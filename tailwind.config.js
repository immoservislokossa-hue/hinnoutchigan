/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)', 'sans-serif'],  // Nunito pour tout le site
      },
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        gold: "#FFD700",
        red: "#C1272F",
      },
      boxShadow: {
        gold: "0 0 15px rgba(255, 215, 0, 0.5)",  // Glow doré pour CTA
      },
    },
  },
  plugins: [],
};
