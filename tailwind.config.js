/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                retro: {
                    yellow: '#E1B978',
                    pink: '#FF69B4',
                    blue: '#4169E1',
                    green: '#32CD32',
                    purple: '#9932CC',
                    orange: '#FF8C00',
                    black: '#000000',
                },
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    900: '#1e3a8a',
                },
            },
            fontFamily: {
                'retro': ['Courier New', 'monospace'],
                'pixel': ['monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'pulse-dot': 'pulseDot 1.4s infinite ease-in-out',
                'bounce-slow': 'bounce 2s infinite',
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
                pulseDot: {
                    '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.5' },
                    '40%': { transform: 'scale(1)', opacity: '1' },
                }
            },
            boxShadow: {
                'retro': '4px 4px 0px 0px rgba(0,0,0,1)',
                'retro-inset': 'inset 2px 2px 0px 0px rgba(255,255,255,0.5), inset -2px -2px 0px 0px rgba(0,0,0,0.3)',
            }
        },
    },
    plugins: [],
}
