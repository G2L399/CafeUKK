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
  			'120': '1.2'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  darkMode: ["class", "class"],
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
              50: "#F9F6F3", 
              100: "#F0E8E1", 
              200: "#D9CCC0", 
              300: "#C3B1A0", 
              400: "#AD957F", 
              500: "#967A5E", 
              600: "#7E6045", 
              700: "#67482C", 
              800: "#503213", 
              900: "#3A1C00", 
              DEFAULT: "#F9F6F3", 
            },
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
            secondary: {
              50: "#2C3E3F", // Dark teal
              100: "#3A4F4F", // Teal accent
              200: "#4B6161", // Deep teal highlight
              300: "#5C7373", // Muted sea green
              400: "#6D8585", // Soft sea foam
              500: "#809999", // Ocean wave
              600: "#92ABAB", // Warm light teal
              700: "#A5BDBD", // Dusty teal
              800: "#B7CFCF", // Pale teal
              900: "#CADFDF", // Light mist
              DEFAULT: "#809999", // Main teal tone for dark theme
            },
            success: {
              50: "#5B9B6D", // Dark forest green
              100: "#2D5037", // Rich green
              200: "#396245", // Fresh green herb
              300: "#447552", // Green leaf
              400: "#50885F", // Healthy grass
              500: "#223D2A", // Lush garden green
              600: "#6AA87B", // Soft pine green
              700: "#79B489", // Misty fern green
              800: "#88C197", // Pale mint green
              900: "#97CDA4", // Light sage green
              DEFAULT: "#5B9B6D", // Main green tone for dark theme
            },
            warning: {
              50: "#473A29", // Dark roasted caramel
              100: "#5C4A33", // Strong caramel hint
              200: "#705B3D", // Warm toffee
              300: "#846C47", // Medium caramel roast
              400: "#987D51", // Light caramel roast
              500: "#AC8D5B", // Butter toffee
              600: "#BF9E65", // Creamy caramel
              700: "#D3AF6F", // Pale amber
              800: "#E6C079", // Golden honey
              900: "#F9D183", // Bright honey
              DEFAULT: "#AC8D5B", // Main caramel tone for dark theme
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
              50: "#3E2D26", 
              100: "#493630", 
              200: "#634C42", 
              300: "#7C6254", 
              400: "#957766", 
              500: "#AE8C78", 
              600: "#C7A28A", 
              700: "#E0B79B", 
              800: "#EBC4AD", 
              900: "#F3D1BF", 
              DEFAULT: "#3E2D26", 
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
