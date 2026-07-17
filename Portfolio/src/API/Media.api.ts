import { apiClient } from "./Client";
import { endpoints } from "./Endpoints";

import type { MediaModel, MediaRequestModel, MediaUpdateRequestModel } from "../Types/Media";
import type { SuccessResponseModel } from "../Types/API Response";

export async function uploadMedia(
  id: number,
  file: File
): Promise<MediaModel> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<MediaModel>(
    endpoints.mediaUpload(id),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return data;
}

export async function getMedia(id: number): Promise<MediaModel[]> {
  const { data } = await apiClient.get<MediaModel[]>(endpoints.media(id));

  return data;
}

export async function createMedia(
  id: number,
  request: MediaRequestModel
): Promise<MediaModel> {
  const { data } = await apiClient.post<MediaModel>(
    endpoints.media(id),
    request
  );

  return data;
}

export async function updateMedia(
  id: number,
  request: MediaUpdateRequestModel
): Promise<MediaModel> {
  const { data } = await apiClient.patch<MediaModel>(
    endpoints.media(id),
    request
  );

  return data;
}

export async function deleteMedia(
  id: number,
  fileName?: string
): Promise<SuccessResponseModel> {
  const { data } = await apiClient.delete<SuccessResponseModel>(endpoints.media(id), {
    data: { fileName }
  });

  return data;
}