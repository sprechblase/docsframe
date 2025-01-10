import { SidebarNavItem, NavItem } from "@/types/index";

export interface DocsConfig {
  sidebarNav: SidebarNavItem[];
}

export interface DocsframeData {
  docsConfig: {
    categories: {
      title: string;
      items: NavItem[];
    }[];
  };
}

export interface DocsframeContribution {
  contribution: {
    owner: string;
    repo: string;
  };
}

export const getDocsConfig = async () => {
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
};

export const getContribution = async () => {
  try {
    const docsframeContribution: DocsframeContribution = await import(
      "../docsframe.json"
    );

    if (!docsframeContribution.contribution) {
      throw new Error("Invalid docsframe.json: Missing 'contribution'");
    }

    return docsframeContribution;
  } catch (error) {
    console.error("Error loading docs configuration:", error);
    return null;
  }
};
