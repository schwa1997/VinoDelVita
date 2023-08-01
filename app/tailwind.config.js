/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: 'tw-',
    darkMode: ['class', '[data-theme="dark"]'],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        screens: {
            xs: '480px',
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            tablet: '640px',
            laptop: '1024px',
            desktop: '1280px',
        },
        extend: {
            fontFamily: {
                standard: 'var(--font-family-standard)',
                firacode: 'var(--font-family-firacode)',
                kaiti: 'var(--font-family-kaiti)',
            },
            colors: {
                customGray: '#808080', // Define your custom color here
                customPurple: '#D6B4FE',
            },
        },
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [],
};
