<script setup lang="ts">
import { useExamsQuery } from '~/composables/useExamQuery';

const { data: exams, isPending, error } = useExamsQuery();

// Stats for hero
const stats = computed(() => [
  { label: 'Đề thi', value: exams.value?.length || 0 },
  { label: 'Người dùng', value: '1.2k+' },
  { label: 'Lượt thi', value: '5k+' },
]);

// Features
const features = [
  {
    icon: 'bx bx-check-double',
    title: 'Chấm điểm tự động',
    desc: 'Hệ thống tự động chấm điểm chính xác ngay sau khi hoàn thành bài thi.'
  },
  {
    icon: 'bx bx-trending-up',
    title: 'Phân tích kết quả',
    desc: 'Cung cấp báo cáo chi tiết về điểm số và các câu hỏi cần cải thiện.'
  },
  {
    icon: 'bx bx-book-open',
    title: 'Nội dung chọn lọc',
    desc: 'Đề thi được biên soạn bám sát chương trình học và các kỳ thi quan trọng.'
  }
];
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
    <!-- Decorative Background Elements -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-[120px] -z-10 rounded-full animate-float">
    </div>
    <div
      class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 blur-[120px] -z-10 rounded-full animate-float-slow">
    </div>

    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 md:pt-56 md:pb-40 px-4 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="flex-1 text-center lg:text-left">
            <div
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400 mb-8 animate-fade-in-down">
              <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Version 3.0: Trải nghiệm học tập vượt trội
            </div>
            <h1
              class="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-8 font-heading animate-fade-in-up">
              Làm chủ <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Toán
                học</span><br />
              theo cách mới.
            </h1>
            <p
              class="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0 font-medium animate-fade-in-up-delay">
              Nền tảng luyện thi thông minh nhất với kho đề thi khổng lồ, giải thích chi tiết và hệ thống theo dõi tiến
              độ học tập cá nhân hóa.
            </p>

            <div
              class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up-delay">
              <NuxtLink to="#exams" class="btn-primary !px-8 !py-4 text-base shadow-blue-600/20">
                Bắt đầu học ngay
                <i class="bx bx-run text-xl"></i>
              </NuxtLink>
              <NuxtLink to="/register" class="btn-secondary !px-8 !py-4 text-base">
                Khám phá tính năng
                <i class="bx bx-compass text-xl"></i>
              </NuxtLink>
            </div>

            <!-- Enhanced Stats -->
            <div
              class="grid grid-cols-3 gap-8 md:gap-12 mt-20 pt-10 border-t border-slate-100 dark:border-slate-900 animate-fade-in-up-delay">
              <div v-for="stat in stats" :key="stat.label">
                <div class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading mb-1">{{
                  stat.value }}</div>
                <div class="text-[xs] md:text-sm font-bold text-slate-400 uppercase tracking-widest">{{ stat.label }}
                </div>
              </div>
            </div>
          </div>

          <!-- Hero Illustration/Image Placeholder -->
          <div class="flex-1 hidden lg:block animate-float">
            <div class="relative w-full aspect-square max-w-lg mx-auto">
              <!-- Decorative circles -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl">
              </div>
              <div
                class="glass-card w-full h-full rounded-[40px] flex items-center justify-center p-12 overflow-hidden border-2 border-white/40 dark:border-slate-700/40 relative z-10">
                <div class="grid grid-cols-2 gap-6 w-full h-full">
                  <div
                    class="bg-blue-600 rounded-3xl p-6 flex flex-col justify-end text-white hover:scale-105 transition-transform duration-500 cursor-default">
                    <i class="bx bx-calculator text-4xl mb-4"></i>
                    <p class="font-bold text-lg">Hơn 500+ bài giảng</p>
                  </div>
                  <div
                    class="bg-indigo-600 rounded-3xl p-6 flex flex-col justify-end text-white translate-y-8 hover:scale-105 transition-transform duration-500 cursor-default">
                    <i class="bx bx-user-voice text-4xl mb-4"></i>
                    <p class="font-bold text-lg">Giáo viên hỗ trợ 24/7</p>
                  </div>
                  <div
                    class="bg-slate-900 dark:bg-blue-400 rounded-3xl p-6 flex flex-col justify-end text-white dark:text-slate-900 hover:scale-105 transition-transform duration-500 cursor-default">
                    <i class="bx bx-trophy text-4xl mb-4"></i>
                    <p class="font-bold text-lg">95% học sinh hài lòng</p>
                  </div>
                  <div
                    class="bg-emerald-500 rounded-3xl p-6 flex flex-col justify-end text-white translate-y-8 hover:scale-105 transition-transform duration-500 cursor-default">
                    <i class="bx bx-check-shield text-4xl mb-4"></i>
                    <p class="font-bold text-lg">Bản quyền độc quyền</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-32 px-4 relative">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="section-title mb-4">Tại sao chọn MathPractice?</h2>
          <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Chúng tôi mang đến giải pháp học
            trực tuyến toàn diện, tối ưu hóa thời gian và hiệu quả cho học sinh Việt Nam.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="f in features" :key="f.title"
            class="group p-10 rounded-3xl transition-all duration-500 hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-800/10 border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
            <div
              class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex-center text-blue-600 dark:text-blue-400 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <i :class="f.icon" class="text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{{ f.title }}</h3>
            <p class="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Exams List Section -->
    <section id="exams" class="py-32 px-4 bg-slate-50/50 dark:bg-slate-900/30">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
          <div class="max-w-xl">
            <div class="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">
              <i class="bx bx-hot"></i>
              Nổi bật hàng tuần
            </div>
            <h2 class="text-4xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Đề thi mới nhất
            </h2>
          </div>

          <div
            class="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <button class="px-6 py-2 text-sm font-bold rounded-xl transition-all"
              :class="'bg-slate-900 text-white shadow-xl shadow-slate-900/10'">Mới nhất</button>
            <button
              class="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Xem
              nhiều</button>
          </div>
        </div>

        <!-- States -->
        <div v-if="isPending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i"
            class="h-80 rounded-2xl bg-white dark:bg-slate-800 animate-pulse border border-slate-100 dark:border-slate-700/50">
          </div>
        </div>

        <div v-else-if="error" class="card py-20 text-center max-w-2xl mx-auto border-dashed border-2">
          <div class="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 flex-center mx-auto mb-6">
            <i class="bx bx-error-circle text-4xl text-red-500"></i>
          </div>
          <p class="text-slate-900 dark:text-white font-bold text-lg mb-2">Đã xảy ra lỗi</p>
          <p class="text-slate-500 dark:text-slate-400 mb-8">Không thể tải danh sách đề thi. Vui lòng kiểm tra lại kết
            nối.</p>
          <button @click="() => { }" class="btn-primary !px-6 !py-2.5 mx-auto">Thử lại</button>
        </div>

        <div v-else-if="!exams?.length" class="card py-24 text-center max-w-2xl mx-auto border-dashed border-2">
          <div class="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex-center mx-auto mb-6">
            <i class="bx bx-folder-open text-4xl text-slate-300"></i>
          </div>
          <p class="text-slate-500 dark:text-slate-400 font-bold">Chưa có đề thi nào trong hệ thống.</p>
        </div>

        <!-- Main List -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 px-2">
          <ExamCard v-for="exam in exams" :key="exam.id" :exam="exam" class="animate-fade-in-up" />
        </div>

        <div class="mt-20 text-center">
          <NuxtLink to="/exams" class="btn-secondary !inline-flex !px-10 !py-4 text-base font-bold shadow-sm">
            Xem toàn bộ kho đề thi
            <i class="bx bx-chevron-right text-xl"></i>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Custom animations if needed beyond UnoCSS */
</style>
