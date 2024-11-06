import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
      },
      colors: {
        ozonBlue: '#005BFF',
        ozonMagenta: '#F1117E',
        darkSpace: '#001A34',
        morningBlue: '#00A2FF',
        greenGrass: '#00BE6C',
        orangeStar: '#FFA800',
        gray: '#F2F5F8',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
} satisfies Config;
