import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}", "db/**/*.{test,spec}.ts"],
  },
  resolve: {
    // Mirror tsconfig "@/*": ["./*"] so domain tests can import "@/db/schema" etc.
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
});
