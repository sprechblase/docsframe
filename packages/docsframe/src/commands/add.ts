import { Command } from "commander";
import { z } from "zod";
import path from "node:path";
import fs from "fs-extra";
import { copyManager } from "../functions/copy-manager";
import { confirm, log, outro, multiselect } from "@clack/prompts";
import color from "picocolors";
import { packageManager } from "../functions/package-manager";

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  overwrite: z.boolean(),
  cwd: z.string(),
});

async function loadComponentsJson(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`components.json file not found at ${filePath}.`);
  }
  return await fs.readJson(filePath);
}

async function handleComponentAddition(
  componentName: string,
  componentData: any,
  cwd: string,
  overwrite: boolean
) {
  const destinationPath = path.join(
    cwd,
    "components",
    "docsframe",
    `${componentName}.tsx`
  );

  if (!overwrite && (await fs.pathExists(destinationPath))) {
    const shouldOverwrite = await confirm({
      message: `The file ${color.cyan(
        `${destinationPath}`
      )} already exists. Would you like to overwrite?`,
    });
    if (!shouldOverwrite) return;
  }

  await copyManager.component({
    dir: destinationPath,
    component: componentName,
  });

  const mdxFilePath = path.join(
    path.dirname(destinationPath),
    "mdx-components.tsx"
  );
  const { exports } = componentData;

  if (await fs.pathExists(mdxFilePath)) {
    let mdxComponents = await fs.readFile(mdxFilePath, "utf8");
    const importStatement = `import { ${exports.join(", ")} } from "./${componentName}";\n`;

    if (!mdxComponents.includes(importStatement)) {
      mdxComponents = importStatement + mdxComponents;

      const componentsObjectPattern = /const components = {([\s\S]*?)};/;
      mdxComponents = mdxComponents.replace(
        componentsObjectPattern,
        (match, insideComponents) =>
          `const components = {${insideComponents} ${exports.join(",\n ")},\n};`
      );

      await fs.writeFile(mdxFilePath, mdxComponents, "utf8");
    }
  }

  if (componentData.dependencies.length > 0) {
    await packageManager.installComponent({
      dir: cwd,
      stdio: "inherit",
      deps: componentData.dependencies,
    });
  }
}

export const add = new Command()
  .name("add")
  .description("add docsframe components to your documentation")
  .argument("[components...]", "the components to add")
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (components, opts) => {
    const componentsFilePath = path.join(
      __dirname,
      "..",
      "templates",
      "components",
      "components.json"
    );

    try {
      const options = addOptionsSchema.parse({ components, ...opts });
      const cwd = path.resolve(options.cwd);

      if (!fs.existsSync(cwd)) {
        log.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      const componentsJson = await loadComponentsJson(componentsFilePath);

      if (!options.components || options.components.length === 0) {
        const selectedComponents = (await multiselect({
          message: "Which components would you like to add?",
          options: componentsJson.map((comp: any) => ({
            label: comp.name,
            value: comp.name,
          })),
          required: true,
        })) as string[];

        if (!selectedComponents) {
          log.error("No components selected.");
          process.exit(1);
        }

        options.components = selectedComponents;
      }

      await log.step("Checking for components.");
      const missingComponents: string[] = [];

      for (const componentName of options.components) {
        const componentData = componentsJson.find(
          (comp: any) => comp.name === componentName
        );

        if (componentData) {
          await handleComponentAddition(
            componentName,
            componentData,
            cwd,
            options.overwrite
          );
        } else {
          missingComponents.push(componentName);
        }
      }

      if (missingComponents.length > 0) {
        log.warn(
          `The following components do not exist: ${missingComponents.join(", ")}`
        );
      }

      await outro("You're all set.");
    } catch (error: any) {
      log.error(error.message || "An unexpected error occurred.");
      process.exit(1);
    }
  });
