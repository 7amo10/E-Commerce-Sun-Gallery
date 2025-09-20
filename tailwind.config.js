/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./src/**/*.html", "./src/**/*.ts"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#D2B48C",
          cream: "#F5F5DC",
          pink: "#D4A574",
          sage: "#9CAF88",
          accent: "#FFD700",
          dark: "#374151",
          light: "#F8F7F3",
        },
      },
      fontFamily: {
        arabic: ["Tajawal", "Amiri", "Cairo", "ui-sans-serif", "system-ui"],
        english: ["Poppins", "Inter", "ui-sans-serif", "system-ui"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          lg: "2rem",
          xl: "3rem",
          "2xl": "4rem",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
