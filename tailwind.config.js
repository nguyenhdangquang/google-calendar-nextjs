module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
    },
    fontFamily: {
      raleway: ["Raleway", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        gray: {
          100: "#f7fafc",
          200: "#edf2f7",
          300: "#e2e8f0",
          400: "#cbd5e0",
          500: "#a0aec0",
          600: "#718096",
          700: "#4a5568",
          800: "#2d3748",
          900: "#1a202c",
        },
        blue: {
          100: "#ebf8ff",
          200: "#bee3f8",
          300: "#90cdf4",
          400: "#63b3ed",
          500: "#4299e1",
          600: "#3182ce",
          700: "#2b6cb0",
          800: "#2c5282",
          900: "#2a4365",
        },
        "zenith-black": "#050404",
        "zenith-gray": {
          50: "#efefef",
          100: "#A8A6A7",
        },
        "zenith-emerald": "#59C9A5",
        "google-blue": "#4285F4",
        "zenith-stone": {
          50: "#fafafa",
          100: "#F8EDED",
        },
        red: {
          850: "#A70804",
          900: "#B00603",
          200: "#F7E6E5",
        },
      },
    },
  },
  plugins: [],
};
