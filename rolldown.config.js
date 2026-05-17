import { defineConfig } from "rolldown";
import { readFileSync, writeFileSync } from "fs";

export default defineConfig({
  input: "src/main.ts",
  plugins: [
    {
      buildStart() {
        cleanCartJs();
      },
    },
  ],
  output: {
    file: "build/output.js",
    banner: "// script: js",
  },
});

/**
 * Removes code added to cart.js when saving in TIC-80. This
 * prevents duplicate / conflicting code from our build, while allowing
 * the native editors for assets to easily save back to cart.js
 */
function cleanCartJs() {
  const file = "./cart.js";

  const content = readFileSync(file, "utf-8");
  // remove all regions
  const cleaned = content.replace(/\/\/#region[\s\S]*?\/\/#endregion\s*/g, "");

  writeFileSync(file, cleaned, "utf-8");
}
