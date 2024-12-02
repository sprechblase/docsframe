import { execSync } from "node:child_process";
import { z } from "zod";

const DependencyConfigSchema = z.object({
  base: z.array(z.string()).min(1),
  dev: z.array(z.string()).min(1),
});

const InstallPropsSchema = z.object({
  dir: z.string().min(1),
  stdio: z.enum(["pipe", "inherit", "ignore"]).default("pipe"),
  deps: z.array(z.string()).optional(),
});

export type DependencyConfig = z.infer<typeof DependencyConfigSchema>;
export type InstallProps = z.infer<typeof InstallPropsSchema>;

const dependencies: DependencyConfig = {
  base: [
    "@radix-ui/react-icons",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-slot",
    "class-variance-authority",
    "clsx",
    "framer-motion",
    "lucide-react",
    "next",
    "react",
    "react-dom",
    "tailwind-merge",
    "tailwindcss-animate",
  ],
  dev: [
    "@content-collections/core",
    "@content-collections/mdx",
    "@content-collections/next",
    "@types/node",
    "@types/react",
    "@types/react-dom",
    "mdast-util-toc",
    "rehype-pretty-code",
    "rehype-slug",
    "remark",
    "remark-code-import",
    "remark-gfm",
    "shiki",
    "tailwindcss",
    "typescript",
    "unist-util-visit",
  ],
};

function buildInstallCommand(packages: string[], isDev = false): string {
  return `npm install ${packages.join(" ")} ${isDev ? "-D" : ""} --silent`;
}

function install(options: InstallProps): void {
  const { dir, stdio } = InstallPropsSchema.parse(options);

  try {
    const baseCommand = buildInstallCommand(dependencies.base);
    const devCommand = buildInstallCommand(dependencies.dev, true);

    execSync(baseCommand, { cwd: dir, stdio });
    execSync(devCommand, { cwd: dir, stdio });
  } catch (error) {
    throw new Error(
      `Failed to install dependencies: ${(error as Error).message}`
    );
  }
}

function installComponent(options: InstallProps): void {
  const { dir, stdio, deps } = InstallPropsSchema.parse(options);

  if (!deps?.length) return;

  try {
    const componentCommand = buildInstallCommand(deps);
    execSync(componentCommand, { cwd: dir, stdio });
  } catch (error) {
    throw new Error(
      `Failed to install component dependencies: ${(error as Error).message}`
    );
  }
}

export const packageManager = {
  install,
  installComponent,
} as const;
