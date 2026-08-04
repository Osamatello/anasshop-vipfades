import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],

  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },

      colors: {
        /**
         * VIP FADES brand colors
         *
         * Usage:
         * - textPrimary: Main headings and important information
         * - cream/highlight: Section labels and premium highlighted text
         * - textSecondary: Paragraphs and supporting copy
         * - accent/hover: Buttons, links, active states and interactive elements
         */
        brand: {
          bg: '#070707',
          bgSecondary: '#101010',
          card: '#171717',
          border: '#2A2A2A',

          // Interactive elements only
          accent: '#22344A',
          hover: '#304A66',

          // Typography
          textPrimary: '#F2F2F2',
          textSecondary: '#B0ACA6',

          // Premium highlighted typography
          cream: '#E8DCC8',
          highlight: '#E8DCC8',
        },

        /**
         * Neutral dark scale
         */
        ink: {
          950: '#070707',
          900: '#101010',
          800: '#171717',
          700: '#242424',
          600: '#2E2E2E',
          500: '#3A3A3A',
          400: '#555555',
          300: '#777777',
          200: '#999999',
          100: '#CCCCCC',
          50: '#F2F2F2',
        },

        /**
         * Warm editorial tones
         */
        warm: {
          50: '#FAF7F2',
          100: '#F5F0E8',
          200: '#E8DCC8',
          300: '#DDD0B8',
          400: '#C9B8A8',
        },

        /**
         * Legacy colors retained temporarily.
         * Keep these to avoid breaking existing components.
         * Do not use them for new typography.
         */
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E0C06A',
          dark: '#A07A28',
          muted: '#8A6820',
        },

        /**
         * Original logo colors
         */
        vip: {
          red: '#CC2936',
          blue: '#1D3D8A',
        },

        /**
         * Existing shadcn/ui color tokens
         */
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

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

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },

        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },

        'fade-up': {
          from: {
            opacity: '0',
            transform: 'translateY(32px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },

        'cinematic-zoom': {
          from: {
            transform: 'scale(1)',
          },
          to: {
            transform: 'scale(1.03)',
          },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.7s ease forwards',
        'fade-in': 'fade-in 0.6s ease forwards',
        'cinematic-zoom':
          'cinematic-zoom 22s ease-in-out infinite alternate',
      },
    },
  },

  plugins: [require('tailwindcss-animate')],
};

export default config;