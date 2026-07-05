import { apiClient } from "./Client";
import { endpoints } from "./Endpoints";

import type { LoginModel, AuthStatusModel } from "../Types/Authentication";

export async function login(request: LoginModel): Promise<void> {
  await apiClient.post(endpoints.login(), request);
}

export async function logout(): Promise<void> {
  await apiClient.post(endpoints.logout());
}

export async function getAuthStatus(): Promise<boolean> {
  const { data } = await apiClient.get<AuthStatusModel>(endpoints.authStatus());

  return data.authenticated;
}