import { DEFAULT_SPACING_SCALE, generateEvenNumbers } from './src/lib/helpers/tailwind-helpers';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/component-children/**/*.{js,ts,jsx,tsx,mdx}',
    './src/stories/**/*.{js,ts,jsx,tsx,mdx}',
    './src/stories/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/types/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/type.ts',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem', // 48px
        '6xl': '3.75rem', // 60px
        '7xl': '4.5rem', // 72px
        '8xl': '6rem', // 96px
        '9xl': '8.0rem', // 129px
      },
      colors: {
        primary: 'rgb(var(--next-primary-bg) / <alpha-value>)', // New primary theme background
        secondary: 'rgb(var(--next-secondary-bg) / <alpha-value>)', // New secondary theme background
        tertiary: 'rgb(var(--next-tertiary-bg) / <alpha-value>)', // New tertiary theme background
        red: 'rgb(var(--next-red) / <alpha-value>)', // Legacy red color
        maroon: 'rgb(var(--next-maroon) / <alpha-value>)', // Legacy maroon color
        // Note: Legacy gray color (--next-gray) is available as CSS variable but not exposed as Tailwind utility to avoid conflicting with built-in gray scale

        content: 'rgb(var(--text) / <alpha-value>)',
        surface: 'rgb(var(--bg)/ <alpha-value>)',
        'button-surface': 'rgb(var(--button-bg)/ <alpha-value>)',
        'link-color': 'rgb(var(--link-color) / <alpha-value>)',
      },
      spacing: DEFAULT_SPACING_SCALE,
      keyframes: {
        enterFromRight: {
          from: { opacity: 0, transform: 'translateX(200px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        enterFromLeft: {
          from: { opacity: 0, transform: 'translateX(-200px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        exitToRight: {
          from: { opacity: 1, transform: 'translateX(0)' },
          to: { opacity: 0, transform: 'translateX(200px)' },
        },
        exitToLeft: {
          from: { opacity: 1, transform: 'translateX(0)' },
          to: { opacity: 0, transform: 'translateX(-200px)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'rotateX(-10deg) scale(0.9)' },
          to: { opacity: 1, transform: 'rotateX(0deg) scale(1)' },
        },
        scaleOut: {
          from: { opacity: 1, transform: 'rotateX(0deg) scale(1)' },
          to: { opacity: 0, transform: 'rotateX(-10deg) scale(0.95)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        scaleIn: 'scaleIn 200ms ease',
        scaleOut: 'scaleOut 200ms ease',
        fadeIn: 'fadeIn 200ms ease',
        fadeOut: 'fadeOut 200ms ease',
        enterFromLeft: 'enterFromLeft 250ms ease',
        enterFromRight: 'enterFromRight 250ms ease',
        exitToLeft: 'exitToLeft 250ms ease',
        exitToRight: 'exitToRight 250ms ease',
        fade: 'fade 0.5s ease-in',
      },
      fontFamily: {
        heading: ['var(--font-ppmori)', 'serif'],
        body: ['var(--font-ppmori)', 'serif'],
        ppmori: ['var(--font-ppmori)', 'serif'],
      },
      width: {
        'horizontal-card-image-sm': '13%',
        'horizontal-card-image-md': '16%',
        'horizontal-card-image-lg': '19%',
        'horizontal-card-image-xl': '22%',
      },
      minWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'horizontal-card-image-sm': '13%',
        'horizontal-card-image-md': '16%',
        'horizontal-card-image-lg': '19%',
        'horizontal-card-image-xl': '22%',
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'horizontal-card-image-sm': '13%',
        'horizontal-card-image-md': '16%',
        'horizontal-card-image-lg': '19%',
        'horizontal-card-image-xl': '22%',
        'desktop-content-w-padding': '1112px',
        'desktop-content': '1064px',
        'half-outer-content': '720px',
        'inner-content': '1280px',
        'outer-content': '1440px',
        'outer-content-carousel': '1464px',
        'outer-content-w-padding': '1568px',
        'cta-block': '80%',
        30: '120px',
        ...generateEvenNumbers(80, 300), // Generate even numbers from 100 (400) to 300 (1200)
      },
      borderWidth: {
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
        6: '6px',
        8: '8px',
      },
      minHeight: {
        70: '17.5rem',
        hero: '400px',
        'hero-lg': '620px',
        banner: '400px',
        'split-banner': '500px',
        ...generateEvenNumbers(80, 300), // Generate even numbers from 100 (400) to 300 (1200)
      },
      maxHeight: {
        'card-content': '120px',
        modal: '85vh',
      },
      listStyleType: {
        circle: 'circle',
        square: 'square',
        'lower-alpha': 'lower-alpha',
        'upper-alpha': 'upper-alpha',
        'lower-roman': 'lower-roman',
        'upper-roman': 'upper-roman',
      },
      // request of story 11936
      borderRadius: {
        1: '0',
        2: '0',
        3: '0',
        4: '0',
        5: '0',
        6: '0',
        8: '0',
        10: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '0',
        loader: '9999px',
        DEFAULT: '0',
      },
      zIndex: {
        60: '60',
        70: '70',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')({
      className: 'prose',
    }),
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
    function ({ addVariant }) {
      addVariant('not-last-child', '&:not(:last-child)');
    },
  ],
  safelist: [
    // Layout and positioning utilities
    {
      pattern: /^(basis-|order-|flex|block|hidden|inline|table|static|fixed|relative|absolute)/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    // Margin utilities
    {
      pattern: /^m(x|l|r)-/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
  ],
};
