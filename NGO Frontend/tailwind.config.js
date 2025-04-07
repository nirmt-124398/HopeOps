//  /** @type {import('tailwindcss').Config} */
//  export default {
//   content: ["./src/**/*.{html,js,jsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#1E4592",
//         secondary: "#F97316",
//         accent: "#10B981",
//         background: "#F8FAFC"
//       }
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00712D",
        secondary: "#FFB200",
        accent: "#640D5F",
        background: "#F8FAFC",
        lightGreen: "#EAFFEB",
        cream: "#FEFAE0"
      }
    },
  },
  plugins: [],
}
