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
    <div class="min-h-screen bg-white dark:bg-slate-950 pb-20">
        <div class="max-w-5xl mx-auto px-4 py-12">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div class="flex items-center gap-5">
                    <NuxtLink to="/profile"
                        class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                        <i class="bx bx-arrow-back text-2xl"></i>
                    </NuxtLink>
                    <div>
                        <h1 class="text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">Lịch
                            sử làm bài</h1>
                        <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">Xem lại các kỳ thi bạn đã tham
                            gia</p>
                    </div>
                </div>

                <div
                    class="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                    <div class="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ history?.length || 0 }} Bài đã
                        làm</span>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="isPending" class="grid grid-cols-1 gap-4">
                <div v-for="i in 4" :key="i"
                    class="h-28 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800">
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!history || history.length === 0" class="card py-24 text-center border-dashed border-2">
                <div class="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 flex-center mx-auto mb-6">
                    <i class="bx bx-history text-5xl text-slate-200 dark:text-slate-700"></i>
                </div>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-heading">Chưa có dữ liệu</h3>
                <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto font-medium">Bạn chưa thực hiện bất
                    kỳ bài thi nào. Hãy thử sức ngay!</p>
                <NuxtLink to="/" class="btn-primary !inline-flex !px-8 !py-3">Làm bài ngay</NuxtLink>
            </div>

            <!-- List -->
            <div v-else class="grid grid-cols-1 gap-5">
                <div v-for="result in history" :key="result.id"
                    class="card-interactive flex flex-col md:flex-row md:items-center justify-between gap-6 group">

                    <div class="flex items-center gap-5">
                        <div class="w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-110"
                            :class="result.score >= 5 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-emerald-500/10' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 shadow-red-500/10'">
                            <span class="text-2xl font-black font-heading leading-none">{{ result.score }}</span>
                            <span class="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">Điểm</span>
                        </div>
                        <div>
                            <h3
                                class="font-bold text-xl text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors font-heading mb-1 line-clamp-1">
                                {{ result.exam?.title || 'Đề thi không xác định' }}
                            </h3>
                            <div class="flex flex-wrap items-center gap-4">
                                <span class="flex items-center gap-1.5 text-sm text-slate-400 font-bold">
                                    <i class="bx bx-calendar text-blue-500"></i>
                                    {{ formatDate(result.startedAt) }}
                                </span>
                                <span v-if="result.submittedAt"
                                    class="flex items-center gap-1.5 text-sm text-slate-400 font-bold">
                                    <i class="bx bx-check-double text-emerald-500"></i>
                                    Đã nộp bài
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                        <div class="flex flex-col items-end">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Xếp
                                loại</span>
                            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                                :class="result.score >= 8 ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : (result.score >= 5 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400')">
                                {{ result.score >= 8 ? 'Giỏi' : (result.score >= 5 ? 'Đạt' : 'Chưa đạt') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
