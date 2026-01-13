<script setup lang="ts">
import { useExamsQuery } from '~/composables/useExamQuery';

const { data: exams, isPending, error } = useExamsQuery();
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-sky-500 to-blue-600 py-16 text-white text-center px-4 mb-12">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-top">
          Luyện Thi Toán Học
        </h1>
        <p class="text-xl opacity-90 max-w-2xl mx-auto">
          Nâng cao kỹ năng giải toán với các đề thi bám sát chương trình học và hệ thống chấm điểm tự động.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <i class="bx bx-list-ul text-sky-500"></i>
          Danh sách đề thi
        </h2>
      </div>

      <!-- Loading State -->
      <div v-if="isPending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="card animate-pulse h-64 bg-white dark:bg-slate-800"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl text-center border border-red-100 dark:border-red-800">
        <i class="bx bx-error-circle text-5xl text-red-500 mb-4"></i>
        <p class="text-slate-900 dark:text-white font-bold text-xl mb-2">Đã có lỗi xảy ra</p>
        <p class="text-slate-600 dark:text-slate-400">Không thể tải danh sách đề thi. Vui lòng thử lại sau.</p>
      </div>

      <!-- Exam List -->
      <div v-else-if="exams && exams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ExamCard v-for="exam in exams" :key="exam.id" :exam="exam" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <i class="bx bx-file-blank text-7xl text-slate-200 dark:text-slate-700 mb-4"></i>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white">Chưa có đề thi nào</h3>
        <p class="text-slate-500 dark:text-slate-400">Vui lòng quay lại sau hoặc liên hệ quản trị viên.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-top {
  animation: fadeInTop 0.8s ease-out forwards;
}

@keyframes fadeInTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>