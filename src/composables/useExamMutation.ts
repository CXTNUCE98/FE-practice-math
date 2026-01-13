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
      return await $practiceMathApi(`/exams/${examId}/submit`, {
        method: "POST",
        headers: getAuthHeaders(),
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
      return await $practiceMathApi("/exams/upload", {
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
