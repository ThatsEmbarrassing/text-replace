import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	esbuild: {
		treeShaking: true,
	},
	build: {
		outDir: path.resolve(__dirname, "dist"),
		lib: {
			entry: {
				index: path.resolve(__dirname, "src/index.ts"),
				errors: path.resolve(__dirname, "src/errors/CustomErrors/index.ts"),
				"error-handlers": path.resolve(__dirname, "src/errors/ErrorHandlers/index.ts"),
			},
			name: "text-replace",
			fileName: "[name]",
			formats: ["cjs"]
		},
		minify: "esbuild",
		sourcemap: false,
		rollupOptions: {
			output: {
				exports: "named",
				assetFileNames: "[name].[ext]",
				chunkFileNames: "chunks/[name].[format].js",
			},
			treeshake: true,
		},
	},
	plugins: [
		dts({
			insertTypesEntry: true,
			copyDtsFiles: true,
			outputDir: path.resolve(__dirname, "dist/types"),
			clearPureImport: true,
			tsConfigFilePath: path.resolve(__dirname, "./tsconfig.json"),
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"@errors/custom": path.resolve(__dirname, "src/errors/CustomErrors"),
			"@errors/hanlders": path.resolve(__dirname, "src/errors/ErrorHandlers"),
		},
	},
});
