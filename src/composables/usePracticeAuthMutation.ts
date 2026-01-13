import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
} from "~/types/practice-math";

/**
 * Mutation xử lý đăng nhập vào hệ thống luyện toán
 */
export const usePracticeLoginMutation = () => {
  const { login } = useAuth(); // Sử dụng hàm login từ useAuth có sẵn để lưu token

  return useMutation({
    mutationFn: async (data: LoginDto): Promise<AuthResponse> => {
      return await $practiceMathApi("/auth/login", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (data) => {
      login(data.accessToken);
    },
  });
};

/**
 * Mutation xử lý đăng ký tài khoản mới
 */
export const usePracticeRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterDto): Promise<{ message: string }> => {
      return await $practiceMathApi("/auth/register", {
        method: "POST",
        body: data,
      });
    },
  });
};
