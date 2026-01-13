<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
const { theme } = useTheme();
</script>

<template>
    <!-- Header -->
    <Header />
    
    <!-- Nội dung chính -->
    <main class="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 min-h-screen">
        <slot />
    </main>    
</template>