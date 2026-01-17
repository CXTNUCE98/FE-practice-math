import katex from "katex";

/**
 * Render LaTeX math and HTML content safely
 */
export function renderMath(content: string): string {
  if (!content) return "";

  // Simple LaTeX detection and rendering
  // Looks for $...$ or $$...$$
  let rendered = content;

  // Render block math $$...$$
  rendered = rendered.replace(/\$\$(.*?)\$\$/gs, (_, math) => {
    try {
      return katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
      });
    } catch (e) {
      return math;
    }
  });

  // Render inline math $...$
  rendered = rendered.replace(/\$(.*?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
      });
    } catch (e) {
      return math;
    }
  });

  return rendered;
}
