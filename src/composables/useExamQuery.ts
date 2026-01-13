import { useQuery } from "@tanstack/vue-query";
import type { Exam } from "~/types/practice-math";

/**
 * Query lấy danh sách tất cả đề thi
 */
export const useExamsQuery = () => {
  const { getAuthHeaders } = useAuth();

  return useQuery({
    queryKey: ["exams"],
    queryFn: async (): Promise<Exam[]> => {
      return await $practiceMathApi("/exams", {
        headers: getAuthHeaders(),
      });
    },
  });
};

/**
 * Query lấy chi tiết một đề thi theo ID
 */
export const useExamDetailQuery = (id: ComputedRef<string> | string) => {
  const { getAuthHeaders } = useAuth();
  const examId = isRef(id) ? id : ref(id);

  return useQuery({
    queryKey: ["exams", examId],
    queryFn: async (): Promise<Exam> => {
      return await $practiceMathApi(`/exams/${examId.value}`, {
        headers: getAuthHeaders(),
      });
    },
    enabled: computed(() => !!examId.value),
  });
};

/**
 * Query lấy lịch sử thi của người dùng
 */
export const useExamHistoryQuery = () => {
  const { getAuthHeaders } = useAuth();

  return useQuery({
    queryKey: ["exam-history"],
    queryFn: async (): Promise<any[]> => {
      return await $practiceMathApi("/exams/history", {
        headers: getAuthHeaders(),
      });
    },
  });
};
