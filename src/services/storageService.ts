import { fetchWithAuth } from "@/services/authService";
import type {
  UploadFileSuccessResponse,
  UploadFileErrorResponse,
} from "@/types/storage";

export type {
  UploadFileSuccessData,
  UploadFileSuccessResponse,
  UploadFileErrorResponse,
} from "@/types/storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function uploadFile(
  file: File,
): Promise<UploadFileSuccessResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithAuth(`${BASE_URL}/storage/file`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as UploadFileErrorResponse;
  }

  return data as UploadFileSuccessResponse;
}
