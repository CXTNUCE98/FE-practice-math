<script setup lang="ts">
import { useCategoriesQuery, useCategoryMutation } from '~/composables/useCategory';

const { data: categories, refetch } = useCategoriesQuery();
const { createCategory, updateCategory, deleteCategory } = useCategoryMutation();

const isModalOpen = ref(false);
const editingCategory = ref<any>(null);

const formData = reactive({
    name: '',
    slug: '',
    description: '',
});

const resetForm = () => {
    formData.name = '';
    formData.slug = '';
    formData.description = '';
    editingCategory.value = null;
};

const openCreateModal = () => {
    resetForm();
    isModalOpen.value = true;
};

const openEditModal = (category: any) => {
    formData.name = category.name;
    formData.slug = category.slug;
    formData.description = category.description || '';
    editingCategory.value = category;
    isModalOpen.value = true;
};

// Auto-generate slug from name
const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .normalize('NFD') // decompose characters
        .replace(/[\u0300-\u036f]/g, '') // remove diacritics
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .trim()
        .replace(/\s+/g, '-');
};

watch(() => formData.name, (newName) => {
    if (!editingCategory.value) {
        formData.slug = generateSlug(newName);
    }
});

const handleSubmit = () => {
    if (editingCategory.value) {
        updateCategory.mutate({
            id: editingCategory.value.id,
            data: { ...formData },
        }, {
            onSuccess: () => {
                isModalOpen.value = false;
                refetch();
                ElMessage.success('Cập nhật danh mục thành công');
            },
            onError: () => ElMessage.error('Cập nhật thất bại'),
        });
    } else {
        createCategory.mutate(formData, {
            onSuccess: () => {
                isModalOpen.value = false;
                refetch();
                ElMessage.success('Tạo danh mục thành công');
            },
            onError: () => ElMessage.error('Tạo danh mục thất bại'),
        });
    }
};

const handleDelete = (category: any) => {
    ElMessageBox.confirm(
        `Bạn có chắc muốn xóa danh mục "${category.name}"?`,
        'Cảnh báo',
        {
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            type: 'warning',
        }
    ).then(() => {
        deleteCategory.mutate(category.id, {
            onSuccess: () => {
                refetch();
                ElMessage.success('Xóa thành công');
            },
            onError: () => ElMessage.error('Xóa thất bại'),
        });
    });
};
</script>

<template>
    <div class="card p-8 animate-fade-in-top">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span
                    class="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                    <i class="bx bx-category"></i>
                </span>
                Quản lý Danh mục
            </h2>

            <button @click="openCreateModal"
                class="px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <i class="bx bx-plus text-xl"></i> Thêm danh mục
            </button>
        </div>

        <!-- Content Card -->
        <div
            class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th
                                class="px-6 py-4 font-extrabold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider">
                                Tên danh mục</th>
                            <th
                                class="px-6 py-4 font-extrabold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider">
                                Đường dẫn (Slug)</th>
                            <th
                                class="px-6 py-4 font-extrabold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider text-center">
                                Số lượng đề</th>
                            <th
                                class="px-6 py-4 font-extrabold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider text-right">
                                Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr v-for="cat in categories" :key="cat.id"
                            class="group hover:bg-sky-50/30 dark:hover:bg-slate-700/30 transition-colors duration-200">
                            <td class="px-6 py-4 align-middle">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <i class="bx bx-folder text-lg"></i>
                                    </div>
                                    <div>
                                        <p class="font-bold text-slate-900 dark:text-white">{{ cat.name }}
                                        </p>
                                        <p class="text-xs text-slate-400 font-medium truncate max-w-xs">{{
                                            cat.description }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 align-middle">
                                <span
                                    class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-mono text-xs border border-slate-200 dark:border-slate-700">
                                    /{{ cat.slug }}
                                </span>
                            </td>
                            <td class="px-6 py-4 align-middle text-center">
                                <span class="font-bold text-slate-700 dark:text-slate-300">{{ cat._count?.exams || 0
                                    }}</span>
                            </td>
                            <td class="px-6 py-4 align-middle text-right">
                                <div
                                    class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button @click="openEditModal(cat)"
                                        class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-all"
                                        title="Chỉnh sửa">
                                        <i class="bx bx-edit text-lg"></i>
                                    </button>
                                    <button @click="handleDelete(cat)"
                                        class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                                        title="Xóa">
                                        <i class="bx bx-trash text-lg"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!categories?.length">
                            <td colspan="4" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center justify-center">
                                    <div
                                        class="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                        <i class="bx bx-folder-open text-3xl text-slate-300 dark:text-slate-600"></i>
                                    </div>
                                    <p class="text-lg font-bold text-slate-400 mb-1">Chưa có danh mục nào</p>
                                    <button @click="openCreateModal"
                                        class="px-4 py-1.5 rounded-lg font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 transition-colors text-sm">
                                        + Tạo ngay
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal -->
        <el-dialog v-model="isModalOpen" :title="editingCategory ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới'"
            width="550px" align-center append-to-body
            class="category-dialog !rounded-12px overflow-hidden dark:bg-#0F172A" :show-close="true"
            :destroy-on-close="true">

            <div class="px-2">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tên danh
                            mục</label>
                        <input v-model="formData.name" type="text"
                            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-all font-bold text-slate-900 dark:text-white placeholder-slate-400"
                            required placeholder="VD: Toán 12" />
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Slug
                            (URL)</label>
                        <div class="relative">
                            <input v-model="formData.slug" type="text"
                                class="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-all font-mono font-medium text-slate-700 dark:text-slate-300"
                                required placeholder="toan-12" />
                            <div class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">/</div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mô tả</label>
                        <textarea v-model="formData.description"
                            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-all font-medium text-slate-900 dark:text-white resize-none h-32"
                            placeholder="Mô tả nội dung của danh mục này..."></textarea>
                    </div>

                    <div class="flex gap-4 pt-4">
                        <button type="button" @click="isModalOpen = false"
                            class="flex-1 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                            Hủy bỏ
                        </button>
                        <button type="submit"
                            class="flex-1 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/30 transition-all">
                            {{ editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục' }}
                        </button>
                    </div>
                </form>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.animate-fade-in-top {
    animation: fadeInTop 0.5s ease-out forwards;
}

.animate-fade-in-scale {
    animation: fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
