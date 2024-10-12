import { Registry } from "@/registry/schema";

export const types: Registry = [
  {
    name: "index.d",
    type: "registry:types",
    dependencies: [],
    files: [
      {
        path: "types/index.d.ts",
        type: "registry:types",
      },
    ],
  },
  {
    name: "unist",
    type: "registry:types",
    dependencies: [],
    files: [
      {
        path: "types/unist.ts",
        type: "registry:types",
      },
    ],
  },
];
