#!/usr/bin/env node
import { Command } from "commander"

import packageJson from "../package.json"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  const program = new Command()
    .name("docsframe-cli")
    .description("init docsframe in your project and add components")
    .version(
      packageJson.version,
      "-v, --version",
      "display the version number"
    )


  program.parse()
}

main()