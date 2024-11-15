console.clear();

import { intro, outro, confirm, text, spinner, log } from "@clack/prompts";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import fs from "fs-extra";
import color from "picocolors";
import { Command } from "commander";

import { packageManager } from "../functions/package-manager";
import { copyManager } from "../functions/copy-manager";
import { setup } from "../functions/setup";

const validateDirectory = (dir: string): string | undefined => {
  const resolvedDir = path.resolve(process.cwd(), dir);

  const appExists = fs.existsSync(path.join(resolvedDir, "app"));
  const srcExists = fs.existsSync(path.join(resolvedDir, "src"));

  if (!appExists) {
    if (srcExists) {
      return `Warning: The ${color.cyan(
        "src"
      )} folder is unsupported. Use the App Router structure instead.`;
    }
    return "Warning: No Next.js application with an App Router found.";
  }

  return undefined;
};

const getGithubRepoDetails = async (): Promise<{
  owner: string;
  repo: string;
}> => {
  const githubRepo = await confirm({
    message: "Does your project have a GitHub Repo?",
  });

  if (!githubRepo) return { owner: "", repo: "" };

  const owner = (await text({
    message: "Enter the repository owner's GitHub username:",
    placeholder: "Leave blank if not using a GitHub Repo",
    defaultValue: "",
  })) as string;

  const repo = (await text({
    message: "Enter your GitHub repository name:",
    placeholder: "Leave blank if not using a GitHub Repo",
    defaultValue: "",
  })) as string;

  return { owner, repo };
};

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .action(async () => {
    intro(color.inverse(" Docsframe "));

    const dir = path.resolve(
      process.cwd(),
      (await text({
        message: "Enter a project directory:",
        placeholder: "Leave blank for the current directory",
        defaultValue: ".",
        validate: validateDirectory,
      })) as string
    );

    const { owner: contributionOwner, repo: contributionRepo } =
      await getGithubRepoDetails();

    const s = spinner();
    s.start("Setting up Docsframe. This may take some time.");
    await sleep(500);

    try {
      await packageManager.install({ dir, stdio: "inherit" });
      s.message("Adding necessary files...");
      await sleep(150);

      await copyManager.template({ dir });
      s.message("Setting up configurations...");
      await sleep(150);

      await setup({ contributionOwner, contributionRepo, dir });
    } catch (error) {
      s.stop("Setup failed.");
      log.error("Error while setting up Docsframe.");
      log.info((error as Error).message || "Unknown error occurred.");
      process.exit(1);
    }

    s.stop("Dependencies installed.");
    outro("You're all set, thank you for choosing Docsframe!");

    await sleep(1000);
  });
