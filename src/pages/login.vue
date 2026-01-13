<script setup lang="ts">
import { usePracticeLoginMutation } from '~/composables/usePracticeAuthMutation';

definePageMeta({
  layout: 'default',
});

const loginData = reactive({
  email: '',
  password: '',
});

const { mutate: login, isPending, error } = usePracticeLoginMutation();

const handleLogin = () => {
  login(loginData);
};
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900">
    <div class="max-w-md w-full space-y-8 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white">
          Đăng nhập
        </h2>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Luyện tập toán học mỗi ngày
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              id="email-address"
              v-model="loginData.email"
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
              v-model="loginData.password"
              name="password"
              type="password"
              required
              class="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
          {{ (error as any)?.message || 'Đăng nhập thất bại. Vui lòng thử lại.' }}
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
            {{ isPending ? 'Đang xử lý...' : 'Đăng nhập' }}
          </button>
        </div>
      </form>

      <div class="text-center">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Chưa có tài khoản?
          <NuxtLink to="/register" class="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400">
            Đăng ký ngay
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
