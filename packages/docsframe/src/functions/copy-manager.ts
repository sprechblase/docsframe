import fs from "fs-extra";
import path from "node:path";
import { z } from "zod";

const CopyComponentPropsSchema = z.object({
  dir: z.string(),
  component: z.string(),
});

const CopyTemplatesPropsSchema = z.object({
  dir: z.string(),
});

export type CopyComponentProps = z.infer<typeof CopyComponentPropsSchema>;
export type CopyTemplatesProps = z.infer<typeof CopyTemplatesPropsSchema>;

async function component(options: CopyComponentProps) {
  const validatedOptions = CopyComponentPropsSchema.parse(options);
  const { dir, component } = validatedOptions;

  const componentPath = path.join(
    __dirname,
    "..",
    "templates",
    "components",
    "docsframe",
    `${component}.tsx`
  );

  await fs.copyFile(componentPath, dir);
}

async function template(options: CopyTemplatesProps) {
  const validatedOptions = CopyTemplatesPropsSchema.parse(options);
  const { dir } = validatedOptions;

  const templatePath = path.join(__dirname, "..", "templates", "init");

  await fs.copy(templatePath, dir);
}

export const copyManager = {
  component,
  template,
};
