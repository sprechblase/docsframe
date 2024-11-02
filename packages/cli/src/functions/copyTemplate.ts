import fs from "fs-extra";
import path from "node:path";

interface CopyTemplatesProps {
  dir: string;
}

const template = path.join(__dirname, "..", "template");

export async function copyTemplates({ dir }: CopyTemplatesProps) {
  await fs.copy(template, dir);
}
