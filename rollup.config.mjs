import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
// import terser from "@rollup/plugin-terser";
import pkg from "./package.json" with { type: "json" }

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "index.ts",
  output: [
    {
      dir: "dist",
      entryFileNames: "index.es.js",
      format: "es",
      sourcemap: true,
    },
    {
      dir: "dist",
      entryFileNames: "index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
    // "crypto",
    // "node:crypto"
  ],
  plugins: [
    json(),
    typescript({
      tsconfig:
        process.env.NODE_ENV === "production"
          ? "./tsconfig.production.json"
          : "./tsconfig.json",
    }),
  ],
};

const button = {
  input: "buttons/index.ts",
  output: [
    {
      dir: "dist",
      entryFileNames: "buttons.es.js",
      format: "es",
      // sourcemap: true,
    },
    {
      dir: "dist",
      entryFileNames: "buttons.cjs.js",
      format: "cjs",
      // sourcemap: true,
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
  ],
  plugins: [
    json(),
    typescript({
      tsconfig:
        process.env.NODE_ENV === "production"
          ? "./tsconfig.production.json"
          : "./tsconfig.json",
    }),
  ],
};

const providers = {
  input: "src/providers/index.ts",
  output: [
    {
      dir: "dist",
      entryFileNames: "providers.es.js",
      format: "es",
      // sourcemap: true,
    },
    {
      dir: "dist",
      entryFileNames: "providers.cjs.js",
      format: "cjs",
      // sourcemap: true,
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
  ],
  plugins: [
    json(),
    typescript({
      tsconfig:
        process.env.NODE_ENV === "production"
          ? "./tsconfig.production.json"
          : "./tsconfig.json",
    }),
  ],
};

// const providersBuild = (name: string) = {
//   input: `src/providers/`
// }

export default [config, button, providers];