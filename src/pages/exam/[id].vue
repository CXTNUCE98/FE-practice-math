<script setup lang="ts">
import { useExamDetailQuery } from '~/composables/useExamQuery';
import { useSubmitExamMutation } from '~/composables/useExamMutation';

const route = useRoute();
const examId = computed(() => route.params.id as string);

const { data: exam, isPending, error } = useExamDetailQuery(examId);
const { mutate: submitExam, isPending: isSubmitting, isSuccess: isSubmitted, data: result } = useSubmitExamMutation();
const showResult = ref(false);

const userAnswers = ref<number[]>([]);
const timeLeft = ref(0);
const currentQuestionIndex = ref(0);
const isReviewMode = ref(false);
let timerInterval: any = null;

/**
 * Bắt đầu đếm ngược thời gian
 */
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
    submitExam({ examId: examId.value, answers: userAnswers.value }, {
      onSuccess: () => {
        showResult.value = true;
      }
    });
  }
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
      handleAutoSubmit();
    })
    .catch(() => {
      // User canceled submission
    });
};

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const currentQuestion = computed(() => exam.value?.questions?.[currentQuestionIndex.value]);
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 pb-20 selection:bg-blue-600 selection:text-white">
    <!-- Decorative Background -->
    <div class="fixed top-0 right-0 w-[400px] h-[400px] bg-blue-400/5 blur-[100px] -z-10 rounded-full"></div>
    <div class="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/5 blur-[100px] -z-10 rounded-full"></div>

    <!-- Loading & Error States -->
    <div v-if="isPending" class="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
      <div class="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-6"></div>
      <p class="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-xs">Đang chuẩn bị đề thi...
      </p>
    </div>

    <div v-else-if="error"
      class="max-w-xl mx-auto mt-32 p-10 card text-center border-dashed border-2 animate-fade-in-up">
      <div class="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 flex-center mx-auto mb-6">
        <i class="bx bx-error-circle text-4xl text-red-500"></i>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-heading">Không thể tải đề thi</h2>
      <p class="text-slate-500 dark:text-slate-400 mb-8 font-medium">Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau
        ít phút.</p>
      <NuxtLink to="/" class="btn-primary !inline-flex !px-8">Quay lại trang chủ</NuxtLink>
    </div>

    <!-- Result View -->
    <div v-else-if="showResult" class="max-w-3xl mx-auto mt-24 px-4 pb-20 animate-fade-in-up">
      <div class="glass-card p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
        <!-- Floating shapes -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <div class="relative z-10">
          <div
            class="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto text-5xl mb-8 shadow-xl shadow-emerald-500/20 rotate-3">
            <i class="bx bx-trophy"></i>
          </div>
          <h2 class="text-4xl font-black text-slate-900 dark:text-white mb-3 font-heading tracking-tight">Hoàn thành bài
            thi!</h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium mb-12">Chúc mừng bạn đã hoàn thành bài thi. Dưới đây
            là kết quả chi tiết.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div
              class="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Điểm số của bạn</span>
              <div class="flex items-baseline gap-1">
                <span class="text-6xl font-black text-blue-600 dark:text-blue-400 font-heading leading-none">{{
                  result?.score?.toFixed(1) }}</span>
                <span class="text-slate-400 font-bold text-xl">/10</span>
              </div>
            </div>
            <div
              class="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 lg:col-span-1 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Thông tin nộp
                bài</span>
              <div class="space-y-2 text-center">
                <p class="text-lg font-bold text-slate-900 dark:text-white">{{ new Date().toLocaleTimeString('vi-VN') }}
                </p>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">{{ new
                  Date().toLocaleDateString('vi-VN') }}</p>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="isReviewMode = true; showResult = false"
              class="btn-secondary !px-10 !py-4 font-bold order-2 sm:order-1">
              <i class="bx bx-show text-xl"></i>
              Xem lại bài làm
            </button>
            <NuxtLink to="/" class="btn-primary !px-10 !py-4 font-bold order-1 sm:order-2 shadow-blue-600/20">
              Về trang chủ
              <i class="bx bx-home-alt text-xl"></i>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Exam Content -->
    <div v-else-if="exam" class="max-w-[1400px] mx-auto px-4 py-12 lg:py-20 animate-fade-in">
      <!-- Header Info -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 px-2">
        <div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight mb-2 uppercase">{{
            exam.title }}</h1>
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5 text-slate-500 font-bold text-sm">
              <i class="bx bx-list-ol text-blue-500"></i> {{ exam.questions?.length }} Câu hỏi
            </span>
            <span class="w-1 h-1 rounded-full bg-slate-300"></span>
            <span class="flex items-center gap-1.5 text-slate-500 font-bold text-sm">
              <i class="bx bx-time-five text-blue-500"></i> {{ exam.duration }} Phút
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button v-if="!isReviewMode" @click="handleSubmit"
            class="btn-primary !px-10 !py-4 !text-base shadow-emerald-500/20 !bg-emerald-600 !hover:bg-emerald-700">
            Nộp bài ngay
            <i class="bx bx-send text-xl"></i>
          </button>
          <NuxtLink v-else to="/" class="btn-secondary !px-8 !py-3">
            <i class="bx bx-left-arrow-alt"></i>
            Thoát xem lại
          </NuxtLink>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Main Question Area -->
        <div class="lg:col-span-8 space-y-8">
          <div class="card p-8 md:p-12 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16">
            </div>

            <div
              class="flex items-center justify-between mb-12 border-b border-slate-100 dark:border-slate-800/60 pb-8">
              <div class="space-y-1">
                <span class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">Đang
                  làm câu</span>
                <h2 class="text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tighter">
                  #{{ (currentQuestionIndex + 1).toString().padStart(2, '0') }}
                </h2>
              </div>
              <div class="flex gap-3">
                <button @click="currentQuestionIndex = Math.max(0, currentQuestionIndex - 1)"
                  class="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed group"
                  :disabled="currentQuestionIndex === 0">
                  <i
                    class="bx bx-chevron-left text-2xl text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white"></i>
                </button>
                <button
                  @click="currentQuestionIndex = Math.min((exam.questions?.length || 1) - 1, currentQuestionIndex + 1)"
                  class="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed group"
                  :disabled="currentQuestionIndex === (exam.questions?.length || 1) - 1">
                  <i
                    class="bx bx-chevron-right text-2xl text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white"></i>
                </button>
              </div>
            </div>

            <div v-if="currentQuestion" class="space-y-12 animate-fade-in">
              <div
                class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                <MathRenderer :content="currentQuestion.content" block
                  class="text-xl md:text-2xl leading-[1.6] text-slate-900 dark:text-white font-medium" />
              </div>

              <div class="grid grid-cols-1 gap-4">
                <button v-for="(option, idx) in currentQuestion.options" :key="idx"
                  @click="!isReviewMode && handleSelectAnswer(currentQuestionIndex, idx)"
                  class="flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left relative overflow-hidden group/opt"
                  :class="[
                    !isReviewMode && userAnswers[currentQuestionIndex] === idx
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-lg shadow-blue-600/5'
                      : isReviewMode
                        ? (idx === currentQuestion.correctAnswer
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10'
                          : userAnswers[currentQuestionIndex] === idx
                            ? 'border-red-500 bg-red-50/50 dark:bg-red-500/10'
                            : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60')
                        : 'border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-900',
                    isReviewMode && 'cursor-default'
                  ]">
                  <div v-if="!isReviewMode"
                    class="absolute inset-0 bg-blue-600 opacity-0 group-hover/opt:opacity-[0.02] transition-opacity">
                  </div>

                  <span
                    class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl font-black transition-all text-xl font-heading shadow-sm"
                    :class="[
                      !isReviewMode && userAnswers[currentQuestionIndex] === idx
                        ? 'bg-blue-600 text-white scale-110 rotate-3'
                        : isReviewMode
                          ? (idx === currentQuestion.correctAnswer
                            ? 'bg-emerald-600 text-white'
                            : userAnswers[currentQuestionIndex] === idx
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-400')
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover/opt:scale-110 group-hover/opt:bg-blue-100 dark:group-hover/opt:bg-blue-900/30 group-hover/opt:text-blue-600'
                    ]">
                    {{ String.fromCharCode(65 + idx) }}
                  </span>
                  <div class="flex-grow flex justify-between items-center">
                    <MathRenderer :content="option" class="font-bold text-slate-700 dark:text-slate-200 text-lg" />
                    <div v-if="isReviewMode" class="flex items-center">
                      <i v-if="idx === currentQuestion.correctAnswer"
                        class="bx bxs-check-circle text-2xl text-emerald-500"></i>
                      <i v-else-if="userAnswers[currentQuestionIndex] === idx"
                        class="bx bxs-x-circle text-2xl text-red-500"></i>
                    </div>
                  </div>
                </button>
              </div>

              <!-- Explanation Area -->
              <div v-if="isReviewMode && currentQuestion.explanation"
                class="mt-8 p-6 bg-blue-50/50 dark:bg-blue-500/5 rounded-3xl border border-blue-100 dark:border-blue-900/30 animate-fade-in">
                <div
                  class="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400 font-black uppercase text-xs tracking-widest">
                  <i class="bx bx-bulb text-lg"></i>
                  Lời giải chi tiết
                </div>
                <MathRenderer :content="currentQuestion.explanation" block
                  class="text-slate-700 dark:text-slate-300 leading-relaxed" />
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center px-4">
            <button @click="currentQuestionIndex = Math.max(0, currentQuestionIndex - 1)"
              class="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-colors disabled:opacity-0"
              :disabled="currentQuestionIndex === 0">
              <i class="bx bx-left-arrow-alt text-2xl"></i>
              Câu trước
            </button>
            <button
              @click="currentQuestionIndex = Math.min((exam.questions?.length || 1) - 1, currentQuestionIndex + 1)"
              class="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-colors disabled:opacity-0"
              :disabled="currentQuestionIndex === (exam.questions?.length || 1) - 1">
              Câu sau
              <i class="bx bx-right-arrow-alt text-2xl"></i>
            </button>
          </div>
        </div>

        <!-- Sidebar / Navigation -->
        <div class="lg:col-span-4 space-y-8">
          <!-- Timer Card -->
          <div class="glass-card p-10 text-center sticky top-28 shadow-xl border-blue-500/20">
            <div class="absolute top-0 right-0 p-3">
              <div class="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
            </div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Thời gian làm bài</p>
            <div
              class="text-6xl font-black font-mono tracking-tighter text-slate-900 dark:text-white mb-8 bg-slate-50 dark:bg-slate-900/50 py-6 rounded-3xl border border-slate-100 dark:border-slate-800 tabular-nums">
              {{ formatTime(timeLeft) }}
            </div>

            <div class="space-y-4">
              <div class="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest px-2">
                <span>Tiến độ</span>
                <span>{{userAnswers.filter(a => a !== -1).length}}/{{ exam.questions?.length }} Câu</span>
              </div>
              <div
                class="h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-1 border border-slate-200/50 dark:border-slate-800/50">
                <div
                  class="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000"
                  :style="{ width: `${(userAnswers.filter(a => a !== -1).length / (exam.questions?.length || 1)) * 100}%` }">
                </div>
              </div>
            </div>
          </div>

          <!-- Question Grid -->
          <div class="card p-8 group">
            <h3
              class="font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3 font-heading uppercase tracking-tight">
              <div
                class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                <i class="bx bx-grid-alt"></i>
              </div>
              Bản đồ câu hỏi
            </h3>
            <div class="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-3">
              <button v-for="(ans, idx) in userAnswers" :key="idx" @click="currentQuestionIndex = idx"
                class="aspect-square flex items-center justify-center text-sm font-black rounded-xl transition-all border-2 relative group/item"
                :class="[
                  currentQuestionIndex === idx ? 'border-blue-600 dark:border-blue-500' : 'border-transparent',
                  ans !== -1
                    ? (currentQuestionIndex === idx ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-100 dark:border-blue-500/20')
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                ]">
                {{ idx + 1 }}
                <div v-if="ans !== -1"
                  class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900"
                  :class="[
                    isReviewMode
                      ? (ans === exam?.questions?.[idx]?.correctAnswer ? 'bg-emerald-500' : 'bg-red-500')
                      : 'bg-emerald-500'
                  ]">
                </div>
              </button>
            </div>

            <div class="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-blue-600"></div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đã chọn</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trống</span>
              </div>
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
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
