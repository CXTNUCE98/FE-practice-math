<script setup lang="ts">
import type { Exam } from '~/types/practice-math';

interface Props {
  exam: Exam;
}

const props = defineProps<Props>();
</script>

<template>
  <NuxtLink :to="`/exam/${exam.id}`" class="group block">
    <div class="card-interactive flex flex-col h-full group-hover:-translate-y-1 transition-all duration-300">
      <!-- Top -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <i class="bx bx-time-five"></i>
          {{ exam.duration }} Min
        </div>
        <div class="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <i class="bx bx-calendar"></i>
          {{ new Date(exam.createdAt).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' }) }}
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-1">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">
          {{ exam.title }}
        </h3>
        
        <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
          {{ exam.description || 'Hệ thống đề thi trắc nghiệm Toán học bám sát chương trình học và các kỳ thi quan trọng.' }}
        </p>
      </div>

      <!-- Info -->
      <div class="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-800">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <i class="bx bx-list-check text-slate-300"></i>
            {{ exam.questionCount || 0 }} Câu hỏi
          </div>
          <div class="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <i class="bx bx-user-circle text-slate-300"></i>
            Admin
          </div>
        </div>
        
        <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-all duration-300">
          <i class="bx bx-right-arrow-alt text-xl"></i>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
