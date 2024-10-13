import { Registry } from "@/registry/schema";

export const lib: Registry = [
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
