/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#FAF9F5",
          100: "#F6F3EC",
          200: "#ECE8DF",
          300: "#E2DDD4",
          400: "#D5CFC4",
        },
        navy: {
          900: "#061226",
          850: "#0A1128",
          800: "#0F1E3D",
          700: "#1A2E56",
        },
        wood: {
          500: "#8A8474",
          600: "#795548",
          700: "#5D4037",
        },
        champagne: {
          400: "#D5CFC4",
          500: "#C8AD7F",
          600: "#B39567",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
