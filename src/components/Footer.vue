<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

const tourLinks = computed(() => [
    { title: t('footer.tourCategories.north'), url: localePath('/tour/city/mien-bac') },
    { title: t('footer.tourCategories.central'), url: localePath('/tour/city/mien-trung') },
    { title: t('footer.tourCategories.south'), url: localePath('/tour/city/mien-nam') },
    { title: t('footer.tourCategories.domestic'), url: localePath('/tour') },
    { title: t('footer.tourCategories.asia'), url: localePath('/tour') }
]);

const galleryImages = [
    '/carousel/1.jpg',
    '/carousel/2.jpg',
    '/carousel/3.jpg',
    '/carousel/4.jpg',
    '/carousel/5.jpg',
    '/carousel/6.jpg'
];
</script>

<template>
    <footer class="py-20 border-t border-slate-100 dark:border-slate-900 px-4 bg-slate-50/30 dark:bg-slate-950">
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <!-- Branding -->
                <div class="col-span-1 md:col-span-1">
                    <NuxtLink to="/" class="flex items-center gap-3 group mb-6">
                        <div class="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-lg transition-transform group-hover:scale-110">
                            M
                        </div>
                        <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                            Math<span class="text-blue-600">Practice</span>
                        </span>
                    </NuxtLink>
                    <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                        Nền tảng luyện thi Toán học thông minh giúp bạn chinh phục mọi kỳ thi với kho đề thi đa dạng và hệ thống chấm điểm tự động.
                    </p>
                    <div class="flex items-center gap-4 mt-8">
                        <a href="#" class="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
                            <i class="bx bxl-facebook text-xl"></i>
                        </a>
                        <a href="#" class="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-400 transition-all">
                            <i class="bx bxl-twitter text-xl"></i>
                        </a>
                        <a href="#" class="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-600 hover:border-pink-600 transition-all">
                            <i class="bx bxl-instagram text-xl"></i>
                        </a>
                    </div>
                </div>

                <!-- Product -->
                <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6 opacity-40">Sản phẩm</h3>
                    <ul class="space-y-4">
                        <li><NuxtLink to="/" class="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">Đề thi mới nhất</NuxtLink></li>
                        <li><NuxtLink to="/" class="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">Thi thử THPT QG</NuxtLink></li>
                        <li><NuxtLink to="/" class="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">Toán lớp 10-12</NuxtLink></li>
                        <li><NuxtLink to="/" class="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">Ôn thi học sinh giỏi</NuxtLink></li>
                    </ul>
                </div>

                <!-- Support -->
                <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6 opacity-40">Hỗ trợ</h3>
                    <ul class="space-y-4">
                        <li><a href="#" class="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">Hướng dẫn sử dụng</a></li>
                        <li><a href="#" class="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">Điều khoản dịch vụ</a></li>
                        <li><a href="#" class="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">Chính sách bảo mật</a></li>
                        <li><a href="#" class="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">Liên hệ báo lỗi</a></li>
                    </ul>
                </div>

                <!-- Contact -->
                <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6 opacity-40">Liên hệ</h3>
                    <div class="space-y-4">
                        <div class="flex items-start gap-3">
                            <i class="bx bx-envelope text-blue-600 text-xl"></i>
                            <span class="text-sm font-semibold text-slate-500">support@mathpractice.vn</span>
                        </div>
                        <div class="flex items-start gap-3">
                            <i class="bx bx-phone text-blue-600 text-xl"></i>
                            <span class="text-sm font-semibold text-slate-500">1900 8198</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-slate-100 dark:border-slate-800/50">
                <div class="text-sm font-semibold text-slate-400">
                    © 2026 MathPractice. Đăng ký bản quyền.
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-400">
                    Trạng thái hệ thống: <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> <span class="text-emerald-500 font-bold">Hoạt động tốt</span>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.container {
    max-width: 1400px;
}
</style>