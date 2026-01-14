<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
import { useUpdateProfileMutation, useChangePasswordMutation } from '~/composables/useAuthMutation';

definePageMeta({
    middleware: 'auth',
});

const { user, fetchUser } = useAuth();
const { mutate: updateProfile, isPending: isUpdating, error: updateError, isSuccess: isUpdateSuccess } = useUpdateProfileMutation();
const { mutate: changePassword, isPending: isChangingPassword, error: passwordError, isSuccess: isPasswordSuccess } = useChangePasswordMutation();

const activeTab = ref('info'); // 'info' | 'password'

const profileData = reactive({
    fullName: user.value?.fullName || '',
    className: user.value?.className || '',
    role: user.value?.role || 'USER',
});

const passwordData = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});

// Watch user to update active profile data when user is loaded
watchEffect(() => {
    if (user.value) {
        profileData.fullName = user.value.fullName || '';
        profileData.className = user.value.className || '';
        profileData.role = user.value.role || 'USER';
    }
});

const handleUpdateProfile = () => {
    updateProfile({
        fullName: profileData.fullName,
        className: profileData.className,
        role: profileData.role,
    }, {
        onSuccess: () => {
            fetchUser(); // Reload user data
        }
    });
};

const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('Mật khẩu xác nhận không khớp'); // Simple alert for now, can improve
        return;
    }
    changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
    }, {
        onSuccess: () => {
            // Reset form
            passwordData.oldPassword = '';
            passwordData.newPassword = '';
            passwordData.confirmPassword = '';
        }
    });
};
</script>

<template>
    <div class="max-w-4xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Cài đặt tài khoản</h1>

        <div
            class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <!-- Tabs -->
            <div class="flex border-b border-slate-200 dark:border-slate-700">
                <button @click="activeTab = 'info'"
                    :class="['px-6 py-4 font-medium text-sm transition-colors', activeTab === 'info' ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200']">
                    Thông tin cá nhân
                </button>
                <button @click="activeTab = 'password'"
                    :class="['px-6 py-4 font-medium text-sm transition-colors', activeTab === 'password' ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200']">
                    Đổi mật khẩu
                </button>
            </div>

            <div class="p-6">
                <!-- Info Tab -->
                <div v-if="activeTab === 'info'" class="space-y-6 max-w-lg">
                    <div v-if="isUpdateSuccess"
                        class="p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                        Cập nhật thông tin thành công!
                    </div>
                    <div v-if="updateError"
                        class="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                        {{ (updateError as any)?.message || 'Có lỗi xảy ra' }}
                    </div>

                    <form @submit.prevent="handleUpdateProfile" class="space-y-4">
                        <div>
                            <label
                                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                            <input :value="user?.email" disabled type="email"
                                class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 cursor-not-allowed" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Họ và
                                tên</label>
                            <input v-model="profileData.fullName" type="text"
                                class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                                required />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lớp</label>
                            <input v-model="profileData.className" type="text"
                                class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                                placeholder="Lớp của bạn" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vai
                                trò</label>
                            <select v-model="profileData.role"
                                class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none">
                                <option value="USER">Học sinh (User)</option>
                                <option value="ADMIN">Quản trị viên (Admin)</option>
                            </select>
                            <p class="text-xs text-slate-500 mt-1">Lưu ý: Chỉ dùng cho mục đích kiểm thử</p>
                        </div>

                        <div class="pt-4">
                            <button type="submit" :disabled="isUpdating"
                                class="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center">
                                <span v-if="isUpdating" class="bx bx-loader-alt animate-spin mr-2"></span>
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Password Tab -->
                <div v-if="activeTab === 'password'" class="space-y-6 max-w-lg">
                    <div v-if="isPasswordSuccess"
                        class="p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                        Đổi mật khẩu thành công!
                    </div>
                    <div v-if="passwordError"
                        class="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                        {{ (passwordError as any)?.message || 'Có lỗi xảy ra' }}
                    </div>

                    <form @submit.prevent="handleChangePassword" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mật khẩu
                                hiện tại</label>
                            <input v-model="passwordData.oldPassword" type="password"
                                class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                                required />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mật khẩu
                                mới</label>
                            <input v-model="passwordData.newPassword" type="password"
                                class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                                required minlength="6" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Xác nhận
                                mật khẩu mới</label>
                            <input v-model="passwordData.confirmPassword" type="password"
                                class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                                required />
                        </div>

                        <div class="pt-4">
                            <button type="submit" :disabled="isChangingPassword"
                                class="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center">
                                <span v-if="isChangingPassword" class="bx bx-loader-alt animate-spin mr-2"></span>
                                Đổi mật khẩu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
