/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,svelte}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: 'black'
        }
      },
      'dark',
      'black',
      'winter',
      'sunset',
      'pastel',
      'nord',
      'emerald'
    ]
  }
}
