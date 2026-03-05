/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#000000',
                accent: '#555555',
                light: '#FFFFFF',
                dark: '#000000',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            keyframes: {
                shine: {
                    '0%': { transform: 'translateX(-200%)' },
                    '100%': { transform: 'translateX(200%)' },
                }
            },
            animation: {
                shine: 'shine 3s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}
