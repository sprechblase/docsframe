import fs from "fs-extra";
import path from "node:path";

interface CopyComponentProps {
  dir: string;
  component: string;
}

export async function copyComponent({
  dir,
  component
}: CopyComponentProps) {
  component = path.join(
    __dirname,
    "..",
    "templates",
    "components",
    "docsframe",
    `${component}.tsx`
  );
  await fs.copyFile(component, dir);
}
