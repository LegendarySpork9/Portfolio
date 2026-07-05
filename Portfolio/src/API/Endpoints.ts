export const endpoints = {
  login: () => "/auth/login",
  logout: () => "/auth/logout",
  authStatus: () => "/auth/status",
  filters: () => "/filter",
  filter: (id: number) => `/filter/${id}`,
  portfolio: () => "/item",
  portfolioItem: (id: number) => `/item/${id}`,
  media: (id: number) => `/media/${id}`,
  metric: () => "/metric"
} as const;