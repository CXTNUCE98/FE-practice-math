<script setup lang="ts">
useHead({
  title: 'Luyện Thi Toán Học - Hệ thống ôn luyện trực tuyến',
  meta: [
    { name: 'description', content: 'Nâng cao kỹ năng giải toán với hệ thống đề thi đa dạng và chấm điểm tự động.' }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#0EA5E9" />
    <DefaultLayout>
      <NuxtPage />
    </DefaultLayout>
    <Notification />
  </NuxtLayout>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

:root {
  --color-primary: #0EA5E9;
  --color-primary-dark: #0284C7;
  --color-primary-light: #38BDF8;
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F8FAFC;
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-border: #E2E8F0;
}

.dark {
  --color-primary: #06B6D4;
  --color-bg-primary: #0F172A;
  --color-bg-secondary: #1E293B;
  --color-text-primary: #F8FAFC;
  --color-text-secondary: #CBD5E1;
  --color-border: #334155;
}

body {
  @apply bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  @apply bg-slate-100 dark:bg-slate-800;
}
::-webkit-scrollbar-thumb {
  @apply bg-sky-500/50 rounded-full border-2 border-transparent bg-clip-padding hover:bg-sky-500;
}

/* Utilities */
.btn-primary {
  @apply bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95 disabled:opacity-50;
}

.card {
  @apply bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6;
}

.section-title {
  @apply text-3xl font-black tracking-tighter text-slate-900 dark:text-white mb-6;
}
</style>