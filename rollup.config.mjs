import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" with { type: "json" }

/**
 * @type {import('rollup').OutputOptions['chunkFileNames']}
 */
const chunkFileNames = (chunkInfo) => {
  if (chunkInfo.name.includes("CallStatsLatencyChart")) {
    return "sse-latency-chart-[hash].[format].js";
  }
  return "[name]-[hash].[format].js";
};

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  // external: "",
  input: "index.ts",
  output: [
    {
      dir: "dist",
      entryFileNames: "index.es.js",
      format: "es",
      sourcemap: true,
      chunkFileNames,
    },
    {
      dir: "dist",
      entryFileNames: "index.cjs.js",
      format: "cjs",
      sourcemap: true,
      chunkFileNames,
    },
    {
      dir: "dist",
      entryFileNames: "bundle.min.js",
      format: "system",
      // sourcemap: true,
      chunkFileNames,
      plugins: [terser()]
    }
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

export default [config];
