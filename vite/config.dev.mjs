import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/arkanoid/",
    plugins: [react()],
    server: {
        port: 8080,
        host: true,
    },
    build: {
        outDir: "dist",
    },
});
