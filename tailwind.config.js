/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "quantum-green": "#00ff88",
        "quantum-blue": "#0088ff",
        "quantum-purple": "#8800ff",
        "matrix-green": "#00ff41",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-sans-tc)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Consolas", "Monaco", "Courier New", "monospace"],
      },
      animation: {
        "quantum-pulse": "quantum-pulse 2s ease-in-out infinite",
        "neural-flow": "neural-flow 3s linear infinite",
        holographic: "holographic 4s ease-in-out infinite",
        "matrix-rain": "matrix-rain 20s linear infinite",
        typing: "typing 3.5s steps(40, end)",
        "blink-caret": "blink-caret .75s step-end infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "quantum-pulse": {
          "0%, 100%": {
            opacity: "0.3",
            transform: "scale(1) rotate(0deg)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.1) rotate(180deg)",
          },
        },
        "neural-flow": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        holographic: {
          "0%, 100%": {
            "background-position": "0% 50%",
            filter: "hue-rotate(0deg)",
          },
          "50%": {
            "background-position": "100% 50%",
            filter: "hue-rotate(180deg)",
          },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(100vh)" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        "blink-caret": {
          "from, to": { "border-color": "transparent" },
          "50%": { "border-color": "#00ff88" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        quantum: "0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.1)",
        neural: "0 0 30px rgba(0, 136, 255, 0.4), 0 0 60px rgba(0, 136, 255, 0.2)",
        hologram: "0 0 25px rgba(136, 0, 255, 0.4), 0 0 50px rgba(136, 0, 255, 0.2)",
      },
      screens: {
        xs: "475px",
        "3xl": "1600px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
