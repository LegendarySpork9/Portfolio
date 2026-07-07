import { apiClient } from "./Client";
import { endpoints } from "./Endpoints";

import type { FilterModel, FilterRequestModel } from "../Types/Filter";
import type { SuccessResponseModel } from "../Types/API Response";

export async function getFilters(includeDeleted?: boolean): Promise<FilterModel[]> {
  const { data } = await apiClient.get<FilterModel[]>(endpoints.filters(), {
    params: {includeDeleted }
  });

  return Array.isArray(data) ? data : [];
}

export async function createFilter(request: FilterRequestModel): Promise<FilterModel> {
  const { data } = await apiClient.post<FilterModel>(
    endpoints.filters(),
    request
  );

  return data;
}

export async function updateFilter(
  id: number,
  request: FilterRequestModel
): Promise<FilterModel> {
  const { data } = await apiClient.patch<FilterModel>(
    endpoints.filter(id),
    request
  );

  return data;
}

export async function deleteFilter(id: number): Promise<SuccessResponseModel> {
  const { data } = await apiClient.delete<SuccessResponseModel>(endpoints.filter(id));

  return data;
}