/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: {
    "@tailwindcss/postcss": {},
  },
  theme: {
    extend: {},
  },
};

export default config;
