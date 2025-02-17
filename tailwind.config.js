/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/settings.html", "./pages/splash.html", "./src/index.html", './pages/settings.js', './src/preload.js'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["black", "sunset", "nord", "forest", "aqua", "luxury", "dracula", "synthwave"], 
    darkTheme: "black", 
    base: true, 
    styled: true, 
    utils: true, 
    prefix: "", 
    logs: true,
    themeRoot: ":root", 
  },
}

