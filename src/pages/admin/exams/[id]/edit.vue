<script setup lang="ts">
const route = useRoute();
const examId = route.params.id as string;

const { data: exam, isLoading, refetch } = useExamDetailQuery(examId);
const { data: categories } = useCategoriesQuery();

const isSaving = ref(false);
const editData = ref({
    title: '',
    duration: 0,
    categoryId: ''
});

watch(exam, (newVal) => {
    if (newVal) {
        editData.value = {
            title: newVal.title,
            duration: newVal.duration,
            categoryId: newVal.categoryId || ''
        };
    }
}, { immediate: true });

const handleUpdateInfo = async () => {
    try {
        isSaving.value = true;
        await $fetch(`/api/exams/${examId}`, {
            method: 'PATCH',
            body: editData.value
        });
        //@ts-ignore
        ElMessage.success('Cập nhật thông tin thành công');
        refetch();
    } catch (e: any) {
        //@ts-ignore
        ElMessage.error('Có lỗi xảy ra khi cập nhật');
    } finally {
        isSaving.value = false;
    }
};

const handleDeleteQuestion = async (qId: string) => {
    //@ts-ignore
    try {
        await ElMessageBox.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?', 'Cảnh báo', {
            type: 'warning'
        });

        await $fetch(`/api/questions/${qId}`, { method: 'DELETE' });
        ElMessage.success('Đã xóa câu hỏi');
        refetch();
    } catch (e) {
        // Cancel or error
    }
};

const handleUpdateQuestion = async (qId: string, data: any) => {
    try {
        await $fetch(`/api/questions/${qId}`, {
            method: 'PATCH',
            body: data
        });
        //@ts-ignore
        ElMessage.success('Đã lưu thay đổi câu hỏi');
        refetch();
    } catch (e) {
        //@ts-ignore
        ElMessage.error('Không thể cập nhật câu hỏi');
    }
};

const activeTab = ref('info'); // 'info' | 'questions'
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-20">
        <div class="max-w-5xl mx-auto px-4">
            <!-- Header section -->
            <div class="flex items-center justify-between mb-10">
                <div class="flex items-center gap-6">
                    <NuxtLink to="/admin"
                        class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-sky-500 shadow-sm border border-slate-100 dark:border-slate-700 transition-all">
                        <i class="bx bx-left-arrow-alt text-2xl"></i>
                    </NuxtLink>
                    <div>
                        <h1 class="text-3xl font-black text-slate-900 dark:text-white">Chỉnh sửa đề thi</h1>
                        <p class="text-slate-500 font-medium">ID: {{ examId }}</p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button @click="activeTab = 'info'"
                        :class="activeTab === 'info' ? 'bg-sky-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                        class="px-6 py-3 rounded-2xl font-bold shadow-sm transition-all">
                        Thông tin chung
                    </button>
                    <button @click="activeTab = 'questions'"
                        :class="activeTab === 'questions' ? 'bg-sky-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                        class="px-6 py-3 rounded-2xl font-bold shadow-sm transition-all">
                        Câu hỏi ({{ exam?.questions?.length || 0 }})
                    </button>
                </div>
            </div>

            <div v-if="isLoading" class="flex justify-center p-20">
                <i class="bx bx-loader-alt animate-spin text-4xl text-sky-500"></i>
            </div>

            <div v-else class="space-y-8 animate-fade-in">
                <!-- Info Tab -->
                <div v-if="activeTab === 'info'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 space-y-6">
                        <div class="card p-8">
                            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Thông tin cơ bản</h3>
                            <div class="space-y-6">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tiêu
                                        đề đề thi</label>
                                    <input v-model="editData.title" type="text"
                                        class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-sky-500 transition-all font-bold text-slate-900 dark:text-white" />
                                </div>
                                <div class="grid grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label
                                            class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Thời
                                            gian (Phút)</label>
                                        <input v-model.number="editData.duration" type="number"
                                            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-sky-500 transition-all font-bold text-slate-900 dark:text-white" />
                                    </div>
                                    <div class="space-y-2">
                                        <label
                                            class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Danh
                                            mục</label>
                                        <select v-model="editData.categoryId"
                                            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-sky-500 transition-all font-bold text-slate-900 dark:text-white appearance-none">
                                            <option value="">Không có</option>
                                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name
                                            }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="pt-4">
                                    <button @click="handleUpdateInfo" :disabled="isSaving"
                                        class="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50">
                                        <i v-if="isSaving" class="bx bx-loader-alt animate-spin mr-2"></i>
                                        Lưu thay đổi thông tin
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-1">
                        <div class="card p-6 bg-sky-500 text-white">
                            <h4 class="font-bold mb-2">Thống kê đề thi</h4>
                            <div class="space-y-3 opacity-90">
                                <div class="flex justify-between">
                                    <span>Tổng số câu hỏi:</span>
                                    <span class="font-bold">{{ exam?.questions?.length || 0 }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Lượt làm bài:</span>
                                    <span class="font-bold">0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Điểm trung bình:</span>
                                    <span class="font-bold">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Questions Tab -->
                <div v-if="activeTab === 'questions'" class="space-y-6">
                    <div v-for="(q, index) in exam?.questions" :key="q.id" class="card overflow-hidden">
                        <div
                            class="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
                            <span class="font-black text-lg text-sky-500">CÂU HỎI {{ index + 1 }}</span>
                            <div class="flex gap-2">
                                <button @click="handleDeleteQuestion(q.id)"
                                    class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="p-8">
                            <AdminQuestionDetail :question="q" @update="(data) => handleUpdateQuestion(q.id, data)" />
                        </div>
                    </div>

                    <button
                        class="w-full py-6 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 hover:border-sky-300 hover:text-sky-500 transition-all font-bold flex flex-col items-center gap-2">
                        <i class="bx bx-plus-circle text-3xl"></i>
                        <span>Thêm câu hỏi mới</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    @apply bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700;
}
</style>
