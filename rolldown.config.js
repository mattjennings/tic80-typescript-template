import { defineConfig } from "rolldown";
import { tic80 } from "./tic80.plugin.js";

export default defineConfig(() => {
  return {
    input: "src/main.ts",

    output: {
      // If you are up against the size limit, try setting to true.
      // This will make errors hard to read so only do this if necessary.
      minify: false,
    },
    plugins: [
      tic80({
        build: "build/cart.js",
        assets: "assets.txt",
        header: {
          title: "my game",
          author: "matt",
          desc: "tiny cartridge",
        },
      }),
    ],
  };
});
