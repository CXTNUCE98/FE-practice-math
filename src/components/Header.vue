<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { theme, toggleTheme } = useTheme()
const localePath = useLocalePath()
const { isAuthenticated, user, logout } = useAuth()
const isScrolled = ref(false)
const showMobileMenu = ref(false)

const handleLogout = () => {
    ElMessageBox.confirm(
        'Bạn có chắc chắn muốn đăng xuất?',
        'Xác nhận đăng xuất',
        {
            confirmButtonText: 'Đăng xuất',
            cancelButtonText: 'Hủy',
            type: 'warning',
            confirmButtonClass: 'btn-primary-important',
            cancelButtonClass: 'btn-secondary-important',
        }
    )
        .then(() => {
            logout()
            router.push('/')
        })
        .catch(() => {})
}

const handleScroll = () => {
    if (process.client) {
        isScrolled.value = window.scrollY > 0
    }
}

const menuItems = computed(() => [
    { name: 'Trang chủ', path: localePath('/') },
    { name: 'Lịch sử', path: localePath('/history'), auth: true },
    { name: 'Quản trị', path: localePath('/admin'), role: 'ADMIN' },
].filter(item => {
    if (item.auth && !isAuthenticated.value) return false
    if (item.role && (!user.value || user.value.role !== item.role)) return false
    return true
}))

const isActive = (path: string) => {
    const homePath = localePath('/')
    if (path === homePath) return route.path === homePath
    return route.path.startsWith(path)
}

onMounted(() => {
    if (process.client) {
        window.addEventListener('scroll', handleScroll)
        handleScroll()
    }
})

onBeforeUnmount(() => {
    if (process.client) {
        window.removeEventListener('scroll', handleScroll)
    }
})
</script>

<template>
    <header
        class="fixed top-0 left-0 right-0 z-[999] transition-all duration-300 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
        :class="isScrolled ? 'border-b border-slate-100 dark:border-slate-800' : 'border-b border-transparent'">
        <div class="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
            <!-- Logo -->
            <NuxtLink to="/" class="flex items-center gap-3 group">
                <div class="w-9 h-9 rounded bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-lg transition-transform group-hover:scale-110">
                    M
                </div>
                <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Math<span class="text-blue-600">Practice</span>
                </span>
            </NuxtLink>

            <!-- Nav -->
            <nav class="hidden md:flex items-center gap-1">
                <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path"
                    class="px-4 py-2 rounded-lg text-sm font-semibold transition-all" 
                    :class="[
                        isActive(item.path)
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    ]">
                    {{ item.name }}
                    <div v-show="isActive(item.path)" class="h-0.5 w-1/2 bg-blue-600 mt-0.5 rounded-full mx-auto"></div>
                </NuxtLink>
            </nav>

            <!-- Actions -->
            <div class="flex items-center gap-3">
                <!-- Theme -->
                <button @click="toggleTheme" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <i v-if="theme === 'dark'" class="bx bx-sun text-xl"></i>
                    <i v-else class="bx bx-moon text-xl"></i>
                </button>

                <!-- Auth -->
                <div v-if="!isAuthenticated" class="hidden sm:flex items-center gap-2">
                    <NuxtLink to="/login" class="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                        Đăng nhập
                    </NuxtLink>
                    <NuxtLink to="/register" class="btn-primary !text-[13px] !px-5 !py-2">
                        Tham gia ngay
                    </NuxtLink>
                </div>

                <!-- User -->
                <div v-else class="relative group">
                    <button class="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs ring-1 ring-slate-200 dark:ring-slate-700">
                            {{ user?.fullName?.charAt(0) || 'U' }}
                        </div>
                        <i class="bx bx-chevron-down text-slate-400 text-lg"></i>
                    </button>

                    <!-- Dropdown -->
                    <div class="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 transform translate-y-2 group-hover:translate-y-0">
                        <div class="px-4 py-3 border-b border-slate-50 dark:border-slate-800 mb-2">
                            <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tài khoản</p>
                            <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ user?.fullName || user?.email }}</p>
                            <p class="text-xs text-slate-400 truncate">{{ user?.email }}</p>
                        </div>
                        
                        <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
                            <i class="bx bx-cog text-lg opacity-50"></i>
                            Cài đặt cá nhân
                        </NuxtLink>
                        
                        <div class="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                            <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold transition-colors">
                                <i class="bx bx-log-out-circle text-lg opacity-80"></i>
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <button @click="showMobileMenu = !showMobileMenu" class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400">
                    <i v-if="!showMobileMenu" class="bx bx-menu-alt-right text-2xl"></i>
                    <i v-else class="bx bx-x text-2xl"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu Overlay -->
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showMobileMenu" class="md:hidden fixed inset-x-0 top-[64px] bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 p-6 z-[998]">
                <nav class="space-y-4">
                    <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" @click="showMobileMenu = false"
                        class="block text-lg font-bold transition-colors" :class="isActive(item.path) ? 'text-blue-600' : 'text-slate-900 dark:text-white'">
                        {{ item.name }}
                    </NuxtLink>
                </nav>
                
                <div v-if="!isAuthenticated" class="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4">
                    <NuxtLink to="/login" @click="showMobileMenu = false" class="block text-center py-3 text-sm font-bold border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white">
                        Đăng nhập
                    </NuxtLink>
                    <NuxtLink to="/register" @click="showMobileMenu = false" class="btn-primary !w-full !text-center !py-3">
                        Tham gia ngay
                    </NuxtLink>
                </div>
            </div>
        </Transition>
    </header>
</template>

<style>
.btn-primary-important {
    @apply bg-red-500! text-white! border-none!;
}
.btn-secondary-important {
    @apply bg-slate-100! text-slate-900! border-none!;
}
</style>
