import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE } from "@consts";

export async function GET(context) {
	const writings = (await getCollection("writings()")).filter(
		(post) => !post.data.draft,
	);

	const projects = (await getCollection("projects")).filter(
		(project) => !project.data.draft,
	);

	const items = [...writings, ...projects].sort(
		(a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
	);

	return rss({
		title: SITE.TITLE,
		description: SITE.DESCRIPTION,
		site: context.site,
		items: items.map((item) => ({
			title: item.data.title,
			description: item.data.description,
			pubDate: item.data.date,
			link: `/${item.collection}/${item.id}/`,
		})),
	});
}
