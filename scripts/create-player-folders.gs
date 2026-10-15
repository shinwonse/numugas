/**
 * Google Apps Script: run createPlayerFolders once with your Google account.
 * Reuses existing player folders anywhere below ROOT_ID. Never moves photos.
 */
const ROOT_ID = '1luK3oI81Off3rf9SDkM3C1PUxmejZ7Z9';
const PLAYER_NAMES = [
  '권태윤', '김경민', '김관휘', '김국태', '김선호', '김수철', '김윤환',
  '김정수', '김지섭', '김형진', '박세원', '박수웅', '백승민', '신동재',
  '신완교', '신원세', '양형석', '이영도', '이준서', '이지용', '이형주',
  '정의재', '정종현', '주형준', '진태진', '한상우', '홍민기', '홍윤기', '홍준택',
];

function createPlayerFolders() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const root = DriveApp.getFolderById(ROOT_ID);
    const folders = [];
    const pending = [root];
    const seen = new Set([ROOT_ID]);
    while (pending.length) {
      const iterator = pending.shift().getFolders();
      while (iterator.hasNext()) {
        const folder = iterator.next();
        if (seen.has(folder.getId())) continue;
        if (seen.size >= 1000) throw new Error('폴더가 너무 많습니다. 검색 범위를 줄여 주세요.');
        seen.add(folder.getId());
        folders.push(folder);
        pending.push(folder);
      }
    }
    const normalize = (name) => name.normalize('NFC').trim();
    // Preflight all names before creating any folders; never guess among duplicates.
    const existing = new Map();
    PLAYER_NAMES.forEach((name) => {
      const matches = folders.filter((folder) => normalize(folder.getName()) === name);
      if (matches.length > 1) throw new Error(name + ': 같은 이름의 폴더가 여러 개입니다.');
      existing.set(name, matches[0]);
    });
    const containers = [];
    const children = root.getFoldersByName('선수별 사진');
    while (children.hasNext()) containers.push(children.next());
    if (containers.length > 1) throw new Error('선수별 사진 폴더가 여러 개입니다.');
    const container = containers[0] || root.createFolder('선수별 사진');
    const result = PLAYER_NAMES.map((name) => {
      const prior = existing.get(name);
      const folder = prior || container.createFolder(name);
      return { name: name, folderId: folder.getId(), url: folder.getUrl(), created: !prior };
    });
    console.log(JSON.stringify(result, null, 2));
    console.log('완료: ' + result.length + '명. 기존 경기 사진은 이동하지 않았습니다.');
  } finally {
    lock.releaseLock();
  }
}
