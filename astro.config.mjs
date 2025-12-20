import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://space.itha.workers.dev",
	integrations: [mdx(), sitemap()],

	markdown: {
		shikiConfig: {
			theme: "css-variables",
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},

	adapter: cloudflare(),
});
