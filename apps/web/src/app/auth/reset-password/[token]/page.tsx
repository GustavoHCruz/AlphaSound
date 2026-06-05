"use client";

import { resetPassword } from "@/src/services/user.service";
import { gradients } from "@/src/theme/gradients";
import { shadows } from "@/src/theme/shadows";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import LockResetIcon from "@mui/icons-material/LockReset";
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
import { use, useEffect, useState } from "react";

interface Props {
  params: Promise<{
    token: string;
  }>;
}

const REDIRECT_SECONDS = 5;

export default function ResetPasswordPage({ params }: Props) {
  const router = useRouter();

  const { token } = use(params);

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (!success) return;

    const interval = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      router.replace("/auth");
    }, REDIRECT_SECONDS * 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [router, success]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await resetPassword(token, password);

      setSuccess("Password updated successfully. Redirecting to login...");
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
        setError("Could not reset password.");
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
          p: 5,
          background: "rgba(255,255,255,0.96)",
          boxShadow: shadows.panel,
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
            }}
          >
            <GraphicEqIcon />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
              }}
            >
              AlphaSound
            </Typography>
          </Stack>

          <Typography color="text.secondary">
            Enter your new password.
          </Typography>

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                type="password"
                label="New password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                fullWidth
              />

              {error && <Alert severity="error">{error}</Alert>}

              {success && (
                <Alert severity="success">
                  {success}
                  <br />
                  Redirecting in {countdown}s...
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={18} /> : <LockResetIcon />
                }
                sx={{
                  background: gradients.primaryButton,
                }}
              >
                {loading ? "Updating password..." : "Reset password"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
