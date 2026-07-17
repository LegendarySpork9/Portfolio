import { useMutation } from "@tanstack/react-query";
import { postMetric } from "../API/Metric.api";

export function usePostMetric() {
  return useMutation({
    mutationFn: ({ id, metric }: { id: number; metric: "summary" | "full" }) =>
      postMetric(id, metric)
  });
};
