import { examples } from "./registry-examples";
import { ui } from "./registry-ui";
import { lib } from "./registry-lib";
import { types } from "./registry-types";
import { Registry } from "./schema";

export const registry: Registry = [...ui, ...lib, ...types, ...examples];
