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
  skipDeps: z.boolean(),
});

const componentDataSchema = z.object({
  name: z.string(),
  exports: z.array(z.string()),
  dependencies: z.array(z.string()),
});

type AddOptions = z.infer<typeof addOptionsSchema>;
type ComponentData = z.infer<typeof componentDataSchema>;

async function loadComponentsJson(filePath: string): Promise<ComponentData[]> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`components.json file not found at ${filePath}.`);
  }
  return await fs.readJson(filePath);
}

async function updateMdxComponents(
  mdxFilePath: string,
  componentName: string,
  exports: ComponentData["exports"]
): Promise<void> {
  try {
    let mdxComponents = await fs.readFile(mdxFilePath, "utf8");

    const importRegex = new RegExp(
      `import\\s*{[^}]*}\\s*from\\s*['"]\\.\\/${componentName}['"]`
    );
    if (importRegex.test(mdxComponents)) {
      log.info(
        `Component ${componentName} is already imported in mdx-components.tsx`
      );
      return;
    }

    const importStatement = `import { ${exports.join(", ")} } from "./${componentName}";\n`;
    const importSection =
      mdxComponents.match(/^import.*?\n(?:import.*?\n)*/m)?.[0] || "";
    mdxComponents = mdxComponents.replace(
      importSection,
      importSection + importStatement
    );

    const componentsObjectPattern = /const\s+components\s*=\s*{([\s\S]*?)};/;
    const match = mdxComponents.match(componentsObjectPattern);
    if (!match) {
      throw new Error(
        "Invalid mdx-components.tsx format: components object not found"
      );
    }

    const existingIndent = match[1].match(/^\n?(\s+)/m)?.[1] || "  ";
    const formattedExports = exports
      .map((exp) => `${existingIndent}${exp}`)
      .join(",\n");

    mdxComponents = mdxComponents.replace(
      componentsObjectPattern,
      (match, insideComponents) => {
        const hasTrailingComma = insideComponents.trim().endsWith(",");
        return `const components = {${insideComponents.trim()}${hasTrailingComma ? "" : ","}
${formattedExports}
};`;
      }
    );

    await fs.writeFile(mdxFilePath, mdxComponents, "utf8");
  } catch (error) {
    throw new Error(
      `Failed to update MDX components: ${(error as Error).message}`
    );
  }
}

async function handleComponentAddition(
  componentData: ComponentData,
  cwd: AddOptions["cwd"],
  overwrite: AddOptions["overwrite"],
  skipDeps: AddOptions["skipDeps"]
): Promise<boolean> {
  const destinationPath = cwd === process.cwd()
    ? path.join(cwd, "components", "docsframe", `${componentData.name}.tsx`)
    : path.join(cwd, `${componentData.name}.tsx`);

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
      component: componentData.name,
    });

    const mdxFilePath = path.join(
      path.dirname(destinationPath),
      "mdx-components.tsx"
    );

    if (await fs.pathExists(mdxFilePath)) {
      await updateMdxComponents(
        mdxFilePath,
        componentData.name,
        componentData.exports
      );
    } else {
      log.warn(`MDX components file not found at ${mdxFilePath}`);
    }

    if (componentData.dependencies.length > 0 && !skipDeps) {
      try {
        await packageManager.installComponent({
          dir: cwd,
          stdio: "inherit",
          deps: componentData.dependencies,
        });
      } catch (error) {
        log.warn(
          `Failed to install dependencies for ${componentData.name}: ${(error as Error).message}`
        );
      }
    }

    return true;
  } catch (error) {
    log.error(
      `Failed to add component ${componentData.name}: ${(error as Error).message}`
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
          componentData,
          cwd,
          options.overwrite,
          options.skipDeps
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
