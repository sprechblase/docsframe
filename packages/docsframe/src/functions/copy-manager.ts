import fs from "fs-extra";
import path from "node:path";
import { z } from "zod";

const CopyComponentPropsSchema = z.object({
  dir: z.string().min(1),
  component: z.string().min(1),
});

const CopyTemplatesPropsSchema = z.object({
  dir: z.string().min(1),
});

export type CopyComponentProps = z.infer<typeof CopyComponentPropsSchema>;
export type CopyTemplatesProps = z.infer<typeof CopyTemplatesPropsSchema>;

async function component({ dir, component }: CopyComponentProps) {
  const validatedOptions = CopyComponentPropsSchema.parse({ dir, component });

  const componentPath = path.join(
    __dirname,
    "..",
    "templates",
    "components",
    "docsframe",
    `${validatedOptions.component}.tsx`
  );

  await fs.copyFile(componentPath, validatedOptions.dir);
}

async function template({ dir }: CopyTemplatesProps) {
  const validatedOptions = CopyTemplatesPropsSchema.parse({ dir });

  const templatePath = path.join(__dirname, "..", "templates", "init");
  await fs.copy(templatePath, validatedOptions.dir);
}

export const copyManager = {
  component,
  template,
} as const;
