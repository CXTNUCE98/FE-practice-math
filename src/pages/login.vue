<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useLoginMutation } from '~/composables/useAuthMutation';

definePageMeta({
  layout: 'default',
});

const loginData = reactive({
  email: '',
  password: '',
  fullName: 'User', // Placeholder
});

const router = useRouter();
const { mutate: login, isPending, error } = useLoginMutation();

const showPassword = ref(false);

const handleLogin = () => {
  login(
    {
      email: loginData.email,
      password: loginData.password,
    },
    {
      onSuccess: () => {
        router.push('/');
      },
    }
  );
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
        <div class="text-center mb-10">
          <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6 group">
            <div
              class="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl transition-transform group-hover:rotate-6">
              M
            </div>
          </NuxtLink>
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-3 font-heading">
            Mừng bạn trở lại
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            Tiếp tục hành trình chinh phục Toán học
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-5">
            <div class="space-y-2">
              <label for="email-address"
                class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <input id="email-address" v-model="loginData.email" name="email" type="email" required class="input-field"
                placeholder="name@example.com" />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between ml-1">
                <label for="password" class="block text-sm font-bold text-slate-700 dark:text-slate-300">Mật
                  khẩu</label>
                <a href="#" class="text-xs font-bold text-blue-600 hover:text-blue-500">Quên mật khẩu?</a>
              </div>
              <div class="relative group/input">
                <input id="password" v-model="loginData.password" name="password"
                  :type="showPassword ? 'text' : 'password'" required class="input-field pr-12"
                  placeholder="••••••••" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors focus:outline-none">
                  <i :class="['bx text-xl', showPassword ? 'bx-show' : 'bx-hide']"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="error"
            class="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/50 flex items-start gap-3">
            <i class="bx bx-error-circle text-red-500 text-xl flex-shrink-0"></i>
            <p class="text-sm text-red-600 dark:text-red-400 font-medium">
              {{ (error as any)?.message || 'Đăng nhập không thành công. Kiểm tra lại email hoặc mật khẩu.' }}
            </p>
          </div>

          <button type="submit" :disabled="isPending"
            class="btn-primary !w-full !py-4 !text-base shadow-blue-600/20 group">
            <span v-if="!isPending">Đăng nhập</span>
            <span v-else class="flex items-center gap-2">
              <i class="bx bx-loader-alt animate-spin text-xl"></i>
              Đang xử lý...
            </span>
            <i v-if="!isPending"
              class="bx bx-right-arrow-alt text-xl transition-transform group-hover:translate-x-1"></i>
          </button>
        </form>

        <div class="mt-10 text-center">
          <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Chưa có tài khoản?
            <NuxtLink to="/register"
              class="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
              Đăng ký ngay
            </NuxtLink>
          </p>
        </div>
      </div>

      <p class="text-center mt-8 text-xs text-slate-400 font-medium">
        Bằng việc đăng nhập, bạn đồng ý với <a href="#" class="underline">Điều khoản</a> và <a href="#"
          class="underline">Chính sách</a> của chúng tôi.
      </p>
    </div>
  </div>
</template>
