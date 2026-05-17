import { defineConfig } from "rolldown";
import fs from "fs";
import path from "path";

export default defineConfig(({ watch }) => {
  return {
    input: "src/main.ts",
    plugins: [syncCart(watch)],
    output: {
      file: "cart/code.js",
      banner: "// script: js",
    },
  };
});

function syncCart(watch) {
  if (!watch) {
    return;
  }

  const cartPath = path.join(process.cwd(), "cart/_cart.js");
  const assetsPath = path.join(process.cwd(), "cart/assets.js");

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
// script: js
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
