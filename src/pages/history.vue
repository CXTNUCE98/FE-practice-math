<script setup lang="ts">
import { useExamHistoryQuery } from '~/composables/useExamQuery';
import dayjs from 'dayjs';

definePageMeta({
    middleware: ['auth'], // Ensure only logged-in users can access
});

const { data: history, isPending, error } = useExamHistoryQuery();

const formatDate = (date: string) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
};
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="flex items-center gap-4 mb-8">
                <NuxtLink to="/"
                    class="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <i class="bx bx-arrow-back text-xl"></i>
                </NuxtLink>
                <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Lịch sử làm bài</h1>
            </div>

            <!-- Loading -->
            <div v-if="isPending" class="space-y-4">
                <div v-for="i in 3" :key="i" class="h-24 bg-white dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            </div>

            <!-- Empty -->
            <div v-else-if="!history || history.length === 0"
                class="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl">
                <i class="bx bx-history text-6xl text-slate-200 dark:text-slate-700 mb-4"></i>
                <p class="text-xl text-slate-600 dark:text-slate-400">Bạn chưa làm bài thi nào.</p>
                <NuxtLink to="/" class="mt-4 inline-block text-sky-500 hover:underline">Làm bài ngay</NuxtLink>
            </div>

            <!-- List -->
            <div v-else class="space-y-4">
                <div v-for="result in history" :key="result.id"
                    class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">

                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            :class="result.score >= 5 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                            <span class="font-bold text-lg">{{ result.score }}</span>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-slate-900 dark:text-white">
                                {{ result.exam?.title || 'Đề thi không xác định' }}</h3>
                            <p class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                                <i class="bx bx-calendar"></i> {{ formatDate(result.startedAt) }}
                                <span v-if="result.completedAt">
                                    • <i class="bx bx-time"></i> Hoàn thành
                                </span>
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <div class="text-right hidden md:block">
                            <span class="block text-xs text-slate-500 uppercase font-semibold">Kết quả</span>
                            <span class="font-bold" :class="result.score >= 5 ? 'text-green-600' : 'text-red-500'">
                                {{ result.score >= 5 ? 'Đạt' : 'Chưa đạt' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
