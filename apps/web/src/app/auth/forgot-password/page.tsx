"use client";

import { forgotPassword } from "@/src/services/user.service";
import { gradients } from "@/src/theme/gradients";
import { shadows } from "@/src/theme/shadows";
import EmailIcon from "@mui/icons-material/Email";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
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
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await forgotPassword(email);

      setSuccess(
        "If an account exists with this email, a password reset link has been sent.",
      );
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
        setError("Could not process your request.");
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
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <GraphicEqIcon />

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              AlphaSound
            </Typography>
          </Stack>

          <Typography color="text.secondary">
            Enter your email address and we'll send you a password reset link.
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

              {error && <Alert severity="error">{error}</Alert>}

              {success && <Alert severity="success">{success}</Alert>}

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={18} /> : <EmailIcon />
                }
                sx={{
                  background: gradients.primaryButton,
                }}
              >
                {loading ? "Sending..." : "Send password reset email"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
