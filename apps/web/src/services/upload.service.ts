import api from "@/src/lib/api";
import { ApiResponse } from "@/src/types/api";

interface UploadResponse {
  sessionId: string;
}

export const uploadAudio = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ApiResponse<UploadResponse>>(
    "/upload/audio",
    formData
  );

  return response.data.data;
};
