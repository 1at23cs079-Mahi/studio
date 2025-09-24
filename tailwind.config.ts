import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: (theme: (arg0: string) => any) => ({
        DEFAULT: {
          css: {
            '--prose-body': theme('colors.foreground'),
            '--prose-headings': theme('colors.foreground'),
            '--prose-lead': theme('colors.foreground'),
            '--prose-links': theme('colors.primary.DEFAULT'),
            '--prose-bold': theme('colors.foreground'),
            '--prose-counters': theme('colors.muted.foreground'),
            '--prose-bullets': theme('colors.primary.DEFAULT'),
            '--prose-hr': theme('colors.border'),
            '--prose-quotes': theme('colors.foreground'),
            '--prose-quote-borders': theme('colors.primary.DEFAULT'),
            '--prose-captions': theme('colors.muted.foreground'),
            '--prose-code': theme('colors.foreground'),
            '--prose-pre-code': theme('colors.foreground'),
            '--prose-pre-bg': theme('colors.muted.DEFAULT'),
            '--prose-th-borders': theme('colors.border'),
            '--prose-td-borders': theme('colors.border'),
            '--prose-invert-body': theme('colors.foreground'),
            '--prose-invert-headings': theme('colors.foreground'),
            '--prose-invert-lead': theme('colors.foreground'),
            '--prose-invert-links': theme('colors.primary.DEFAULT'),
            '--prose-invert-bold': theme('colors.foreground'),
            '--prose-invert-counters': theme('colors.muted.foreground'),
            '--prose-invert-bullets': theme('colors.primary.DEFAULT'),
            '--prose-invert-hr': theme('colors.border'),
            '--prose-invert-quotes': theme('colors.foreground'),
            '--prose-invert-quote-borders': theme('colors.primary.DEFAULT'),
            '--prose-invert-captions': theme('colors.muted.foreground'),
            '--prose-invert-code': theme('colors.foreground'),
            '--prose-invert-pre-code': theme('colors.foreground'),
            '--prose-invert-pre-bg': theme('colors.muted.DEFAULT'),
            '--prose-invert-th-borders': theme('colors.border'),
            '--prose-invert-td-borders': theme('colors.border'),
          },
        },
      }),
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        headline: ['var(--font-headline)', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
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
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        'fade-in': {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;

    