import fs from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC_ROOT = path.resolve(process.cwd(), "src");
const EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".mjs"];

function resolveExistingFile(basePath) {
  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) {
    return basePath;
  }
  if (basePath.endsWith(".mjs")) {
    const mtsCandidate = `${basePath.slice(0, -4)}.mts`;
    if (fs.existsSync(mtsCandidate) && fs.statSync(mtsCandidate).isFile()) {
      return mtsCandidate;
    }
  }
  for (const ext of EXTENSIONS) {
    const candidate = `${basePath}${ext}`;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  for (const ext of EXTENSIONS) {
    const indexCandidate = path.join(basePath, `index${ext}`);
    if (fs.existsSync(indexCandidate) && fs.statSync(indexCandidate).isFile()) {
      return indexCandidate;
    }
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    let basePath = null;
    if (specifier.startsWith("@/")) {
      basePath = path.join(SRC_ROOT, specifier.slice(2));
    } else if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      context.parentURL?.startsWith("file:")
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      if (!parentDir.includes(`${path.sep}node_modules${path.sep}`)) {
        basePath = path.resolve(parentDir, specifier);
      }
    }
    const resolved = basePath ? resolveExistingFile(basePath) : null;
    if (resolved) {
      return { url: pathToFileURL(resolved).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
