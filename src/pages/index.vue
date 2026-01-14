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
    icon: 'bx-check-double',
    title: 'Chấm điểm tự động',
    desc: 'Hệ thống tự động chấm điểm chính xác ngay sau khi hoàn thành bài thi.'
  },
  {
    icon: 'bx-trending-up',
    title: 'Phân tích kết quả',
    desc: 'Cung cấp báo cáo chi tiết về điểm số và các câu hỏi cần cải thiện.'
  },
  {
    icon: 'bx-shield-quarter',
    title: 'Nội dung chọn lọc',
    desc: 'Đề thi được biên soạn bám sát chương trình học và các kỳ thi quan trọng.'
  }
];
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900">
    <!-- Hero -->
    <section class="pt-32 pb-20 md:pt-48 md:pb-32 px-4 border-b border-slate-50 dark:border-slate-900">
      <div class="max-w-7xl mx-auto">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-8 animate-fade-in">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Version 2.0 đã ra mắt
          </div>
          <h1 class="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8 animate-slide-up">
            Nền tảng luyện thi <span class="text-blue-600">Toán học</span> hiện đại.
          </h1>
          <p class="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl animate-slide-up delay-100">
            Học tập hiệu quả hơn với hệ thống đề thi thông minh, giao diện tối giản và trải nghiệm làm bài mượt mà nhất.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 animate-slide-up delay-200">
            <NuxtLink to="#exams" class="btn-primary flex items-center justify-center gap-2">
              Bắt đầu luyện tập
              <i class="bx bx-right-arrow-alt text-xl"></i>
            </NuxtLink>
            <NuxtLink to="/register" class="btn-secondary flex items-center justify-center gap-2">
              Tìm hiểu thêm
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mt-20 pt-12 border-t border-slate-100 dark:border-slate-900 animate-fade-in delay-300">
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ stat.value }}</div>
            <div class="text-sm font-medium text-slate-400">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-24 px-4 bg-slate-50/50 dark:bg-slate-900/20">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div v-for="f in features" :key="f.title" class="space-y-4">
            <div class="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-blue-600">
              <i :class="f.icon" class="text-xl"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ f.title }}</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Exams List -->
    <section id="exams" class="py-24 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Đề thi mới nhất</h2>
            <p class="text-slate-500 dark:text-slate-400">Danh sách các đề thi được cập nhật thường xuyên</p>
          </div>
          <div class="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
            <button class="px-4 py-1.5 text-sm font-semibold rounded-md bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white">Tất cả</button>
            <button class="px-4 py-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Yêu thích</button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isPending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="h-64 rounded-xl bg-slate-50 dark:bg-slate-900 animate-pulse border border-slate-100 dark:border-slate-800"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="card py-16 text-center text-slate-500 border-dashed border-2">
          <i class="bx bx-error-circle text-4xl mb-4 text-red-400"></i>
          <p>Không thể tải danh sách đề thi. Vui lòng thử lại sau.</p>
        </div>

        <!-- Empty -->
        <div v-else-if="!exams?.length" class="card py-20 text-center text-slate-400 border-dashed border-2">
          <i class="bx bx-folder-open text-5xl mb-4 opacity-50"></i>
          <p>Chưa có đề thi nào trong danh sách.</p>
        </div>

        <!-- List -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ExamCard v-for="exam in exams" :key="exam.id" :exam="exam" />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t border-slate-100 dark:border-slate-900 px-4">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold">M</div>
          <span class="font-bold text-slate-900 dark:text-white">MathPractice</span>
        </div>
        <div class="flex gap-8 text-sm font-medium text-slate-400">
          <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Điều khoản</a>
          <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Bảo mật</a>
          <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Liên hệ</a>
        </div>
        <div class="text-sm text-slate-400">
          © 2026 MathPractice. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
