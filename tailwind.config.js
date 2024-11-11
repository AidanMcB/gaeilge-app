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
    },
    future: {
        hoverOnlyWhenSupported: true
    },
    plugins: [],
}