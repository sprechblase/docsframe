import { promises as fs } from "fs";
import path from "path";
import { SidebarNavItem } from "@/types/index";

export interface DocsConfig {
  sidebarNav: SidebarNavItem[];
}

interface DocsframeItem {
  title: string;
  href: string;
  disabled?: boolean;
  label?: string;
}

interface DocsframeData {
  docsConfig: {
    title: string;
    items: DocsframeItem[];
  };
}

export async function getDocsConfig(): Promise<DocsConfig> {
  const filePath = path.join(process.cwd(), "docsframe.json");
  const docsframeJson = await fs.readFile(filePath, "utf8");

  const docsframeData: DocsframeData = JSON.parse(docsframeJson);

  if (!docsframeData.docsConfig) {
    throw new Error("Invalid docsframe.json: Missing 'docsConfig'");
  }

  const { title, items } = docsframeData.docsConfig;

  const sidebarNav: SidebarNavItem[] = [
    {
      title,
      items: items.map(({ title, href, disabled = false, label = null }) => ({
        title,
        href,
        disabled,
        label,
      })),
    },
  ];

  return { sidebarNav };
}
