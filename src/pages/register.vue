<script setup lang="ts">
import { usePracticeRegisterMutation } from '~/composables/usePracticeAuthMutation';

definePageMeta({
  layout: 'default',
});

const registerData = reactive({
  email: '',
  password: '',
  fullName: '',
});

const { mutate: register, isPending, error, isSuccess } = usePracticeRegisterMutation();

const handleRegister = () => {
  register(registerData);
};
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900">
    <div class="max-w-md w-full space-y-8 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
      <div v-if="isSuccess" class="text-center space-y-4">
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto text-3xl">
          <i class="bx bx-check"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Đăng ký thành công!</h2>
        <p class="text-slate-600 dark:text-slate-400">Bạn có thể đăng nhập ngay bây giờ.</p>
        <NuxtLink to="/login" class="inline-block btn-primary w-full text-center">
          Đăng nhập
        </NuxtLink>
      </div>

      <div v-else>
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white">
            Đăng ký tài khoản
          </h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Tham gia cộng đồng học toán
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <div class="space-y-4">
            <div>
              <label for="full-name" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Họ và tên</label>
              <input
                id="full-name"
                v-model="registerData.fullName"
                name="fullName"
                type="text"
                required
                class="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label for="email-address" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                id="email-address"
                v-model="registerData.email"
                name="email"
                type="email"
                required
                class="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu</label>
              <input
                id="password"
                v-model="registerData.password"
                name="password"
                type="password"
                required
                class="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
            {{ (error as any)?.message || 'Đăng ký thất bại. Vui lòng thử lại.' }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="isPending"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-50"
            >
              <span v-if="isPending" class="animate-spin mr-2">
                <i class="bx bx-loader-alt"></i>
              </span>
              {{ isPending ? 'Đang đăng ký...' : 'Đăng ký' }}
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Đã có tài khoản?
            <NuxtLink to="/login" class="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400">
              Đăng nhập
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
