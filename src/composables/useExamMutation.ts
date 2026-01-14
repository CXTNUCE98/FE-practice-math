import { useMutation, useQueryClient } from "@tanstack/vue-query";

/**
 * Mutation xử lý nộp bài thi
 */
export const useSubmitExamMutation = () => {
  const { getAuthHeaders } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      examId,
      answers,
    }: {
      examId: string;
      answers: number[];
    }): Promise<any> => {
      return await $practiceMathApi("/exams/{id}/submit", {
        method: "POST",
        headers: getAuthHeaders(),
        path: { id: examId },
        body: { answers },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-history"] });
    },
  });
};

/**
 * Mutation xử lý upload đề thi (Dành cho Admin)
 */
export const useUploadExamMutation = () => {
  const { getAuthHeaders } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData): Promise<any> => {
      // NOTE: Bypass nuxt-api-party proxy for FormData to ensure
      // correct multipart/form-data handling with all fields (title, duration, file)
      const config = useRuntimeConfig();
      const apiBase = config.public.apiBase;

      return await $fetch(`${apiBase}/exams/upload`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

/**
 * Mutation xử lý xóa đề thi (Dành cho Admin)
 */
export const useDeleteExamMutation = () => {
  const { getAuthHeaders } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<any> => {
      return await $practiceMathApi(`/exams/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};
