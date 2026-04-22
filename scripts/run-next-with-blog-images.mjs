import { spawn } from "node:child_process";
import path from "node:path";
import { prepareBlogImages } from "./prepare-blog-images.mjs";

const NEXT_CLI = path.join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

async function main() {
  const mode = process.argv[2];

  if (mode !== "build" && mode !== "dev") {
    throw new Error('Use "build" or "dev" when running the Next wrapper.');
  }

  await prepareBlogImages();

  const child = spawn(process.execPath, [NEXT_CLI, mode], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  child.on("exit", (code) => {
    process.exit(code ?? 1);
  });
}

main().catch((error) => {
  console.error(`[blog-images] ${error.message}`);
  process.exit(1);
});