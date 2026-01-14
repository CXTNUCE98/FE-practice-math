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
body {
  @apply bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans antialiased selection:bg-blue-600 selection:text-white;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-slate-50 dark:bg-slate-900;
}

::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-800 rounded-full border-2 border-transparent bg-clip-padding hover:bg-slate-300 dark:hover:bg-slate-700;
}

/* Transition Page */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>