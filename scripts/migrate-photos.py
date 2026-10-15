#!/usr/bin/env python3
"""Copy local photos to Google Drive using rclone; no MYBOX access."""

import argparse
import csv
import fcntl
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone

PHOTO_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif',
                    '.tif', '.tiff', '.bmp', '.avif', '.dng', '.cr2', '.cr3', '.nef', '.arw'}
GALLERY_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
DEFAULT_OUTPUT = Path(__file__).resolve().parent.parent / '.local' / 'photo-migration'


def scan_photos(source):
    """Only regular, non-hidden photos; never follow symlinks outside the source."""
    source = Path(source).expanduser().resolve(strict=True)
    if not source.is_dir():
        raise ValueError('로컬 사진 폴더를 지정하세요.')
    photos, skipped = [], []
    def walk_error(error):
        raise error
    for root, directories, files in os.walk(source, followlinks=False, onerror=walk_error):
        for name in list(directories):
            path = Path(root) / name
            if name.startswith('.') or path.is_symlink() or name == '__MACOSX':
                skipped.append(str(path.relative_to(source)))
                directories.remove(name)
        directories.sort()
        for name in sorted(files):
            path = Path(root) / name
            relative = path.relative_to(source).as_posix()
            if name.startswith('.') or path.is_symlink() or path.suffix.lower() not in PHOTO_EXTENSIONS:
                skipped.append(relative)
                continue
            if any(character in relative for character in ('\n', '\r', '\\')):
                raise ValueError(f'줄바꿈/역슬래시가 있는 파일명을 변경하세요: {relative!r}')
            info = path.stat()
            if not path.is_file() or info.st_size == 0:
                raise ValueError(f'비어 있거나 일반 파일이 아닙니다: {relative}')
            photos.append({'path': relative, 'size': info.st_size,
                           'mtime_ns': info.st_mtime_ns,
                           'gallery_supported': path.suffix.lower() in GALLERY_EXTENSIONS})
    if not photos:
        raise ValueError('업로드할 사진이 없습니다. ZIP 파일은 먼저 압축을 풀어 주세요.')
    return source, photos, skipped


def validate_destination(value):
    # A dedicated directory is required, rather than the entire remote root.
    match = re.fullmatch(r'([A-Za-z0-9_][A-Za-z0-9_-]*):(.+)', value)
    if not match or value.startswith('-'):
        raise ValueError('대상은 gdrive:NUMUGAS-사진 형태로 지정하세요.')
    path = match.group(2)
    if path.startswith('/') or any(part in ('', '.', '..') for part in path.split('/')):
        raise ValueError('Drive 대상에 절대 경로, 빈 경로, . 또는 ..을 사용할 수 없습니다.')
    if any(character in path for character in ('\n', '\r', '\\')):
        raise ValueError('Drive 대상 경로에 줄바꿈/역슬래시를 사용할 수 없습니다.')
    return value


def write_json(path, value):
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(path)


def run_rclone(arguments, capture=False):
    result = subprocess.run(['rclone', *arguments], check=True, text=True,
                            stdout=subprocess.PIPE if capture else None)
    return result.stdout if capture else None


def folder_mapping(photos, entries, root_entry):
    parents = sorted({str(PurePosixPath(photo['path']).parent) for photo in photos})
    mapping = []
    for parent in parents:
        candidates = [root_entry] if parent == '.' else [entry for entry in entries
                      if entry.get('IsDir') and entry.get('Path') == parent]
        if len(candidates) != 1 or not candidates[0].get('ID'):
            raise ValueError(f'Drive 폴더 ID를 확정할 수 없습니다(없음/동명이름 중복): {parent}')
        folder_id = candidates[0]['ID']
        mapping.append({'local_folder': parent, 'drive_folder_id': folder_id,
                        'url': f'https://drive.google.com/drive/folders/{folder_id}'})
    return mapping


def migrate(args):
    destination = validate_destination(args.destination)
    source, photos, skipped = scan_photos(args.source)
    output = Path(args.output).expanduser().resolve()
    if output == source or source in output.parents:
        raise ValueError('결과 폴더(--output)는 사진 원본 폴더 바깥에 지정하세요.')
    output.mkdir(parents=True, exist_ok=True)
    # Advisory lock is released even after interruption; no stale PID cleanup needed.
    with (output / 'migration.lock').open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise ValueError('같은 결과 폴더에서 마이그레이션이 실행 중입니다.') from error
        plan = {'source': str(source), 'destination': destination, 'photos': photos,
                'skipped': skipped, 'created_at': datetime.now(timezone.utc).isoformat()}
        write_json(output / 'plan.json', plan)
        write_json(output / 'result.json', {'status': 'planned', 'verified': False,
                   'destination': destination, 'created_at': plan['created_at']})
        files_list = output / 'files.txt'
        files_list.write_text(''.join(photo['path'] + '\n' for photo in photos), encoding='utf-8')
        total = sum(photo['size'] for photo in photos)
        unsupported = sum(not photo['gallery_supported'] for photo in photos)
        print(f'사진 {len(photos)}개 / {total / 1024**3:.2f} GiB / 제외 {len(skipped)}개', flush=True)
        print(f'원본: {source}\n대상: {destination}\n계획: {output / "plan.json"}', flush=True)
        if unsupported:
            print(f'안내: {unsupported}개는 원본 보관용 형식입니다. 현재 웹 갤러리에는 표시되지 않습니다.', flush=True)
        if not args.execute:
            print('미리보기 완료: 네트워크 요청/업로드 없음. 실제 업로드는 --execute를 추가하세요.')
            return
        if not shutil.which('rclone'):
            raise ValueError('rclone이 없습니다. brew install rclone 후 rclone config로 Google Drive를 연결하세요.')
        result_path = output / 'result.json'
        # Never leave a previous successful run looking like the current run succeeded.
        result = {'status': 'running', 'destination': destination, 'verified': False,
                  'started_at': datetime.now(timezone.utc).isoformat()}
        write_json(result_path, result)
        try:
            common = ['--files-from-raw', str(files_list), '--checkers', '4',
                      '--log-file', str(output / 'rclone.log'), '--log-level', 'INFO']
            run_rclone(['copy', str(source), destination, '--checksum', '--immutable',
                        '--transfers', '2', '--retries', '3', '--low-level-retries', '10',
                        '--stats', '30s', *common])
            run_rclone(['check', str(source), destination, '--one-way',
                        '--combined', str(output / 'verification.txt'), *common])
            # Detect local edits during the run, including files added after the plan.
            _, current_photos, _ = scan_photos(source)
            if current_photos != photos:
                raise ValueError('실행 중 원본 사진이 변경되었습니다. 다운로드/편집을 마친 후 다시 실행하세요.')
            entries = json.loads(run_rclone(['lsjson', destination, '--dirs-only', '--recursive'], capture=True))
            root_entry = json.loads(run_rclone(['lsjson', destination, '--stat'], capture=True))
            mapping = folder_mapping(photos, entries, root_entry)
            if args.public:
                result['public_url'] = run_rclone(['link', destination], capture=True).strip()
            result.update(status='complete', verified=True, folders=mapping,
                          photo_count=len(photos), bytes=total,
                          finished_at=datetime.now(timezone.utc).isoformat())
            with (output / 'folders.csv').open('w', encoding='utf-8-sig', newline='') as stream:
                writer = csv.DictWriter(stream, fieldnames=['local_folder', 'drive_folder_id', 'url'])
                writer.writeheader()
                writer.writerows(mapping)
            write_json(result_path, result)
            print(f'업로드·검증 완료. 폴더 ID: {output / "folders.csv"}')
        except (Exception, KeyboardInterrupt):
            result.update(status='incomplete')
            write_json(result_path, result)
            raise


def main(argv=None):
    parser = argparse.ArgumentParser(description='로컬 사진 → Google Drive. 기본은 오프라인 미리보기.')
    parser.add_argument('--source', required=True, help='다운로드가 끝난 로컬 사진 폴더')
    parser.add_argument('--destination', required=True, help='rclone 대상, 예: gdrive:NUMUGAS-사진')
    parser.add_argument('--output', default=str(DEFAULT_OUTPUT), help='계획/로그/폴더 ID 결과 폴더')
    parser.add_argument('--execute', action='store_true', help='실제 업로드 후 체크섬 검증')
    parser.add_argument('--public', action='store_true', help='업로드 검증 후 대상 폴더를 링크 공개')
    args = parser.parse_args(argv)
    try:
        migrate(args)
    except KeyboardInterrupt:
        print('\n중단했습니다. 같은 명령으로 다시 실행할 수 있습니다.', file=sys.stderr)
        return 130
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print(f'실패: {error}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
