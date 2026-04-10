"use client";

import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

// =========================
// TYPES
// =========================

type Segment = {
  start: number;
  end: number;
  transcription: string;
  audio_path: string;
  text: string;
};

type Session = {
  id: string;
  segments: Segment[];
};

// =========================
// API
// =========================

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// =========================
// COMPONENTS
// =========================

function Sidebar({ open, onClose, sessions, onSelect }) {
  return (
    <Drawer open={open} onClose={onClose}>
      <Box sx={{ width: 250 }}>
        <List>
          {sessions.map((s: Session) => (
            <ListItem button key={s.id} onClick={() => onSelect(s)}>
              <ListItemText primary={`Session ${s.id}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

function AudioSegment({ seg }: { seg: Segment }) {
  return (
    <Box sx={{ borderBottom: "1px solid #ccc", p: 2 }}>
      <Typography variant="caption">
        {seg.start} - {seg.end}
      </Typography>

      <TextField fullWidth multiline defaultValue={seg.text} sx={{ my: 1 }} />

      <audio controls src={seg.audio_path} style={{ width: "100%" }} />

      <Typography>{seg.transcription}</Typography>
    </Box>
  );
}

function Upload({ onUpload }) {
  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <input
        type="file"
        accept="audio/mp3"
        onChange={(e) => onUpload(e.target.files?.[0])}
      />
    </Box>
  );
}

function LoginModal({ open, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.access_token);
    onLogin();
  };

  return (
    <Modal open={open}>
      <Box sx={{ p: 4, background: "#fff", m: "20% auto", width: 300 }}>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button fullWidth onClick={handleLogin} sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </Modal>
  );
}

// =========================
// MAIN PAGE
// =========================

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthenticated(true);
  }, []);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/upload", formData);

    setSegments(res.data);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <IconButton onClick={() => setDrawerOpen(true)}>
        <MenuIcon />
      </IconButton>

      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sessions={sessions}
        onSelect={(s) => setSegments(s.segments)}
      />

      <Box sx={{ flex: 1, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Avatar
            onClick={() => {
              localStorage.removeItem("token");
              setAuthenticated(false);
            }}
          />
        </Box>

        {segments.length === 0 ? (
          <Upload onUpload={handleUpload} />
        ) : (
          segments.map((seg, i) => <AudioSegment key={i} seg={seg} />)
        )}
      </Box>

      <LoginModal
        open={!authenticated}
        onLogin={() => setAuthenticated(true)}
      />
    </Box>
  );
}
