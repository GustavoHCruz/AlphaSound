"use client";

import api from "@/src/lib/api";
import { gradients } from "@/src/theme/gradients";
import { palette } from "@/src/theme/palette";
import { shadows } from "@/src/theme/shadows";
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
import { useEffect, useState, type SubmitEvent } from "react";

type LoginResponse = {
  status: string;
  code: number;
  data: {
    access_token: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (event: SubmitEvent) => {
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
        setError("Invalid email or password.");
        return;
      }

      localStorage.setItem("token", token);
      router.replace("/dashboard");
    } catch (err) {
      const errorResponse = err as AxiosError<{
        message?: string | string[];
      }>;

      const message = errorResponse.response?.data?.message;

      if (Array.isArray(message)) {
        setError(message.join(", "));
      } else if (message) {
        setError(message);
      } else {
        setError("Could not authenticate.");
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
        background: gradients.loginBackground,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 5,
          p: {
            xs: 3,
            md: 5,
          },
          backdropFilter: "blur(8px)",
          background: "rgba(255,255,255,0.96)",
          boxShadow: shadows.panel,
        }}
      >
        <Stack spacing={2.2}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
            }}
          >
            <GraphicEqIcon
              sx={{
                color: palette.text.primary,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                color: palette.text.primary,
              }}
            >
              AlphaSound
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Log in to see your transcriptions and audio uploads.
          </Typography>
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                type="email"
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <TextField
                type="password"
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {error ? <Alert severity="error">{error}</Alert> : null}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={18} /> : <LockOpenIcon />
                }
                sx={{
                  py: 1.2,
                  background: gradients.primaryButton,
                }}
              >
                {loading ? "Authenticating..." : "Log in"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
