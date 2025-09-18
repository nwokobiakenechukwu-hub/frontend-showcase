import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF3B7E',
        secondary: '#47C5FB',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config;
