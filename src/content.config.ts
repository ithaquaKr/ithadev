import { defineCollection, z } from "astro:content";
import { SUBSTACK_FEED_URL } from "@consts";
import { substackLoader } from "@lib/substack-loader";
import { glob } from "astro/loaders";

const works = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/works" }),
	schema: z.object({
		company: z.string(),
		role: z.string(),
		dateStart: z.coerce.date(),
		dateEnd: z.union([z.coerce.date(), z.string()]),
	}),
});

const educations = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/educations" }),
	schema: z.object({
		university: z.string(),
		major: z.string(),
		dateStart: z.coerce.date(),
		dateEnd: z.union([z.coerce.date(), z.string()]),
	}),
});

const substack = defineCollection({
	loader: substackLoader({ url: SUBSTACK_FEED_URL }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		externalUrl: z.string(),
	}),
});

export const collections = { works, educations, substack };
