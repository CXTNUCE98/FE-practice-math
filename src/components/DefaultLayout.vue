<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
const { theme } = useTheme();
</script>

<template>
    <!-- Header -->
    <Header />

    <!-- Nội dung chính -->
    <main class="min-h-screen">
        <slot />
    </main>

    <!-- Footer -->
    <Footer />
</template>