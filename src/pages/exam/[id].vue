<script setup lang="ts">
import { useExamDetailQuery } from '~/composables/useExamQuery';
import { useSubmitExamMutation } from '~/composables/useExamMutation';

const route = useRoute();
const examId = computed(() => route.params.id as string);

const { data: exam, isPending, error } = useExamDetailQuery(examId);
const { mutate: submitExam, isPending: isSubmitting, isSuccess: isSubmitted, data: result } = useSubmitExamMutation();

const userAnswers = ref<number[]>([]);
const timeLeft = ref(0);
const currentQuestionIndex = ref(0);
let timerInterval: any = null;

/**
 * Khởi tạo dữ liệu khi đề thi được tải xong
 */
watch(exam, (newExam) => {
  if (newExam && newExam.questions) {
    userAnswers.value = new Array(newExam.questions.length).fill(-1);
    timeLeft.value = newExam.duration * 60;
    startTimer();
  }
}, { immediate: true });

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      handleAutoSubmit();
    }
  }, 1000);
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
  userAnswers.value[questionIndex] = answerIndex;
};

const handleAutoSubmit = () => {
  clearInterval(timerInterval);
  if (!isSubmitted.value) {
    submitExam({ examId: examId.value, answers: userAnswers.value });
  }
};

const handleSubmit = () => {
  if (confirm('Bạn có chắc chắn muốn nộp bài?')) {
    handleAutoSubmit();
  }
};

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const currentQuestion = computed(() => exam.value?.questions?.[currentQuestionIndex.value]);
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
    <!-- Loading & Error States -->
    <div v-if="isPending" class="flex flex-col items-center justify-center min-h-[60vh]">
      <div class="animate-spin text-5xl text-sky-500 mb-4">
        <i class="bx bx-loader-alt"></i>
      </div>
      <p class="text-slate-600 dark:text-slate-400">Đang tải đề thi...</p>
    </div>

    <div v-else-if="error" class="max-w-xl mx-auto mt-20 p-8 card text-center">
      <i class="bx bx-error-circle text-5xl text-red-500 mb-4"></i>
      <h2 class="text-xl font-bold mb-2">Không thể tải đề thi</h2>
      <p class="text-slate-600 mb-6">Vui lòng kiểm tra lại kết nối hoặc thử lại sau.</p>
      <NuxtLink to="/" class="btn-primary inline-block">Quay lại trang chủ</NuxtLink>
    </div>

    <!-- Result View -->
    <div v-else-if="isSubmitted" class="max-w-2xl mx-auto mt-20 p-8 card text-center animate-fade-in-top">
      <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto text-4xl mb-6">
        <i class="bx bx-trophy"></i>
      </div>
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Hoàn thành bài thi!</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-8">Kết quả của bạn đã được ghi lại.</p>
      
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
          <p class="text-sm text-slate-500 mb-1">Điểm số</p>
          <p class="text-4xl font-black text-sky-600 dark:text-sky-400">{{ result?.score?.toFixed(1) }}</p>
        </div>
        <div class="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
          <p class="text-sm text-slate-500 mb-1">Thời gian nộp</p>
          <p class="text-lg font-bold">{{ new Date().toLocaleTimeString('vi-VN') }}</p>
        </div>
      </div>
      
      <div class="flex gap-4">
        <NuxtLink to="/" class="flex-1 btn-primary">Về trang chủ</NuxtLink>
        <button @click="isSubmitted = false" class="flex-1 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          Xem lại bài
        </button>
      </div>
    </div>

    <!-- Exam Content -->
    <div v-else-if="exam" class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Main Question Area -->
        <div class="lg:col-span-3 space-y-6">
          <div class="card p-8">
            <div class="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
              <h2 class="text-lg font-bold text-slate-500 uppercase tracking-wider">
                Câu hỏi {{ currentQuestionIndex + 1 }}
              </h2>
              <div class="flex gap-2">
                <button 
                  @click="currentQuestionIndex = Math.max(0, currentQuestionIndex - 1)"
                  class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                  :disabled="currentQuestionIndex === 0"
                >
                  <i class="bx bx-chevron-left text-2xl"></i>
                </button>
                <button 
                  @click="currentQuestionIndex = Math.min((exam.questions?.length || 1) - 1, currentQuestionIndex + 1)"
                  class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                  :disabled="currentQuestionIndex === (exam.questions?.length || 1) - 1"
                >
                  <i class="bx bx-chevron-right text-2xl"></i>
                </button>
              </div>
            </div>

            <div v-if="currentQuestion" class="space-y-8">
              <MathRenderer :content="currentQuestion.content" block class="text-xl leading-relaxed text-slate-900 dark:text-white" />
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  v-for="(option, idx) in currentQuestion.options" 
                  :key="idx"
                  @click="handleSelectAnswer(currentQuestionIndex, idx)"
                  class="flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group"
                  :class="[
                    userAnswers[currentQuestionIndex] === idx 
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700'
                  ]"
                >
                  <span 
                    class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl font-bold transition-all text-lg"
                    :class="[
                      userAnswers[currentQuestionIndex] === idx 
                        ? 'bg-sky-500 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-sky-100 dark:group-hover:bg-sky-900/30 group-hover:text-sky-600'
                    ]"
                  >
                    {{ String.fromCharCode(65 + idx) }}
                  </span>
                  <MathRenderer :content="option" class="font-medium text-slate-700 dark:text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar / Navigation -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Timer Card -->
          <div class="card p-6 border-sky-200 dark:border-sky-900 text-center sticky top-24">
            <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Thời gian còn lại</p>
            <p class="text-4xl font-black font-mono tracking-tighter text-sky-600 dark:text-sky-400 mb-6">
              {{ formatTime(timeLeft) }}
            </p>
            
            <button 
              @click="handleSubmit" 
              :disabled="isSubmitting"
              class="btn-primary w-full py-4 text-lg"
            >
              {{ isSubmitting ? 'Đang nộp bài...' : 'Nộp bài thi' }}
            </button>
          </div>

          <!-- Question Grid -->
          <div class="card p-6">
            <h3 class="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="bx bx-grid-alt"></i>
              Phiếu trả lời
            </h3>
            <div class="grid grid-cols-5 gap-2">
              <button 
                v-for="(ans, idx) in userAnswers" 
                :key="idx"
                @click="currentQuestionIndex = idx"
                class="w-full aspect-square flex items-center justify-center text-xs font-bold rounded-lg transition-all border"
                :class="[
                  currentQuestionIndex === idx ? 'ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900' : '',
                  ans !== -1 
                    ? 'bg-sky-500 text-white border-transparent' 
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-sky-300'
                ]"
              >
                {{ idx + 1 }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-top {
  animation: fadeInTop 0.5s ease-out forwards;
}

@keyframes fadeInTop {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
