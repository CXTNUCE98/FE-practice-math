<script setup lang="ts">
import type { Exam } from '~/types/practice-math';

interface Props {
  exam: Exam;
}

const props = defineProps<Props>();
</script>

<template>
  <NuxtLink :to="`/exam/${exam.id}`" class="group block">
    <div class="card-interactive flex flex-col h-full group">
      <!-- Top Section -->
      <div class="flex items-center justify-between mb-6">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">
          <i class="bx bx-time-five"></i>
          {{ exam.duration }} Phút
        </div>
        <div class="flex items-center gap-1 text-[11px] text-slate-400 font-bold uppercase tracking-tight opacity-70">
          <i class="bx bx-calendar"></i>
          {{ new Date(exam.createdAt).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' }) }}
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors tracking-tight leading-tight font-heading">
          {{ exam.title }}
        </h3>
        
        <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
          {{ exam.description || 'Hệ thống đề thi trắc nghiệm Toán học bám sát chương trình học và các kỳ thi quan trọng.' }}
        </p>
      </div>

      <!-- Footer Info -->
      <div class="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/60">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400 font-bold">
            <i class="bx bx-list-check text-blue-500 text-lg"></i>
            {{ exam.questionCount || 0 }} Câu
          </div>
          <div class="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400 font-bold">
            <i class="bx bx-user text-blue-500 text-lg"></i>
            Admin
          </div>
        </div>
        
        <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:shadow-lg group-hover:shadow-blue-600/30">
          <i class="bx bx-right-arrow-alt text-2xl"></i>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
