import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = ts.transpileModule(
  readFileSync(new URL('../src/lib/google-drive.ts', import.meta.url), 'utf8'),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;

function loadDrive(fetch, key = 'test-public-key') {
  const module = { exports: {} };
  new Function('module', 'exports', 'fetch', 'process', source)(
    module,
    module.exports,
    fetch,
    {
      env: { NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY: key },
    },
  );
  return module.exports;
}

const photo = {
  id: 'photo-1',
  name: 'test.jpg',
  mimeType: 'image/jpeg',
  modifiedTime: '2026-01-01',
  resourceKey: 'resource-key',
};

test('list uses direct Google endpoint, image filter, paging, and cancellation signal', async () => {
  const controller = new AbortController();
  const drive = loadDrive(async (url, options) => {
    assert.equal(url.origin, 'https://www.googleapis.com');
    assert.match(url.searchParams.get('q'), /'folder_1' in parents/);
    assert.match(url.searchParams.get('q'), /trashed = false/);
    assert.equal(url.searchParams.get('pageSize'), '9');
    assert.equal(url.searchParams.get('pageToken'), 'page-2');
    assert.equal(options.signal, controller.signal);
    assert.equal(options.credentials, 'omit');
    return Response.json({ files: [photo], nextPageToken: 'page-3' });
  });
  assert.deepEqual(
    await drive.listDrivePhotos('folder_1', 'page-2', controller.signal),
    { files: [photo], nextPageToken: 'page-3' },
  );
});

test('invalid configuration makes no network requests', async () => {
  const neverFetch = () => {
    assert.fail('unexpected network request');
  };
  await assert.rejects(
    loadDrive(neverFetch).listDrivePhotos("folder' or true"),
  );
  await assert.rejects(loadDrive(neverFetch, '').listDrivePhotos('folder'));
});

test('quota failures do not automatically retry', async () => {
  let calls = 0;
  const drive = loadDrive(async () => {
    calls++;
    return new Response('', { status: 429 });
  });
  await assert.rejects(drive.listDrivePhotos('folder'), /잠시 후/);
  assert.equal(calls, 1);
});

test('downloads are capped at four, queued cancellation does not download, and slots recover', async () => {
  let active = 0;
  let peak = 0;
  let calls = 0;
  const drive = loadDrive(async (url, options) => {
    calls++;
    active++;
    peak = Math.max(peak, active);
    assert.equal(url.searchParams.get('alt'), 'media');
    assert.equal(
      options.headers['X-Goog-Drive-Resource-Keys'],
      'photo-1/resource-key',
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    active--;
    return new Response(new Blob(['image'], { type: 'image/jpeg' }));
  });
  const first = Array.from({ length: 4 }, () =>
    drive.downloadDrivePhoto(photo),
  );
  const controller = new AbortController();
  const cancelled = drive.downloadDrivePhoto(photo, controller.signal);
  const cancellation = assert.rejects(cancelled, { name: 'AbortError' });
  controller.abort();
  await Promise.all([...first, cancellation, drive.downloadDrivePhoto(photo)]);
  assert.equal(peak, 4);
  assert.equal(calls, 5);
  assert.equal((await drive.downloadDrivePhoto(photo)).type, 'image/jpeg');
});

test('non-image responses and failed requests release download slots', async () => {
  let calls = 0;
  const drive = loadDrive(async () => {
    calls++;
    if (calls <= 4) return new Response('error', { status: 403 });
    return new Response('<html>login</html>', {
      headers: { 'content-type': 'text/html' },
    });
  });
  const results = await Promise.allSettled(
    Array.from({ length: 6 }, () => drive.downloadDrivePhoto(photo)),
  );
  assert.ok(results.every((result) => result.status === 'rejected'));
  assert.equal(calls, 6);
});

test('player matching is exact, Unicode-normalized, and rejects ambiguous folders', () => {
  const drive = loadDrive(() => assert.fail('unexpected network'));
  const folder = { id: 'player', name: ' 신원세 '.normalize('NFD') };
  assert.equal(drive.matchPlayerFolder([folder], '신원세').id, 'player');
  assert.equal(
    drive.matchPlayerFolder(
      [{ id: 'match', name: '0425 신원세.ver' }],
      '신원세',
    ),
    undefined,
  );
  assert.throws(
    () =>
      drive.matchPlayerFolder(
        [folder, { id: 'other', name: '신원세' }],
        '신원세',
      ),
    /여러 개/,
  );
});

test('folder discovery follows nested folders and pagination with single-parent queries', async () => {
  const requests = [];
  const drive = loadDrive(async (url) => {
    const q = url.searchParams.get('q');
    requests.push(q);
    assert.match(q, /application\/vnd.google-apps.folder/);
    assert.equal((q.match(/in parents/g) || []).length, 1);
    if (q.includes("'root' in parents")) {
      if (url.searchParams.get('pageToken'))
        return Response.json({ files: [{ id: 'year', name: '2026년' }] });
      return Response.json({
        files: [{ id: 'players', name: '선수별 사진' }],
        nextPageToken: 'page2',
      });
    }
    if (q.includes("'players' in parents")) {
      return Response.json({ files: [{ id: 'player', name: '신원세' }] });
    }
    return Response.json({ files: [] });
  });
  const folders = await drive.listGalleryFolders('root');
  assert.equal(folders.length, 3);
  assert.equal(drive.matchPlayerFolder(folders, '신원세').id, 'player');
  assert.equal(requests.length, 5);
});

test('folder index fails rather than treating an inaccessible subtree as no match', async () => {
  let requests = 0;
  const drive = loadDrive(async () => {
    requests++;
    return requests === 1
      ? Response.json({ files: [{ id: 'child', name: '선수별 사진' }] })
      : new Response('', { status: 403 });
  });
  await assert.rejects(drive.listGalleryFolders('root'), /접근/);
  assert.equal(requests, 2);
});

test('cancelled folder lookup does not start network requests', async () => {
  const controller = new AbortController();
  controller.abort();
  const drive = loadDrive(() => assert.fail('unexpected network'));
  await assert.rejects(drive.listGalleryFolders('root', controller.signal), {
    name: 'AbortError',
  });
});

test('direct player folder resolves without crawling match archives', async () => {
  let requests = 0;
  const drive = loadDrive(async () => {
    requests++;
    return Response.json({
      files: [
        { id: 'year', name: '2026년' },
        { id: 'player', name: '신원세' },
      ],
    });
  });
  assert.equal((await drive.findPlayerFolder('root', '신원세')).id, 'player');
  assert.equal(requests, 1);
});

test('direct matching waits for all root pages to detect duplicates', async () => {
  const drive = loadDrive(async (url) =>
    Response.json(
      url.searchParams.has('pageToken')
        ? { files: [{ id: 'second', name: '신원세' }] }
        : { files: [{ id: 'first', name: '신원세' }], nextPageToken: 'next' },
    ),
  );
  await assert.rejects(drive.findPlayerFolder('root', '신원세'), /여러 개/);
});

test('preview uses the API thumbnail and can refresh an expired link without downloading media', async () => {
  const drive = loadDrive(async (url) => {
    assert.equal(url.searchParams.has('alt'), false);
    assert.match(url.searchParams.get('fields'), /thumbnailLink/);
    return Response.json({
      ...photo,
      thumbnailLink: 'https://lh3.googleusercontent.com/fresh=s220',
    });
  });
  const fresh = await drive.refreshDrivePhoto(photo);
  assert.equal(
    drive.drivePreviewUrl(fresh),
    'https://lh3.googleusercontent.com/fresh=s640',
  );
  assert.equal(drive.drivePreviewUrl(photo), undefined);
});
