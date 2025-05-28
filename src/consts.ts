import type { MenuItem, Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "@ithadev",
  DESCRIPTION: "@ithadev is my blog",
  EMAIL: "ithadev.nguyen@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 2,
  NUM_WORKS_ON_HOMEPAGE: 1,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "My personal blog and portfolio.",
};

export const WRITINGS: Metadata = {
  TITLE: "Writings",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
  {
    NAME: "twitter-x",
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
    label: SITE.TITLE,
    url: "/",
  },
  {
    label: "writings",
    url: "/writings",
  },
  {
    label: "projects",
    url: "/projects",
  },
  {
    label: "tags",
    url: "/tags",
  },
];
