import { MainNavItem } from "@/types";

interface MainConfig {
  mainNav: MainNavItem[];
}

export const mainConfig: MainConfig = {
  mainNav: [
    {
      title: "Docs",
      href: "/docs",
    },
    {
      title: "Components",
      href: "/docs/components",
    },
  ],
};
