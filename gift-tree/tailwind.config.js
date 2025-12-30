/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary brand color (green)
        primary: {
          DEFAULT: "#16A34A", // green-600
          light: "#22C55E", // green-500
          dark: "#15803D", // green-700
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
        },
        // Secondary color (for accents if needed)
        secondary: {
          DEFAULT: "#6B7280", // gray-500
          light: "#9CA3AF", // gray-400
          dark: "#4B5563", // gray-600
        },
        // Error/danger colors
        danger: {
          DEFAULT: "#DC2626", // red-600
          light: "#FEF2F2", // red-50
          border: "#FECACA", // red-200
        },
        // Semantic background colors
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F3F4F6", // gray-100
          tertiary: "#E5E7EB", // gray-200
          dark: "#111827", // gray-900
          "dark-secondary": "#1F2937", // gray-800
          "dark-tertiary": "#374151", // gray-700
        },
        // Semantic text colors
        foreground: {
          DEFAULT: "#111827", // gray-900
          secondary: "#6B7280", // gray-500
          muted: "#9CA3AF", // gray-400
          dark: "#F9FAFB", // gray-50
          "dark-secondary": "#D1D5DB", // gray-300
          "dark-muted": "#6B7280", // gray-500
        },
        // Border colors
        border: {
          DEFAULT: "#E5E7EB", // gray-200
          light: "#F3F4F6", // gray-100
          dark: "#374151", // gray-700
        },
      },
    },
  },
  plugins: [],
};
