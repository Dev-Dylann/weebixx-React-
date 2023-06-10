import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import historyApiFallback from "connect-history-api-fallback";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    middleware: [historyApiFallback()],
  },
  base: "/",
  ssr: false,
});
