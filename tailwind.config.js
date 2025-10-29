// Tailwind CSS v4 configuration
import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tighter': '-0.04em',
        'tight': '-0.02em',
        'normal': '0em',
        'wide': '0.02em',
        'wider': '0.04em',
        'widest': '0.08em',
      },
      lineHeight: {
        'extra-tight': '1.1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '1.75',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'fadeIn': 'fadeIn 1s ease-in',
        'slideUp': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '25%': {
            'background-size': '400% 400%',
            'background-position': 'left top'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right top'
          },
          '75%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translatey(0px)' },
          '50%': { transform: 'translatey(-20px)' }
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slideUp': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      colors: {
        'mint': {
          50: '#e6f7ef',
          100: '#ccefdf',
          200: '#99dfbf',
          300: '#66cf9f',
          400: '#33bf7f',
          500: '#00954C',
          600: '#007a3e',
          700: '#00602f',
          800: '#004521',
          900: '#002b14',
        },
        'green': {
          50: '#e6f7ef',
          100: '#ccefdf',
          200: '#99dfbf',
          300: '#66cf9f',
          400: '#33bf7f',
          500: '#00954C',
          600: '#007a3e',
          700: '#00602f',
          800: '#004521',
          900: '#002b14',
        },
        'yellow': {
          50: '#fef9e6',
          100: '#fef3cc',
          200: '#fde799',
          300: '#fddb66',
          400: '#fccf33',
          500: '#fcb900',
          600: '#ca9400',
          700: '#976f00',
          800: '#654a00',
          900: '#322500',
        },
        'gold': {
          50: '#fef9e6',
          100: '#fef3cc',
          200: '#fde799',
          300: '#fddb66',
          400: '#fccf33',
          500: '#fcb900',
          600: '#ca9400',
          700: '#976f00',
          800: '#654a00',
          900: '#322500',
        },
        // Dynamic theme colors (use CSS variables)
        'theme': {
          'primary': 'var(--theme-primary)',
          'primary-light': 'var(--theme-primary-light)',
          'primary-dark': 'var(--theme-primary-dark)',
          'secondary': 'var(--theme-secondary)',
          'accent': 'var(--theme-accent)',
          'text': 'var(--theme-text)',
          'text-dark': 'var(--theme-text-dark)',
        }
      }
    },
  },
  plugins: [],
} satisfies Config;