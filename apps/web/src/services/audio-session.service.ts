import api from "@/src/lib/api";
import { ApiResponse } from "@/src/types/api";
import { AudioSession } from "@/src/types/audio-session";

export const getMySessions = async () => {
  const response = await api.get<ApiResponse<AudioSession[]>>(
    "/audio-session/my-sessions"
  );

  return response.data.data;
};

export const getSessionById = async (id: string) => {
  const response = await api.get<ApiResponse<AudioSession>>(
    `/audio-session/${id}`
  );

  return response.data.data;
};

export const updateSessionName = async (id: string, name: string) => {
  await api.put(`/audio-session/${id}`, {
    name,
  });
};

export const deleteSession = async (id: string) => {
  await api.delete(`/audio-session/${id}`);
};
