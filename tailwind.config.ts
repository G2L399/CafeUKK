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
  darkMode: ["class", "class"],
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

    // nextui({
    //   themes: {
    //     light: {
    //       colors: {
    //         background: "#F7E6D5", // Light creamy background
    //         foreground: "#4B3832", // Dark brown for text
    //         primary: {
    //           50: "#FCECE4",
    //           100: "#F8D3B9",
    //           200: "#F4BA8E",
    //           300: "#EFA062",
    //           400: "#EA8545",
    //           500: "#D47435",
    //           600: "#B85F2A",
    //           700: "#9C4A20",
    //           800: "#7F3516",
    //           900: "#65200C",
    //           DEFAULT: "#D47435",
    //           foreground: "#FFFFFF",
    //         },
    //         secondary: {
    //           50: "#E6F2F2",
    //           100: "#CDE6E6",
    //           200: "#9ACCCC",
    //           300: "#66B3B3",
    //           400: "#339999",
    //           500: "#008080",
    //           600: "#006666",
    //           700: "#004D4D",
    //           800: "#003333",
    //           900: "#001A1A",
    //           DEFAULT: "#008080",
    //         },
    //         success: {
    //           50: "#E8F5E9",
    //           100: "#C8E6C9",
    //           200: "#A5D6A7",
    //           300: "#81C784",
    //           400: "#66BB6A",
    //           500: "#4CAF50",
    //           600: "#43A047",
    //           700: "#388E3C",
    //           800: "#2E7D32",
    //           900: "#1B5E20",
    //           DEFAULT: "#4CAF50",
    //         },
    //         warning: {
    //           50: "#FFF8E1",
    //           100: "#FFECB3",
    //           200: "#FFE082",
    //           300: "#FFD54F",
    //           400: "#FFCA28",
    //           500: "#FFC107",
    //           600: "#FFB300",
    //           700: "#FFA000",
    //           800: "#FF8F00",
    //           900: "#FF6F00",
    //           DEFAULT: "#FFC107",
    //         },
    //         danger: {
    //           50: "#FFEBEE",
    //           100: "#FFCDD2",
    //           200: "#EF9A9A",
    //           300: "#E57373",
    //           400: "#EF5350",
    //           500: "#F44336",
    //           600: "#E53935",
    //           700: "#D32F2F",
    //           800: "#C62828",
    //           900: "#B71C1C",
    //           DEFAULT: "#F44336",
    //         },
    //         default: {
    //           50: "#F9F6F3",
    //           100: "#F0E8E1",
    //           200: "#D9CCC0",
    //           300: "#C3B1A0",
    //           400: "#AD957F",
    //           500: "#967A5E",
    //           600: "#7E6045",
    //           700: "#67482C",
    //           800: "#503213",
    //           900: "#3A1C00",
    //           DEFAULT: "#F9F6F3",
    //         },
    //       },
    //     },
    //     dark: {
    //       colors: {
    //         background: "#2A211D", // Dark, cozy café background
    //         foreground: "#D3B8A5", // Creamy, light text on dark
    //         primary: {
    //           50: "#423127", // Deep coffee cream
    //           100: "#5A3D2D", // Latte hint
    //           200: "#734833", // Warm espresso
    //           300: "#8C5439", // Rich cappuccino
    //           400: "#A45F3F", // Medium roasted coffee
    //           500: "#BC6A44", // Mocha brown
    //           600: "#D4754A", // Strong caramel
    //           700: "#D88A5C", // Creamy caramel
    //           800: "#DB9D70", // Light toffee
    //           900: "#DDB083", // Soft cream
    //           DEFAULT: "#BC6A44", // Main mocha tone for dark theme
    //           foreground: "#FFFFFF", // White text on primary
    //         },
    //         secondary: {
    //           50: "#2C3E3F", // Dark teal
    //           100: "#3A4F4F", // Teal accent
    //           200: "#4B6161", // Deep teal highlight
    //           300: "#5C7373", // Muted sea green
    //           400: "#6D8585", // Soft sea foam
    //           500: "#809999", // Ocean wave
    //           600: "#92ABAB", // Warm light teal
    //           700: "#A5BDBD", // Dusty teal
    //           800: "#B7CFCF", // Pale teal
    //           900: "#CADFDF", // Light mist
    //           DEFAULT: "#809999", // Main teal tone for dark theme
    //         },
    //         success: {
    //           50: "#5B9B6D", // Dark forest green
    //           100: "#2D5037", // Rich green
    //           200: "#396245", // Fresh green herb
    //           300: "#447552", // Green leaf
    //           400: "#50885F", // Healthy grass
    //           500: "#223D2A", // Lush garden green
    //           600: "#6AA87B", // Soft pine green
    //           700: "#79B489", // Misty fern green
    //           800: "#88C197", // Pale mint green
    //           900: "#97CDA4", // Light sage green
    //           DEFAULT: "#5B9B6D", // Main green tone for dark theme
    //         },
    //         warning: {
    //           50: "#473A29", // Dark roasted caramel
    //           100: "#5C4A33", // Strong caramel hint
    //           200: "#705B3D", // Warm toffee
    //           300: "#846C47", // Medium caramel roast
    //           400: "#987D51", // Light caramel roast
    //           500: "#AC8D5B", // Butter toffee
    //           600: "#BF9E65", // Creamy caramel
    //           700: "#D3AF6F", // Pale amber
    //           800: "#E6C079", // Golden honey
    //           900: "#F9D183", // Bright honey
    //           DEFAULT: "#AC8D5B", // Main caramel tone for dark theme
    //         },
    //         danger: {
    //           50: "#FFEBEE",
    //           100: "#FFCDD2",
    //           200: "#EF9A9A",
    //           300: "#E57373",
    //           400: "#EF5350",
    //           500: "#F44336",
    //           600: "#E53935",
    //           700: "#D32F2F",
    //           800: "#C62828",
    //           900: "#B71C1C",
    //           DEFAULT: "#F44336",
    //         },
    //         default: {
    //           50: "#3E2D26",
    //           100: "#493630",
    //           200: "#634C42",
    //           300: "#7C6254",
    //           400: "#957766",
    //           500: "#AE8C78",
    //           600: "#C7A28A",
    //           700: "#E0B79B",
    //           800: "#EBC4AD",
    //           900: "#F3D1BF",
    //           DEFAULT: "#3E2D26",
    //         },
    //       },
    //     },
    //   },
    // }),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tailwindcss-animate"),
  ],
};
export default config;
