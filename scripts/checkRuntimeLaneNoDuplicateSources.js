const fs = require("node:fs");
const path = require("node:path");

function fileExists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function readJson(p) {
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw);
}

function main() {
  const repoRoot = path.join(__dirname, "..");
  const tsconfigPath = path.join(repoRoot, "tsconfig.runtime.json");
  const tsconfig = readJson(tsconfigPath);

  const includes = Array.isArray(tsconfig?.include) ? tsconfig.include : [];
  const runtimeSources = includes
    .filter((p) => typeof p === "string")
    .filter((p) => p.endsWith(".ts") || p.endsWith(".cts") || p.endsWith(".mts"));

  const offenders = [];
  for (const rel of runtimeSources) {
    const abs = path.join(repoRoot, rel);
    const dir = path.dirname(abs);
    const base = path.basename(abs).replace(/\.(cts|mts|ts)$/i, "");

    const js = path.join(dir, `${base}.js`);
    const cjs = path.join(dir, `${base}.cjs`);
    const mjs = path.join(dir, `${base}.mjs`);

    const dupes = [js, cjs, mjs].filter(fileExists);
    if (dupes.length) {
      offenders.push({
        runtime: path.relative(repoRoot, abs),
        duplicates: dupes.map((p) => path.relative(repoRoot, p)),
      });
    }
  }

  if (offenders.length) {
    console.error(
      "[runtime-ts] Duplicate source implementations detected for runtime lane modules."
    );
    for (const o of offenders) {
      console.error(`- ${o.runtime}`);
      for (const d of o.duplicates) console.error(`  - ${d}`);
    }
    console.error(
      "[runtime-ts] Fix: update consumers to use dist/runtime/** output and remove the legacy JS/CJS sources."
    );
    process.exitCode = 1;
    return;
  }

  process.exitCode = 0;
}

main();
