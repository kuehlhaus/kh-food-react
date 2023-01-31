/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        theserif: 'TheSerif HP4 SemiLight',
        thesansosf: 'TheSansOsF SemiLight',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        bold: '600',
      },
      backgroundSize: {
        fill: 'auto 100%',
      },
      width: {
        headerXxl: '1536px',
        headerXl: '1280px',
      },
      height: {
        headerXxl: '587px',
        headerXl: '489px',
      },
    },
  },
  plugins: [],
};
