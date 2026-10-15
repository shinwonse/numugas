# 로컬 사진 → Google Drive 마이그레이션

MYBOX 다운로드는 포함하지 않는다. 다운로드/압축 해제가 완료된 로컬 폴더를 Google Drive에 복사한다. Python 3.9 이상과 rclone을 사용하는 Mac/Linux용 스크립트다. Supabase Storage와 웹사이트 API 키는 사용하지 않는다.

## 1. 최초 한 번 Google 로그인

```bash
brew install rclone
rclone config
```

설정에서 새 remote(`n`)를 만들고 이름은 `gdrive`, 저장소 종류는 `drive`(Google Drive)를 선택한다. `client_id`와 `client_secret`은 기본값인 빈 값으로 두면 rclone 기본 OAuth 클라이언트를 사용한다. **웹사이트의 API 키를 여기에 넣지 않는다.** 개인 Google Drive를 선택하고 브라우저에서 사진을 올릴 계정으로 로그인한다.

Scope는 새로 만드는 마이그레이션 폴더만 다룰 경우 `drive.file`을 선택한다. 이 권한은 이 앱이 만든 파일/폴더에 한정되므로, 웹에서 미리 만든 기존 폴더에 올리려면 별도의 접근 설정 또는 `drive` 범위의 재인증이 필요하다. 기존 폴더와 같은 이름을 지정하지 말고 새로운 전용 경로를 사용한다. `root_folder_id`와 서비스 계정 파일은 비워 둔다. Shared Drive 질문에는 개인 드라이브라면 아니오를 선택한다.

로그인 토큰은 rclone의 로컬 설정에 저장된다. 앱 코드나 `.env.local`에 복사하지 않는다. 유료 스토리지 서비스를 추가하지 않지만 사진 용량은 대상 Google Drive 계정의 저장 공간을 차지한다.

## 2. 로컬 폴더

이름과 하위 폴더 구조를 그대로 유지한다. 선수 상세 갤러리는 연결된 폴더 바로 아래 사진만 조회하므로 다음처럼 정리하는 편이 좋다.

```text
사진/
  김선수/
    2026-09-01_01.jpg
    2026-09-01_02.jpg
  이선수/
    2026-09-01_01.jpg
```

날짜별 하위 폴더도 복사할 수 있지만 자동으로 선수별 분류하거나 폴더를 합치지는 않는다. 결과 CSV에는 실제 사진이 들어 있는 각 폴더 ID가 나온다.

JPG/JPEG, PNG, WebP, GIF와 HEIC/HEIF, TIFF, BMP, AVIF, 일부 RAW를 복사한다. HEIC/RAW 등은 보관만 되며 현재 웹 갤러리 지원 형식이 아니다. 제외 파일은 plan.json에 기록한다. ZIP은 먼저 압축을 푼다. 숨김 파일/폴더, __MACOSX, 심볼릭 링크는 제외한다. 줄바꿈 또는 역슬래시가 포함된 사진 경로와 빈 사진은 오류로 처리한다.

원본 화질/메타데이터를 그대로 복사하며 리사이징/압축하지 않는다. 같은 내용이어도 서로 다른 경로에 있으면 별도 사진으로 보관한다.

## 3. 미리보기 (로그인/네트워크 불필요)

```bash
python3 scripts/migrate-photos.py \
  --source "$HOME/Downloads/사진" \
  --destination "gdrive:NUMUGAS-사진"
```

파일 수·용량과 계획만 출력한다. 원격 파일과의 비교는 하지 않으므로 예상 신규 업로드 개수는 아니다. 결과는 `.local/photo-migration/`에 저장되며 Git에서 제외된다. 원본 폴더 안에 결과 폴더를 지정할 수 없다.

## 4. 업로드 및 공개

```bash
python3 scripts/migrate-photos.py \
  --source "$HOME/Downloads/사진" \
  --destination "gdrive:NUMUGAS-사진" \
  --execute --public
```

`--execute`가 실제 복사를 실행한다. `--public`은 검증 성공 후 대상 폴더 전체를 링크 공개한다. 그 폴더에 기존 사진이 있으면 함께 공개되므로 전용 갤러리 경로를 사용한다. 이미 공개해 둔 폴더라면 `--public`을 생략해도 된다.

- `rclone copy --checksum --immutable`: 원본/Drive 파일을 삭제하지 않는다. 같은 경로·체크섬이면 건너뛴다. 같은 경로의 내용이 다르면 덮어쓰지 않고 오류를 낸다. 변경본은 새 이름으로 저장하거나 대상 파일을 직접 정리한 후 다시 실행한다.
- 동시 업로드 2개, 제한된 재시도. 중단 후 **동일한 source/destination으로 재실행**하면 완료 파일은 건너뛴다. 업로드 도중인 파일은 처음부터 다시 전송될 수 있다.
- `rclone check --one-way`: 크기와 공통 해시로 검증하며 Drive의 추가 파일은 삭제하거나 오류 처리하지 않는다.
- 실행 중 원본을 수정/추가하지 않는다. 다운로드가 진행 중인 폴더를 입력하지 않는다.
- 같은 결과 폴더에서 동시 실행을 막는다. 같은 Drive 경로로 다른 도구/다른 결과 폴더를 통해 동시 업로드하지 않는다. Drive에 기존 동명이름 중복 파일/폴더가 있으면 먼저 정리한다.

인증/쿼터/검증/공개 설정 중 하나라도 실패하면 종료 코드가 0이 아니고 result.json은 `incomplete`다. 일부 업로드가 끝났어도 완료로 보고하지 않는다. 로그는 rclone.log, 파일별 검증 결과는 verification.txt에서 확인한다. 이전 실행의 folders.csv가 남아 있을 수 있으므로 **현재 result.json의 complete/verified 상태를 먼저 확인**한다.

## 5. 선수 상세 페이지 연결

성공 후 `.local/photo-migration/folders.csv`의 `drive_folder_id`를 해당 선수의 `players.drive_folder_id`에 입력한다. 선수 이름 추정이나 DB 자동 변경은 하지 않는다. 루트에 사진이 있으면 local_folder가 `.`인 행이 생성된다. 신규 폴더는 비어 있으면 업로드하지 않는다.

다른 마이그레이션 기록을 분리하려면 `--output /원본밖/결과폴더`를 지정한다. 원격 경로는 Google Drive ID/웹 링크가 아니라 rclone 경로(`gdrive:폴더이름`)다.

## 테스트

```bash
python3 -m unittest discover -s tests -p 'test_photo_migration.py' -v
```

실제 계정 전송 전에는 소량 사진으로 --execute를 실행하고 결과 검증을 확인한다.

공식 문서: [Google Drive 로그인](https://rclone.org/drive/), [copy](https://rclone.org/commands/rclone_copy/), [check](https://rclone.org/commands/rclone_check/), [link 공개](https://rclone.org/commands/rclone_link/).
