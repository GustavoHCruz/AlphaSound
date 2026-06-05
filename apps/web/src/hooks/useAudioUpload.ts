import { uploadAudio } from "@/src/services/upload.service";
import { isValidAudio } from "@/src/utils/file";
import { useState } from "react";

interface Props {
  onUploaded: (sessionId: string) => Promise<void>;
}

export function useAudioUpload({ onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const uploadFile = async (file?: File) => {
    if (!file) return;

    if (!isValidAudio(file)) {
      setError("Only audio files are allowed.");

      return;
    }

    setUploading(true);
    setError("");

    try {
      const response = await uploadAudio(file);

      await onUploaded(response.sessionId);
    } catch {
      setError("Failed to upload audio.");
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    uploadFile,
  };
}
