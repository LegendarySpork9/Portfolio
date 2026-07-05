import { QueryClient } from "@tanstack/react-query";

import type { AxiosError } from "axios";

const MAX_RETRIES = 2;

// Decides if the call should be retried. 400 Status codes are ignored.
function shouldRetry(
  failureCount: number,
  error: unknown
): boolean {
  if (failureCount >= MAX_RETRIES)
    return false;
  
  const status = (error as AxiosError | undefined)?.response?.status;

  if (status && status >= 400 && status < 500)
    return false;

  return true;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: shouldRetry,
      retryDelay: (attempt) => Math.min(
        1000 * 2 ** attempt,
        80000
      )
    },
    mutations: {
      retry: (
          failureCount,
          error
        ) => {
        if (failureCount >= 1)
          return false;

        const status = (error as AxiosError | undefined)?.response?.status;

        if (status && status >= 400 && status < 500)
          return false;

        return true;
      },
      retryDelay: 1000
    }
  }
});