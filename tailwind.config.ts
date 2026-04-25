import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ransa: {
          navy:       "#0D1B2A",
          ink:        "#1A2E42",
          steel:      "#2C4A63",
          accent:     "#E8A020",
          "accent-lt":"#F5C05A",
          mist:       "#EEF2F6",
          text:       "#1A2E42",
          muted:      "#6B8299",
          border:     "rgba(44,74,99,0.12)",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body:    ["'DM Sans'",    "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(52px,8vw,88px)", { lineHeight: "0.95", letterSpacing: "2px" }],
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(232,160,32,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.06) 1px, transparent 1px)",
        "accent-line":
          "linear-gradient(90deg, transparent, #E8A020, transparent)",
        "hero-glow":
          "radial-gradient(ellipse, rgba(232,160,32,0.14) 0%, transparent 70%)",
      },
      backgroundSize: {
        "grid-48": "48px 48px",
      },
      keyframes: {
        "pulse-dot": {
          "0%,100%": { opacity: "1",   transform: "scale(1)"   },
          "50%":      { opacity: "0.5", transform: "scale(0.7)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;