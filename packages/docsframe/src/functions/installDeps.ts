import type { PackageManager } from "../types";
import { type IOType, execSync } from "node:child_process";

interface InstallDepsProps {
  manager: PackageManager;
  dir: string;
  stdio: IOType;
}

interface InstallComponentDepsProps {
  manager: PackageManager;
  dir: string;
  deps: string[];
  stdio: IOType;
}

const baseDependencies = [
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
];

const devDependencies = [
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
];

export function installDeps({
  manager,
  dir,
  stdio = "pipe",
}: InstallDepsProps) {
  const depsCommand = `${manager} add ${baseDependencies.join(" ")} -D ${devDependencies.join(" ")} --silent`;
  execSync(depsCommand, { cwd: dir, stdio });
}

export function installComponentDeps({
  manager,
  dir,
  deps,
  stdio = "pipe",
}: InstallComponentDepsProps) {
  const depsCommand = `${manager} add ${deps.join(" ")} --silent`;
  execSync(depsCommand, { cwd: dir, stdio });
}
