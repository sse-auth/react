import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
// import terser from "@rollup/plugin-terser";
import pkg from "./package.json" with { type: "json" }
import path from "path";
import { glob } from "glob";

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

const providers = glob.sync(`./src/providers/*.tsx`).map((file) => {
  const name = path.basename(file, path.extname(file))
  return {
    input: file,
    output: [
      {
        dir: "dist",
        entryFileNames: `src/providers/${name}.es.js`,
        format: "es",
        // sourcemap: true,
      },
      {
        dir: "dist",
        entryFileNames: `src/providers/${name}.cjs.js`,
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
});

// const providersBuild = (name: string) = {
//   input: `src/providers/`
// }

export default [config, ...providers];
// export default [...providers];