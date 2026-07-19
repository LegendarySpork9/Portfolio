import { apiClient } from "./Client";
import { endpoints } from "./Endpoints";

import type { ItemModel, ItemRequestModel } from "../Types/Item";
import type { SuccessResponseModel } from "../Types/API Response";

export async function getPortfolio(includeDeleted?: boolean): Promise<ItemModel[]> {
  const { data } = await apiClient.get<ItemModel[] | { information: string }>(endpoints.portfolio(), {
    params: { includeDeleted }
  });

  if (!Array.isArray(data)) {
    return [];
  }

  return data;
}

export async function getPortfolioItem(id: number): Promise<ItemModel> {
  const { data } = await apiClient.get<ItemModel>(endpoints.portfolioItem(id));

  return data;
}

export async function createPortfolioItem(request: ItemRequestModel): Promise<ItemModel> {
  const { data } = await apiClient.post<ItemModel>(
    endpoints.portfolio(),
    request
  );

  return data;
}

export async function updatePortfolioItem(
  id: number,
  request: ItemRequestModel
): Promise<ItemModel> {
  const { data } = await apiClient.patch<ItemModel>(
    endpoints.portfolioItem(id),
    request
  );

  return data;
}

export async function deletePortfolioItem(id: number): Promise<SuccessResponseModel> {
  const { data } = await apiClient.delete<SuccessResponseModel>(endpoints.portfolioItem(id));

  return data;
}