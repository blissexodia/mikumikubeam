/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Miku-inspired color palette
        miku: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Main Miku teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Complementary anime colors
        anime: {
          pink: '#ff6b9d',
          purple: '#8b5cf6',
          blue: '#3b82f6',
          yellow: '#fbbf24',
          orange: '#f97316',
        },
        // Dark theme colors
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #14b8a6, 0 0 10px #14b8a6, 0 0 15px #14b8a6' },
          '100%': { boxShadow: '0 0 10px #14b8a6, 0 0 20px #14b8a6, 0 0 30px #14b8a6' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'miku-gradient': 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #8b5cf6 100%)',
        'anime-gradient': 'linear-gradient(45deg, #ff6b9d 0%, #8b5cf6 50%, #3b82f6 100%)',
      },
      boxShadow: {
        'miku': '0 4px 14px 0 rgba(20, 184, 166, 0.3)',
        'miku-lg': '0 10px 25px -3px rgba(20, 184, 166, 0.4)',
        'anime': '0 4px 14px 0 rgba(139, 92, 246, 0.3)',
        'glow-sm': '0 0 10px rgba(20, 184, 166, 0.5)',
        'glow': '0 0 20px rgba(20, 184, 166, 0.6)',
        'glow-lg': '0 0 30px rgba(20, 184, 166, 0.7)',
      }
    },
  },
  plugins: [],
}