import fs from "fs-extra";
import path from "node:path";

interface SetupProps {
  contributionOwner: string;
  contributionRepo: string;
  dir: string;
}

interface DocsframeConfig {
  contribution: {
    owner: string;
    repo: string;
  };
  docsConfig: {
    title: string;
    items: Array<{
      title: string;
      href: string;
    }>;
  };
}

export async function setup({
  contributionOwner,
  contributionRepo,
  dir,
}: SetupProps) {
  try {
    if (!dir) {
      throw new Error("Missing required setup parameters");
    }

    await fs.ensureDir(dir);

    await Promise.all([
      createDocsframeJson({ contributionOwner, contributionRepo, dir }).catch(
        (error) => console.error("Failed to create docsframe.json:", error)
      ),

      updateTsconfig(dir).catch((error) =>
        console.error("Failed to update tsconfig:", error)
      ),

      updateNextConfig(dir).catch((error) =>
        console.error("Failed to update next.config:", error)
      ),

      appendGlobalStyles(dir).catch((error) =>
        console.error("Failed to update global styles:", error)
      ),
    ]);

    console.log("Setup completed successfully");
  } catch (error) {
    console.error("Setup failed:", error);
    throw error;
  }
}

async function createDocsframeJson({
  contributionOwner,
  contributionRepo,
  dir,
}: SetupProps): Promise<void> {
  const docsframeJsonPath = path.join(dir, "docsframe.json");

  const docsframeJson: DocsframeConfig = {
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

  await fs.writeFile(
    docsframeJsonPath,
    JSON.stringify(docsframeJson, null, 2),
    "utf8"
  );
}

async function updateTsconfig(dir: string): Promise<void> {
  const tsconfigPath = path.join(dir, "tsconfig.json");
  const jsconfigPath = path.join(dir, "jsconfig.json");

  const configPath = (await fs.pathExists(tsconfigPath))
    ? tsconfigPath
    : (await fs.pathExists(jsconfigPath))
      ? jsconfigPath
      : null;

  if (!configPath) {
    throw new Error("Neither tsconfig.json nor jsconfig.json found");
  }

  const config = await fs.readJSON(configPath);

  config.compilerOptions = config.compilerOptions || {};
  config.compilerOptions.paths = config.compilerOptions.paths || {};

  config.compilerOptions.paths["content-collections"] = [
    "./.content-collections/generated",
  ];

  await fs.writeJSON(configPath, config, { spaces: 2 });
}

async function updateNextConfig(dir: string): Promise<void> {
  const nextConfigPath = path.join(dir, "next.config.mjs");

  if (!(await fs.pathExists(nextConfigPath))) {
    throw new Error("next.config.mjs not found");
  }

  let content = await fs.readFile(nextConfigPath, "utf8");

  if (!content.includes("withContentCollections")) {
    content = `import { withContentCollections } from "@content-collections/next";\n${content}`;
  }

  if (!content.includes("export default withContentCollections(")) {
    content = content.replace(
      /export default (\w+);?/,
      "export default withContentCollections($1);"
    );
  }

  await fs.writeFile(nextConfigPath, content, "utf8");
}

async function appendGlobalStyles(dir: string): Promise<void> {
  const globalsCssPath = path.join(dir, "app", "globals.css");

  if (!(await fs.pathExists(globalsCssPath))) {
    throw new Error("globals.css not found");
  }

  const additionalStyles = `
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

  const existingContent = await fs.readFile(globalsCssPath, "utf8");

  if (!existingContent.includes(".step {")) {
    await fs.appendFile(globalsCssPath, `\n${additionalStyles}`, "utf8");
  }
}
