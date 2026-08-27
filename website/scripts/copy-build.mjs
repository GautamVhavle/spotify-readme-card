import { cpSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "../dist");
const build = resolve(__dirname, "../../build");

if (!existsSync(dist)) {
  console.error("dist not found, run vite build first");
  process.exit(1);
}

rmSync(build, { recursive: true, force: true });
mkdirSync(build, { recursive: true });
cpSync(dist, build, { recursive: true });
console.log(`Copied ${dist} -> ${build}`);

// Also ensure .nojekyll for GitHub Pages
import { writeFileSync } from "node:fs";
writeFileSync(resolve(build, ".nojekyll"), "");
console.log("Created .nojekyll");
