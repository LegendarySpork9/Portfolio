import { apiClient } from "./Client";
import { endpoints } from "./Endpoints";

import type { SuccessResponseModel } from "../Types/API Response";

export async function postMetric(
  id: number,
  metric: "summary" | "full"
): Promise<SuccessResponseModel> {
  const { data } = await apiClient.post<SuccessResponseModel>(
    endpoints.metric(),
    { id, metric }
  );

  return data;
}
