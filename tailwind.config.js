/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"], 
  
  theme: {
    extend: {
      colors: {
        appColor: "#da9f21",
        darkcolor: "#171716",
      },
    },
  },
  plugins: [],
}

