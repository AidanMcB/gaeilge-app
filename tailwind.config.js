/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue}",
    ],
    theme: {
        extend: {
            transitionDuration: {
                '2000': '5000ms',
            }, 
            colors: {
                mute: {
                    light: '#5d5d5d',
                    standard: '#282828',
                    dark: '#222222',
                    darker: '#181818'
                },
                base: {
                    'black-main': 'var(--vt-c-black)'
                }
            },
            screens: {
                'mobile': '320px'
            }
        },
        screens: {
            'mobile': '320px',
            'mobile-lg': '430px',
            'mobile-xl': '500px',
            'desktop-sm': '700px',
            'laptop': '1024px',
            'desktop': '1280px',
            'widescreen': '1536px',
            // default
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
    },
    future: {
        hoverOnlyWhenSupported: true
    },
    plugins: [],
}