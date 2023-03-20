import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		outDir: path.resolve(__dirname, "dist"),
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "text-replace",
			formats: ["cjs", "es"],
			fileName: "text-replace",
		},
		sourcemap: false,
		minify: "terser",
		rollupOptions: {
			output: {
				exports: "named",
			},
			external: (id) => id.includes("test"),
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
			"@/helpers": path.resolve(__dirname, "src/helpers"),
			"@/models": path.resolve(__dirname, "src/models"),
		},
	},
});
