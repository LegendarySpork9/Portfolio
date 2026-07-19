import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedia, createMedia, updateMedia, deleteMedia } from "../API/Media.api";
import { queryKeys } from "../Lib/QueryKeys";

import type { MediaRequestModel, MediaUpdateRequestModel } from "../Types/Media";

export function useMedia(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.media.detail(id),
    queryFn: () => getMedia(id),
    enabled
  });
};

export function useNewMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number, request: MediaRequestModel }) => createMedia(
      id,
      request
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.all
      });
    }
  });
};

export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: MediaUpdateRequestModel }) => updateMedia(
      id,
      request
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.all
      });
    }
  });
};

export function useDeleteMedia(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.all
      });
    }
  });
};