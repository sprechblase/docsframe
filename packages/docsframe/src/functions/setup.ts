import fs from "fs-extra";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

interface SetupProps {
  contributionOwner: string;
  contributionRepo: string;
  dir: string;
}

export async function setup(props: SetupProps) {
  const { dir } = props;
  try {
    await Promise.all([
      createDocsframeJson(props),
      await sleep(100),
      updateTsconfig(dir),
      await sleep(100),
      updateNextConfig(dir),
      await sleep(100),
      appendGlobalStyles(dir),
    ]);
  } catch (error) {}
}

async function createDocsframeJson({
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

  await fs.writeFile(docsframeJsonPath, JSON.stringify(docsframeJson, null, 2));
}

async function updateTsconfig(dir: string) {
  let configJsonPath = path.join(dir, "tsconfig.json");
  if (!(await fs.pathExists(configJsonPath)))
    configJsonPath = path.join(dir, "jsconfig.json");
  const configJson = await fs.readJSON(configJsonPath);

  configJson.compilerOptions = configJson.compilerOptions || {};
  configJson.compilerOptions.paths = configJson.compilerOptions.paths || {};

  configJson.compilerOptions.paths["content-collections"] = [
    "./.content-collections/generated",
  ];

  await fs.writeJSON(configJsonPath, configJson, { spaces: 2 });
}

async function updateNextConfig(dir: string) {
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

  await fs.writeFile(nextConfigPath, nextConfigContent);
}

async function appendGlobalStyles(dir: string) {
  const globalsCssPath = path.join(dir, "app", "globals.css");
  const additionalCss = `

@layer utilities {
  .step {
    counter-increment: step;
  }

  .step:before {
    @apply absolute inline-flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-muted text-center -indent-px font-mono text-base font-medium;
    @apply ml-[-50px] mt-[-4px];
    content: counter(step);
  }
}

@media (max-width: 640px) {
  .container {
    @apply px-4;
  }
}`;

  await fs.appendFile(globalsCssPath, additionalCss, "utf8");
}
