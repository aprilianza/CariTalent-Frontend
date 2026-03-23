import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{vue,js,ts}', './components/**/*.{vue,js,ts}', './layouts/**/*.{vue,js,ts}', './pages/**/*.{vue,js,ts}', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3e8ff',
          100: '#e9d5ff',
          200: '#d8b4fe',
          300: '#c084fc',
          400: '#a855f7',
          500: '#8A2BE2',
          600: '#7e22ce',
          700: '#6b21a8',
          800: '#581c87',
          900: '#3f0f5c',
        },
        secondary: {
          50: '#e0f7ff',
          100: '#b3edff',
          200: '#80e1ff',
          300: '#4dd9ff',
          400: '#1ac8ff',
          500: '#00BFFF',
          600: '#00a8d8',
          700: '#0088aa',
          800: '#006b8a',
          900: '#004d61',
        },
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
