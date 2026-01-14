<script setup lang="ts">
import { useExamDetailQuery } from '~/composables/useExamQuery';
import { useSubmitExamMutation } from '~/composables/useExamMutation';

const route = useRoute();
const router = useRouter();
const examId = route.params.id as string;

// State
const answers = ref<number[]>([]);
const currentStep = ref(0); // Optional: if implementing pagination per question

// Queries
const { data: exam, isPending, error } = useExamDetailQuery(examId);

// Mutations
const { mutate: submitExam, isPending: isSubmitting, data: result } = useSubmitExamMutation();

// Initialize answers array when exam loads
watch(exam, (newExam) => {
    if (newExam && newExam.questions) {
        answers.value = new Array(newExam.questions.length).fill(-1);
    }
});

const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    answers.value[questionIndex] = answerIndex;
};

const handleSubmit = () => {
    ElMessageBox.confirm(
        'Bạn có chắc chắn muốn nộp bài?',
        'Xác nhận nộp bài',
        {
            confirmButtonText: 'Nộp bài',
            cancelButtonText: 'Hủy',
            type: 'info',
        }
    )
        .then(() => {
            submitExam({
                examId,
                answers: answers.value,
            }, {
                onSuccess: (data) => {
                    ElMessage.success(`Nộp bài thành công! Điểm số: ${data.score}`);
                    router.push('/history');
                }
            });
        })
        .catch(() => {
            // User canceled submission
        });
};
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
        <div class="max-w-4xl mx-auto">
            <!-- Loading State -->
            <div v-if="isPending" class="text-center py-20">
                <div class="animate-spin text-5xl text-sky-500 mb-4 inline-block">
                    <i class="bx bx-loader-alt"></i>
                </div>
                <p class="text-slate-600 dark:text-slate-400">Đang tải đề thi...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-20 text-red-500">
                <h2 class="text-2xl font-bold">Không tìm thấy đề thi</h2>
                <p>Vui lòng thử lại sau.</p>
                <NuxtLink to="/" class="btn-primary mt-4 inline-block">Về trang chủ</NuxtLink>
            </div>

            <!-- Exam Content -->
            <div v-else-if="exam" class="space-y-8">
                <!-- Header -->
                <div
                    class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-4 z-10 font-sans">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ exam.title }}</h1>
                        <p class="text-slate-500 text-sm mt-1">
                            <i class="bx bx-time-five mr-1"></i> {{ exam.duration }} phút
                            <span class="mx-2">•</span>
                            <i class="bx bx-question-mark mr-1"></i> {{ exam?.questions?.length }} câu hỏi
                        </p>
                    </div>
                    <button @click="handleSubmit" :disabled="isSubmitting" class="btn-primary flex items-center gap-2">
                        <span v-if="isSubmitting"><i class="bx bx-loader-alt animate-spin"></i></span>
                        <span>Nộp bài</span>
                    </button>
                </div>

                <!-- Questions List -->
                <div class="space-y-6">
                    <div v-for="(question, qIndex) in exam.questions" :key="qIndex"
                        class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-start gap-3">
                            <span
                                class="bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 w-8 h-8 flex items-center justify-center rounded-lg text-sm flex-shrink-0">
                                {{ qIndex + 1 }}
                            </span>
                            <span v-html="question.content"></span>
                        </h3>

                        <!-- Options -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                            <div v-for="(option, oIndex) in question.options" :key="oIndex"
                                @click="handleSelectAnswer(qIndex, oIndex)"
                                class="cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 group"
                                :class="[
                                    answers[qIndex] === oIndex
                                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                                        : 'border-slate-200 dark:border-slate-600 hover:border-sky-300 dark:hover:border-slate-500'
                                ]">
                                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                                    :class="[
                                        answers[qIndex] === oIndex
                                            ? 'border-sky-500 bg-sky-500'
                                            : 'border-slate-300 dark:border-slate-500 group-hover:border-sky-400'
                                    ]">
                                    <i v-if="answers[qIndex] === oIndex" class="bx bx-check text-white text-sm"></i>
                                </div>
                                <span class="text-slate-700 dark:text-slate-300 font-medium">{{ option }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-primary {
    @apply bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-sky-500/30 active:scale-95;
}
</style>
