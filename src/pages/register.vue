<script setup lang="ts">
import { useRegisterMutation } from '~/composables/useAuthMutation';

definePageMeta({
  layout: 'default',
});

const registerData = reactive({
  email: '',
  password: '',
  fullName: '',
  className: '',
});

const { mutate: register, isPending, error, isSuccess } = useRegisterMutation();

const handleRegister = () => {
  register(registerData, {
    onSuccess: () => {
      isSuccess.value = true;
    }
  });
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-white dark:bg-slate-950">
    <!-- Decorative Objects -->
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-float"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-float-slow">
    </div>

    <div class="max-w-md w-full relative z-10 animate-fade-in-up">
      <div class="glass-card p-10 md:p-12 shadow-2xl">
        <div v-if="isSuccess" class="text-center space-y-8 animate-bounce-in">
          <div
            class="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg shadow-emerald-500/20">
            <i class="bx bx-check-double"></i>
          </div>
          <div class="space-y-2">
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white font-heading">Đăng ký thành công!</h2>
            <p class="text-slate-500 dark:text-slate-400 font-medium">Tài khoản của bạn đã sẵn sàng để bắt đầu hành
              trình chinh phục Toán học.</p>
          </div>
          <NuxtLink to="/login" class="btn-primary !w-full !py-4 text-base shadow-blue-600/20">
            Đăng nhập ngay
            <i class="bx bx-right-arrow-alt text-xl"></i>
          </NuxtLink>
        </div>

        <div v-else>
          <div class="text-center mb-10">
            <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6 group">
              <div
                class="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl transition-transform group-hover:rotate-6">
                M
              </div>
            </NuxtLink>
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-3 font-heading">
              Tạo tài khoản mới
            </h2>
            <p class="text-slate-500 dark:text-slate-400 font-medium">
              Bắt đầu hành trình học tập thông minh ngay hôm nay
            </p>
          </div>

          <form class="space-y-5" @submit.prevent="handleRegister">
            <div class="grid grid-cols-1 gap-5">
              <div class="space-y-2">
                <label for="full-name" class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Họ và
                  tên</label>
                <input id="full-name" v-model="registerData.fullName" name="fullName" type="text" required
                  class="input-field" placeholder="Nguyễn Văn A" />
              </div>
              <div class="space-y-2">
                <label for="class-name" class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Lớp /
                  Trường</label>
                <input id="class-name" v-model="registerData.className" name="className" type="text" class="input-field"
                  placeholder="Lớp 12A1 (Tùy chọn)" />
              </div>
              <div class="space-y-2">
                <label for="email-address"
                  class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                <input id="email-address" v-model="registerData.email" name="email" type="email" required
                  class="input-field" placeholder="name@example.com" />
              </div>
              <div class="space-y-2">
                <label for="password" class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Mật
                  khẩu</label>
                <input id="password" v-model="registerData.password" name="password" type="password" required
                  class="input-field" placeholder="••••••••" />
              </div>
            </div>

            <div v-if="error"
              class="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/50 flex items-start gap-3">
              <i class="bx bx-error-circle text-red-500 text-xl flex-shrink-0"></i>
              <p class="text-sm text-red-600 dark:text-red-400 font-medium">
                {{ (error as any)?.message || 'Đăng ký không thành công. Vui lòng thử lại sau.' }}
              </p>
            </div>

            <button type="submit" :disabled="isPending"
              class="btn-primary !w-full !py-4 !text-base shadow-blue-600/20 group mt-4">
              <span v-if="!isPending">Đăng ký tài khoản</span>
              <span v-else class="flex items-center gap-2">
                <i class="bx bx-loader-alt animate-spin text-xl"></i>
                Đang xử lý...
              </span>
              <i v-if="!isPending"
                class="bx bx-right-arrow-alt text-xl transition-transform group-hover:translate-x-1"></i>
            </button>
          </form>

          <div class="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800/50">
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Đã có tài khoản?
              <NuxtLink to="/login"
                class="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                Đăng nhập
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
