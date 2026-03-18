import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{vue,js,ts}', './components/**/*.{vue,js,ts}', './layouts/**/*.{vue,js,ts}', './pages/**/*.{vue,js,ts}', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}'],
  theme: {
    extend: {
      colors: {
        highlight: '#8A2BE2',
        accent: '#00BFFF',
        'ui-dark': '#1E1B4B',
        'ui-light': '#F9FAFB',
        'neutral-dark': '#111827',
        'neutral-medium': '#6B7280',
        'neutral-light': '#E5E7EB',
      },
    },
  },
} satisfies Config;
