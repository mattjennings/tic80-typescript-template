import fs from "node:fs";
import path from "node:path";

const ASSET_SECTIONS = ["TILES", "SPRITES", "MAP", "WAVES", "SFX", "PALETTE"];
const ASSET_PREAMBLE =
  "// DO NOT EDIT! This file is generated on TIC-80 cart saves.";

/**
 * Parses out the inline asset comments from a cart
 */
const ASSET_SECTION_RE = new RegExp(
  `^//\\s*<(${ASSET_SECTIONS.join("|")})>[\\s\\S]*?^//\\s*</\\1>\\s*$`,
  "gm",
);

export function tic80(options = {}) {
  const {
    build = "build/cart.js",
    assets = "assets.txt",
    watchInterval = 100,
    header = {
      title: "game title",
      author: "game developer",
      desc: "short description",
    },
  } = options;

  const buildPath = path.resolve(build);
  const assetsPath = path.resolve(assets);
  const headerText = `\
// title:  ${header.title}
// author: ${header.author}
// desc:   ${header.desc}
// script: js
`;

  let started = false;

  /**
   * Copies the inline asset contents from the cart into the assets.txt file.
   * This is so that when you make changes to sprites etc. inside the TIC-80 editor the
   * changes don't get lost (as it simply modifies the build/cart.js file).
   */
  function syncAssets() {
    if (!fs.existsSync(buildPath)) return;
    const matches = fs.readFileSync(buildPath, "utf8").match(ASSET_SECTION_RE);
    if (!matches?.length) return; // partial write or empty cart
    const content = matches.join("\n\n");
    fs.writeFileSync(assetsPath, `${ASSET_PREAMBLE}\n\n${content}\n`);
  }

  return {
    name: "tic80",

    outputOptions(output) {
      output.file ??= buildPath;
      return output;
    },

    generateBundle(_, bundle) {
      const assets = fs.existsSync(assetsPath)
        ? fs.readFileSync(assetsPath, "utf8").replace(ASSET_PREAMBLE, "")
        : "";
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === "chunk") {
          chunk.code = headerText + chunk.code + (assets ? "\n" + assets : "");
        }
      }
    },

    /**
     * Set up asset syncing
     */
    buildStart() {
      if (started || !this.meta.watchMode) return;
      started = true;

      if (!fs.existsSync(buildPath)) {
        fs.mkdirSync(path.dirname(buildPath), { recursive: true });
        fs.writeFileSync(buildPath, headerText);
      }

      fs.watchFile(buildPath, { interval: watchInterval }, syncAssets);
    },

    closeWatcher() {
      if (started) fs.unwatchFile(buildPath);
    },
  };
}

