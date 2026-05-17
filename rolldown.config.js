import { defineConfig } from "rolldown";
import { tic80 } from "./tic80.plugin.js";

export default defineConfig({
  input: "src/main.ts",

  plugins: [
    tic80({
      build: "build/cart.js",
      assets: "src/assets.js",
      header: {
        title: "my game",
        author: "matt",
        desc: "tiny cartridge",
      },
    }),
  ],
});
