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
        class="fixed top-0 left-0 right-0 z-[999] transition-all duration-500"
        :class="isScrolled ? 'py-3' : 'py-5'">
        <div class="max-w-7xl mx-auto px-4">
            <div class="glass-card flex items-center justify-between px-6 py-3 transition-all duration-500"
                :class="isScrolled ? 'rounded-2xl shadow-xl' : 'rounded-3xl border-transparent bg-white/0 dark:bg-slate-950/0 shadow-none'">
                
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center gap-3 group">
                    <div class="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-lg shadow-slate-900/10 dark:shadow-white/10">
                        M
                    </div>
                    <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                        Math<span class="text-blue-600">Practice</span>
                    </span>
                </NuxtLink>

                <!-- Nav -->
                <nav class="hidden md:flex items-center gap-1">
                    <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path"
                        class="px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 relative group/nav" 
                        :class="[
                            isActive(item.path)
                                ? 'text-slate-900 dark:text-white bg-slate-100/50 dark:bg-slate-800/50'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/30'
                        ]">
                        {{ item.name }}
                        <div v-if="isActive(item.path)" class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600 transition-all duration-300"></div>
                    </NuxtLink>
                </nav>

                <!-- Actions -->
                <div class="flex items-center gap-3">
                    <!-- Theme -->
                    <button @click="toggleTheme" 
                        class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:text-slate-900 dark:hover:text-white">
                        <i v-if="theme === 'dark'" class="bx bx-sun text-xl"></i>
                        <i v-else class="bx bx-moon text-xl"></i>
                    </button>

                    <!-- Auth -->
                    <div v-if="!isAuthenticated" class="hidden sm:flex items-center gap-2">
                        <NuxtLink to="/login" class="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Đăng nhập
                        </NuxtLink>
                        <NuxtLink to="/register" class="btn-primary !text-[13px] !px-6 !py-2.5">
                            Tham gia ngay
                        </NuxtLink>
                    </div>

                    <!-- User -->
                    <div v-else class="relative group">
                        <button class="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                            <div class="w-8 h-8 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-xs ring-4 ring-slate-100 dark:ring-slate-800/50">
                                {{ user?.fullName?.charAt(0) || 'U' }}
                            </div>
                            <i class="bx bx-chevron-down text-slate-400 text-lg transition-transform group-hover:rotate-180"></i>
                        </button>

                        <!-- Dropdown -->
                        <div class="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                            <div class="px-5 py-4 border-b border-slate-50 dark:border-slate-800 mb-2">
                                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mb-1.5 opacity-60">Tài khoản</p>
                                <p class="text-sm font-bold text-slate-900 dark:text-white truncate mb-0.5">{{ user?.fullName || user?.email }}</p>
                                <p class="text-xs text-slate-400 truncate">{{ user?.email }}</p>
                            </div>
                            
                            <NuxtLink to="/profile" class="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors">
                                <i class="bx bx-user-circle text-xl opacity-50 group-hover:opacity-100"></i>
                                Hồ sơ của tôi
                            </NuxtLink>
                            
                            <NuxtLink v-if="user?.role === 'ADMIN'" to="/admin" class="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors">
                                <i class="bx bx-shield-quarter text-xl opacity-50 group-hover:opacity-100"></i>
                                Bảng quản trị
                            </NuxtLink>
                            
                            <div class="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                                <button @click="handleLogout" class="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-colors">
                                    <i class="bx bx-log-out-circle text-xl opacity-80"></i>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile Menu -->
                    <button @click="showMobileMenu = !showMobileMenu" class="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <i v-if="!showMobileMenu" class="bx bx-menu-alt-right text-2xl"></i>
                        <i v-else class="bx bx-x text-2xl"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Overlay -->
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-10 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 -translate-y-10 scale-95">
            <div v-if="showMobileMenu" class="md:hidden fixed inset-x-4 top-[84px] p-6 z-[998] glass-card shadow-2xl">
                <nav class="space-y-2">
                    <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" @click="showMobileMenu = false"
                        class="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-bold transition-all" 
                        :class="isActive(item.path) ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'">
                        {{ item.name }}
                    </NuxtLink>
                </nav>
                
                <div v-if="!isAuthenticated" class="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <NuxtLink to="/login" @click="showMobileMenu = false" class="block text-center py-3.5 text-sm font-bold rounded-xl text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800">
                        Đăng nhập
                    </NuxtLink>
                    <NuxtLink to="/register" @click="showMobileMenu = false" class="btn-primary !w-full !text-center !py-3.5">
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
