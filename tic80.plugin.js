import fs from "node:fs";
import path from "node:path";

const ASSET_SECTIONS = ["TILES", "SPRITES", "MAP", "WAVES", "SFX", "PALETTE"];
/**
 * Parses out the inline asset comments from a cart
 */
const ASSET_SECTION_RE = new RegExp(
  `^//\\s*<(${ASSET_SECTIONS.join("|")})>[\\s\\S]*?^//\\s*</\\1>\\s*$`,
  "gm",
);

function composeBannerFooter(existing, extra, sep = "\n") {
  return async function (...args) {
    const prev =
      typeof existing === "function" ? await existing(...args) : existing || "";
    return [prev, extra].filter(Boolean).join(sep);
  };
}

function makeHeader({ title, author, desc }) {
  return `\
// title:  ${title}
// author: ${author}
// desc:   ${desc}
// script: js
`;
}

export function tic80(options = {}) {
  const {
    build = "build/cart.js",
    assets = "src/assets.js",
    watchInterval = 100,
    header = {
      title: "game title",
      author: "game developer",
      desc: "short description",
    },
  } = options;

  const buildPath = path.resolve(build);
  const assetsPath = path.resolve(assets);
  const headerText = makeHeader(header);
  let started = false;

  /**
   * Copies the inline asset contents from the cart into the assets.js source file.
   * This is so that when you make changes to sprites etc. inside the TIC-80 editor the
   * changes don't get lost (as it simply modifies the build/cart.js file).
   */
  function syncAssets() {
    if (!fs.existsSync(buildPath)) return;
    const matches = fs.readFileSync(buildPath, "utf8").match(ASSET_SECTION_RE);
    if (!matches?.length) return; // partial write or empty cart
    fs.writeFileSync(
      assetsPath,
      `// This file is overwritten when TIC-80 saves the cart.
// Do not edit directly!

${matches.join("\n\n")}
`,
    );
  }

  return {
    name: "tic80",

    outputOptions(output) {
      output.file ??= buildPath;
      output.banner = composeBannerFooter(output.banner, headerText);
      output.footer = composeBannerFooter(
        output.footer,
        fs.existsSync(assetsPath) ? fs.readFileSync(assetsPath, "utf8") : "",
      );
      return output;
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
