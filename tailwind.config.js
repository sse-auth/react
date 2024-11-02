import {
  animations,
  components,
  palette,
  rounded,
  shade,
} from "@tailus/themer";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/Pages/*.{ts,tsx}",
    "./src/components/Radix/*.{ts,tsx}",
    "./src/components/tailus-ui/*.{ts,tsx}",
    "./node_modules/@tailus/themer/dist/components/**/*.{js,ts}",
    "./node_modules/@tailus/themer/dist/components/*.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [components, rounded, palette, shade, animations],
}

