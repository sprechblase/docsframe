#!/usr/bin/env node
console.clear();

import type { ModuleType, PackageManager } from "./types";

import { intro, text, select, password, confirm, outro } from "@clack/prompts";

import path from "node:path";
import { installDeps } from "./functions/installDeps";

await intro("It is advisable to only initialize in newly created Next.js projects")

const dir = path.resolve(
  process.cwd(),
  (await text({
    message: "Enter a project directory:",
    placeholder: "Leave blank for current directory",
    defaultValue: ".",
  })) as string
);

const manager = (await select({
  message: "Select a package manager:",
  options: [
    { label: "npm", value: "npm" },
    { label: "pnpm", value: "pnpm" },
    { label: "yarn", value: "yarn" },
  ],
})) as PackageManager;

const type = (await select({
  message: "Select a module type:",
  options: [
    {
      label: "CommonJS",
      value: "cjs",
      hint: `require & exports`,
    },
    {
      label: "ES Modules",
      value: "esm",
      hint: `import & export`,
    },
  ],
})) as ModuleType;

await installDeps({ manager, dir, stdio: "inherit" });
