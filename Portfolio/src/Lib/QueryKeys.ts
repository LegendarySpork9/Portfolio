export const queryKeys = {
  auth: {
    status: [
      "auth",
      "status"
    ] as const
  },
  portfolio: {
    all: ["portfolio"] as const,
    detail: (id: number) => [
      "portfolio",
      id
    ] as const
  },
  filter: {
    all: ["filter"] as const
  }
} as const;