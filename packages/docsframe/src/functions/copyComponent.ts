import fs from "fs-extra";
import path from "node:path";

interface CopyComponentProps {
  dir: string;
  component: string;
  extension?: string;
}

export async function copyComponent({
  dir,
  component,
  extension = "tsx",
}: CopyComponentProps) {
  component = path.join(
    __dirname,
    "..",
    "templates",
    "components",
    `${component}.${extension}`
  );
  await fs.copyFile(component, dir);
}
