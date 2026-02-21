/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: { 50: '#fdf8f0', 100: '#f9eddb', 200: '#f2d8b4', 300: '#e8bc83', 400: '#dd9b50', 500: '#d4832f', 600: '#c56c24', 700: '#a45320', 800: '#844321', 900: '#6c381e', DEFAULT: '#d4832f' },
                secondary: { 50: '#f4f6f7', 100: '#e2e8eb', 200: '#c8d3d9', 300: '#a1b3bd', 400: '#738c99', 500: '#58717e', 600: '#4b5f6b', 700: '#3f4f5a', 800: '#38444d', 900: '#313c43', DEFAULT: '#58717e' },
                accent: { 50: '#fef9ec', 100: '#fcf0ca', 200: '#f9df91', 300: '#f6c957', 400: '#f4b52d', 500: '#ed9714', 600: '#d2720e', 700: '#ae5110', 800: '#8e3f13', 900: '#753413', DEFAULT: '#ed9714' },
                dark: { 50: '#f6f6f6', 100: '#e7e7e7', 200: '#d1d1d1', 300: '#b0b0b0', 400: '#888888', 500: '#6d6d6d', 600: '#5d5d5d', 700: '#4f4f4f', 800: '#454545', 900: '#1a1a1a', DEFAULT: '#1a1a1a' },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            animation: {
                'scroll-up': 'scrollUp 20s linear infinite',
                'scroll-left': 'scrollLeft 20s linear infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                scrollUp: { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(-50%)' } },
                scrollLeft: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
                fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
                slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
            },
        },
    },
    plugins: [],
};
