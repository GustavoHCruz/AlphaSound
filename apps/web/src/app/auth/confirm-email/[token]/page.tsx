"use client";

import { confirmEmail } from "@/src/services/user.service";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const REDIRECT_SECONDS = 5;

interface Props {
  params: Promise<{
    token: string;
  }>;
}

export default function ConfirmEmailPage({ params }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    params.then(async ({ token }) => {
      try {
        await confirmEmail(token);

        setSuccess(true);
        setMessage("Your email has been successfully confirmed.");

        countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }

            return prev - 1;
          });
        }, 1000);

        redirectTimeout = setTimeout(() => {
          router.replace("/auth");
        }, REDIRECT_SECONDS * 1000);
      } catch (error: any) {
        setSuccess(false);

        setMessage(
          error?.response?.data?.message ?? "Could not confirm your email.",
        );
      } finally {
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(redirectTimeout);
      clearInterval(countdownInterval);
    };
  }, [params, router]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Confirming email...</Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              gutterBottom
              color={success ? "success.main" : "error.main"}
            >
              {success ? "Email Confirmed" : "Error"}
            </Typography>

            <Typography sx={{ mb: 3 }}>{message}</Typography>

            {success ? (
              <>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Redirecting to login in {countdown}s.
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => router.replace("/auth")}
                >
                  Go to login now
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => router.replace("/auth")}
              >
                Back to login
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}
