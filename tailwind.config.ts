import type { Config } from "tailwindcss";
import {
  animations,
  components,
  palette,
  rounded,
  shade,
} from "@tailus/themer";

module.exports = {
  content: [
    "./src/components/Pages/*.{ts,tsx}",
    "./src/components/Radix/*.{ts,tsx}",
    "./src/components/tailus-ui/*.{ts,tsx}",
    "./node_modules/@tailus/themer/dist/components/**/*.{js,ts}",
  ],
  plugins: [components, rounded, palette, shade, animations],
} satisfies Config;
