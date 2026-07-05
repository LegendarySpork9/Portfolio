import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout, getAuthStatus } from "../API/Auth.api";
import { queryKeys } from "../Lib/QueryKeys";

import type { LoginModel } from "../Types/Authentication";

export function useAuthStatus() {
  return useQuery({
    queryKey: queryKeys.auth.status,
    queryFn: () => getAuthStatus()
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LoginModel) => login(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.status
      });
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.status
      });
    }
  });
}