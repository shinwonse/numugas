/** Public Drive requests. Import only from client components/hooks. */
export interface DrivePhoto {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  resourceKey?: string;
  thumbnailLink?: string;
}

export interface DrivePhotoPage {
  files: DrivePhoto[];
  nextPageToken?: string;
}

const API_ROOT = 'https://www.googleapis.com/drive/v3/files';
export const hasDriveApiKey = Boolean(
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY?.trim(),
);

function requestUrl(path = '') {
  const key = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY?.trim();
  if (!key) throw new Error('사진 갤러리 연결을 준비 중입니다.');
  const url = new URL(`${API_ROOT}${path}`);
  url.searchParams.set('key', key);
  return url;
}

function checkResponse(response: Response) {
  if (response.ok) return;
  if (response.status === 403 || response.status === 429) {
    throw new Error(
      '사진에 접근할 수 없거나 요청이 많습니다. 잠시 후 다시 시도해 주세요.',
    );
  }
  if (response.status === 404)
    throw new Error('사진이나 폴더를 찾을 수 없습니다.');
  throw new Error('사진을 불러오지 못했습니다. 다시 시도해 주세요.');
}

export async function listDrivePhotos(
  folderId: string,
  pageToken?: string,
  signal?: AbortSignal,
): Promise<DrivePhotoPage> {
  if (!/^[\w-]+$/.test(folderId))
    throw new Error('사진 폴더 연결을 확인해 주세요.');
  const url = requestUrl();
  url.searchParams.set(
    'q',
    `'${folderId}' in parents and trashed = false and (mimeType = 'image/jpeg' or mimeType = 'image/png' or mimeType = 'image/webp' or mimeType = 'image/gif')`,
  );
  url.searchParams.set(
    'fields',
    'nextPageToken,files(id,name,mimeType,modifiedTime,resourceKey,thumbnailLink)',
  );
  url.searchParams.set('pageSize', '9');
  url.searchParams.set('orderBy', 'name_natural');
  if (pageToken) url.searchParams.set('pageToken', pageToken);
  const response = await fetch(url, { signal, credentials: 'omit' });
  checkResponse(response);
  const page = (await response.json()) as Partial<DrivePhotoPage>;
  return { files: page.files ?? [], nextPageToken: page.nextPageToken };
}

export const DRIVE_GALLERY_ROOT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim() ||
  '1OhJxNckYeGyWeMw3zg872DWOBup7beXJ';

export interface DriveFolder {
  id: string;
  name: string;
}

/** Shared folder-only index. Public API access requires a single parent per query. */
export async function listGalleryFolders(
  rootId: string,
  signal?: AbortSignal,
): Promise<DriveFolder[]> {
  if (!/^[\w-]+$/.test(rootId))
    throw new Error('사진 폴더 연결을 확인해 주세요.');
  const pending = [rootId];
  const visited = new Set<string>([rootId]);
  const folders: DriveFolder[] = [];
  async function children(parentId: string) {
    const result: DriveFolder[] = [];
    let pageToken: string | undefined;
    do {
      signal?.throwIfAborted();
      const url = requestUrl();
      url.searchParams.set(
        'q',
        `'${parentId}' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'`,
      );
      url.searchParams.set('fields', 'nextPageToken,files(id,name)');
      url.searchParams.set('pageSize', '1000');
      if (pageToken) url.searchParams.set('pageToken', pageToken);
      const response = await fetch(url, { signal, credentials: 'omit' });
      checkResponse(response);
      const page = (await response.json()) as {
        files?: DriveFolder[];
        nextPageToken?: string;
      };
      result.push(...(page.files ?? []));
      if (result.length >= 1000)
        throw new Error('사진 폴더가 너무 많습니다. 검색 범위를 줄여 주세요.');
      pageToken = page.nextPageToken;
    } while (pageToken);
    return result;
  }
  while (pending.length) {
    signal?.throwIfAborted();
    const pages = await Promise.all(pending.splice(0, 3).map(children));
    for (const folder of pages.flat()) {
      if (visited.has(folder.id)) continue;
      if (visited.size >= 1000)
        throw new Error(
          '사진 폴더가 너무 많습니다. 선수별 사진 폴더를 검색 시작 폴더로 설정해 주세요.',
        );
      if (!/^[\w-]+$/.test(folder.id))
        throw new Error('사진 폴더 정보를 확인해 주세요.');
      visited.add(folder.id);
      folders.push(folder);
      pending.push(folder.id);
    }
  }
  return folders;
}

export function matchPlayerFolder(
  folders: DriveFolder[],
  playerName: string,
): DriveFolder | undefined {
  const name = playerName.normalize('NFC').trim();
  const matches = folders.filter(
    (folder) => folder.name.normalize('NFC').trim() === name,
  );
  if (matches.length > 1)
    throw new Error(
      `${name} 이름의 폴더가 여러 개입니다. 선수 폴더를 하나로 정리해 주세요.`,
    );
  return matches.at(0);
}

/** Prefer a direct player folder, avoiding a full match-day archive traversal. */
export async function findPlayerFolder(
  rootId: string,
  playerName: string,
  signal?: AbortSignal,
): Promise<DriveFolder | null> {
  if (!/^[\w-]+$/.test(rootId))
    throw new Error('사진 폴더 연결을 확인해 주세요.');
  const direct: DriveFolder[] = [];
  let pageToken: string | undefined;
  do {
    const url = requestUrl();
    url.searchParams.set(
      'q',
      `'${rootId}' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'`,
    );
    url.searchParams.set('fields', 'nextPageToken,files(id,name)');
    url.searchParams.set('pageSize', '1000');
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const response = await fetch(url, { signal, credentials: 'omit' });
    checkResponse(response);
    const data = (await response.json()) as {
      files?: DriveFolder[];
      nextPageToken?: string;
    };
    direct.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  const match = matchPlayerFolder(direct, playerName);
  if (match) return match;
  return (
    matchPlayerFolder(await listGalleryFolders(rootId, signal), playerName) ??
    null
  );
}

export async function refreshDrivePhoto(
  photo: DrivePhoto,
  signal?: AbortSignal,
): Promise<DrivePhoto> {
  const url = requestUrl(`/${encodeURIComponent(photo.id)}`);
  url.searchParams.set(
    'fields',
    'id,name,mimeType,modifiedTime,resourceKey,thumbnailLink',
  );
  const response = await fetch(url, { signal, credentials: 'omit' });
  checkResponse(response);
  return (await response.json()) as DrivePhoto;
}

/** Best-effort larger preview; a refreshed, unmodified API link is the fallback. */
export function drivePreviewUrl(photo: DrivePhoto): string | undefined {
  if (!photo.thumbnailLink) return undefined;
  return photo.thumbnailLink.replace(/=s\d+$/, '=s640');
}

// Bound concurrent downloads across both the grid and the viewer.
let activeDownloads = 0;
const waiters: Array<() => void> = [];
async function acquireDownload(signal?: AbortSignal) {
  signal?.throwIfAborted();
  if (activeDownloads < 4) {
    activeDownloads += 1;
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const resume = () => {
      signal?.removeEventListener('abort', cancel);
      resolve();
    };
    const cancel = () => {
      const index = waiters.indexOf(resume);
      if (index !== -1) waiters.splice(index, 1);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    waiters.push(resume);
    signal?.addEventListener('abort', cancel, { once: true });
  });
}

export async function downloadDrivePhoto(
  photo: DrivePhoto,
  signal?: AbortSignal,
) {
  await acquireDownload(signal);
  try {
    signal?.throwIfAborted();
    const url = requestUrl(`/${encodeURIComponent(photo.id)}`);
    url.searchParams.set('alt', 'media');
    const headers: HeadersInit = photo.resourceKey
      ? { 'X-Goog-Drive-Resource-Keys': `${photo.id}/${photo.resourceKey}` }
      : {};
    const response = await fetch(url, { signal, headers, credentials: 'omit' });
    checkResponse(response);
    const blob = await response.blob();
    if (
      !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(
        blob.type.split(';')[0],
      )
    ) {
      throw new Error('표시할 수 없는 사진 형식입니다.');
    }
    return blob;
  } finally {
    const next = waiters.shift();
    if (next) next();
    else activeDownloads -= 1;
  }
}
