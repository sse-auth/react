import { animations, components, palette, rounded, shade } from "@tailus/themer"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.{ts,tsx,js,jsx}",
    "./node_modules/@sse-auth/react/dist/src/components/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tailus/themer/dist/components/**/*.{js,ts}",
    "./node_modules/@tailus/themer/dist/components/*.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [components, rounded, palette, shade, animations],
}

