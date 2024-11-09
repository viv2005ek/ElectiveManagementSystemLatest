/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "muj-orange": "#DF6139",
        "main-bg": "#f0f0f0",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
