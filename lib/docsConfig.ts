import { SidebarNavItem, NavItem } from "@/types/index";
import { cache } from "react";

export interface DocsConfig {
  sidebarNav: SidebarNavItem[];
}

interface DocsframeCategory {
  title: string;
  items: NavItem[];
}

interface DocsframeData {
  docsConfig: {
    categories: DocsframeCategory[];
  };
}

export const getDocsConfig = cache(async () => {
  try {
    const docsframeData: DocsframeData = await import("../docsframe.json");

    if (!docsframeData.docsConfig) {
      throw new Error("Invalid docsframe.json: Missing 'docsConfig'");
    }

    const { categories } = docsframeData.docsConfig;
    const sidebarNav: SidebarNavItem[] = categories.map(({ title, items }) => ({
      title,
      items: items.map(
        ({ title, href, disabled = false, label = undefined }) => ({
          title,
          href,
          disabled,
          label,
        })
      ),
    }));

    return { sidebarNav };
  } catch (error) {
    console.error("Error loading docs configuration:", error);
    return { sidebarNav: [] };
  }
});

export async function fetchDocsConfig() {
  return await getDocsConfig();
}
