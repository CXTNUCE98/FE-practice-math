import { useQuery } from "@tanstack/vue-query";
import type { UserResponseDto } from "~/types/practice-math";

// Loại dữ liệu trả về của API users (User + count)
// Cần define type chính xác nếu có thể, tạm thời extend
export interface UserWithExamCount extends UserResponseDto {
  examCount: number;
}

/**
 * Query lấy danh sách người dùng (Admin)
 */
export const useUsersQuery = () => {
  const { getAuthHeaders } = useAuth();

  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<UserWithExamCount[]> => {
      const res = await $practiceMathApi("/users", {
        headers: getAuthHeaders(),
      });
      return res as unknown as UserWithExamCount[];
    },
  });
};

/**
 * Query lấy lịch sử thi của user cụ thể (Admin)
 */
export const useAdminUserHistoryQuery = (userId: Ref<string> | string) => {
  const { getAuthHeaders } = useAuth();
  const idRef = isRef(userId) ? userId : ref(userId);

  return useQuery({
    queryKey: ["admin-user-history", idRef],
    queryFn: async () => {
      const res = await $practiceMathApi("/users/{id}/history", {
        headers: getAuthHeaders(),
        path: { id: idRef.value },
      });
      return res as unknown as any[]; // Tạm thời any[], sẽ define type Result sau
    },
    enabled: computed(() => !!idRef.value),
  });
};
