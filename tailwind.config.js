module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#ac2d00",
        "primary-container": "#d63c05",
        "secondary": "#1b6d24",
        "secondary-container": "#a0f399",
        "background": "#f6fbed",
        "surface": "#f6fbed",
        "surface-dim": "#d6dccf",
        "surface-bright": "#f6fbed",
        "surface-container-low": "#f0f6e8",
        "surface-container-high": "#e4eadc",
        "surface-container-highest": "#dfe5d7",
        "surface-container-lowest": "#ffffff",
        "on-background": "#181d15",
        "on-surface": "#181d15",
        "on-surface-variant": "#5b4039",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-primary-container": "#fffbff",
        "on-secondary-container": "#217128",
        "tertiary": "#8c4c00",
        "tertiary-container": "#b06000",
        "tertiary-fixed": "#ffdcc2",
        "tertiary-fixed-dim": "#ffb77b",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fffbff",
        "on-tertiary-fixed": "#2e1500",
        "on-tertiary-fixed-variant": "#6d3a00",
        "outline": "#8f7067",
        "outline-variant": "#e4beb4",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "inverse-surface": "#2c3229",
        "inverse-on-surface": "#edf3e5",
        "inverse-primary": "#ffb5a0",
        "primary-fixed": "#ffdbd1",
        "primary-fixed-dim": "#ffb5a0",
        "on-primary-fixed-variant": "#872100",
        "secondary-fixed": "#a3f69c",
        "secondary-fixed-dim": "#88d982",
        "on-secondary-fixed-variant": "#005312",
        "on-secondary-fixed": "#002204"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        label: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        warm: "0 20px 25px -5px rgba(176, 46, 0, 0.04), 0 8px 10px -6px rgba(176, 46, 0, 0.04)"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms")
  ]
};
