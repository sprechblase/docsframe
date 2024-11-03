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

  await fs.writeFileSync(
    docsframeJsonPath,
    JSON.stringify(docsframeJson, null, 2)
  );

  const tsconfigJsonPath = path.join(dir, "tsconfig.json");
  const tsconfigJson = await fs.readJSON(tsconfigJsonPath);
  const tsconfigContentCollections = {
    "content-collections": ["./.content-collections/generated"],
  };

  tsconfigJson.compilerOptions = tsconfigJson.compilerOptions || {};
  tsconfigJson.compilerOptions.paths = tsconfigJson.compilerOptions.paths || {};

  Object.assign(tsconfigJson.compilerOptions.paths, tsconfigContentCollections);

  await fs.writeJSON(tsconfigJsonPath, tsconfigJson, { spaces: 2 });

  const nextConfigPath = path.join(dir, "next.config.mjs");
  let nextConfigContent = await fs.readFile(nextConfigPath, "utf8");

  if (!nextConfigContent.includes("withContentCollections")) {
    nextConfigContent = `
  import { withContentCollections } from "@content-collections/next";
  ${nextConfigContent}
      `.trim();
  }

  if (!nextConfigContent.includes("export default withContentCollections(")) {
    nextConfigContent = nextConfigContent.replace(
      /export default nextConfig;/,
      "export default withContentCollections(nextConfig);"
    );
  }

  await fs.writeFileSync(nextConfigPath, nextConfigContent);
}
