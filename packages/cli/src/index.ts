#!/usr/bin/env node
console.clear();

import type { PackageManager } from "./types";

import {
  intro,
  text,
  select,
  password,
  confirm,
  outro,
  spinner,
} from "@clack/prompts";

import path from "node:path";
import { installDeps } from "./functions/installDeps";
import { copyTemplates } from "./functions/copyTemplate";
import { setup } from "./functions/setup";

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

const githubRepo = await confirm({
  message: "Does your project have a GitHub Repo?",
});

let contributionOwner = "";
let contributionRepo = "";

if (githubRepo) {
  contributionOwner = (await text({
    message: "Enter your repository owners GitHub username:",
    placeholder: "Leave blank if you are not using a GitHub Repo",
    defaultValue: "",
  })) as string;

  contributionRepo = (await text({
    message: "Enter your GitHub repository name:",
    placeholder: "Leave blank if you are not using a GitHub Repo",
    defaultValue: "",
  })) as string;
}

const s = spinner();
s.start("Installing dependencies via " + manager);

await installDeps({ manager, dir, stdio: "inherit" });

s.stop("Installed via " + manager);

await copyTemplates({ dir });
await setup({ contributionOwner, contributionRepo, dir });

outro("You're all set, thank you for choosing Docsframe!");
