import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const isCJSFormat = (exports: string[]) => exports[0].length > 1;

export default defineConfig(({ mode }) => {
	return {
		mode,
		build: {
			outDir: path.resolve(__dirname, "dist"),
			lib: {
				entry: {
					index: path.resolve(__dirname, "src/index.ts"),
					errors: path.resolve(__dirname, "src/errors.ts"),
					"error-handlers": path.resolve(__dirname, "src/error-handlers.ts"),
				},
				name: "text-replace",
				fileName: "[format]/[name]",
				formats: ["cjs", "es"],
			},
			minify: "esbuild",
			sourcemap: false,
			rollupOptions: {
				output: {
					exports: "named",
					chunkFileNames({ exports }) {
						return isCJSFormat(exports) ? "[format]/chunks/[name].js" : "[format]/chunks/[name].mjs";
					},
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
	};
});
