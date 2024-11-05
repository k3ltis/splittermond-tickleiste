import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import svg from "vite-plugin-svelte-svg"
import pkg from "./package.json"

export default defineConfig({
	plugins: [sveltekit(), svg()],

	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"]
	},

	define: {
		__APP_NAME__: JSON.stringify(pkg.name),
		__APP_VERSION__: JSON.stringify(pkg.version),
	}
});
