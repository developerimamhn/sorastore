/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        line: "var(--line)",
        muted: "var(--muted)",
        navy: "var(--navy)",
        paper: "var(--paper)",
      },
    },
  },
  plugins: [],
};