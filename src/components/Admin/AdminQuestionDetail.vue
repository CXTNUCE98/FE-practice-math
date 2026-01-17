<script setup lang="ts">
import { renderMath } from '~/utils/renderMath';
import { MATH_SYMBOL_GROUPS } from '~/constants/mathSymbols';
import MathToolbar from '~/components/Admin/MathToolbar.vue';

const props = defineProps<{
    question: any
}>();

const emit = defineEmits(['update']);

const isEditing = ref(false);
const contentRef = ref<HTMLTextAreaElement | null>(null);
const explanationRef = ref<HTMLTextAreaElement | null>(null);
const optionRefs = ref<HTMLInputElement[]>([]);

const editForm = ref({
    content: '',
    options: [] as string[],
    correctAnswer: 0,
    explanation: ''
});

const focusedField = ref<'content' | 'explanation' | number | null>(null);

const setFocusedField = (field: 'content' | 'explanation' | number) => {
    focusedField.value = field;
};

const insertMath = (snippet: string) => {
    let el: HTMLTextAreaElement | HTMLInputElement | null = null;
    let targetField: 'content' | 'explanation' | 'option' = 'content';
    let optionIndex = -1;

    if (focusedField.value === 'content') {
        el = contentRef.value;
        targetField = 'content';
    } else if (focusedField.value === 'explanation') {
        el = explanationRef.value;
        targetField = 'explanation';
    } else if (typeof focusedField.value === 'number') {
        el = optionRefs.value[focusedField.value];
        targetField = 'option';
        optionIndex = focusedField.value;
    }

    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const text = el.value;

    // Check if we are already inside $...$
    const textBefore = text.substring(0, start);
    const textAfter = text.substring(end);

    const dollarCountBefore = (textBefore.match(/\$/g) || []).length;
    const isInsideMath = dollarCountBefore % 2 !== 0;

    let finalSnippet = snippet;
    if (!isInsideMath) {
        finalSnippet = `$${snippet}$`;
    }

    const newValue = textBefore + finalSnippet + textAfter;

    if (targetField === 'content') {
        editForm.value.content = newValue;
    } else if (targetField === 'explanation') {
        editForm.value.explanation = newValue;
    } else if (targetField === 'option' && optionIndex !== -1) {
        editForm.value.options[optionIndex] = newValue;
    }

    nextTick(() => {
        el?.focus();
        const bracketIndex = finalSnippet.indexOf('{}');
        let newPos;
        
        const insertedString = isInsideMath ? snippet : `$${snippet}$`;
        const firstBracketRelative = insertedString.indexOf('{}');
        
        if (firstBracketRelative !== -1) {
             newPos = start + firstBracketRelative + 1;
        } else {
             newPos = start + insertedString.length;
        }

        el?.setSelectionRange(newPos, newPos);
    });
};

watch(() => props.question, (newVal) => {
    if (newVal) {
        editForm.value = {
            content: newVal.content,
            options: [...newVal.options],
            correctAnswer: newVal.correctAnswer,
            explanation: newVal.explanation || ''
        };
    }
}, { immediate: true });

const save = () => {
    emit('update', editForm.value);
    isEditing.value = false;
    focusedField.value = null;
};

const cancel = () => {
    editForm.value = {
        content: props.question.content,
        options: [...props.question.options],
        correctAnswer: props.question.correctAnswer,
        explanation: props.question.explanation || ''
    };
    isEditing.value = false;
    focusedField.value = null;
};
</script>

<template>
    <div class="space-y-6">
        <!-- View Mode -->
        <div v-if="!isEditing" class="space-y-6">
            <div class="prose dark:prose-invert max-w-none">
                <div v-html="renderMath(question.content)" class="text-lg font-medium leading-relaxed"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(opt, idx) in question.options" :key="idx"
                    :class="idx === question.correctAnswer ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-100 dark:border-slate-700'"
                    class="p-4 rounded-2xl border-2 flex items-start gap-3 transition-all">
                    <div :class="idx === question.correctAnswer ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'"
                        class="w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                        {{ String.fromCharCode(65 + Number(idx)) }}
                    </div>
                    <div v-html="renderMath(opt)" class="pt-0.5 font-medium"></div>
                </div>
            </div>

            <div v-if="question.explanation"
                class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h5 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Lời giải chi tiết</h5>
                <div v-html="renderMath(question.explanation)" class="text-slate-700 dark:text-slate-300"></div>
            </div>

            <div class="flex justify-end pt-4">
                <button @click="isEditing = true"
                    class="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
                    <i class="bx bx-edit-alt"></i>
                    Sửa câu hỏi
                </button>
            </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="space-y-8 animate-fade-in">
            <!-- Question Content Edit -->
            <div class="space-y-4">
                <div class="flex items-center justify-between ml-1">
                    <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Nội dung câu hỏi</label>
                    <div class="text-[10px] text-slate-400 font-bold uppercase">Mẹo: Bao quanh công thức bằng dấu $</div>
                </div>

                <!-- Math Toolbar for Content -->
                <transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <MathToolbar 
                        v-if="focusedField === 'content'"
                        :groups="MATH_SYMBOL_GROUPS" 
                        @insert="insertMath" 
                        class="mb-2 z-10 relative"
                    />
                </transition>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <textarea ref="contentRef" 
                        v-model="editForm.content"
                        @focus="setFocusedField('content')"
                        placeholder="Nhập nội dung câu hỏi tại đây..."
                        class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-sky-500 transition-all font-medium h-64 resize-none shadow-sm"></textarea>

                    <!-- Real-time Preview -->
                    <div class="p-8 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl overflow-auto h-64 shadow-inner relative">
                        <div class="text-[10px] font-black text-slate-300 uppercase mb-4 flex items-center gap-2">
                            <i class="bx bx-show text-lg"></i>
                            Xem trước nội dung
                        </div>
                        <div v-html="renderMath(editForm.content)"
                            class="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 text-lg font-medium leading-relaxed">
                        </div>
                        <div v-if="!editForm.content" class="text-slate-300 italic text-sm">Nội dung xem trước sẽ hiển thị tại đây...</div>
                    </div>
                </div>
            </div>

            <!-- Answer Options Edit -->
            <div class="space-y-4">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Các lựa chọn đáp án</label>
                <div v-for="(opt, idx) in 4" :key="idx" class="space-y-3 relative">
                    
                    <!-- Toolbar for Option -->
                     <transition
                        enter-active-class="transition-all duration-300 ease-out"
                        enter-from-class="opacity-0 -translate-y-2"
                        enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition-all duration-200 ease-in"
                        leave-from-class="opacity-100 translate-y-0"
                        leave-to-class="opacity-0 -translate-y-2"
                    >
                        <div v-if="focusedField === idx" class="mb-2 z-20 relative">
                            <MathToolbar 
                                :groups="MATH_SYMBOL_GROUPS" 
                                @insert="insertMath" 
                            />
                        </div>
                    </transition>

                    <div class="flex gap-4 items-start">
                        <button type="button" @click="editForm.correctAnswer = idx"
                            :class="editForm.correctAnswer === idx ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'"
                            class="w-14 h-14 flex-shrink-0 rounded-2xl border-2 font-black text-lg transition-all mt-1">
                            {{ String.fromCharCode(65 + idx) }}
                        </button>
                        
                        <div class="flex-1 space-y-2">
                             <input 
                                :ref="el => optionRefs[idx] = el as HTMLInputElement"
                                v-model="editForm.options[idx]" 
                                @focus="setFocusedField(idx)"
                                type="text" 
                                placeholder="Nhập đáp án..."
                                class="w-full px-6 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-sky-500 transition-all font-medium shadow-sm" 
                            />
                             <!-- Option Preview -->
                             <div v-if="editForm.options[idx]"
                                class="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm flex items-center min-h-[40px]">
                                <span v-html="renderMath(editForm.options[idx])" class="font-medium text-sm"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Explanation Edit -->
            <div class="space-y-4">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lời giải chi tiết</label>

                <!-- Explanation Toolbar -->
                 <transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <MathToolbar 
                        v-if="focusedField === 'explanation'"
                        :groups="MATH_SYMBOL_GROUPS" 
                        @insert="insertMath" 
                        class="mb-2 z-10 relative"
                    />
                </transition>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <textarea ref="explanationRef" 
                        v-model="editForm.explanation"
                        @focus="setFocusedField('explanation')"
                        placeholder="Giải thích các bước giải..."
                        class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-sky-500 transition-all font-medium h-48 resize-none shadow-sm"></textarea>

                    <div class="p-8 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl overflow-auto h-48 shadow-inner relative">
                        <div class="text-[10px] font-black text-slate-300 uppercase mb-4 flex items-center gap-2">
                            <i class="bx bx-show text-lg"></i>
                            Xem trước lời giải
                        </div>
                        <div v-html="renderMath(editForm.explanation)"
                            class="text-slate-700 dark:text-slate-200 leading-relaxed font-medium"></div>
                        <div v-if="!editForm.explanation" class="text-slate-300 italic text-sm">Lời giải xem trước...</div>
                    </div>
                </div>
            </div>

            <div class="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" @click="cancel"
                    class="flex-1 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-all">
                    Thoát
                </button>
                <button type="button" @click="save"
                    class="flex-1 py-4 rounded-2xl font-bold text-white bg-sky-500 hover:bg-sky-600 shadow-xl shadow-sky-500/20 transition-all">
                    Lưu tất cả thay đổi
                </button>
            </div>
        </div>
    </div>
</template>
