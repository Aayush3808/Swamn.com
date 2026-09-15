import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  preset: "vercel",
  srcDir: ".",
  output: ".output",
  rollup: {
    emitCJS: true,
  },
});
