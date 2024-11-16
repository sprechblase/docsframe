#!/usr/bin/env node
import { init } from "./commands/init";
import { add } from "./commands/add";
import { Command } from "commander";
import { z } from "zod";
import packageJson from "../package.json";

const exitHandler = (signal: string) => {
  console.log(`\nReceived ${signal}. Cleaning up...`);
  process.exit(0);
};

process.on("SIGINT", () => exitHandler("SIGINT"));
process.on("SIGTERM", () => exitHandler("SIGTERM"));

const PackageSchema = z.object({
  version: z.string().min(1),
  name: z.string().min(1),
});

const validatedPackage = PackageSchema.parse(packageJson);

async function main() {
  const program = new Command()
    .name("docsframe")
    .description("add a simple documentation framework")
    .version(
      validatedPackage.version || "1.0.0",
      "-v, --version",
      "display the version number"
    );

  program.addCommand(init).addCommand(add);

  try {
    await program.parseAsync();
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    process.exit(1);
  }
}

main();
