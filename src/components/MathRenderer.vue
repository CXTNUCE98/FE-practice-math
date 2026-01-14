<script setup lang="ts">
import { computed } from 'vue';
import katex from 'katex';

interface Props {
  content: string;
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  block: false,
});

const renderedHtml = computed(() => {
  if (!props.content) return '';

  let text = props.content;

  // Clean HTML wrappers
  text = text.replace(/<\/?(html|head|body|meta|title)[^>]*>/gi, '').trim();

  // Tiền xử lý LaTeX: Tìm và render các khối $...$ hoặc $$...$$
  try {
    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g);
    return parts.map((part) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        let latex = part.slice(2, -2);
        // Giải mã entities để KaTeX hiểu được các ký tự như <, >
        latex = latex.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&');
        return katex.renderToString(latex, { displayMode: true, throwOnError: false });
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        let latex = part.slice(1, -1);
        // Giải mã entities để KaTeX hiểu được các ký tự như <, >
        latex = latex.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&');
        return katex.renderToString(latex, { displayMode: false, throwOnError: false });
      }
      return part;
    }).join('');
  } catch (e) {
    console.error('KaTeX render error:', e);
    return text;
  }
});
</script>

<template>
  <div class="math-renderer-v2 overflow-x-auto overflow-y-hidden max-w-full prose dark:prose-invert no-scrollbar" :class="[
    block ? 'block my-4 w-full' : 'inline-block align-middle',
    'text-slate-900 dark:text-white transition-colors duration-200'
  ]" v-html="renderedHtml" />
</template>

<style>
/* Đảm bảo nội dung hiển thị rõ rệt và kế thừa style từ cha */
.math-renderer-v2.prose {
  --un-prose-body: inherit;
  font-size: inherit;
  line-height: inherit;
  max-width: none;
}

/* Ẩn scrollbar nhưng vẫn cho phép scroll nếu cần */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.math-renderer-v2 .katex-display {
  @apply m-0 py-2 overflow-x-auto overflow-y-hidden text-center;
}

.math-renderer-v2 img {
  @apply inline-block max-w-full h-auto align-middle;
  margin: 0.1em 2px;
  min-width: 12px;
}

.math-renderer-v2 table {
  @apply border-collapse border border-slate-300 my-4 w-full text-sm;
}

.math-renderer-v2 th,
.math-renderer-v2 td {
  @apply border border-slate-300 p-2 text-center;
}

/* Fix cho các đoạn văn con nếu có */
.math-renderer-v2 p {
  @apply m-0 inline;
}

.math-renderer-v2.block p {
  @apply block mb-2 last:mb-0;
}
</style>
