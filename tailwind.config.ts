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
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "custom-animation": "cubic-bezier(0.33, 1.52, 0.6, 1)",
      },
      scale: {
        "120": "1.2",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  darkMode: ["class"],
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#F1E4D3", // Warm light beige background (café ambiance)
            foreground: "#5A4634", // Dark mocha text
            primary: {
              50: "#F7E6D5",
              100: "#EDD3B9",
              200: "#E3B89E",
              300: "#DA9E83",
              400: "#D08467",
              500: "#C66A4C",
              600: "#AC5032", // Dark mocha for highlights
              700: "#934226", // Rich brown
              800: "#7A341A",
              900: "#62300F", // Darkest color in light theme, matching lightest in dark theme
              DEFAULT: "#C66A4C",
              foreground: "#FFFFFF",
            },
            secondary: {
              50: "#E8F2F2",
              100: "#CCE8E8",
              200: "#99D1D1",
              300: "#66B9B9",
              400: "#33A1A1",
              500: "#008888",
              600: "#006F6F",
              700: "#005757",
              800: "#003F3F",
              900: "#002727",
              DEFAULT: "#008888",
            },
            success: {
              50: "#EDF7EC",
              100: "#CDEDCB",
              200: "#ABE2A9",
              300: "#89D788",
              400: "#67CC66",
              500: "#45C144",
              600: "#38A336",
              700: "#2B8528",
              800: "#1F671A",
              900: "#13490C",
              DEFAULT: "#45C144",
            },
            warning: {
              50: "#FFF4E1",
              100: "#FFE0B3",
              200: "#FFCC85",
              300: "#FFB858",
              400: "#FFA42A",
              500: "#FF9100",
              600: "#E67F00",
              700: "#CC6D00",
              800: "#B35B00",
              900: "#994900",
              DEFAULT: "#FF9100",
            },
            danger: {
              50: "#FFEBE9",
              100: "#FFD2CF",
              200: "#FFA7A2",
              300: "#FF7B76",
              400: "#FF514B",
              500: "#FF2620",
              600: "#E6201B",
              700: "#CC1B16",
              800: "#B21611",
              900: "#990F0C",
              DEFAULT: "#FF2620",
            },
            default: {
              50: "#F1E4D3",
              100: "#E0CEBA",
              200: "#CBB198",
              300: "#B69576",
              400: "#A17854",
              500: "#8C5B32",
              600: "#744221",
              700: "#5D3419",
              800: "#472611",
              900: "#301809",
              DEFAULT: "#472611",
            },
          },
        },
        dark: {
          colors: {
            background: "#3C2C25", // Deep dark brown, café interior vibe
            foreground: "#D2B5A4", // Light creamy text for contrast
            primary: {
              50: "#523D33", // Soft coffee brown
              100: "#6A5041", // Richer brown
              200: "#83554F", // Medium roast coffee
              300: "#9B614D", // Warm cinnamon
              400: "#B36B56", // Toasted brown
              500: "#CB765F", // Latte hue
              600: "#C68D78", // Creamy caramel
              700: "#D19B88", // Light latte brown
              800: "#DDBA9B", // Soft cream
              900: "#62300F", // Matches the darkest in light theme
              DEFAULT: "#CB765F",
              foreground: "#FFFFFF", // White text on primary
            },
            secondary: {
              50: "#324545", // Deep dark teal
              100: "#3F5656", // Teal highlight
              200: "#4E6969", // Muted sea green
              300: "#5D7C7C", // Soft sea foam
              400: "#6C8F8F", // Light ocean
              500: "#7AA2A2", // Calm teal
              600: "#88B5B5", // Warmer teal
              700: "#96C8C8", // Soft mist
              800: "#A4DBDB", // Misty teal
              900: "#B2ECEC", // Very light mist
              DEFAULT: "#7AA2A2",
            },
            success: {
              50: "#3B6A3C", // Dark forest green
              100: "#476A47", // Deep green
              200: "#567757", // Green highlight
              300: "#628463", // Light green
              400: "#73A376", // Soft forest
              500: "#81B088", // Garden green
              600: "#92C19A", // Pale mint green
              700: "#A3D2AC", // Light green mist
              800: "#B4E3BE", // Light minty
              900: "#C4F4D0", // Pale sage
              DEFAULT: "#73A376",
            },
            warning: {
              50: "#5E472C", // Dark caramel
              100: "#6F5736", // Warm roasted
              200: "#806840", // Golden toffee
              300: "#91794A", // Warm butter caramel
              400: "#A38A54", // Creamy caramel roast
              500: "#B59B5E", // Light toffee
              600: "#C7AC68", // Honey roast
              700: "#D9BD72", // Pale gold
              800: "#EBCD7C", // Golden
              900: "#FDD086", // Bright honey
              DEFAULT: "#A38A54",
            },
            danger: {
              50: "#FFEBE9",
              100: "#FFD2CF",
              200: "#FFA7A2",
              300: "#FF7B76",
              400: "#FF514B",
              500: "#FF2620",
              600: "#E6201B",
              700: "#CC1B16",
              800: "#B21611",
              900: "#990F0C",
              DEFAULT: "#FF2620",
            },
            default: {
              50: "#3C2C25",
              100: "#4A3730",
              200: "#5D4A43",
              300: "#705D56",
              400: "#846F6A",
              500: "#97717E",
              600: "#AB8791",
              700: "#BE9D9D",
              800: "#D1B3B3",
              900: "#E4C9C9",
              DEFAULT: "#3C2C25",
            },
          },
        },
      },
    }),

   
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tailwindcss-animate"),
  ],
};
export default config;
