export interface UploadFileSuccessData {
  guid: string;
  name: string;
  description: string | null;
  file: {
    path: string;
    url: string;
  };
  size: number;
  extension: string;
  mime_type: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
}

export interface UploadFileSuccessResponse {
  data: UploadFileSuccessData;
  message: string;
}

export interface UploadFileErrorResponse {
  message: string;
}
