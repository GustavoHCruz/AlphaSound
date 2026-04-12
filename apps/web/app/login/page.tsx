"use client";

import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import api from "../lib/api";

type LoginResponse = {
  status: string;
  code: number;
  data: {
    access_token: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("@Dmin1230000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const token = response.data?.data?.access_token;
      if (!token) {
        setError("Resposta de autenticacao invalida.");
        return;
      }

      localStorage.setItem("token", token);
      router.replace("/dashboard");
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string | string[] }>;
      const message = errorResponse.response?.data?.message;

      if (Array.isArray(message)) {
        setError(message.join(", "));
      } else if (message) {
        setError(message);
      } else {
        setError("Falha ao conectar com a API de autenticacao.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        background:
          "radial-gradient(circle at 20% 20%, #ffe2b8 0%, #f8c27a 25%, #0f1f3d 75%)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 5,
          p: { xs: 3, md: 5 },
          backdropFilter: "blur(8px)",
          background: "rgba(255, 255, 255, 0.96)",
        }}
      >
        <Stack spacing={2.2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <GraphicEqIcon sx={{ color: "#0f1f3d" }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f1f3d" }}>
              AlphaSound
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Entre para acessar suas transcricoes e uploads de audio.
          </Typography>

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                type="email"
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                fullWidth
              />
              <TextField
                type="password"
                label="Senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                fullWidth
              />

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} /> : <LockOpenIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  py: 1.2,
                  borderRadius: 2,
                  background:
                    "linear-gradient(120deg, rgba(8,34,82,1) 0%, rgba(27,112,196,1) 100%)",
                }}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
