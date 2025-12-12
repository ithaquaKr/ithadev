import type { MenuItem, Metadata, Site, Socials } from "@types";

export const SITE: Site = {
	TITLE: "@ithaqua'kr",
	DESCRIPTION: "Personal space to share everything.",
	EMAIL: "ithadev.nguyen@gmail.com",
	NUM_POSTS_ON_HOMEPAGE: 2,
	NUM_WORKS_ON_HOMEPAGE: 1,
	NUM_PROJECTS_ON_HOMEPAGE: 3,
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

export const PROJECTS: Metadata = {
	TITLE: "projects",
	DESCRIPTION:
		"A collection of my projects, with links to repositories and demos.",
};

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

export const MENU_ITEMS: MenuItem[] = [
	{
		label: "@ithaqua'kr",
		url: "/",
	},
	{
		label: "writing",
		url: "/writing",
	},
	// TODO: Add path when project is ready
	// {
	//   label: "projects",
	//   url: "/projects",
	// },
];
