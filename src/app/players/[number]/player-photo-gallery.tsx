'use client';

import { useCallback, useMemo, useRef, useState, type MouseEvent } from 'react';
import { usePlayerFolder, usePlayerPhotos } from '@/hooks/use-player-photos';
import { hasDriveApiKey } from '@/lib/google-drive';
import { PlayerDriveImage } from './player-drive-image';
import { PlayerPhotoViewer } from './player-photo-viewer';
import { Grid3X3, Camera } from 'lucide-react';

export function PlayerPhotoGallery({
  folderId: explicitFolderId,
  playerName,
}: {
  folderId?: string;
  playerName: string;
}) {
  const folderQuery = usePlayerFolder(playerName, explicitFolderId);
  const { refetch: refetchFolders } = folderQuery;
  const folderId = explicitFolderId || folderQuery.data?.id || '';
  const query = usePlayerPhotos(folderId);
  const { isFetchNextPageError, fetchNextPage, refetch } = query;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const photos = useMemo(
    () => [
      ...new Map(
        (query.data?.pages.flatMap((page) => page.files) ?? []).map((photo) => [
          photo.id,
          photo,
        ]),
      ).values(),
    ],
    [query.data],
  );

  const refreshFolders = useCallback(() => {
    void refetchFolders();
  }, [refetchFolders]);
  const openPhoto = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    lastTrigger.current = event.currentTarget;
    setSelectedIndex(Number(event.currentTarget.dataset.index));
  }, []);
  const retry = useCallback(() => {
    if (isFetchNextPageError) void fetchNextPage();
    else void refetch();
  }, [isFetchNextPageError, fetchNextPage, refetch]);
  const loadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const closePhoto = useCallback(() => {
    setSelectedIndex(null);
  }, []);
  const restoreFocus = useCallback(() => {
    lastTrigger.current?.focus();
  }, []);
  const loading =
    hasDriveApiKey &&
    ((folderQuery.isFetching && !folderId) ||
      (Boolean(folderId) && query.isLoading));
  return (
    <section
      aria-label={`${playerName} 선수 사진`}
      className="relative z-10 w-full"
    >
      <div className="relative flex items-center justify-between border-t border-white/10 py-4">
        <h2 className="flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] text-neutral-300">
          <Grid3X3 className="h-3.5 w-3.5" />
          <span className="sr-only">갤러리</span>
        </h2>
        {photos.length > 0 && (
          <span className="text-[10px] tracking-wider text-neutral-500">
            {photos.length}
            {query.hasNextPage ? '+' : ''}
          </span>
        )}
      </div>
      {loading && photos.length === 0 ? (
        <div
          className="grid grid-cols-3 gap-[2px] sm:gap-1 md:gap-2"
          role="status"
          aria-label="사진을 불러오는 중"
        >
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className="aspect-square bg-white/[0.035] motion-safe:animate-pulse"
            />
          ))}
        </div>
      ) : !folderId ||
        !hasDriveApiKey ||
        (query.isSuccess && photos.length === 0) ? (
        <div className="flex flex-col items-center px-5 py-20 text-center">
          <Camera className="mb-4 h-7 w-7 stroke-1 text-neutral-600" />
          <p className="text-sm text-neutral-400">
            {folderQuery.isError
              ? '사진을 불러오지 못했어요.'
              : '아직 담긴 순간이 없어요.'}
          </p>
          {hasDriveApiKey && (
            <button
              type="button"
              onClick={folderId ? retry : refreshFolders}
              disabled={folderQuery.isFetching || query.isFetching}
              className="mt-4 text-xs text-neutral-600 underline underline-offset-4 hover:text-white disabled:opacity-40"
            >
              다시 확인
            </button>
          )}
        </div>
      ) : (
        <>
          <div
            className="grid grid-cols-3 gap-[2px] sm:gap-1 md:gap-2"
            data-photo-grid
          >
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden bg-neutral-900"
              >
                <PlayerDriveImage photo={photo} priority={index < 3} />
                <button
                  type="button"
                  aria-label={`${playerName} 사진 ${String(index + 1)} 확대`}
                  className="absolute inset-0 transition-colors hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
                  data-index={index}
                  onClick={openPhoto}
                />
              </div>
            ))}
          </div>
          {query.isError && (
            <div
              role="alert"
              className="px-5 py-8 text-center text-xs text-neutral-400"
            >
              <p>사진을 불러오지 못했어요.</p>
              <button
                type="button"
                disabled={query.isFetching}
                onClick={retry}
                className="mt-3 underline underline-offset-4 disabled:opacity-40"
              >
                다시 시도
              </button>
            </div>
          )}
          {query.hasNextPage && !isFetchNextPageError && (
            <div className="py-8 text-center">
              <button
                type="button"
                disabled={query.isFetching}
                onClick={loadMore}
                className="rounded-full border border-white/15 px-7 py-2.5 text-xs text-neutral-300 transition-colors hover:bg-white hover:text-black disabled:opacity-40"
              >
                {query.isFetchingNextPage ? '불러오는 중…' : '사진 더 보기'}
              </button>
            </div>
          )}
        </>
      )}
      {selectedIndex !== null && (
        <PlayerPhotoViewer
          photos={photos}
          index={selectedIndex}
          playerName={playerName}
          onIndexChange={setSelectedIndex}
          onClose={closePhoto}
          onRestoreFocus={restoreFocus}
        />
      )}
    </section>
  );
}
