<script setup lang="ts">
import katex from 'katex';

interface Props {
  /** Nội dung văn bản có chứa mã LaTeX */
  content: string;
  /** Hiển thị dạng khối (block) hay nội dòng (inline) */
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  block: false,
});

/**
 * Hàm phân tích văn bản và render LaTeX
 */
const renderMath = (text: string) => {
  // Regex để tìm các đoạn mã LaTeX nằm giữa $...$ hoặc $$...$$
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g);

  return parts.map((part) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const math = part.slice(2, -2);
      try {
        return katex.renderToString(math, { displayMode: true, throwOnError: false });
      } catch (e) {
        return part;
      }
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      const math = part.slice(1, -1);
      try {
        return katex.renderToString(math, { displayMode: false, throwOnError: false });
      } catch (e) {
        return part;
      }
    }
    return part;
  }).join('');
};

const renderedContent = computed(() => renderMath(props.content));
</script>

<template>
  <div
    class="math-renderer"
    :class="{ 'my-4 block': block, 'inline': !block }"
    v-html="renderedContent"
  />
</template>

<style>
.math-renderer .katex-display {
  @apply m-0 overflow-x-auto overflow-y-hidden;
}
</style>
