import apiClient from "@/lib/apiClient";
import type {
  UploadFileSuccessResponse,
  UploadFileErrorResponse,
} from "@/types/storage";

export type {
  UploadFileSuccessData,
  UploadFileSuccessResponse,
  UploadFileErrorResponse,
} from "@/types/storage";

export async function uploadFile(
  file: File,
): Promise<UploadFileSuccessResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<UploadFileSuccessResponse>(
    "/storage/file",
    formData,
  );
  return data;
}
