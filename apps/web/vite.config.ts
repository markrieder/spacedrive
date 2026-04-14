import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		dedupe: ["react", "react-dom"],
		alias: [
			{
				find: /^react$/,
				replacement: path.resolve(__dirname, "./node_modules/react/index.js"),
			},
			{
				find: /^react\/jsx-runtime$/,
				replacement: path.resolve(__dirname, "./node_modules/react/jsx-runtime.js"),
			},
			{
				find: /^react\/jsx-dev-runtime$/,
				replacement: path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime.js"),
			},
			{
				find: /^react-dom$/,
				replacement: path.resolve(__dirname, "./node_modules/react-dom/index.js"),
			},
			{
				find: /^react-dom\/client$/,
				replacement: path.resolve(__dirname, "./node_modules/react-dom/client.js"),
			},
			{
				find: "@spacedrive/tokens",
				replacement: path.resolve(
					__dirname,
					"../../../spaceui/packages/tokens",
				),
			},
			{
				find: "@spacedrive/ai",
				replacement: path.resolve(
					__dirname,
					"../../../spaceui/packages/ai/src/index.ts",
				),
			},
			{
				find: "@spacedrive/primitives",
				replacement: path.resolve(
					__dirname,
					"../../../spaceui/packages/primitives/src/index.ts",
				),
			},
			{
				find: "@spacebot/api-client",
				replacement: path.resolve(
					__dirname,
					"../../../spacebot/packages/api-client/src",
				),
			},
			{
				find: "@sd/interface",
				replacement: path.resolve(__dirname, "../../packages/interface/src"),
			},
			{
				find: "@sd/ts-client",
				replacement: path.resolve(__dirname, "../../packages/ts-client/src"),
			},
			{
				find: "openapi-fetch",
				replacement: path.resolve(
					__dirname,
					"../../packages/interface/node_modules/openapi-fetch/dist/index.mjs",
				),
			},
		],
	},
	server: {
		port: 3000,
		fs: {
			allow: [
				path.resolve(__dirname, "../../.."),
				path.resolve(__dirname, "../../../spaceui"),
			],
		},
		proxy: {
			// Proxy RPC requests to server
			"/rpc": {
				target: "http://localhost:8080",
				changeOrigin: true,
			},
		},
	},
	optimizeDeps: {
		exclude: ["@spacedrive/ai", "@spacedrive/primitives", "@spacedrive/tokens"],
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: true,
	},
});
