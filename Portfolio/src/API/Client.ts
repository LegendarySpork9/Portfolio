import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
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

      }

      else if (status && status >= 500) {
        console.error("Server Error:", error.response?.data);
      }
    }

    return Promise.reject(error);
  }
);