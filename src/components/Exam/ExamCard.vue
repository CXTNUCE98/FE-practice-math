<script setup lang="ts">
import type { Exam } from '~/types/practice-math';

interface Props {
  exam: Exam;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="card group hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
    <div class="flex-1">
      <div class="flex items-center justify-between mb-4">
        <span class="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-bold rounded-full">
          {{ exam.duration }} phút
        </span>
        <span class="text-slate-400 dark:text-slate-500 text-xs">
          {{ new Date(exam.createdAt).toLocaleDateString('vi-VN') }}
        </span>
      </div>
      
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
        {{ exam.title }}
      </h3>
      
      <p class="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
        {{ exam.description || 'Đề thi trắc nghiệm toán học với các câu hỏi chất lượng cao.' }}
      </p>
    </div>

    <NuxtLink :to="`/exam/${exam.id}`" class="btn-primary w-full text-center mt-auto">
      Bắt đầu thi
    </NuxtLink>
  </div>
</template>
