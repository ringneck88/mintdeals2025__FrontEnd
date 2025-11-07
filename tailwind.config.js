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
          50: '#e6f4ec',
          100: '#cce9da',
          200: '#99d3b5',
          300: '#66bd90',
          400: '#33a76b',
          500: '#00954c',
          600: '#00773d',
          700: '#00592e',
          800: '#003c1f',
          900: '#001e0f',
        },
        'green': {
          50: '#e6f4ec',
          100: '#cce9da',
          200: '#99d3b5',
          300: '#66bd90',
          400: '#33a76b',
          500: '#00954c',
          600: '#00773d',
          700: '#00592e',
          800: '#003c1f',
          900: '#001e0f',
        },
        'yellow': {
          50: '#faf7f0',
          100: '#f5eee0',
          200: '#ebddc2',
          300: '#e2cca3',
          400: '#d8bb85',
          500: '#d9a752',
          600: '#c18b3a',
          700: '#91682c',
          800: '#60461d',
          900: '#30230f',
        },
        'gold': {
          50: '#faf7f0',
          100: '#f5eee0',
          200: '#ebddc2',
          300: '#e2cca3',
          400: '#d8bb85',
          500: '#d9a752',
          600: '#c18b3a',
          700: '#91682c',
          800: '#60461d',
          900: '#30230f',
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