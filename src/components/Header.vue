<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { theme, toggleTheme } = useTheme()
const localePath = useLocalePath()
const { isAuthenticated, user, logout } = useAuth()
const isScrolled = ref(false)
const showMobileMenu = ref(false)

const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        logout()
        router.push('/')
    }
}

// Xử lý sự kiện cuộn trang
const handleScroll = () => {
    if (process.client) {
        isScrolled.value = window.scrollY > 10
    }
}

// Menu chính
const menuItems = computed(() => [
    { name: 'Trang chủ', path: localePath('/') },
    { name: 'Lịch sử thi', path: localePath('/exam/history'), auth: true },
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
        class="fixed top-0 left-0 right-0 z-[999] border-b transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        :class="isScrolled ? 'shadow-lg h-16 md:h-20' : 'h-16 md:h-20'">
        <div class="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            <!-- Logo -->
            <NuxtLink to="/" class="flex items-center gap-2">
                <div class="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-sky-500/20">
                    M
                </div>
                <span class="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
                    Math<span class="text-sky-500">Practice</span>
                </span>
            </NuxtLink>

            <!-- Navigation -->
            <nav class="hidden lg:flex items-center gap-6">
                <NuxtLink 
                    v-for="item in menuItems" 
                    :key="item.path" 
                    :to="item.path"
                    class="text-sm font-bold transition-all px-4 py-2 rounded-xl"
                    :class="[
                        isActive(item.path)
                            ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    ]"
                >
                    {{ item.name }}
                </NuxtLink>
            </nav>

            <!-- User Actions -->
            <div class="flex items-center gap-4">
                <!-- Theme Toggle -->
                <button @click="toggleTheme" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all">
                    <i v-if="theme === 'dark'" class="bx bx-sun text-2xl"></i>
                    <i v-else class="bx bx-moon text-2xl"></i>
                </button>

                <div v-if="!isAuthenticated" class="hidden md:flex gap-2">
                    <NuxtLink to="/login" class="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        Đăng nhập
                    </NuxtLink>
                    <NuxtLink to="/register" class="btn-primary !px-6 !py-2.5 !text-sm">
                        Đăng ký
                    </NuxtLink>
                </div>

                <!-- User Dropdown -->
                <div v-else class="relative group">
                    <button class="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <div class="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs uppercase">
                            {{ user?.fullName?.charAt(0) || 'U' }}
                        </div>
                        <span class="hidden md:block text-sm font-bold text-slate-700 dark:text-slate-300 pr-2">
                            {{ user?.fullName }}
                        </span>
                    </button>
                    
                    <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                        <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-2">
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Tài khoản</p>
                            <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ user?.email }}</p>
                        </div>
                        <button 
                            @click="handleLogout"
                            class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold flex items-center gap-2"
                        >
                            <i class="bx bx-log-out text-lg"></i>
                            Đăng xuất
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu Button -->
                <button @click="showMobileMenu = !showMobileMenu" class="lg:hidden p-2 text-slate-500 text-3xl">
                    <i v-if="!showMobileMenu" class="bx bx-menu-alt-right"></i>
                    <i v-else class="bx bx-x"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu Overlay -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-[-20px]"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-[-20px]"
        >
            <div v-if="showMobileMenu" class="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl p-4 space-y-2">
                <NuxtLink 
                    v-for="item in menuItems" 
                    :key="item.path" 
                    :to="item.path"
                    @click="showMobileMenu = false"
                    class="block px-4 py-3 rounded-xl font-bold transition-all"
                    :class="[
                        isActive(item.path)
                            ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                            : 'text-slate-600 dark:text-slate-400'
                    ]"
                >
                    {{ item.name }}
                </NuxtLink>
                <div v-if="!isAuthenticated" class="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    <NuxtLink to="/login" class="flex-1 text-center py-3 font-bold text-slate-600 bg-slate-50 dark:bg-slate-800 rounded-xl">Đăng nhập</NuxtLink>
                    <NuxtLink to="/register" class="flex-1 text-center py-3 font-bold text-white bg-sky-500 rounded-xl">Đăng ký</NuxtLink>
                </div>
            </div>
        </Transition>
    </header>
</template>
