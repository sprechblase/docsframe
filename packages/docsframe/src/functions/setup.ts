import fs from "fs-extra";
import path from "node:path";
import { z } from "zod";

const setupPropsSchema = z.object({
  contributionOwner: z.string(),
  contributionRepo: z.string(),
  dir: z.string().min(1),
});

const docsframeConfigSchema = z.object({
  contribution: z.object({
    owner: z.string(),
    repo: z.string(),
  }),
  docsConfig: z.object({
    categories: z.array(
      z.object({
        title: z.string(),
        items: z.array(
          z.object({
            title: z.string(),
            href: z.string(),
          })
        ),
      })
    ),
  }),
});

type SetupProps = z.infer<typeof setupPropsSchema>;
type DocsframeConfig = z.infer<typeof docsframeConfigSchema>;

export async function setup(props: SetupProps) {
  try {
    const validatedProps = setupPropsSchema.parse(props);
    const { dir } = validatedProps;

    try {
      await fs.access(dir, fs.constants.W_OK);
    } catch {
      throw new Error(`Directory ${dir} does not exist or is not writable`);
    }

    await fs.ensureDir(dir);

    const results = await Promise.allSettled([
      createDocsframeJson(validatedProps),
      updateTsconfig(dir),
      updateNextConfig(dir),
      updateGlobalStyles(dir),
      updateReadMe(dir),
    ]);

    const failures = results.filter(
      (result): result is PromiseRejectedResult => result.status === "rejected"
    );

    if (failures.length > 0) {
      console.warn("Some operations failed:");
      failures.forEach((failure) => console.error(failure.reason));

      const criticalFailures = failures.length === results.length;
      if (criticalFailures) {
        throw new Error("All setup operations failed");
      }
    }

    console.log(
      "Setup completed with",
      results.length - failures.length,
      "successful and",
      failures.length,
      "failed operations"
    );
  } catch (error) {
    console.error("Setup failed:", error);
    throw error;
  }
}

// createDocsframeJson
async function createDocsframeJson(props: SetupProps): Promise<void> {
  const { dir, contributionOwner, contributionRepo } = props;
  const docsframeJsonPath = path.join(dir, "docsframe.json");

  if (await fs.pathExists(docsframeJsonPath)) {
    const existingConfig = await fs.readJson(docsframeJsonPath);
    try {
      docsframeConfigSchema.parse(existingConfig);
      console.log("Valid docsframe.json already exists, skipping creation");
      return;
    } catch {
      console.log("Existing docsframe.json is invalid, creating new one");
    }
  }

  const docsframeJson: DocsframeConfig = {
    contribution: {
      owner: contributionOwner,
      repo: contributionRepo,
    },
    docsConfig: {
      categories: [
        {
          title: "Getting Started",
          items: [
            {
              title: "Introduction",
              href: "/docs",
            },
          ],
        },
      ],
    },
  };

  docsframeConfigSchema.parse(docsframeJson);

  await fs.writeFile(
    docsframeJsonPath,
    JSON.stringify(docsframeJson, null, 2),
    "utf8"
  );
}

// updateTsconfig
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

  try {
    const config = await fs.readJson(configPath);

    config.compilerOptions = config.compilerOptions || {};
    config.compilerOptions.paths = config.compilerOptions.paths || {};

    if (config.compilerOptions.paths["content-collections"]) {
      console.log("content-collections path already configured, skipping");
      return;
    }

    config.compilerOptions.paths["content-collections"] = [
      "./.content-collections/generated",
    ];

    await fs.writeJson(configPath, config, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to update ${configPath}: ${error}`);
  }
}

// updateNextConfig
async function updateNextConfig(dir: string): Promise<void> {
  const files = await fs.readdir(dir);
  const nextConfigFile = files.find((file) => file.startsWith("next.config"));
  if (!nextConfigFile) {
    throw new Error(
      `No Next.js config file found (expected a file starting with 'next.config' in ${dir})`
    );
  }
  const nextConfigPath = path.join(dir, nextConfigFile);

  let content = await fs.readFile(nextConfigPath, "utf8");

  if (
    content.includes("withContentCollections") &&
    content.includes("export default withContentCollections(")
  ) {
    console.log("Next.js config already configured, skipping");
    return;
  }

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

// updateGlobalStyles
async function updateGlobalStyles(dir: string): Promise<void> {
  const globalsCssPath = path.join(dir, "app", "globals.css");

  if (!(await fs.pathExists(globalsCssPath))) {
    throw new Error("globals.css not found in app directory");
  }

  const existingContent = await fs.readFile(globalsCssPath, "utf8");

  if (existingContent.includes(".step {")) {
    console.log("Global styles already configured, skipping");
    return;
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

  await fs.appendFile(globalsCssPath, `\n${additionalStyles}`, "utf8");
}

// updateReadMe
async function updateReadMe(dir: string): Promise<void> {
  const readMePath = path.join(dir, "README.md");

  if (!(await fs.pathExists(readMePath))) {
    console.warn("README.md not found");
    return;
  }

  const readMeAddition = `
## You've added Docsframe

Thank you for adding Docsframe to your project!
To learn more about Docsframe and how to configure it, please refer to the following resources:

- [Docsframe Documentation](https://docsframe.work/docs) - learn more about Docsframe`;

  const existingContent = await fs.readFile(readMePath, "utf8");

  await fs.writeFile(
    readMePath,
    `${readMeAddition}\n${existingContent}`,
    "utf8"
  );
}
