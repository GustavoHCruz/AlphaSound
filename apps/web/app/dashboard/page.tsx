"use client";

import AudioFileIcon from "@mui/icons-material/AudioFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import api from "../lib/api";

const sideOpenWidth = 260;
const sideClosedWidth = 82;

type Segment = {
  id: string;
  start: number;
  end: number;
  text: string;
  transcription: string;
};

type UploadResponse = {
  status: string;
  code: number;
  data: {
    status: string;
  };
};

type Session = {
  id: string;
  createdAt: string;
  segments: Segment[];
};

type SessionsResponse = {
  status: string;
  code: number;
  data: Session[];
};

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const response = await api.get<SessionsResponse>("/audio-sessions/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const nextSessions = response.data?.data ?? [];
    setSessions(nextSessions);

    if (!selectedSessionId && nextSessions.length > 0) {
      setSelectedSessionId(nextSessions[0].id);
      setSegments(nextSessions[0].segments ?? []);
      return;
    }

    if (selectedSessionId) {
      const selected = nextSessions.find((session) => session.id === selectedSessionId);
      if (selected) {
        setSegments(selected.segments ?? []);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    loadSessions().catch(() => {
      setError("Nao foi possivel carregar suas sessoes.");
    });
  }, [router]);

  const onLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const uploadFile = async (file?: File) => {
    if (!file) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setError("");

    try {
      const response = await api.post<UploadResponse>("/upload/audio", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data?.data?.status) {
        setError("Falha ao iniciar o processamento do audio.");
        return;
      }

      await loadSessions();
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string | string[] }>;
      const message = errorResponse.response?.data?.message;
      if (Array.isArray(message)) {
        setError(message.join(", "));
      } else if (message) {
        setError(message);
      } else {
        setError("Falha ao enviar audio para processamento.");
      }
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
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    await uploadFile(file);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#eef2f9" }}>
      <Box
        component="aside"
        sx={{
          width: { xs: sideClosedWidth, sm: menuOpen ? sideOpenWidth : sideClosedWidth },
          transition: "width .2s ease",
          background: "linear-gradient(180deg, #091124 0%, #121f3d 100%)",
          color: "#f7f9ff",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          minHeight: "100vh",
          overflow: "hidden",
          position: "sticky",
          top: 0,
        }}
      >
        <Toolbar sx={{ px: 1 }}>
          <IconButton color="inherit" onClick={() => setMenuOpen((prev) => !prev)}>
            <MenuIcon />
          </IconButton>
          {menuOpen ? (
            <Typography sx={{ fontWeight: 800, ml: 1 }}>Sessões</Typography>
          ) : null}
        </Toolbar>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
        <List>
          {sessions.map((session) => {
            const selected = selectedSessionId === session.id;
            return (
              <ListItemButton
                key={session.id}
                selected={selected}
                onClick={() => {
                  setSelectedSessionId(session.id);
                  setSegments(session.segments ?? []);
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 42 }}>
                  <AudioFileIcon />
                </ListItemIcon>
                {menuOpen ? (
                  <ListItemText
                    primary={`Sessao ${session.id.slice(0, 8)}`}
                    secondary={new Date(session.createdAt).toLocaleString("pt-BR")}
                    slotProps={{
                      secondary: {
                        sx: { color: "rgba(255,255,255,0.72)", fontSize: 12 },
                      },
                    }}
                  />
                ) : null}
              </ListItemButton>
            );
          })}

          {sessions.length === 0 ? (
            <ListItemButton disabled>
              <ListItemIcon sx={{ color: "inherit", minWidth: 42 }}>
                <AudioFileIcon />
              </ListItemIcon>
              {menuOpen ? <ListItemText primary="Nenhuma sessao" /> : null}
            </ListItemButton>
          ) : null}
          <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", my: 1 }} />
          <ListItemButton onClick={() => fileInputRef.current?.click()}>
            <ListItemIcon sx={{ color: "inherit", minWidth: 42 }}>
              <UploadFileIcon />
            </ListItemIcon>
            {menuOpen ? <ListItemText primary="Nova sessao" /> : null}
          </ListItemButton>
        </List>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box
          sx={{
            height: 64,
            px: { xs: 2, sm: 3 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#0f1f3d",
            color: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            AlphaSound
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>

        <Box sx={{ maxWidth: 980, mx: "auto", p: { xs: 2, sm: 4 } }}>
        <Card sx={{ borderRadius: 4, mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Upload de audio
              </Typography>
              <Typography color="text.secondary">
                Arraste o arquivo para a caixa abaixo ou selecione manualmente.
              </Typography>

              <Box
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: dragActive ? "2px solid #1c77d9" : "2px dashed #9cb4d8",
                  background: dragActive ? "#edf5ff" : "#f9fbff",
                  borderRadius: 3,
                  p: { xs: 3, sm: 5 },
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .2s ease",
                }}
              >
                <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                  <UploadFileIcon sx={{ fontSize: 42, color: "#1c77d9" }} />
                  <Typography sx={{ fontWeight: 700 }}>
                    {dragActive ? "Solte o arquivo aqui" : "Drop file aqui"}
                  </Typography>
                  <Typography color="text.secondary">ou clique para Select file</Typography>
                  <Button
                    variant="contained"
                    startIcon={uploading ? <CircularProgress size={18} /> : <FolderOpenIcon />}
                    disabled={uploading}
                    sx={{ textTransform: "none", fontWeight: 700 }}
                  >
                    {uploading ? "Enviando..." : "Select file"}
                  </Button>
                </Stack>
              </Box>

              <input
                hidden
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={onUpload}
              />

              {error ? <Alert severity="error">{error}</Alert> : null}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          {segments.length === 0 ? (
            <Alert severity="info">
              {selectedSessionId
                ? "Essa sessao ainda nao tem segmentos prontos."
                : "Selecione uma sessao no side ou envie um novo audio."}
            </Alert>
          ) : (
            segments.map((segment) => (
              <Card key={segment.id} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack spacing={1.2}>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={`Inicio: ${segment.start.toFixed(2)}s`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={`Fim: ${segment.end.toFixed(2)}s`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Texto
                    </Typography>
                    <Typography>{segment.text}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Transcricao
                    </Typography>
                    <Typography color="text.secondary">{segment.transcription}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
        </Box>
      </Box>
    </Box>
  );
}
