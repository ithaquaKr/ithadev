import type { Loader } from "astro/loaders";

export function substackLoader(options: { url: string }): Loader {
	return {
		name: "substack-loader",
		load: async ({ store, logger, parseData }) => {
			logger.info("Fetching Substack RSS feed");

			let xml: string;
			try {
				const response = await fetch(options.url);
				if (!response.ok) {
					logger.warn(
						`Failed to fetch Substack feed: ${response.status} ${response.statusText}`,
					);
					return;
				}
				xml = await response.text();
			} catch (error) {
				logger.warn(`Failed to fetch Substack feed: ${error}`);
				return;
			}

			const items = parseRssItems(xml);
			logger.info(`Found ${items.length} Substack posts`);

			store.clear();

			for (const item of items) {
				const slug = extractSlug(item.link);
				if (!slug) continue;

				const data = await parseData({
					id: slug,
					data: {
						title: item.title,
						description: item.description,
						date: new Date(item.pubDate),
						externalUrl: item.link,
					},
				});

				store.set({ id: slug, data });
			}
		},
	};
}

interface RssItem {
	title: string;
	link: string;
	description: string;
	pubDate: string;
}

function parseRssItems(xml: string): RssItem[] {
	const items: RssItem[] = [];
	const itemRegex = /<item>([\s\S]*?)<\/item>/g;

	for (const match of xml.matchAll(itemRegex)) {
		const itemXml = match[1];
		const title = getTagContent(itemXml, "title");
		const link = getTagContent(itemXml, "link");
		const description = getTagContent(itemXml, "description");
		const pubDate = getTagContent(itemXml, "pubDate");

		if (title && link && pubDate) {
			items.push({
				title,
				link,
				description: stripHtml(description || ""),
				pubDate,
			});
		}
	}

	return items;
}

function getTagContent(xml: string, tag: string): string | null {
	// Handle CDATA sections
	const cdataRegex = new RegExp(
		`<${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
	);
	const cdataMatch = cdataRegex.exec(xml);
	if (cdataMatch) return cdataMatch[1].trim();

	// Handle plain text content
	const plainRegex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
	const plainMatch = plainRegex.exec(xml);
	if (plainMatch) return plainMatch[1].trim();

	return null;
}

function stripHtml(html: string): string {
	return html
		.replace(/<[^>]+>/g, "")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, " ")
		.trim();
}

function extractSlug(url: string): string | null {
	try {
		const pathname = new URL(url).pathname;
		const match = /\/p\/(.+?)(?:\/|$)/.exec(pathname);
		return match ? match[1] : null;
	} catch {
		return null;
	}
}
