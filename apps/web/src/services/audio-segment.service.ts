import api from "@/src/lib/api";

export const updateSegmentText = async (id: string, text: string) => {
  await api.put(`/audio-segment/${id}`, {
    text,
  });
};
