/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Sora', 'Space Grotesk', 'system-ui', 'sans-serif'],
        base: ['Inter', 'system-ui', 'sans-serif'],
        tech: ['Orbitron', 'sans-serif'],
        mono: ['Share Tech Mono', 'JetBrains Mono', 'monospace'],
        syne: ['Syne', 'Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -3px rgba(0, 210, 255, 0.45), inset 0 0 15px -3px rgba(0, 210, 255, 0.15)',
        'glow-magenta': '0 0 25px -3px rgba(255, 42, 133, 0.45), inset 0 0 15px -3px rgba(255, 42, 133, 0.15)',
        'glow-amber': '0 0 25px -3px rgba(255, 180, 0, 0.45), inset 0 0 15px -3px rgba(255, 180, 0, 0.15)',
        'glow-emerald': '0 0 25px -3px rgba(0, 255, 157, 0.45), inset 0 0 15px -3px rgba(0, 255, 157, 0.15)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(0,210,255,0.3))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 18px rgba(0,210,255,0.6))' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'grid-travel': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'grid-travel': 'grid-travel 2s linear infinite',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(0, 210, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 210, 255, 0.08) 1px, transparent 1px)",
        'cyber-grid': "radial-gradient(circle, rgba(0,210,255,0.12) 1px, transparent 1px)",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
