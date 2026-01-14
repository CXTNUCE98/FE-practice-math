<script setup lang="ts">
import { useAdminUserHistoryQuery } from '~/composables/useAdmin';

const props = defineProps<{
    userId: string;
    fullName: string;
}>();

const emit = defineEmits(['close']);

const idRef = computed(() => props.userId);
const { data: history, isPending } = useAdminUserHistoryQuery(idRef);

const visible = ref(true);

const handleClose = () => {
    emit('close');
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    if (score >= 5) return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
    return 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
};
</script>

<template>
    <el-dialog v-model="visible" width="850px" @closed="handleClose"
        class="history-dialog !rounded-[2rem] overflow-hidden dark:bg-#0F172A" :show-close="false"
        :destroy-on-close="true">

        <template #header>
            <div class="flex items-center justify-between px-2">
                <div class="flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-sky-500/30">
                        <i class="bx bx-history"></i>
                    </div>
                    <div>
                        <h2 class="text-2xl font-black text-slate-900 dark:text-white leading-tight">Lịch sử thi chi
                            tiết
                        </h2>
                        <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{
                            fullName }}</p>
                    </div>
                </div>
                <button @click="visible = false"
                    class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center justify-center">
                    <i class="bx bx-x text-2xl"></i>
                </button>
            </div>
        </template>

        <div v-if="isPending" class="flex flex-col items-center justify-center py-24 gap-6">
            <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-4 border-sky-500/20 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-sky-500 border-t-transparent rounded-full animate-spin">
                </div>
            </div>
            <p class="text-slate-900 dark:text-slate-100 font-black text-lg animate-pulse tracking-wide">Đang tải dữ
                liệu...</p>
        </div>

        <div v-else-if="!history?.length" class="text-center py-24">
            <div
                class="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-slate-300 dark:text-slate-700">
                <i class="bx bx-file-blank"></i>
            </div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">Trống trơn!</h3>
            <p class="text-slate-600 dark:text-slate-400 font-bold">Học sinh này chưa tham gia bất kỳ bài làm nào.</p>
        </div>

        <div v-else class="space-y-4 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
            <div v-for="(item, index) in history" :key="item.id"
                class="group relative bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-6 rounded-[1.5rem] hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/40 dark:hover:shadow-slate-950/50 hover:border-sky-500/30">
                <div class="flex items-center justify-between gap-6">
                    <div class="flex items-center gap-5">
                        <div
                            class="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-black text-slate-400 dark:text-slate-500 flex items-center justify-center text-xl group-hover:text-sky-500 group-hover:border-sky-500/20 transition-all shadow-sm">
                            {{ index + 1 }}
                        </div>
                        <div>
                            <h4
                                class="text-lg font-black text-slate-900 dark:text-white mb-1.5 group-hover:text-sky-500 transition-colors">
                                {{ item.exam.title }}
                            </h4>
                            <div class="flex items-center gap-5">
                                <span
                                    class="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                    <i class="bx bx-calendar text-sky-500"></i>
                                    {{ formatDate(item.startedAt).split(' ')[1] }}
                                </span>
                                <span
                                    class="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                    <i class="bx bx-time-five text-sky-500"></i>
                                    {{ formatDate(item.startedAt).split(' ')[0] }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-6">
                        <div class="text-right">
                            <div class="text-3xl font-black mb-1"
                                :class="item.score >= 5 ? 'text-sky-600 dark:text-sky-400' : 'text-rose-600 dark:text-rose-400'">
                                {{ item.score.toFixed(1) }}
                                <span
                                    class="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tighter">/
                                    10</span>
                            </div>
                            <div class="inline-flex items-center px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest leading-none"
                                :class="getScoreColor(item.score)">
                                {{ item.score >= 8 ? 'Xuất sắc' : item.score >= 5 ? 'Đạt' : 'Cần cố gắng' }}
                            </div>
                        </div>
                        <NuxtLink :to="`/exam/review/${item.id}`" target="_blank"
                            class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-sky-500 hover:text-white hover:border-sky-500 flex items-center justify-center text-xl transition-all duration-300 shadow-sm">
                            <i class="bx bx-right-arrow-alt"></i>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<style scoped>
.history-dialog {
    @apply !bg-white dark: !bg-slate-900 !border-none !shadow-[0_32px_64px_-16px_rgba(0, 0, 0, 0.2)];
}

.history-dialog .el-dialog__header {
    @apply !p-8 !pb-6 border-b border-slate-100 dark:border-slate-800/50;
}

.history-dialog .el-dialog__body {
    @apply !p-8 !pt-6;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-slate-200 dark:bg-slate-800 rounded-full;
}

/* Hiệu ứng hiển thị văn bản sắc nét hơn */
h2,
h4,
p,
span {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
}
</style>
