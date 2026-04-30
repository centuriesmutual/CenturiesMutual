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
        primary: '#14432A',
        forest: {
          DEFAULT: '#0F3D2E',
          muted: 'rgba(15, 61, 46, 0.65)',
        },
        cream: {
          DEFAULT: '#FAF7F0',
          dark: '#F0EBE0',
          /** Darker dusty tan — editorial column / hero "wall"; lighter `#FAF7F0` sits on cards / chips */
          wall: '#E8DFD6',
        },
        'warm-border': '#E5E0D5',
        muted: {
          DEFAULT: '#6B6B66',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        modal: '0 25px 50px -12px rgba(15, 61, 46, 0.18)',
      },
    },
  },
  plugins: [],
}

export default config
