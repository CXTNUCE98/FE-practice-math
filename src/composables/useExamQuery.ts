import { useQuery } from "@tanstack/vue-query";
import type { Exam } from "~/types/practice-math";

/**
 * Query lấy danh sách tất cả đề thi
 */
export const useExamsQuery = () => {
  const { isAuthenticated, getAuthHeaders } = useAuth();

  return useQuery({
    queryKey: ["exams"],
    queryFn: async (): Promise<Exam[]> => {
      const res = await $practiceMathApi("/exams", {
        headers: getAuthHeaders(),
      });
      return res as unknown as Exam[];
    },
    enabled: isAuthenticated,
  });
};

/**
 * Query lấy chi tiết một đề thi theo ID
 */
export const useExamDetailQuery = (id: ComputedRef<string> | string) => {
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const examId = isRef(id) ? id : ref(id);

  return useQuery({
    queryKey: ["exams", examId],
    queryFn: async (): Promise<Exam> => {
      const res = await $practiceMathApi("/exams/{id}", {
        headers: getAuthHeaders(),
        path: { id: examId.value },
      });
      return res as unknown as Exam;
    },
    enabled: computed(() => isAuthenticated.value && !!examId.value),
  });
};

/**
 * Query lấy lịch sử thi của người dùng
 */
export const useExamHistoryQuery = () => {
  const { isAuthenticated, getAuthHeaders } = useAuth();

  return useQuery({
    queryKey: ["exam-history"],
    queryFn: async (): Promise<any[]> => {
      const res = await $practiceMathApi("/exams/history", {
        headers: getAuthHeaders(),
      });
      return res as unknown as any[];
    },
    enabled: isAuthenticated,
  });
};

/**
 * Query lấy chi tiết kết quả bài thi
 */
export const useResultDetailQuery = (id: ComputedRef<string> | string) => {
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const resultId = isRef(id) ? id : ref(id);

  return useQuery({
    queryKey: ["exam-result", resultId],
    queryFn: async (): Promise<any> => {
      const res = await $practiceMathApi("/exams/results/{id}", {
        headers: getAuthHeaders(),
        path: { id: resultId.value },
      });
      return res;
    },
    enabled: computed(() => isAuthenticated.value && !!resultId.value),
  });
};
