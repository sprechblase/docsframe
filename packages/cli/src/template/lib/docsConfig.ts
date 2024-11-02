// docsConfig.ts
import { promises as fs } from "fs";
import { SidebarNavItem } from "@/types/index";

export interface DocsConfig {
  sidebarNav: SidebarNavItem[];
}

export async function getDocsConfig(): Promise<DocsConfig> {
  const docsframeJson = await fs.readFile(
    process.cwd() + "/docsframe.json",
    "utf8"
  );
  const docsframeData = JSON.parse(docsframeJson);

  return {
    sidebarNav: [
      {
        title: docsframeData.docsConfig.title,
        items: docsframeData.docsConfig.items.map(
          (item: { title: string; href: string }) => ({
            title: item.title,
            href: item.href,
          })
        ),
      },
    ],
  };
}
