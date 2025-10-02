/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Enhanced medical theme with attractive colors
        medical: {
          50: '#f0f9ff',   // Very light blue
          100: '#e0f2fe',  // Light blue
          200: '#bae6fd',  // Soft blue
          300: '#7dd3fc',  // Medium blue
          400: '#38bdf8',  // Bright blue
          500: '#0ea5e9',  // Primary medical blue
          600: '#0284c7',  // Deep blue
          700: '#0369a1',  // Darker blue
          800: '#075985',  // Navy blue
          900: '#0c4a6e',  // Dark navy
        },
        // Light mode accent colors
        accent: {
          50: '#fef7ff',   // Very light purple
          100: '#fce7ff',  // Light purple
          200: '#f8d4fe',  // Soft purple
          300: '#f0abfc',  // Medium purple
          400: '#e879f9',  // Bright purple
          500: '#d946ef',  // Primary purple
          600: '#c026d3',  // Deep purple
          700: '#a21caf',  // Darker purple
          800: '#86198f',  // Dark purple
          900: '#701a75',  // Very dark purple
        },
        // Dark mode primary colors
        dark: {
          50: '#f8fafc',   // Almost white
          100: '#f1f5f9',  // Very light gray
          200: '#e2e8f0',  // Light gray
          300: '#cbd5e1',  // Medium light gray
          400: '#94a3b8',  // Medium gray
          500: '#64748b',  // Gray
          600: '#475569',  // Dark gray
          700: '#334155',  // Darker gray
          800: '#1e293b',  // Dark background
          900: '#0f172a',  // Very dark background
          950: '#020617',  // Ultra dark background
        },
        // Dark mode accent colors (warm orange/amber)
        amber: {
          50: '#fffbeb',   // Very light amber
          100: '#fef3c7',  // Light amber
          200: '#fde68a',  // Soft amber
          300: '#fcd34d',  // Medium amber
          400: '#fbbf24',  // Bright amber
          500: '#f59e0b',  // Primary amber
          600: '#d97706',  // Deep amber
          700: '#b45309',  // Darker amber
          800: '#92400e',  // Dark amber
          900: '#78350f',  // Very dark amber
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // HIPAA compliance color
        hipaa: {
          50: '#fdfcfe',
          100: '#faf7fd',
          200: '#f4edfa',
          300: '#ebd9f5',
          400: '#dcbbec',
          500: '#c891e0',
          600: '#b268d0',
          700: '#9c4fbb',
          800: '#824399',
          900: '#6b3b7c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        medical: ['Source Sans Pro', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'medical': '0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06)',
        'hipaa': '0 4px 6px -1px rgba(156, 79, 187, 0.1), 0 2px 4px -1px rgba(156, 79, 187, 0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
