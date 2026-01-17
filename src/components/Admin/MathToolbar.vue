<script setup lang="ts">
import { renderMath } from '~/utils/renderMath';

interface SymbolItem {
    label: string;
    icon: string;
    snippet: string;
}

interface SymbolGroup {
    name: string;
    symbols: SymbolItem[];
}

const props = defineProps<{
    groups: SymbolGroup[];
}>();

const emit = defineEmits<{
    (e: 'insert', snippet: string): void
}>();

const activeTab = ref(props.groups[0]?.name);

const handleInsert = (snippet: string) => {
    emit('insert', snippet);
};
</script>

<template>
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <!-- Tabs -->
        <div class="flex overflow-x-auto border-b border-slate-100 dark:border-slate-800 scrollbar-hide">
            <button v-for="group in groups" :key="group.name"
                @click="activeTab = group.name"
                @mousedown.prevent 
                class="px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all"
                :class="activeTab === group.name 
                    ? 'text-sky-500 bg-sky-50 dark:bg-sky-900/10 border-b-2 border-sky-500' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'">
                {{ group.name }}
            </button>
        </div>

        <!-- Symbols Grid -->
        <div class="p-3 bg-slate-50/50 dark:bg-slate-900/50 min-h-[140px]">
            <template v-for="group in groups" :key="group.name">
                <div v-show="activeTab === group.name" class="animate-fade-in">
                    <div class="flex flex-wrap gap-2">
                        <button v-for="sym in group.symbols" :key="sym.label" 
                            type="button"
                            @click="handleInsert(sym.snippet)"
                            @mousedown.prevent 
                            class="group relative flex items-center justify-center min-w-[3rem] h-10 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-md transition-all"
                            :title="sym.label">
                            <span v-if="!sym.icon.includes('\\')" class="font-serif italic text-sm">{{ sym.icon }}</span>
                            <span v-else v-html="renderMath('$' + sym.icon + '$')" class="text-sm"></span>
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
