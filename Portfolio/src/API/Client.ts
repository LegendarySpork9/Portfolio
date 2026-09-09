import axios from "axios";

let onAuthExpired: (() => void) | null = null;

export function setAuthExpiredHandler(handler: () => void) {
  onAuthExpired = handler;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        const url = error.config?.url || "";

        if (!url.startsWith("/auth/")) {
          onAuthExpired?.();
        }
      }

      else if (status && status >= 500) {
        console.error("Server Error:", error.response?.data);
      }
    }

    return Promise.reject(error);
  }
);