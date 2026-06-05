import api from "@/src/lib/api";
import { ApiResponse } from "@/src/types/api";

interface ConfirmEmailResponse {
  message: string;
}

interface ForgotPasswordResponse {
  message: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const confirmEmail = async (token: string) => {
  const response = await api.post<ApiResponse<ConfirmEmailResponse>>(
    "/users/confirm-email",
    {
      token,
    },
  );

  return response.data.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post<ApiResponse<ForgotPasswordResponse>>(
    "/users/forgot-password",
    {
      email,
    },
  );

  return response.data.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post<ApiResponse<ResetPasswordResponse>>(
    "/users/reset-password",
    {
      token,
      password,
    },
  );

  return response.data.data;
};
