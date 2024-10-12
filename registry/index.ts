import { examples } from "./registry-examples";
import { ui } from "./registry-ui";
import { Registry } from "./schema";

export const registry: Registry = [...ui, ...examples];
