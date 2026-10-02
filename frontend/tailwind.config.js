/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary: Electric Indigo/Violet
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          DEFAULT: '#6366f1',
        },
        // Cyan/Teal accent — matches the glowing teal in the image
        cyan: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          DEFAULT: '#06b6d4',
        },
        // Purple accent
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        // Dark background palette
        dark: {
          50:  '#1a1a2e',
          100: '#16213e',
          200: '#0f3460',
          300: '#0d1b2a',
          400: '#0a0f1e',
          500: '#060b17',
          600: '#04080f',
          700: '#020508',
          800: '#010307',
          900: '#000204',
          DEFAULT: '#0a0f1e',
        },
        // Neutral surfaces (kept for compatibility)
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Risk levels
        risk: {
          low: '#059669',
          'low-bg': '#d1fae5',
          moderate: '#d97706',
          'moderate-bg': '#fef3c7',
          high: '#dc2626',
          'high-bg': '#fee2e2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)',
        'glow-purple': 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        'hero-gradient': 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 40%, #1a0a2e 70%, #0a0f1e 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'accent-gradient': 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
        'text-gradient': 'linear-gradient(135deg, #67e8f9, #a78bfa)',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        focus: '0 0 0 3px rgba(29, 78, 216, 0.15)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.2)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2)',
        'glow-sm': '0 0 10px rgba(6,182,212,0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-hover': '0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
        'inner-glow': 'inset 0 0 60px rgba(6,182,212,0.05)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scanline': 'scanline 4s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-up': 'slideUp 0.4s ease-out both',
        'slide-in': 'slideIn 0.3s ease-out both',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(6,182,212,0.2), 0 0 10px rgba(6,182,212,0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateX(-8px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
