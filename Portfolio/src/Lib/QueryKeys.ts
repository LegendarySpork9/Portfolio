export const queryKeys = {
  portfolio: {
    all: ["portfolio"] as const,
    detail: (id: number) => [
      "portfolio",
      id
    ] as const
  },
  auth: {
    status: [
      "auth",
      "status"
    ] as const
  }
} as const;