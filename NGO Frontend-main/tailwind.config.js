// Tailwind CSS configuration file
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#00712D",
        // secondary: "#FFB200",
        // accent: "#640D5F",
        // background: "#F8FAFC",
        // lightGreen: "#EAFFEB",
        // cream: "#FEFAE0"
        primary: "#1E6B4A",      // Rich forest green - more sophisticated than bright green
        secondary: "#F3A738",    // Warm amber - softer than bright yellow
        accent: "#9C4668",       // Muted berry - more natural than bright purple
        background: "#F9F9F7",   // Soft off-white - warmer than blue-gray
        lightGreen: "#E3F1E6",   // Subtle sage - softer mint green
        cream: "#FFF8EA",        // Warm cream - slightly warmer
      }
    },
  },
  plugins: [],
}
