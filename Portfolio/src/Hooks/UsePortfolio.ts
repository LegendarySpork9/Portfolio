import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPortfolio, getPortfolioItem, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "../API/Portfolio.api";
import { queryKeys } from "../Lib/QueryKeys";

import type { ItemRequestModel } from "../Types/Item";

export function usePortfolio(includeDeleted?: boolean) {
  return useQuery({
    queryKey: [...queryKeys.portfolio.all, {
      includeDeleted
    }],
    queryFn: () => getPortfolio(includeDeleted)
  });
}

export function usePortfolioItem() {
  return useMutation({
    mutationFn: (id: number) => getPortfolioItem(id)
  });
}

export function useNewPortfolioItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ItemRequestModel) => createPortfolioItem(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolio.all
      });
    }
  });
}

export function useUpdatePortfolioItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: ItemRequestModel }) => updatePortfolioItem(
      id,
      request
    ),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolio.detail(id)
      });
    }
  });
}

export function useDeletePortfolioItem(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deletePortfolioItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolio.detail(id)
      });
    }
  });
}