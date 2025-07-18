import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f0',
          100: '#ffecdc',
          200: '#ffd6b5',
          300: '#ffb787',
          400: '#ff8c42',
          500: '#ff6500',
          600: '#e55100',
          700: '#bf360c',
          800: '#8d2f00',
          900: '#5d1f00',
          DEFAULT: '#ff6500',
          foreground: '#ffffff',
        },
        focus: '#ff6500'

      }
    },
  },
  darkMode: "light",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            50: '#fff8f0',
            100: '#ffecdc',
            200: '#ffd6b5',
            300: '#ffb787',
            400: '#ff8c42',
            500: '#ff6500',
            600: '#e55100',
            700: '#bf360c',
            800: '#8d2f00',
            900: '#5d1f00',
            DEFAULT: '#ff6500',
            foreground: '#ffffff',
          },
          focus: '#ff6500',
        }
      },
      dark: {
        colors: {
          primary: {
            50: '#5d1f00',
            100: '#8d2f00',
            200: '#bf360c',
            300: '#e55100',
            400: '#ff6500',
            500: '#ff8c42',
            600: '#ffb787',
            700: '#ffd6b5',
            800: '#ffecdc',
            900: '#fff8f0',
            DEFAULT: '#ff8c42',
            foreground: '#000000'
          }
        }
      }
    }
  })],
}
