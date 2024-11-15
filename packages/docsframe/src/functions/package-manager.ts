import { execSync } from "node:child_process";
import { z } from "zod";

const DependencyConfigSchema = z.object({
  base: z.array(z.string()),
  dev: z.array(z.string()),
});

export type DependencyConfig = z.infer<typeof DependencyConfigSchema>;

const InstallPropsSchema = z.object({
  dir: z.string(),
  stdio: z.enum(["pipe", "inherit", "ignore"]).default("pipe"),
  deps: z.array(z.string()).optional(),
});

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
    "prettier",
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
  const devFlag = isDev ? "-D" : "";
  return `npm install ${packages.join(" ")} ${devFlag} --silent`;
}

function install(options: InstallProps): void {
  const validatedOptions = InstallPropsSchema.parse(options);
  const { dir, stdio } = validatedOptions;

  const baseCommand = buildInstallCommand(dependencies.base);
  const devCommand = buildInstallCommand(dependencies.dev, true);
  execSync(baseCommand, { cwd: dir, stdio });
  execSync(devCommand, { cwd: dir, stdio });
}

function installComponent(options: InstallProps): void {
  const validatedOptions = InstallPropsSchema.parse(options);
  const { dir, stdio, deps } = validatedOptions;

  if (deps?.length) {
    const componentCommand = buildInstallCommand(deps);
    execSync(componentCommand, { cwd: dir, stdio });
  }
}

export const packageManager = {
  install,
  installComponent,
};
