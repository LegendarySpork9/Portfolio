import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFilters, createFilter, updateFilter, deleteFilter } from "../API/Filter.api";
import { queryKeys } from "../Lib/QueryKeys";

import type { FilterRequestModel } from "../Types/Filter";

export function useFilters(includeDeleted?: boolean) {
  return useQuery({
    queryKey: [...queryKeys.filter.all, {
      includeDeleted
    }],
    queryFn: () => getFilters(includeDeleted)
  });
}

export function useNewFilter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: FilterRequestModel) => createFilter(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.filter.all
      });
    }
  });
}

export function useUpdateFilter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: FilterRequestModel }) => updateFilter(
      id,
      request
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.filter.all
      });
    }
  });
}

export function useDeleteFilter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFilter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.filter.all
      });
    }
  });
}