const colors = {
  "dark": "#121212FF",
  "darkBright": "#2A2A2AFF",
  "main": "#905FCCFF",
  "mainBright": "#B07FFFFF",
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: colors,
      backgroundColor: colors,
      textColor: colors,
      fontFamily: {
        "arial": "Arial, Helvetica, sans-serif",
        "fontin": "Fontin",
        "mono": "monospace"
      },
      backgroundImage: {
        "poe2-item-preview": "url('/poe2_item_preview_background_temp.png')",
        "grad-bl": "linear-gradient(to bottom left, #FFF5, transparent)",
        "grad-br": "linear-gradient(to bottom right, #FFF5, transparent)",
        "grad-tl": "linear-gradient(to top left, #FFF5, transparent)",
        "grad-tr": "linear-gradient(to top right, #FFF5, transparent)"
      },
      boxShadow: {
        "card": "1px 1px 2px 1px #000F",
        "inner-card": "inset 0px 0px 2px 2px #000F"
      }
    },
  },
  plugins: [],
}

