import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writings = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writings" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		draft: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		draft: z.boolean().optional(),
		demoURL: z.string().optional(),
		repoURL: z.string().optional(),
	}),
});

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

export const collections = { writings, projects, works, educations };
