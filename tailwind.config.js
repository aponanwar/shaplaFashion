/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — Fashion-forward deep red + gold
        primary: {
          50:  '#fff0f0',
          100: '#ffe0e0',
          200: '#ffc5c5',
          300: '#ff9999',
          400: '#ff5c5c',
          500: '#f5192a',  // vivid red
          600: '#C41E3A',  // brand primary (deep crimson)
          700: '#a01530',
          800: '#861226',
          900: '#6b1020',
          950: '#3d0510',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#D4A017',  // brand gold
          600: '#b7860e',
          700: '#926c0b',
          800: '#78580d',
          900: '#644810',
        },
        dark: {
          DEFAULT: '#1a1a2e',
          900: '#1a1a2e',
          800: '#16213e',
          700: '#0f3460',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        hind: ['var(--font-hind)', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      boxShadow: {
        'product': '0 2px 12px rgba(0,0,0,0.08)',
        'product-hover': '0 8px 30px rgba(196, 30, 58, 0.15)',
        'card': '0 1px 4px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
