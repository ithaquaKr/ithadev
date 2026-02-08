import { getCollection } from "astro:content";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type SubstackPost = {
	id: string;
	data: {
		title: string;
		description: string;
		date: Date;
		externalUrl: string;
	};
};

export async function getAllPosts(): Promise<SubstackPost[]> {
	const posts = (await getCollection("substack")).map((post) => ({
		id: post.id,
		data: {
			title: post.data.title,
			description: post.data.description,
			date: post.data.date,
			externalUrl: post.data.externalUrl,
		},
	}));

	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
	const startMonth = startDate.toLocaleString("default", { month: "short" });
	const startYear = startDate.getFullYear().toString();
	let endMonth = "";
	let endYear = "";

	if (endDate) {
		if (typeof endDate === "string") {
			endMonth = "";
			endYear = endDate;
		} else {
			endMonth = endDate.toLocaleString("default", { month: "short" });
			endYear = endDate.getFullYear().toString();
		}
	}

	return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
}
