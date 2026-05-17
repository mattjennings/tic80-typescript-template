import { defineConfig } from "rolldown";
import fs from "fs";
import path from "path";

const PATHS = {
  entry: "src/main.ts",
  assets: "src/assets.js",
  build: "build",
};

export default defineConfig(({ watch }) => {
  return {
    input: PATHS.entry,
    plugins: [syncCart(watch)],
    output: {
      file: path.join(PATHS.build, "cart.js"),
      banner: `\
// title:  game title
// author: game developer
// desc:   short description
// script: js
`,
      footer: () => {
        return fs.readFileSync(PATHS.assets, "utf8");
      },
    },
  };
});

function syncCart(watch) {
  if (!watch) {
    return;
  }

  const cartPath = path.join(process.cwd(), PATHS.build, "cart.js");
  const assetsPath = path.join(process.cwd(), PATHS.assets);

  if (!fs.existsSync(cartPath)) {
    fs.writeFileSync(cartPath, "// script: js");
  }

  fs.watchFile(
    cartPath,
    {
      interval: 100,
    },
    function extractAssets() {
      const source = fs.readFileSync(cartPath, "utf8");
      const assets = `\
// This file is overwritten when TIC-80 saves the cart. Do not edit directly!
${extractSection(source, "TILES")}

${extractSection(source, "WAVES")}

${extractSection(source, "PALETTE")}
`;

      fs.writeFileSync(assetsPath, assets);
    },
  );

  return {};
}

function extractSection(source, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(
    `(^//\\s*<${escaped}>\\s*$[\\s\\S]*?^//\\s*<\\/${escaped}>\\s*$)`,
    "m",
  );

  const match = source.match(regex);

  return match ? match[1] : null;
}
