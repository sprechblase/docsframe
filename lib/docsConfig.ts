import { promises as fs } from "fs";
import path from "path";
import { SidebarNavItem, NavItem } from "@/types/index";

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

export async function getDocsConfig(): Promise<DocsConfig> {
  const filePath = path.join(process.cwd(), "docsframe.json");
  const docsframeJson = await fs.readFile(filePath, "utf8");

  const docsframeData: DocsframeData = JSON.parse(docsframeJson);

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
}
