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

const componentDataSchema = z.object({
  name: z.string(),
  exports: z.array(z.string()),
  dependencies: z.array(z.string()),
});

type ComponentData = z.infer<typeof componentDataSchema>;

async function loadComponentsJson(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`components.json file not found at ${filePath}.`);
  }
  return await fs.readJson(filePath);
}

async function updateMdxComponents(
  mdxFilePath: string,
  componentName: string,
  exports: string[]
): Promise<void> {
  try {
    let mdxComponents = await fs.readFile(mdxFilePath, "utf8");
    const importStatement = `import { ${exports.join(", ")} } from "./${componentName}";\n`;

    if (mdxComponents.includes(`from "./${componentName}"`)) {
      log.info(
        `Component ${componentName} is already imported in mdx-components.tsx`
      );
      return;
    }

    mdxComponents = importStatement + mdxComponents;

    const componentsObjectPattern = /const components = {([\s\S]*?)};/;
    if (!componentsObjectPattern.test(mdxComponents)) {
      throw new Error("Invalid mdx-components.tsx format");
    }

    mdxComponents = mdxComponents.replace(
      componentsObjectPattern,
      (match, insideComponents) =>
        `const components = {${insideComponents} ${exports.join(",\n ")},\n};`
    );

    await fs.writeFile(mdxFilePath, mdxComponents, "utf8");
  } catch (error) {
    throw new Error(
      `Failed to update MDX components: ${(error as Error).message}`
    );
  }
}

async function handleComponentAddition(
  componentName: string,
  componentData: ComponentData,
  cwd: string,
  overwrite: boolean
): Promise<boolean> {
  const destinationPath = path.join(
    cwd,
    "components",
    "docsframe",
    `${componentName}.tsx`
  );

  try {
    await fs.ensureDir(path.dirname(destinationPath));

    if (!overwrite && (await fs.pathExists(destinationPath))) {
      const shouldOverwrite = await confirm({
        message: `The file ${color.cyan(destinationPath)} already exists. Would you like to overwrite?`,
      });
      if (!shouldOverwrite) return false;
    }

    await copyManager.component({
      dir: destinationPath,
      component: componentName,
    });

    const mdxFilePath = path.join(
      path.dirname(destinationPath),
      "mdx-components.tsx"
    );

    if (await fs.pathExists(mdxFilePath)) {
      await updateMdxComponents(
        mdxFilePath,
        componentName,
        componentData.exports
      );
    } else {
      log.warn(`MDX components file not found at ${mdxFilePath}`);
    }

    if (componentData.dependencies.length > 0) {
      try {
        await packageManager.installComponent({
          dir: cwd,
          stdio: "inherit",
          deps: componentData.dependencies,
        });
      } catch (error) {
        log.warn(
          `Failed to install dependencies for ${componentName}: ${(error as Error).message}`
        );
      }
    }

    return true;
  } catch (error) {
    log.error(
      `Failed to add component ${componentName}: ${(error as Error).message}`
    );
    return false;
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
  .option("--skip-deps", "skip dependency installation", false)
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
      const successfulComponents: string[] = [];
      const failedComponents: string[] = [];
      const skippedComponents: string[] = [];

      for (const componentName of options.components) {
        const componentData = componentsJson.find(
          (comp: ComponentData) => comp.name === componentName
        );

        if (!componentData) {
          skippedComponents.push(componentName);
          continue;
        }

        const success = await handleComponentAddition(
          componentName,
          componentData,
          cwd,
          options.overwrite
        );

        if (success) {
          successfulComponents.push(componentName);
        } else {
          failedComponents.push(componentName);
        }
      }

      if (successfulComponents.length > 0) {
        log.success(`Successfully added: ${successfulComponents.join(", ")}`);
      }
      if (failedComponents.length > 0) {
        log.error(`Failed to add: ${failedComponents.join(", ")}`);
      }
      if (skippedComponents.length > 0) {
        log.warn(
          `Skipped non-existent components: ${skippedComponents.join(", ")}`
        );
      }

      await outro(
        successfulComponents.length > 0
          ? "Components added successfully."
          : "No components were added."
      );
    } catch (error) {
      log.error(`Installation failed: ${(error as Error).message}`);
      process.exit(1);
    }
  });
