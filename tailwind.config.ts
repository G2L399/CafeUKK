import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        "120": "1.2", // Add a custom scale value for 120%
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#F7E6D5", // Light creamy background
            foreground: "#4B3832", // Dark brown for text
            primary: {
              50: "#FCECE4",
              100: "#F8D3B9",
              200: "#F4BA8E",
              300: "#EFA062",
              400: "#EA8545",
              500: "#D47435",
              600: "#B85F2A",
              700: "#9C4A20",
              800: "#7F3516",
              900: "#65200C",
              DEFAULT: "#D47435",
              foreground: "#FFFFFF",
            },
            secondary: {
              50: "#E6F2F2",
              100: "#CDE6E6",
              200: "#9ACCCC",
              300: "#66B3B3",
              400: "#339999",
              500: "#008080",
              600: "#006666",
              700: "#004D4D",
              800: "#003333",
              900: "#001A1A",
              DEFAULT: "#008080",
            },
            success: {
              50: "#E8F5E9",
              100: "#C8E6C9",
              200: "#A5D6A7",
              300: "#81C784",
              400: "#66BB6A",
              500: "#4CAF50",
              600: "#43A047",
              700: "#388E3C",
              800: "#2E7D32",
              900: "#1B5E20",
              DEFAULT: "#4CAF50",
            },
            warning: {
              50: "#FFF8E1",
              100: "#FFECB3",
              200: "#FFE082",
              300: "#FFD54F",
              400: "#FFCA28",
              500: "#FFC107",
              600: "#FFB300",
              700: "#FFA000",
              800: "#FF8F00",
              900: "#FF6F00",
              DEFAULT: "#FFC107",
            },
            danger: {
              50: "#FFEBEE",
              100: "#FFCDD2",
              200: "#EF9A9A",
              300: "#E57373",
              400: "#EF5350",
              500: "#F44336",
              600: "#E53935",
              700: "#D32F2F",
              800: "#C62828",
              900: "#B71C1C",
              DEFAULT: "#F44336",
            },

            default: {
              50: "#F9F6F3", // Light beige for `bg-default-50`
              100: "#F0E8E1", // Warm beige
              200: "#D9CCC0", // Muted coffee cream
              300: "#C3B1A0", // Soft light brown
              400: "#AD957F", // Medium brown
              500: "#967A5E", // Cocoa
              600: "#7E6045", // Deep brown
              700: "#67482C", // Darker wood tone
              800: "#503213", // Dark roasted brown
              900: "#3A1C00", // Espresso black
              DEFAULT: "#F9F6F3", // Default light cream background
            },
            // ... rest of the colors
          },
        },
        dark: {
          colors: {
            background: "#2A211D", // Dark, cozy café background
            foreground: "#D3B8A5", // Creamy, light text on dark

            primary: {
              50: "#423127", // Deep coffee cream
              100: "#5A3D2D", // Latte hint
              200: "#734833", // Warm espresso
              300: "#8C5439", // Rich cappuccino
              400: "#A45F3F", // Medium roasted coffee
              500: "#BC6A44", // Mocha brown
              600: "#D4754A", // Strong caramel
              700: "#D88A5C", // Creamy caramel
              800: "#DB9D70", // Light toffee
              900: "#DDB083", // Soft cream
              DEFAULT: "#BC6A44", // Main mocha tone for dark theme
              foreground: "#FFFFFF", // White text on primary
            },
            default: {
              50: "#3E2D26", // Light roasted for `bg-default-50`
              100: "#493630", // Warm brown
              200: "#634C42", // Muted coffee tone
              300: "#7C6254", // Medium wood
              400: "#957766", // Dark caramel
              500: "#AE8C78", // Soft chocolate
              600: "#C7A28A", // Creamy highlight
              700: "#E0B79B", // Light toffee
              800: "#EBC4AD", // Lighter cream
              900: "#F3D1BF", // Softest cream
              DEFAULT: "#3E2D26", // Dark, cozy default background
            },
          },
        },
      },
    }),
  ],
};
export default config;
