import { useEffect } from "react";

interface Props {
  sessionId: string | null;
  status?: string;
  onPoll: () => void;
}

export const useSessionPolling = ({ sessionId, status, onPoll }: Props) => {
  useEffect(() => {
    if (!sessionId) return;

    if (status !== "PROCESSING") return;

    const interval = setInterval(() => {
      onPoll();
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, status, onPoll]);
};
