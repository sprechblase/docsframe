import { Registry } from "@/registry/schema";

export const lib: Registry = [
  {
    name: "use-config",
    type: "registry:lib",
    dependencies: ["jotai", "jotai/utils"],
    files: [
      {
        path: "lib/use-config.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "use-mounted",
    type: "registry:lib",
    dependencies: ["react"],
    files: [
      {
        path: "lib/use-mounted.ts",
        type: "registry:lib",
      },
    ],
  },
];
