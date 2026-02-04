import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ isSsrBuild, ssrBuild }) => {
  const isSSR = isSsrBuild || ssrBuild;
  console.log("Vite Config - isSSR:", isSSR);

  return {
    server: {
      host: true, // Listen on all addresses, including 0.0.0.0
      port: 5173,
    },
    plugins: [
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
    ],
  };
});
