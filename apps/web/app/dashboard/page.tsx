"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import api from "../lib/api";
import AudioPlayerCard from "./components/AudioPlayerCard";
import SegmentList from "./components/SegmentList";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import UploadCard from "./components/UploadCard";

const sideOpenWidth = 260;
const sideClosedWidth = 82;

// ======================= TYPES =======================
export type Segment = {
  id: string;
  start: number;
  end: number;
  text: string;
  transcription: string;
};

interface Session {
  id: string;
  createdAt: string;
  audioPath?: string;
  status?: string;
}

interface SessionDetail {
  id: string;
  createdAt: string;
  segments: Segment[];
  audioPath?: string;
  status?: string;
  audioBase64?: string | null;
}

type SessionsResponse = {
  status: string;
  code: number;
  data: Session[];
};

type UploadResponse = {
  status: string;
  code: number;
  data: {
    sessionId: string;
  };
};

// Utilitário para converter base64 em URL tocável
function base64ToAudioUrl(base64: string, mime = "audio/mpeg") {
  // Remove prefixo se vier junto
  const cleaned = base64.replace(/^data:audio\/\w+;base64,/, "");
  const byteCharacters = atob(cleaned);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mime });
  return URL.createObjectURL(blob);
}

// ======================= COMPONENT =======================
export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [segments, setSegments] = useState<Segment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [showUpload, setShowUpload] = useState(true);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);

  // ======================= LOAD SESSION =======================
  const handleSelectSession = async (sessionId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSelectedSessionId(sessionId);
    setSegments([]);
    setAudioPath(null);
    setSessionStatus(null);
    setProcessing(true);

    try {
      const response = await api.get<{
        status: string;
        code: number;
        data: SessionDetail;
      }>(`/audio-session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data;

      setSegments(data.segments ?? []);
      setAudioPath(data.audioPath || null);
      setAudioBase64(data.audioBase64 || null);
      setSessionStatus(data.status || null);
      setShowUpload(false);
      if (data.status !== "PROCESSING") {
        setProcessing(false);
      }
    } catch {
      setError("Failed to load session details.");
      setProcessing(false);
    }
  };

  // ======================= LOAD LIST =======================
  const loadSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await api.get<SessionsResponse>(
      "/audio-session/my-sessions",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const nextSessions = response.data?.data ?? [];
    setSessions(nextSessions);

    if (!selectedSessionId && nextSessions.length > 0) {
      handleSelectSession(nextSessions[0].id);
    }
  };

  // ======================= INIT =======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    loadSessions().catch(() => {
      setError("Could not load your sessions.");
    });
  }, []);

  // ======================= LOGOUT =======================
  const onLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  // ======================= UPLOAD =======================
  const uploadFile = async (file?: File) => {
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setProcessing(true);
    setError("");

    try {
      const response = await api.post<UploadResponse>(
        "/upload/audio",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const sessionId = response.data?.data?.sessionId;

      if (!sessionId) {
        setError("Invalid upload response.");
        return;
      }

      await loadSessions();
      await handleSelectSession(sessionId);
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string | string[] }>;
      const message = errorResponse.response?.data?.message;

      if (Array.isArray(message)) setError(message.join(", "));
      else if (message) setError(message);
      else setError("Failed to upload audio.");
    } finally {
      setUploading(false);
    }
  };

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    await uploadFile(file);
    event.target.value = "";
  };

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    await uploadFile(file);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  // ======================= POLLING =======================
  useEffect(() => {
    if (!selectedSessionId || sessionStatus !== "PROCESSING") return;

    setProcessing(true);
    const interval = setInterval(() => {
      handleSelectSession(selectedSessionId);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedSessionId, sessionStatus]);

  // ======================= UI =======================
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#eef2f9" }}>
      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={() => {
          setShowUpload(true);
          setSelectedSessionId(null);
          setAudioPath(null);
          setSegments([]);
          setSessionStatus(null);
          setError("");
          fileInputRef.current?.click();
        }}
      />

      <Box sx={{ flex: 1 }}>
        <TopBar onLogout={onLogout} />

        <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
          {processing ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
              }}
            >
              <CircularProgress size={60} />
              <Typography sx={{ mt: 2 }}>Processando áudio...</Typography>
            </Box>
          ) : showUpload ? (
            <UploadCard
              uploading={uploading}
              dragActive={dragActive}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onUpload={onUpload}
              fileInputRef={fileInputRef}
              error={error}
            />
          ) : audioPath || audioBase64 ? (
            <AudioPlayerCard
              audioUrl={
                audioBase64 ? base64ToAudioUrl(audioBase64) : audioPath || ""
              }
              onNewUpload={() => setShowUpload(true)}
            />
          ) : null}

          {!processing && <SegmentList segments={segments} />}
        </Box>
      </Box>
    </Box>
  );
}
