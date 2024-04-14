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
            }    
        },
    },
    future: {
        hoverOnlyWhenSupported: true
    },
    plugins: [],
}