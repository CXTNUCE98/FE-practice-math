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
    <div class="max-w-6xl mx-auto px-4 py-12">
        <div class="mb-12">
            <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading mb-2">Cài đặt
                tài khoản</h1>
            <p class="text-slate-500 dark:text-slate-400 font-medium">Quản lý thông tin cá nhân và bảo mật tài khoản của
                bạn.</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-10">
            <!-- Sidebar Navigation -->
            <aside class="w-full lg:w-72 flex-shrink-0">
                <div class="card !p-2 space-y-1">
                    <button @click="activeTab = 'info'"
                        :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm', activeTab === 'info' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white']">
                        <i class="bx bx-user-circle text-xl"></i>
                        Thông tin cá nhân
                    </button>
                    <button @click="activeTab = 'password'"
                        :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm', activeTab === 'password' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white']">
                        <i class="bx bx-lock-alt text-xl"></i>
                        Đổi mật khẩu
                    </button>
                    <div class="my-2 border-t border-slate-100 dark:border-slate-800/60 mx-2"></div>
                    <NuxtLink to="/history"
                        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white">
                        <i class="bx bx-history text-xl"></i>
                        Lịch sử thi
                    </NuxtLink>
                </div>
            </aside>

            <!-- Main Content Area -->
            <div class="flex-1">
                <!-- Info Tab -->
                <div v-if="activeTab === 'info'" class="space-y-8 animate-fade-in-up">
                    <div class="card">
                        <div
                            class="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800/60">
                            <div
                                class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-600/20 font-heading">
                                {{ user?.fullName?.charAt(0).toUpperCase() || 'U' }}
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-slate-900 dark:text-white font-heading">{{
                                    user?.fullName }}</h3>
                                <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">{{ user?.email }}</p>
                                <span
                                    class="inline-flex mt-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-blue-100 dark:border-blue-500/20">
                                    {{ user?.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên' }}
                                </span>
                            </div>
                        </div>

                        <div v-if="isUpdateSuccess"
                            class="mb-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 animate-fade-in">
                            <i class="bx bx-check-circle text-xl"></i>
                            <p class="text-sm font-bold">Cập nhật hồ sơ thành công!</p>
                        </div>

                        <form @submit.prevent="handleUpdateProfile" class="space-y-6 max-w-2xl">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email
                                        (Không thể đổi)</label>
                                    <input :value="user?.email" disabled type="email"
                                        class="input-field opacity-60 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed" />
                                </div>
                                <div class="space-y-2">
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Họ và
                                        tên</label>
                                    <input v-model="profileData.fullName" type="text" class="input-field"
                                        placeholder="Nguyễn Văn A" required />
                                </div>
                                <div class="space-y-2">
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Lớp /
                                        Trường</label>
                                    <input v-model="profileData.className" type="text" class="input-field"
                                        placeholder="VD: Lớp 12A1" />
                                </div>
                                <div class="space-y-2">
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Vai
                                        trò thử nghiệm</label>
                                    <select v-model="profileData.role"
                                        class="input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat">
                                        <option value="USER">Thành viên</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                    </select>
                                </div>
                            </div>

                            <div v-if="updateError"
                                class="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                                {{ (updateError as any)?.message || 'Có lỗi xảy ra khi cập nhật.' }}
                            </div>

                            <div class="pt-4 flex justify-end">
                                <button type="submit" :disabled="isUpdating"
                                    class="btn-primary flex items-center gap-2 group shadow-blue-600/20">
                                    <i v-if="isUpdating" class="bx bx-loader-alt animate-spin text-lg"></i>
                                    <span>Lưu thay đổi</span>
                                    <i v-if="!isUpdating"
                                        class="bx bx-check text-xl transition-transform group-hover:scale-125"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Password Tab -->
                <div v-if="activeTab === 'password'" class="space-y-8 animate-fade-in-up">
                    <div class="card">
                        <div class="mb-10 pb-6 border-b border-slate-100 dark:border-slate-800/60">
                            <h3 class="text-xl font-bold text-slate-900 dark:text-white font-heading">Thay đổi mật khẩu
                            </h3>
                            <p class="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Đảm bảo mật khẩu của
                                bạn có ít nhất 6 ký tự để bảo mật tốt nhất.</p>
                        </div>

                        <div v-if="isPasswordSuccess"
                            class="mb-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 animate-fade-in">
                            <i class="bx bx-check-circle text-xl"></i>
                            <p class="text-sm font-bold">Đổi mật khẩu thành công!</p>
                        </div>

                        <form @submit.prevent="handleChangePassword" class="space-y-6 max-w-xl">
                            <div class="space-y-4">
                                <div class="space-y-2">
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Mật
                                        khẩu hiện tại</label>
                                    <input v-model="passwordData.oldPassword" type="password" class="input-field"
                                        placeholder="••••••••" required />
                                </div>
                                <div class="space-y-2">
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Mật
                                        khẩu mới</label>
                                    <input v-model="passwordData.newPassword" type="password" class="input-field"
                                        placeholder="Tối thiểu 6 ký tự" required minlength="6" />
                                </div>
                                <div class="space-y-2">
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Xác
                                        nhận mật khẩu mới</label>
                                    <input v-model="passwordData.confirmPassword" type="password" class="input-field"
                                        placeholder="Nhập lại mật khẩu mới" required />
                                </div>
                            </div>

                            <div v-if="passwordError"
                                class="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                                {{ (passwordError as any)?.message || 'Mật khẩu hiện tại không chính xác.' }}
                            </div>

                            <div class="pt-4 flex justify-end">
                                <button type="submit" :disabled="isChangingPassword"
                                    class="btn-primary flex items-center gap-2 group shadow-blue-600/20">
                                    <i v-if="isChangingPassword" class="bx bx-loader-alt animate-spin text-lg"></i>
                                    <span>Cập nhật mật khẩu</span>
                                    <i v-if="!isChangingPassword"
                                        class="bx bx-key text-xl transition-transform group-hover:rotate-12"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
