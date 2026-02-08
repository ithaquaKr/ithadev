import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
	TITLE: "@ithaqua'kr",
	DESCRIPTION: "Personal space to share everything.",
	EMAIL: "ithadev.nguyen@gmail.com",
	NUM_POSTS_ON_HOMEPAGE: 2,
};

export const HOME: Metadata = {
	TITLE: "Itha's Space",
	DESCRIPTION: "Personal space to share everything.",
};

export const ABOUT: Metadata = {
	TITLE: "About",
	DESCRIPTION: "About me, my work, and my interests.",
};

export const WRITING: Metadata = {
	TITLE: "Writing",
	DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const WORK: Metadata = {
	TITLE: "Works",
	DESCRIPTION: "Where I have worked and what I have done.",
};

export const SUBSTACK_FEED_URL = "https://ithaquakr.substack.com/feed";

export const SOCIALS: Socials = [
	{
		NAME: "@x",
		HREF: "https://twitter.com/ithadev_ng",
	},
	{
		NAME: "github",
		HREF: "https://github.com/ithaquaKr",
	},
	{
		NAME: "linkedin",
		HREF: "https://www.linkedin.com/in/tuanhiep201",
	},
];
