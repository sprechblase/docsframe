#!/usr/bin/env node
import { init } from "./commands/init"
import { add } from "./commands/add"
import { Command } from "commander"

import packageJson from "../package.json"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  const program = new Command()
    .name("docsframe")
    .description("add a simple documentation framework")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    )

  program.addCommand(init).addCommand(add)

  program.parse()
}

main()