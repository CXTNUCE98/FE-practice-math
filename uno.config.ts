import type { UserConfig } from "unocss";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export const unoConfig: UserConfig = {
  theme: {
    colors: {
      primary: {
        DEFAULT: "var(--el-color-primary)",
        light: {
          3: "var(--el-color-primary-light-3)",
          5: "var(--el-color-primary-light-5)",
          7: "var(--el-color-primary-light-7)",
          8: "var(--el-color-primary-light-8)",
          9: "var(--el-color-primary-light-9)",
        },
        dark: {
          2: "var(--el-color-primary-dark-2)",
        },
      },

      success: {
        DEFAULT: "var(--el-color-success)",
        light: {
          3: "var(--el-color-success-light-3)",
          5: "var(--el-color-success-light-5)",
          7: "var(--el-color-success-light-7)",
          8: "var(--el-color-success-light-8)",
          9: "var(--el-color-success-light-9)",
        },
        dark: {
          2: "var(--el-color-success-dark-2)",
        },
      },

      warning: {
        DEFAULT: "var(--el-color-warning)",
        light: {
          3: "var(--el-color-warning-light-3)",
          5: "var(--el-color-warning-light-5)",
          7: "var(--el-color-warning-light-7)",
          8: "var(--el-color-warning-light-8)",
          9: "var(--el-color-warning-light-9)",
        },
        dark: {
          2: "var(--el-color-warning-dark-2)",
        },
      },

      danger: {
        DEFAULT: "var(--el-color-danger)",

        light: {
          3: "var(--el-color-danger-light-3)",
          5: "var(--el-color-danger-light-5)",
          7: "var(--el-color-danger-light-7)",
          8: "var(--el-color-danger-light-8)",
          9: "var(--el-color-danger-light-9)",
        },
        dark: {
          2: "var(--el-color-danger-dark-2)",
        },
      },

      error: {
        DEFAULT: "var(--el-color-error)",
        light: {
          3: "var(--el-color-error-light-3)",
          5: "var(--el-color-error-light-5)",
          7: "var(--el-color-error-light-7)",
          8: "var(--el-color-error-light-8)",
          9: "var(--el-color-error-light-9)",
        },
        dark: {
          2: "var(--el-color-error-dark-2)",
        },
      },

      info: {
        DEFAULT: "var(--el-color-info)",
        light: {
          3: "var(--el-color-info-light-3)",
          5: "var(--el-color-info-light-5)",
          7: "var(--el-color-info-light-7)",
          8: "var(--el-color-info-light-8)",
          9: "var(--el-color-info-light-9)",
        },
        dark: {
          2: "var(--el-color-info-dark-2)",
        },
      },

      bg: {
        DEFAULT: "var(--el-bg-color)",
        page: "var(--el-bg-color-page)",
        overlay: "var(--el-bg-color-overlay)",
      },

      text: {
        primary: "var(--el-text-color-primary)",
        regular: "var(--el-text-color-regular)",
        secondary: "var(--el-text-color-secondary)",
        placeholder: "var(--el-text-color-placeholder)",
        disabled: "var(--el-text-color-disabled)",
      },

      border: {
        DEFAULT: "var(--el-border-color)",
        light: "var(--el-border-color-light)",
        lighter: "var(--el-border-color-lighter)",
        extraLight: "var(--el-border-color-extra-light)",
        dark: "var(--el-border-color-dark)",
        darker: "var(--el-border-color-darker)",
        hover: "var(--el-border-color-hover)",
      },

      fill: {
        DEFAULT: "var(--el-fill-color)",
        light: "var(--el-fill-color-light)",
        lighter: "var(--el-fill-color-lighter)",
        extraLight: "var(--el-fill-color-extra-light)",
        dark: "var(--el-fill-color-dark)",
        darker: "var(--el-fill-color-darker)",
        blank: "var(--el-fill-color-blank)",
      },

      disabled: {
        bg: "var(--el-disabled-bg-color)",
        text: "var(--el-disabled-text-color)",
        border: "var(--el-disabled-border-color)",
      },

      overlay: {
        DEFAULT: "var(--el-overlay-color)",
        light: "var(--el-overlay-color-light)",
        lighter: "var(--el-overlay-color-lighter)",
      },

      mask: {
        DEFAULT: "var(--el-mask-color)",
        extraLight: "var(--el-mask-color-extra-light)",
      },
      svgMonochromeGrey: "var(--el-svg-monochrome-grey)",
    },
    boxShadow: {
      danger: "0 0 0 1px var(--el-color-danger) inset",
    },
  },
  shortcuts: [
    ["text-helper", "text-13px leading-20px mb-4px font-medium text-slate-500"],
    ["flex-center", "flex items-center justify-center"],
    [
      "el-form-label",
      "[&_.el-form-item\\_\\_label]:(mb-6px! font-semibold! text-slate-700 dark:text-slate-300)",
    ],
    [
      "btn-primary",
      "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
    ],
    [
      "btn-secondary",
      "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 active:scale-[0.98]",
    ],
    [
      "btn-outline",
      "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 active:scale-[0.98]",
    ],
    [
      "card",
      "bg-white dark:bg-slate-900 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.06)] p-6 border border-slate-100 dark:border-slate-800",
    ],
    [
      "card-interactive",
      "bg-white dark:bg-slate-900 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.06)] p-6 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer",
    ],
    [
      "gradient-border",
      "relative before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-slate-200 before:dark:bg-slate-700 before:-z-10",
    ],
    [
      "section-title",
      "text-2xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight",
    ],
    [
      "input-field",
      "w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent outline-none transition-all placeholder:text-slate-400",
    ],
    [
      "glass-card",
      "backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm rounded-xl",
    ],
  ],
  presets: [
    presetTypography(),
    presetAttributify(),
    presetIcons({
      warn: true,
      collections: {
        ep: () =>
          import("@iconify-json/ep/icons.json").then((i) => i.default as any),
        carbon: () =>
          import("@iconify-json/carbon/icons.json").then(
            (i) => i.default as any
          ),
      },
    }),
    presetUno(),
    // presetWebFonts({
    //   provider: 'google',
    //   fonts: {
    //     sans: {
    //       name: 'Inter',
    //       weights: ['200', '300', '400', '500', '600', '700', '800', '900'],
    //       italic: true,
    //     },
    //     jakarta: {
    //       name: 'Plus Jakarta Sans',
    //       weights: ['200', '300', '400', '500', '600', '700', '800', '900'],
    //       italic: true,
    //     },
    //     serif: {
    //       name: 'DM Serif Display',
    //       weights: ['400'],
    //       italic: true,
    //     },
    //     jost: {
    //       name: 'Jost',
    //       weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    //       italic: true,
    //     },
    //     playfair: {
    //       name: 'Playfair Display',
    //       weights: ['400', '500', '600', '700', '800', '900'],
    //       italic: true,
    //     },
    //     roboto: {
    //       name: 'Roboto',
    //       weights: ['100', '300', '400', '500', '700', '900'],
    //       italic: true,
    //     },
    //     opensans: {
    //       name: 'Open Sans',
    //       weights: ['300', '400', '500', '600', '700', '800'],
    //       italic: true,
    //     },
    //   },
    // }),
  ],
  safelist: [],
  rules: [
    ["box-shadow", { "box-shadow": "var(--el-box-shadow)" }],
    ["box-shadow-light", { "box-shadow": "var(--el-box-shadow-light)" }],
    ["box-shadow-lighter", { "box-shadow": "var(--el-box-shadow-lighter)" }],
    ["box-shadow-dark", { "box-shadow": "var(--el-box-shadow-dark)" }],
    ["break-word", { "word-break": "break-word" }],
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  preflights: [
    {
      getCSS: () => `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes heroPattern {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }
        .animate-float-slower { animation: float 7s ease-in-out infinite; }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out 0.2s both; }
        .animate-fade-in-up-delay { animation: fadeInUp 0.6s ease-out 0.4s both; }
        .animate-bounce-in { animation: bounceIn 0.6s ease-out; }
        .animate-hero-pattern { animation: heroPattern 20s linear infinite; }
      `,
    },
  ],
};

export default defineConfig(unoConfig);
