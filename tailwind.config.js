/**
 * Tailwind config — H2O Cleaning Services
 * Brand colours are sampled from the H2O logo + van livery.
 * After editing any HTML/JS class names run:  npm run build
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        abyss: "#021845", // logo background navy — main dark
        deep: "#0a2a6b",  // lighter navy for layered panels
        royal: "#1172db", // primary buttons / links
        sky: "#0396e6",   // secondary blue
        spray: "#7ccef3", // light aqua accent (van stripe)
        foam: "#f2f8fd",  // cool off-white section background
        ink: "#0a1630",   // body text on light backgrounds
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ['"Figtree"', "system-ui", "sans-serif"],
        script: ['"Satisfy"', "cursive"],
      },
      maxWidth: { prose: "65ch" },
      boxShadow: {
        lift: "0 24px 60px -20px rgba(2, 24, 69, .45)",
        glow: "0 10px 30px -8px rgba(17, 114, 219, .65)",
      },
    },
  },
  plugins: [],
};
