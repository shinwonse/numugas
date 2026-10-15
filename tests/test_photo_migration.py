import argparse
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'migrate-photos.py'
spec = importlib.util.spec_from_file_location('photo_migration', SCRIPT)
migration = importlib.util.module_from_spec(spec)
spec.loader.exec_module(migration)


class MigrationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.source = self.root / '사진'
        self.source.mkdir()
        self.output = self.root / 'output'

    def photo(self, name, data=b'photo bytes'):
        path = self.source / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        return path

    def args(self, execute=False, public=False):
        return argparse.Namespace(source=str(self.source), destination='gdrive:선수 사진',
                                  output=str(self.output), execute=execute, public=public)

    def test_plan_preserves_nested_unicode_and_excludes_unwanted_files(self):
        self.photo('김선수/경기 1/사진.JPG')
        self.photo('이선수/원본.HEIC')
        self.photo('.hidden/private.jpg')
        self.photo('김선수/._photo.jpg')
        self.photo('김선수/readme.txt')
        (self.source / 'link').symlink_to(self.root, target_is_directory=True)
        _, photos, skipped = migration.scan_photos(self.source)
        self.assertEqual([p['path'] for p in photos], ['김선수/경기 1/사진.JPG', '이선수/원본.HEIC'])
        self.assertEqual([p['gallery_supported'] for p in photos], [True, False])
        self.assertIn('link', skipped)
        self.assertIn('김선수/readme.txt', skipped)

    def test_default_is_offline_and_does_not_require_rclone(self):
        original = self.photo('선수/photo.jpg')
        with patch.object(migration, 'run_rclone') as run, patch.object(migration.shutil, 'which', return_value=None):
            migration.migrate(self.args())
        run.assert_not_called()
        self.assertEqual(original.read_bytes(), b'photo bytes')
        plan = json.loads((self.output / 'plan.json').read_text())
        self.assertEqual(plan['photos'][0]['path'], '선수/photo.jpg')
        self.assertEqual(json.loads((self.output / 'result.json').read_text())['status'], 'planned')

    def test_rejects_empty_files_and_unsafe_paths(self):
        self.photo('선수/empty.jpg', b'')
        with self.assertRaises(ValueError):
            migration.scan_photos(self.source)
        for destination in ['gdrive:', '/tmp/destination', 'gdrive:../photos', 'gdrive:/photos', 'gdrive:a//b']:
            with self.subTest(destination=destination), self.assertRaises(ValueError):
                migration.validate_destination(destination)

    def test_report_cannot_live_inside_source(self):
        self.photo('선수/photo.jpg')
        args = self.args()
        args.output = str(self.source / 'output')
        with self.assertRaises(ValueError):
            migration.migrate(args)

    def fake_run(self, calls, fail_on=None, edit_on_check=False):
        def run(arguments, capture=False):
            calls.append(arguments)
            if arguments[0] == fail_on:
                raise subprocess.CalledProcessError(1, ['rclone', *arguments])
            if arguments[0] == 'check' and edit_on_check:
                self.photo('선수/new.jpg')
            if arguments[0] == 'lsjson':
                if '--stat' in arguments:
                    return json.dumps({'ID': 'root-id', 'IsDir': True})
                return json.dumps([{'Path': '선수', 'ID': 'player-id', 'IsDir': True}])
            if arguments[0] == 'link':
                return 'https://drive.google.com/drive/folders/root-id\n'
        return run

    def test_execute_copies_verifies_exports_and_publicizes_after_verification(self):
        self.photo('선수/photo.jpg')
        calls = []
        with patch.object(migration.shutil, 'which', return_value='/rclone'), patch.object(migration, 'run_rclone', side_effect=self.fake_run(calls)):
            migration.migrate(self.args(execute=True, public=True))
        self.assertEqual([c[0] for c in calls], ['copy', 'check', 'lsjson', 'lsjson', 'link'])
        self.assertIn('--checksum', calls[0])
        self.assertIn('--immutable', calls[0])
        self.assertIn('--one-way', calls[1])
        result = json.loads((self.output / 'result.json').read_text())
        self.assertTrue(result['verified'])
        self.assertEqual(result['folders'][0]['drive_folder_id'], 'player-id')
        self.assertTrue((self.source / '선수/photo.jpg').exists())

    def test_copy_or_verification_failure_never_publishes_or_reports_success(self):
        self.photo('선수/photo.jpg')
        for failed in ['copy', 'check']:
            calls = []
            with self.subTest(failed=failed), patch.object(migration.shutil, 'which', return_value='/rclone'), patch.object(migration, 'run_rclone', side_effect=self.fake_run(calls, fail_on=failed)):
                with self.assertRaises(subprocess.CalledProcessError):
                    migration.migrate(self.args(execute=True, public=True))
            self.assertNotIn('link', [c[0] for c in calls])
            result = json.loads((self.output / 'result.json').read_text())
            self.assertEqual(result['status'], 'incomplete')
            self.assertFalse(result['verified'])

    def test_source_changed_during_copy_is_not_success(self):
        self.photo('선수/photo.jpg')
        calls = []
        with patch.object(migration.shutil, 'which', return_value='/rclone'), patch.object(migration, 'run_rclone', side_effect=self.fake_run(calls, edit_on_check=True)):
            with self.assertRaisesRegex(ValueError, '변경'):
                migration.migrate(self.args(execute=True, public=True))
        self.assertNotIn('link', [c[0] for c in calls])

    def test_duplicate_folder_names_fail_instead_of_guessing_player_id(self):
        photos = [{'path': '선수/photo.jpg'}]
        entries = [{'Path': '선수', 'ID': identifier, 'IsDir': True} for identifier in ['one', 'two']]
        with self.assertRaises(ValueError):
            migration.folder_mapping(photos, entries, {})
        self.assertEqual(migration.folder_mapping([{'path': 'photo.jpg'}], [], {'ID': 'root'})[0]['local_folder'], '.')

    def test_existing_success_is_invalidated_by_a_new_dry_run(self):
        self.photo('선수/photo.jpg')
        self.output.mkdir()
        (self.output / 'result.json').write_text('{"status":"complete","verified":true}')
        migration.migrate(self.args())
        self.assertFalse(json.loads((self.output / 'result.json').read_text())['verified'])


if __name__ == '__main__':
    unittest.main()
