import fs from "node:fs";
import path from "node:path";

export function tic80(options = {}) {
  const {
    build = "build/cart.js",
    assets = "src/assets.js",
    sync = true,
    watchInterval = 100,

    header = {
      title: "game title",
      author: "game developer",
      desc: "short description",
    },
  } = options;

  const buildPath = path.resolve(build);
  const assetsPath = path.resolve(assets);

  let watcherStarted = false;

  return {
    name: "tic80",

    outputOptions(output) {
      output.file ??= buildPath;

      const banner = createHeader(header);

      const existingBanner = output.banner;
      const existingFooter = output.footer;

      output.banner = async (...args) => {
        const value =
          typeof existingBanner === "function"
            ? await existingBanner(...args)
            : existingBanner || "";

        return [banner, value].filter(Boolean).join("\n");
      };

      output.footer = async (...args) => {
        const value =
          typeof existingFooter === "function"
            ? await existingFooter(...args)
            : existingFooter || "";

        const assetSource = fs.existsSync(assetsPath)
          ? fs.readFileSync(assetsPath, "utf8")
          : "";

        return [value, assetSource].filter(Boolean).join("\n");
      };

      return output;
    },

    buildStart() {
      if (!sync) {
        return;
      }

      if (watcherStarted) {
        return;
      }

      watcherStarted = true;

      ensureCartExists(buildPath, header);

      fs.watchFile(buildPath, { interval: watchInterval }, () => syncAssets());
    },

    closeWatcher() {
      if (sync) {
        fs.unwatchFile(buildPath);
      }
    },
  };

  function syncAssets() {
    if (!fs.existsSync(buildPath)) {
      return;
    }

    const source = fs.readFileSync(buildPath, "utf8");
    const sections = ["TILES", "SPRITES", "MAP", "WAVES", "SFX", "PALETTE"];

    const extracted = sections
      .map((section) => extractSection(source, section))
      .filter(Boolean);

    // Ignore incomplete/initial cart writes
    if (extracted.length === 0) {
      return;
    }

    const output = `\
// This file is overwritten when TIC-80 saves the cart.
// Do not edit directly!

${extracted.join("\n\n")}
`;

    fs.writeFileSync(assetsPath, output);
  }
}

function createHeader(header) {
  return `\
// title:  ${header.title}
// author: ${header.author}
// desc:   ${header.desc}
// script: js
`;
}

function ensureCartExists(file, header) {
  if (fs.existsSync(file)) {
    return;
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, createHeader(header));
}

function extractSection(source, name) {
  const escaped = escapeRegex(name);

  const regex = new RegExp(
    `(^//\\\\s*<${escaped}>\\\\s*$[\\\\s\\\\S]*?^//\\\\s*<\\\\/${escaped}>\\\\s*$)`,
    "m",
  );

  const match = source.match(regex);

  return match?.[1] ?? null;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
