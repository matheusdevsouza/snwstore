import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          darkest: '#011526',
          dark: '#011640',
          base: '#023859',
          light: '#30A9D9',
          lightest: '#99E2F2',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #011640 0%, #011526 50%, #023859 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #023859 0%, #30A9D9 50%, #99E2F2 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(2, 56, 89, 0.1) 0%, rgba(48, 169, 217, 0.05) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(48, 169, 217, 0.05)',
        'soft-lg': '0 10px 40px rgba(48, 169, 217, 0.08)',
        'glow': '0 0 20px rgba(48, 169, 217, 0.15)',
      },
    },
  },
  plugins: [],
}
export default config

