<script setup lang="ts">
import { useUsersQuery } from '~/composables/useAdmin';
import { useUploadExamMutation } from '~/composables/useExamMutation';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
    middleware: ['auth'], // Need stricter admin check ideally
});

const { user } = useAuth();
const router = useRouter();

// Basic admin check
if (user.value?.role !== 'ADMIN') {
    router.push('/');
}

// Tabs
const activeTab = ref<'users' | 'upload'>('users');

// Users Data
const { data: users, isPending: isLoadingUsers } = useUsersQuery();

// Upload Logic
const fileInput = ref<HTMLInputElement | null>(null);
const uploadForm = reactive({
    title: '',
    duration: '90',
});
const { mutate: uploadExam, isPending: isUploading } = useUploadExamMutation();

const handleUpload = () => {
    const file = fileInput.value?.files?.[0];
    if (!file) {
        alert('Vui lòng chọn file đề thi (.docx)');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', uploadForm.title);
    formData.append('duration', uploadForm.duration);

    uploadExam(formData, {
        onSuccess: () => {
            alert('Upload đề thi thành công!');
            // Reset form
            uploadForm.title = '';
            uploadForm.duration = '90';
            if (fileInput.value) fileInput.value.value = '';
        },
        onError: (err: any) => {
            alert(err?.data?.message || 'Upload thất bại');
        }
    });
};
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <i class="bx bxs-dashboard text-sky-500"></i> Admin Dashboard
                    </h1>
                    <p class="text-slate-500 dark:text-slate-400 mt-1">Quản lý người dùng và đề thi</p>
                </div>

                <!-- Tab Navigation -->
                <div
                    class="flex p-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <button @click="activeTab = 'users'" class="px-6 py-2 rounded-lg text-sm font-medium transition-all"
                        :class="activeTab === 'users' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'">
                        <i class="bx bx-user mr-1"></i> Người dùng
                    </button>
                    <button @click="activeTab = 'upload'"
                        class="px-6 py-2 rounded-lg text-sm font-medium transition-all"
                        :class="activeTab === 'upload' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'">
                        <i class="bx bx-cloud-upload mr-1"></i> Upload Đề thi
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div
                class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 min-h-[400px]">

                <!-- Users Tab -->
                <div v-if="activeTab === 'users'">
                    <div v-if="isLoadingUsers" class="space-y-4">
                        <div v-for="i in 5" :key="i"
                            class="h-16 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr
                                    class="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                                    <th class="py-3 font-semibold">User</th>
                                    <th class="py-3 font-semibold">Email</th>
                                    <th class="py-3 font-semibold text-center">Vai trò</th>
                                    <th class="py-3 font-semibold text-center">Số bài thi</th>
                                    <th class="py-3 font-semibold text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                <tr v-for="u in users" :key="u.id"
                                    class="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td class="py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                        <div
                                            class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                                            {{ u.fullName.charAt(0) }}
                                        </div>
                                        {{ u.fullName }}
                                    </td>
                                    <td class="py-4 text-slate-600 dark:text-slate-300">{{ u.email }}</td>
                                    <td class="py-4 text-center">
                                        <span class="px-2 py-1 rounded text-xs font-bold"
                                            :class="u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'">
                                            {{ u.role }}
                                        </span>
                                    </td>
                                    <td
                                        class="py-4 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                                        {{ u.examCount }}
                                    </td>
                                    <td class="py-4 text-right">
                                        <NuxtLink :to="`/admin/users/${u.id}`"
                                            class="text-sky-500 hover:text-sky-600 font-medium text-sm">
                                            Xem lịch sử
                                        </NuxtLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Upload Tab -->
                <div v-else-if="activeTab === 'upload'">
                    <div class="max-w-xl mx-auto py-8">
                        <div class="text-center mb-8">
                            <div
                                class="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                                <i class="bx bxs-file-doc"></i>
                            </div>
                            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Tải lên đề thi mới</h2>
                            <p class="text-slate-500 dark:text-slate-400 text-sm">Hỗ trợ định dạng Microsoft Word
                                (.docx). Đề thi sẽ được tự động phân tích.</p>
                        </div>

                        <form @submit.prevent="handleUpload" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tiêu đề
                                    đề thi</label>
                                <input v-model="uploadForm.title" type="text" required class="w-full input-field"
                                    placeholder="Ví dụ: Đề thi thử Toán 12 - Lần 1" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thời
                                    gian làm bài (phút)</label>
                                <input v-model="uploadForm.duration" type="number" required
                                    class="w-full input-field" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">File đề
                                    thi (.docx)</label>
                                <input ref="fileInput" type="file" accept=".docx" required
                                    class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                            </div>

                            <button type="submit" :disabled="isUploading"
                                class="w-full btn-primary py-3 flex justify-center">
                                <span v-if="isUploading" class="animate-spin mr-2"><i
                                        class="bx bx-loader-alt"></i></span>
                                {{ isUploading ? 'Đang xử lý...' : 'Tải lên & Phân tích' }}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.input-field {
    @apply px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all;
}

.btn-primary {
    @apply bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-500/30;
}
</style>
