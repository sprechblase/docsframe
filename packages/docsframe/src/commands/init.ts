#!/usr/bin/env node
console.clear();

import type { PackageManager } from "../types";

import {
  intro,
  outro,
  confirm,
  select,
  spinner,
  text,
  log,
} from "@clack/prompts";
import { setTimeout as sleep } from "node:timers/promises";
import color from "picocolors";

import path from "node:path";
import { installDeps } from "../functions/installDeps";
import { copyTemplates } from "../functions/copyTemplate";
import { setup } from "../functions/setup";
import { Command } from "commander";
import fs from "fs-extra";

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .action(async () => {
    intro(color.inverse(" Docsframe "));

    const dir = path.resolve(
      process.cwd(),
      (await text({
        message: "Enter a project directory:",
        placeholder: "Leave blank for current directory",
        defaultValue: ".",
        validate: (value) => {
          value = path.resolve(process.cwd(), value);

          const appPath = path.join(value, "app");
          const appExists = fs.existsSync(appPath);

          if (!appExists) {
            return "Warning: There is no Next.js application with an app router";
          }

          return undefined;
        },
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
    s.start("Setting up Docsframe. This may take some time.");
    await sleep(500);

    try {
      await installDeps({ manager, dir, stdio: "inherit" });
      await copyTemplates({ dir });
      await setup({ contributionOwner, contributionRepo, dir });
    } catch (error) {
      log.error("Error while setting up Docsframe.");
      log.info(error as string);
      process.exit(1);
    } finally {
      s.stop("Installed via " + manager);
    }

    outro("You're all set, thank you for choosing Docsframe!");

    await sleep(1000);
  });
