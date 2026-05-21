"use client";

import { useEffect, useRef, useState } from "react";

import { Box, CircularProgress, Stack, Typography } from "@mui/material";

import AudioPlayerCard from "@/src/components/AudioPlayerCard";
import SegmentList from "@/src/components/SegmentList";
import Sidebar from "@/src/components/Sidebar";
import TopBar from "@/src/components/TopBar";
import UploadCard from "@/src/components/UploadCard";

import { useAudioUpload } from "@/src/hooks/useAudioUpload";

import { updateSegmentText } from "@/src/services/audio-segment.service";

import {
  getMySessions,
  getSessionById,
  updateSessionName,
} from "@/src/services/audio-session.service";

import { AudioSegment, AudioSession } from "@/src/types/audio-session";

import { base64ToAudioUrl } from "@/src/utils/audio";

export default function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastAudioBase64Ref = useRef<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [sessions, setSessions] = useState<AudioSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [segments, setSegments] = useState<AudioSegment[]>([]);
  const [showUpload, setShowUpload] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);
  const processing = sessionStatus === "PROCESSING";

  const loadSessions = async () => {
    const data = await getMySessions();

    setSessions(data);

    if (!selectedSessionId && data.length > 0) {
      await selectSession(data[0].id);
    }
  };

  const selectSession = async (sessionId: string) => {
    setSelectedSessionId(sessionId);

    try {
      const session = await getSessionById(sessionId);

      const incomingSegments = session.segments ?? [];

      setSegments((prev) => {
        const sameLength = incomingSegments.length === prev.length;

        const sameContent =
          sameLength &&
          incomingSegments.every(
            (segment, index) =>
              segment.id === prev[index]?.id &&
              segment.text === prev[index]?.text
          );

        if (sameContent) {
          return prev;
        }

        return incomingSegments;
      });

      setSessionStatus(session.status ?? null);

      setShowUpload(false);

      if (session.audioBase64) {
        if (lastAudioBase64Ref.current !== session.audioBase64) {
          lastAudioBase64Ref.current = session.audioBase64;

          setAudioUrl(base64ToAudioUrl(session.audioBase64));
        }
      } else {
        if (audioUrl !== session.audioPath) {
          setAudioUrl(session.audioPath ?? null);
        }
      }
    } catch {}
  };

  const updateSegment = async (segmentId: string, text: string) => {
    setSegments((prev) =>
      prev.map((segment) =>
        segment.id === segmentId
          ? {
              ...segment,
              text,
            }
          : segment
      )
    );

    try {
      await updateSegmentText(segmentId, text);
    } catch {}
  };

  const renameSession = async (sessionId: string, name: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              name,
            }
          : session
      )
    );

    try {
      await updateSessionName(sessionId, name);
    } catch {}
  };

  const { uploading, error, uploadFile } = useAudioUpload({
    onUploaded: async (sessionId) => {
      await loadSessions();

      await selectSession(sessionId);
    },
  });

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    await uploadFile(file);

    event.target.value = "";
  };

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    await uploadFile(file);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onLogout = () => {
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (!selectedSessionId || !processing) {
      return;
    }

    const interval = setInterval(() => {
      selectSession(selectedSessionId);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSessionId, processing]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "#eef2f9",
      }}
    >
      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onSelectSession={selectSession}
        onNewSession={() => {
          setShowUpload(true);
          setSelectedSessionId(null);
          setSegments([]);
          setAudioUrl(null);
          setSessionStatus(null);
          lastAudioBase64Ref.current = null;
          fileInputRef.current?.click();
        }}
        onRename={renameSession}
      />

      <Box sx={{ flex: 1 }}>
        <TopBar onLogout={onLogout} />

        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
            p: 3,
          }}
        >
          <Box
            sx={{
              background: "#fff",
              borderRadius: 3,
              p: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            {showUpload ? (
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
            ) : audioUrl ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      color: "text.secondary",
                      fontWeight: 600,
                    }}
                  >
                    Transcription Result
                  </Typography>

                  <AudioPlayerCard audioUrl={audioUrl} />
                </Box>

                <SegmentList segments={segments} onUpdate={updateSegment} />

                {processing && (
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      mt: 5,
                      mb: 2,
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <CircularProgress size={42} />

                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    >
                      Processing segments...
                    </Typography>
                  </Stack>
                )}
              </>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
