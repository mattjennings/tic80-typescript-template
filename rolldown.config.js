import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/main.ts",
  output: {
    file: "build/output.js",
    banner: `\
// title:  game title
// author: game developer
// desc:   short description
// script: js
`,
  },
});
