/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("node:child_process");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

execSync("npx expo prebuild --non-interactive", {
  cwd: projectRoot,
  stdio: "inherit",
});
