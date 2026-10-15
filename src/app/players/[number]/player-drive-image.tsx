'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type SyntheticEvent,
} from 'react';
import { useDrivePhoto } from '@/hooks/use-player-photos';
import {
  drivePreviewUrl,
  refreshDrivePhoto,
  type DrivePhoto,
} from '@/lib/google-drive';
import { useQuery } from '@tanstack/react-query';

function PlayerOriginalImage({
  photo,
  enlarged = false,
}: {
  photo: DrivePhoto;
  enlarged?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [decodeError, setDecodeError] = useState(false);
  const { src, error, isFetching, refetch } = useDrivePhoto(
    photo,
    enlarged || nearViewport,
  );

  useEffect(() => {
    const element = container.current;
    if (!element || enlarged) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [enlarged]);

  const retry = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setDecodeError(false);
      void refetch();
    },
    [refetch],
  );
  const handleError = useCallback(() => {
    setDecodeError(true);
  }, []);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const originalReady = Boolean(src) && loadedSrc === src;
  const handleLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      const loaded = image.src;
      // 큰 원본은 onLoad 이후에도 디코딩이 남아 있을 수 있어 decode()까지 기다린다
      image
        .decode()
        .catch(() => undefined)
        .finally(() => {
          setLoadedSrc(loaded);
        });
    },
    [],
  );
  const fit = enlarged ? 'object-contain' : 'object-cover';

  return (
    <div
      ref={container}
      className="flex h-full w-full items-center justify-center bg-gray-900/60"
    >
      {error || decodeError ? (
        <div className="p-3 text-center text-xs text-gray-400" role="status">
          <p>{error?.message ?? '사진을 표시하지 못했습니다.'}</p>
          <button
            type="button"
            disabled={isFetching}
            className="relative z-10 mt-2 rounded px-3 py-2 text-red-300 hover:text-white disabled:opacity-50"
            onClick={retry}
          >
            {isFetching ? '불러오는 중…' : '다시 시도'}
          </button>
        </div>
      ) : (
        // 미리보기를 깔아둔 채 원본을 위에 겹쳐, 원본 디코딩이 끝난 뒤에만 보이게 한다.
        // (요소를 교체하면 그 사이 한 프레임 이상 빈 배경이 보여 깜빡인다)
        <div className="relative h-full w-full">
          {photo.thumbnailLink && (
            <img
              src={drivePreviewUrl(photo)}
              alt=""
              aria-hidden
              referrerPolicy="no-referrer"
              className={`absolute inset-0 h-full w-full ${fit}`}
            />
          )}
          {src && (
            // Blob URLs keep the image bytes entirely off the Next.js image proxy.
            <img
              src={src}
              alt={photo.name}
              decoding="async"
              onLoad={handleLoad}
              onError={handleError}
              className={`absolute inset-0 h-full w-full ${fit} transition-opacity duration-300 motion-reduce:transition-none ${
                originalReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          {!originalReady && <span className="sr-only">사진 불러오는 중</span>}
        </div>
      )}
    </div>
  );
}

function PlayerThumbnail({
  photo,
  priority = false,
}: {
  photo: DrivePhoto;
  priority?: boolean;
}) {
  const [refresh, setRefresh] = useState(!photo.thumbnailLink);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['drive-thumbnail', photo.id, photo.modifiedTime],
    queryFn: async ({ signal }) => refreshDrivePhoto(photo, signal),
    enabled: refresh,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const src = refresh ? data?.thumbnailLink : drivePreviewUrl(photo);
  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);
  const handleError = useCallback(() => {
    if (refresh) setFailed(true);
    else setRefresh(true);
  }, [refresh]);
  const retry = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setFailed(false);
      setLoaded(false);
      setRefresh(true);
      void refetch();
    },
    [refetch],
  );
  const unavailable = failed || isError || (refresh && data && !src);
  return (
    <div className="relative h-full w-full bg-[#191919]">
      {!loaded && !unavailable && (
        <div
          className="absolute inset-0 motion-safe:animate-pulse bg-white/[0.025]"
          role="status"
        >
          <span className="sr-only">사진 불러오는 중</span>
        </div>
      )}
      {unavailable ? (
        <div className="flex h-full items-center justify-center">
          <button
            type="button"
            onClick={retry}
            disabled={isFetching}
            className="relative z-10 p-3 text-[11px] text-neutral-400 disabled:opacity-40"
          >
            다시 불러오기
          </button>
        </div>
      ) : (
        src && (
          <img
            src={src}
            alt={photo.name}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={handleLoad}
            onError={handleError}
            className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )
      )}
    </div>
  );
}

export function PlayerDriveImage({
  photo,
  enlarged = false,
  priority = false,
}: {
  photo: DrivePhoto;
  enlarged?: boolean;
  priority?: boolean;
}) {
  return enlarged ? (
    <PlayerOriginalImage photo={photo} enlarged />
  ) : (
    <PlayerThumbnail
      key={photo.id + photo.modifiedTime}
      photo={photo}
      priority={priority}
    />
  );
}
