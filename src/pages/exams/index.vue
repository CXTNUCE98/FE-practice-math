<script setup lang="ts">
import { useExamsQuery } from '~/composables/useExamQuery';

useHead({
    title: 'Kho Đề Thi - MathPractice',
    meta: [
        { name: 'description', content: 'Khám phá kho đề thi toán học từ cơ bản đến nâng cao, bám sát chương trình học.' }
    ]
});

const { data: exams, isPending, error } = useExamsQuery();
const localePath = useLocalePath();

const searchQuery = ref('');
const sortBy = ref('latest'); // 'latest' | 'popular'

const filteredExams = computed(() => {
    if (!exams.value) return [];

    let result = [...exams.value];

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(exam =>
            exam.title.toLowerCase().includes(query) ||
            exam.description?.toLowerCase().includes(query)
        );
    }

    // Sort
    if (sortBy.value === 'latest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
});
</script>

<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 pb-32">
        <!-- Hero Section -->
        <section class="relative pt-32 pb-20 px-4 overflow-hidden">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full"></div>
                <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 blur-[120px] rounded-full">
                </div>
            </div>

            <div class="max-w-7xl mx-auto text-center">
                <div
                    class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400 mb-6 animate-fade-in-down">
                    <i class="bx bx-book-open"></i>
                    Kho tài liệu độc quyền
                </div>
                <h1
                    class="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight animate-fade-in-up">
                    Khám phá <span
                        class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Kho đề
                        thi</span>
                </h1>
                <p
                    class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium text-lg animate-fade-in-up-delay">
                    Tổng hợp các đề thi Toán học chất lượng cao, bám sát chương trình Bộ Giáo dục và Đào tạo.
                </p>
            </div>
        </section>

        <!-- Filters Section -->
        <section class="px-4 mb-20 relative z-10 animate-fade-in-up-delay">
            <div class="max-w-7xl mx-auto">
                <div
                    class="glass-card p-2 md:p-3 shadow-2xl shadow-blue-600/5 border-slate-200/50 dark:border-slate-800/50 rounded-[28px]">
                    <div class="flex flex-col md:flex-row items-center gap-2">
                        <!-- Search Box -->
                        <div class="relative flex-1 w-full group/search">
                            <div class="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                <i
                                    class="bx bx-search text-2xl text-slate-400 group-focus-within/search:text-blue-500 transition-colors"></i>
                                <div class="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
                            </div>
                            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm tên đề thi, nội dung..."
                                class="w-full pl-18 pr-6 py-5 rounded-[22px] bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-medium border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-slate-900 focus:shadow-xl focus:shadow-blue-500/5 outline-none transition-all duration-300 placeholder:text-slate-400" />
                        </div>

                        <!-- Sort Options -->
                        <div
                            class="flex items-center gap-2 p-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-[22px] w-full md:w-auto">
                            <div class="flex items-center gap-2 px-4 py-3 shrink-0">
                                <i class="bx bx-sort-alt-2 text-xl text-slate-400"></i>
                                <span
                                    class="text-xs font-black text-slate-400 uppercase tracking-widest hidden lg:block">Sắp
                                    xếp</span>
                            </div>
                            <el-select v-model="sortBy" size="large" class="custom-select-v2 min-w-[160px]">
                                <el-option label="Mới nhất" value="latest" />
                                <el-option label="Phổ biến" value="popular" />
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- List Section -->
        <section class="px-4 animate-fade-in-up-delay">
            <div class="max-w-7xl mx-auto">
                <!-- Loading State -->
                <div v-if="isPending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    <div v-for="i in 6" :key="i" class="card h-96 animate-pulse bg-slate-50 dark:bg-slate-900/50"></div>
                </div>

                <!-- Error State -->
                <div v-else-if="error"
                    class="card py-20 text-center max-w-2xl mx-auto border-dashed border-2 border-red-500/20">
                    <div class="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 flex-center mx-auto mb-6">
                        <i class="bx bx-error-circle text-4xl text-red-500"></i>
                    </div>
                    <p class="text-slate-900 dark:text-white font-bold text-xl mb-2">Đã xảy ra lỗi</p>
                    <p class="text-slate-500 dark:text-slate-400 mb-8 font-medium">Không thể tải danh sách đề thi. Vui
                        lòng thử lại sau.</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="!filteredExams.length"
                    class="card py-32 text-center max-w-2xl mx-auto border-dashed border-2 border-slate-200 dark:border-slate-800">
                    <div
                        class="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex-center mx-auto mb-6 transition-transform hover:scale-110">
                        <i class="bx bx-search-alt text-4xl text-slate-300"></i>
                    </div>
                    <p class="text-slate-500 dark:text-slate-400 font-bold text-lg mb-2">Không tìm thấy kết quả phù hợp
                    </p>
                    <p class="text-slate-400 text-sm font-medium">Hãy thử tìm kiếm với từ khóa khác.</p>
                </div>

                <!-- Main Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    <ExamCard v-for="(exam, index) in filteredExams" :key="exam.id" :exam="exam"
                        :style="{ animationDelay: `${index * 100}ms` }" class="animate-fade-in-up" />
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
:deep(.custom-select-v2 .el-input__wrapper) {
    @apply !rounded-[18px] !bg-white dark: !bg-slate-900 !shadow-sm !border-none !px-5 !py-2 transition-all duration-300;
}

:deep(.custom-select-v2 .el-input__wrapper.is-focus) {
    @apply !shadow-xl !shadow-blue-500/10;
}

:deep(.custom-select-v2 .el-input__inner) {
    @apply !text-slate-900 dark: !text-white !font-bold !text-sm;
}

/* Animations from UnoCSS or custom */
.animate-fade-in-down {
    animation: fadeInDown 0.6s ease-out forwards;
}

@keyframes fadeInDown {
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
