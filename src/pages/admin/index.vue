<script setup lang="ts">
import { useUploadExamMutation, useDeleteExamMutation } from '~/composables/useExamMutation';
import { useExamsQuery } from '~/composables/useExamQuery';

definePageMeta({
  layout: 'default',
});

const { data: exams, refetch: refetchExams } = useExamsQuery();
const { mutate: uploadExam, isPending, error, isSuccess } = useUploadExamMutation();
const { mutate: deleteExam, isPending: isDeleting } = useDeleteExamMutation();

const handleDeleteExam = (id: string, title: string) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa đề thi: "${title}" không?`,
    'Xác nhận xóa',
    {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'warning',
    }
  )
    .then(() => {
      deleteExam(id, {
        onSuccess: () => {
          ElMessage.success('Xóa đề thi thành công!');
          refetchExams();
        },
        onError: (err: any) => {
          ElMessage.error(err?.data?.message || 'Xóa đề thi thất bại');
        }
      });
    })
    .catch(() => {
      // User canceled deletion
    });
};

const examData = reactive({
  title: '',
  duration: 60,
  file: null as File | null,
});

const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    examData.file = file;
  }
};

const handleUpload = () => {
  if (!examData.file || !examData.title) return;

  const formData = new FormData();
  formData.append('file', examData.file);
  formData.append('title', examData.title);
  formData.append('duration', examData.duration.toString());

  uploadExam(formData, {
    onSuccess: () => {
      examData.title = '';
      examData.file = null;
      refetchExams();
    },
  });
};

const activeTab = ref('upload'); // 'upload' | 'exams' | 'results'
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 ">
    <!-- Header -->
    <!-- <div class="bg-slate-900 text-white py-12 px-4 shadow-xl mb-12">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black tracking-tighter uppercase italic">
            Quản trị <span class="text-sky-400">Đề thi</span>
          </h1>
          <p class="text-slate-400 mt-1">Hệ thống quản lý luyện tập và chấm điểm</p>
        </div>
        <NuxtLink to="/" class="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-bold transition-all border border-slate-700">
          Về trang chủ
        </NuxtLink>
      </div>
    </div> -->

    <div class="max-w-7xl mx-auto px-4 pt-40">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Tabs -->
        <div class="lg:col-span-1 space-y-2">
          <button @click="activeTab = 'upload'"
            class="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all"
            :class="activeTab === 'upload' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'">
            <i class="bx bx-upload text-xl"></i>
            Tải lên đề thi
          </button>
          <button @click="activeTab = 'exams'"
            class="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all"
            :class="activeTab === 'exams' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'">
            <i class="bx bx-file text-xl"></i>
            Quản lý đề thi
          </button>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Upload Tab -->
          <div v-if="activeTab === 'upload'" class="card p-8 animate-fade-in-top">
            <h2 class="text-2xl font-bold mb-8 text-slate-900 dark:text-white flex items-center gap-3">
              <span
                class="w-10 h-10 bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center">
                <i class="bx bx-plus"></i>
              </span>
              Tạo đề thi mới
            </h2>

            <form @submit.prevent="handleUpload" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-bold text-slate-500 uppercase tracking-widest">Tiêu đề đề thi</label>
                  <input v-model="examData.title" type="text" placeholder="Ví dụ: Đề thi HK1 Toán lớp 12"
                    class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
                    required />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-bold text-slate-500 uppercase tracking-widest">Thời gian làm bài
                    (Phút)</label>
                  <input v-model.number="examData.duration" type="number"
                    class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
                    required />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-500 uppercase tracking-widest">File Đề thi
                  (.docx)</label>
                <div
                  class="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
                  :class="{ 'bg-sky-50/50 dark:bg-sky-900/10 border-sky-400': examData.file }">
                  <input type="file" accept=".docx" class="absolute inset-0 opacity-0 cursor-pointer"
                    @change="handleFileChange" />
                  <div v-if="!examData.file" class="space-y-4">
                    <div
                      class="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto text-3xl text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-500 transition-all">
                      <i class="bx bx-cloud-upload"></i>
                    </div>
                    <div>
                      <p class="text-lg font-bold text-slate-900 dark:text-white">Nhấp để tải lên hoặc kéo thả</p>
                      <p class="text-sm text-slate-500">Chỉ chấp nhận định dạng .docx</p>
                    </div>
                  </div>
                  <div v-else class="space-y-4">
                    <div
                      class="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                      <i class="bx bx-file"></i>
                    </div>
                    <div>
                      <p class="text-lg font-bold text-sky-600 dark:text-sky-400">{{ examData.file.name }}</p>
                      <button @click.stop="examData.file = null"
                        class="text-sm text-red-500 font-bold hover:underline">Xóa và chọn lại</button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="error"
                class="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl border border-red-100 dark:border-red-800 text-sm">
                {{ (error as any)?.message || 'Tải lên không thành công. Vui lòng kiểm tra định dạng file.' }}
              </div>

              <div v-if="isSuccess"
                class="bg-green-50 dark:bg-green-900/20 text-green-600 p-4 rounded-xl border border-green-100 dark:border-green-800 text-sm font-bold">
                Tải lên và phân tích đề thi thành công!
              </div>

              <button type="submit" :disabled="isPending || !examData.file" class="btn-primary w-full py-5 text-lg">
                <i v-if="isPending" class="bx bx-loader-alt animate-spin mr-2"></i>
                {{ isPending ? 'Đang phân tích và tải lên...' : 'Tải lên đề thi' }}
              </button>
            </form>
          </div>

          <!-- Exams Tab -->
          <div v-if="activeTab === 'exams'" class="card p-8 animate-fade-in-top">
            <h2 class="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Danh sách đề thi hiện tại</h2>

            <div class="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
              <table class="w-full text-left">
                <thead class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Tên đề thi</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Thời gian</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày tạo</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Thao tác</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="exam in exams" :key="exam.id"
                    class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                    <td class="px-6 py-4">
                      <p class="font-bold text-slate-900 dark:text-white">{{ exam.title }}</p>
                    </td>
                    <td class="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {{ exam.duration }} phút
                    </td>
                    <td class="px-6 py-4 text-slate-500 text-sm">
                      {{ new Date(exam.createdAt).toLocaleDateString('vi-VN') }}
                    </td>
                    <td class="px-6 py-4">
                      <button @click="handleDeleteExam(exam.id, exam.title)"
                        class="p-2 text-slate-400 hover:text-red-500 transition-all" :disabled="isDeleting">
                        <i v-if="isDeleting" class="bx bx-loader-alt animate-spin text-xl"></i>
                        <i v-else class="bx bx-trash text-xl"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="!exams || exams.length === 0" class="p-12 text-center text-slate-400">
                Chưa có đề thi nào trong hệ thống.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-top {
  animation: fadeInTop 0.5s ease-out forwards;
}

@keyframes fadeInTop {
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
