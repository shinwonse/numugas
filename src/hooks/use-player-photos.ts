'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  downloadDrivePhoto,
  DRIVE_GALLERY_ROOT_ID,
  findPlayerFolder,
  hasDriveApiKey,
  listDrivePhotos,
  type DrivePhoto,
} from '@/lib/google-drive';

export function usePlayerFolder(playerName: string, explicitFolderId?: string) {
  return useQuery({
    queryKey: ['drive-player-folder', DRIVE_GALLERY_ROOT_ID, playerName],
    queryFn: async ({ signal }) =>
      findPlayerFolder(DRIVE_GALLERY_ROOT_ID, playerName, signal),
    enabled: hasDriveApiKey && !explicitFolderId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function usePlayerPhotos(folderId: string) {
  return useInfiniteQuery({
    queryKey: ['player-photos', folderId],
    queryFn: async ({ pageParam, signal }) =>
      listDrivePhotos(folderId, pageParam, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    enabled: hasDriveApiKey && Boolean(folderId),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useDrivePhoto(photo: DrivePhoto, enabled: boolean) {
  const query = useQuery({
    queryKey: ['drive-photo', photo.id, photo.modifiedTime, photo.resourceKey],
    queryFn: async ({ signal }) => downloadDrivePhoto(photo, signal),
    enabled: enabled && hasDriveApiKey,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const [image, setImage] = useState<{ blob: Blob; url: string } | null>(null);
  useEffect(() => {
    if (!query.data) return;
    const url = URL.createObjectURL(query.data);
    setImage({ blob: query.data, url });
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [query.data]);
  return { ...query, src: image?.blob === query.data ? image?.url : undefined };
}
