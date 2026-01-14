<script setup lang="ts">
import { useAdminUserHistoryQuery } from '~/composables/useAdmin';
import dayjs from 'dayjs';

definePageMeta({
    middleware: ['auth'], // Should be admin-only middleware ideally
});

const route = useRoute();
const userId = route.params.id as string;
const { data: history, isPending } = useAdminUserHistoryQuery(userId);

// Helper
const formatDate = (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm');
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
        <div class="max-w-4xl mx-auto px-4 py-8">
            <div class="flex items-center gap-4 mb-8">
                <NuxtLink to="/admin/dashboard"
                    class="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <i class="bx bx-arrow-back text-xl"></i>
                </NuxtLink>
                <div>
                    <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Lịch sử thi chi tiết</h1>
                    <p class="text-sm text-slate-500">User ID: {{ userId }}</p>
                </div>
            </div>

            <div v-if="isPending" class="space-y-4">
                <div v-for="i in 3" :key="i" class="h-20 bg-white dark:bg-slate-800 rounded-xl animate-pulse"></div>
            </div>

            <div v-else-if="!history || history.length === 0"
                class="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
                <p class="text-slate-500">User này chưa làm bài thi nào.</p>
            </div>

            <div v-else class="space-y-4">
                <div v-for="result in history" :key="result.id"
                    class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center">

                    <div>
                        <h3 class="font-bold text-slate-900 dark:text-white">{{ result.exam?.title || 'Unknown Exam' }}
                        </h3>
                        <p class="text-sm text-slate-500 mt-1">
                            Bắt đầu: {{ formatDate(result.startedAt) }}
                        </p>
                    </div>

                    <div class="text-right">
                        <div class="text-2xl font-bold" :class="result.score >= 5 ? 'text-green-600' : 'text-red-500'">
                            {{ result.score }}
                        </div>
                        <div class="text-xs text-slate-400 font-medium uppercase mt-1">Điểm số</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
