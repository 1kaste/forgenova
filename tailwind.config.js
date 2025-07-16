/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'header-top-bar': {
          DEFAULT: 'hsl(var(--header-top-bar-background))',
          foreground: 'hsl(var(--header-top-bar-foreground))'
        },
        'header-main': {
          DEFAULT: 'hsl(var(--header-main-background))',
          foreground: 'hsl(var(--header-main-foreground))'
        },
        footer: {
          DEFAULT: 'hsl(var(--footer-background))',
          foreground: 'hsl(var(--footer-foreground))'
        },
        hero: {
          foreground: 'hsl(var(--hero-foreground))',
          overlay: 'hsl(var(--hero-overlay))'
        }
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'body': ['Montserrat', 'sans-serif'],
        'heading': ['Rockwell', 'serif'],
      }
    }
  },
  plugins: [],
}
