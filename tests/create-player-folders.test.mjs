import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function fixture() {
  let created = 0,
    released = 0;
  function iterator(items) {
    let index = 0;
    return { hasNext: () => index < items.length, next: () => items[index++] };
  }
  function folder(name, id = name) {
    return {
      name,
      id,
      children: [],
      getId() {
        return this.id;
      },
      getName() {
        return this.name;
      },
      getUrl() {
        return `https://drive.google.com/drive/folders/${this.id}`;
      },
      getFolders() {
        return iterator(this.children);
      },
      getFoldersByName(value) {
        return iterator(this.children.filter((child) => child.name === value));
      },
      createFolder(value) {
        created++;
        const child = folder(value, `created-${created}`);
        this.children.push(child);
        return child;
      },
    };
  }
  const root = folder('root', '1luK3oI81Off3rf9SDkM3C1PUxmejZ7Z9');
  const context = vm.createContext({
    DriveApp: { getFolderById: () => root },
    LockService: {
      getScriptLock: () => ({
        waitLock() {},
        releaseLock() {
          released++;
        },
      }),
    },
    console: { log() {} },
  });
  vm.runInContext(
    readFileSync(
      new URL('../scripts/create-player-folders.gs', import.meta.url),
      'utf8',
    ),
    context,
  );
  return {
    root,
    folder,
    run: () => vm.runInContext('createPlayerFolders()', context),
    created: () => created,
    released: () => released,
  };
}

test('creates the roster once and reuses folders on rerun', () => {
  const f = fixture();
  f.run();
  assert.equal(f.created(), 30);
  assert.equal(f.root.children[0].children.length, 29);
  f.run();
  assert.equal(f.created(), 30);
  assert.equal(f.released(), 2);
});

test('existing player folder under a different branch is reused', () => {
  const f = fixture();
  const branch = f.folder('기존', 'old');
  branch.children.push(f.folder('신원세', 'existing-player'));
  f.root.children.push(branch);
  f.run();
  assert.equal(f.created(), 29);
  assert.equal(branch.children[0].id, 'existing-player');
});

test('ambiguous player folders stop the whole operation before creating anything', () => {
  const f = fixture();
  f.root.children.push(f.folder('신원세', 'one'), f.folder('신원세', 'two'));
  assert.throws(f.run, /여러 개/);
  assert.equal(f.created(), 0);
  assert.equal(f.released(), 1);
});
