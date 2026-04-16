/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const iosPath = path.join(projectRoot, "ios");
const androidPath = path.join(projectRoot, "android");

const hasIosFolder = fs.existsSync(iosPath);
const hasAndroidFolder = fs.existsSync(androidPath);

if (hasIosFolder && hasAndroidFolder) {
  console.log("Skipping Expo prebuild because ios/ and android/ already exist.");
  process.exit(0);
}

console.log("Running Expo prebuild because native folders are missing.");
execSync("npx expo prebuild --non-interactive", {
  cwd: projectRoot,
  stdio: "inherit",
});
