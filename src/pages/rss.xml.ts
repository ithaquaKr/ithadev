import rss from "@astrojs/rss";
import { SITE } from "@consts";
import { getAllPosts } from "@lib/utils";

type Context = {
	site: string;
};

export async function GET(context: Context) {
	const allPosts = await getAllPosts();

	return rss({
		title: SITE.TITLE,
		description: SITE.DESCRIPTION,
		site: context.site,
		items: allPosts.map((item) => ({
			title: item.data.title,
			description: item.data.description,
			pubDate: item.data.date,
			link: item.data.externalUrl,
		})),
	});
}
