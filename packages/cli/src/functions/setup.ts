import fs from "fs-extra";
import path from "node:path";

interface SetupProps {
  contributionOwner: string;
  contributionRepo: string;
  dir: string;
}

export async function setup({
  contributionOwner,
  contributionRepo,
  dir,
}: SetupProps) {
  const docsframeJsonPath = path.join(dir, "docsframe.json");

  const docsframeJson = {
    contribution: {
      owner: contributionOwner,
      repo: contributionRepo,
    },
    docsConfig: {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
      ],
    },
  };

  await fs.writeFileSync(docsframeJsonPath, JSON.stringify(docsframeJson));
}
