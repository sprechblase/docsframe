import { Command } from "commander";
import { z } from "zod";
import path from "node:path";
import fs from "fs-extra";
import { copyComponent } from "../functions/copyComponent";
import { confirm, spinner, log, outro } from "@clack/prompts";
import color from "picocolors";
import { installComponentDeps } from "../functions/installDeps";

export const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  overwrite: z.boolean(),
  cwd: z.string(),
});

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
    const s = spinner();

    try {
      const options = addOptionsSchema.parse({
        components,
        ...opts,
      });

      const cwd = path.resolve(options.cwd);

      if (!fs.existsSync(cwd)) {
        log.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      if (!options.components || options.components.length === 0) {
        log.error("No component specified.");
        return;
      }

      const componentsFilePath = path.join(
        __dirname,
        "..",
        "templates",
        "components",
        "components.json"
      );
      if (!fs.existsSync(componentsFilePath)) {
        log.error("components.json file not found.");
        process.exit(1);
      }
      const componentsJson = await fs.readJson(componentsFilePath);

      // Checking for components
      await s.start("Checking for components.");

      const missingComponents = [];

      for (const componentName of options.components) {
        const componentData = componentsJson.find(
          (comp: any) => comp.name === componentName
        );

        if (componentData) {
          const destinationPath = path.join(
            cwd,
            "components",
            "docsframe",
            `${componentName}.tsx`
          );

          if (!options.overwrite && (await fs.pathExists(destinationPath))) {
            const overwriteFile = await confirm({
              message: `The file ${color.cyan(
                `${destinationPath}`
              )} already exists. Would you like to overwrite?`,
            });
            if (!overwriteFile) return;
          }

          try {
            await copyComponent({
              dir: destinationPath,
              component: componentName,
            });

            let mdxComponents = await fs.readFile(
              path.join(path.dirname(destinationPath), "mdx-components.tsx"),
              "utf8"
            );

            const { exports } = componentData;
            const importStatement = `import { ${exports.join(", ")} } from "./${componentName}";\n`;
            const componentEntries = exports.join(",\n ");

            if (!mdxComponents.includes(importStatement)) {
              mdxComponents = importStatement + mdxComponents;

              const componentsObjectPattern =
                /const components = {([\s\S]*?)};/;
              mdxComponents = mdxComponents.replace(
                componentsObjectPattern,
                (match, insideComponents) => {
                  return `const components = {${insideComponents} ${componentEntries},\n};`;
                }
              );

              await fs.writeFile(
                path.join(path.dirname(destinationPath), "mdx-components.tsx"),
                mdxComponents,
                "utf8"
              );
            }
          } catch (error) {
            console.log(error);
          }

          // Installing dependencies
          await s.message("Installing component dependencies.");

          if (componentData.dependencies.length > 0) {
            await installComponentDeps({
              manager: "npm",
              dir: cwd,
              deps: componentData.dependencies,
              stdio: "inherit",
            });
          }

          await s.stop("Component dependencies installed.");
        } else {
          missingComponents.push(componentName);
        }
      }

      if (missingComponents.length > 0) {
        log.warn(
          `The following components do not exist: ${missingComponents.join(", ")}`
        );
      }

      await outro("You're all set");
      process.exit(1);
    } catch (error) {
      console.log("Error while setting up the Docsframe Component.");
      process.exit(1);
    }
  });
