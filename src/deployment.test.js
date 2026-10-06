import fs from "fs";
import path from "path";
import { getUnifiedCatalog, resolveCatalogImage } from "./data/unifiedCatalog";

const projectRoot = path.resolve(__dirname, "..");

test("Netlify SPA fallback is exactly the public index rewrite", () => {
  expect(fs.readFileSync(path.join(projectRoot, "public/_redirects"), "utf8")).toBe("/* /index.html 200\n");
});

test("the existing production command retains Create React App public copying", () => {
  const packageConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
  expect(packageConfig.scripts.build).toBe("react-scripts build");
  const buildScript = fs.readFileSync(require.resolve("react-scripts/scripts/build"), "utf8");
  expect(buildScript).toContain("copyPublicFolder();");
  expect(buildScript).toContain("fs.copySync(paths.appPublic, paths.appBuild");
});

test("all local catalogue images exist with exact production filename casing", () => {
  const missing = getUnifiedCatalog()
    .map(product => resolveCatalogImage(product))
    .filter(image => image.startsWith("/"))
    .filter(image => !fs.existsSync(path.join(projectRoot, "public", decodeURIComponent(image))));
  expect([...new Set(missing)]).toEqual([]);
});

test("all literal public image references and manifest icons exist", () => {
  const missing = [];
  const inspectDirectory = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        inspectDirectory(filename);
      } else if (/\.(jsx?|css)$/.test(entry.name)) {
        const source = fs.readFileSync(filename, "utf8");
        for (const match of source.matchAll(/["'`](\/[^\s"'`?]*\.(?:png|jpe?g|gif|webp|svg|woff2?|ttf|ico))["'`?]/gi)) {
          if (!fs.existsSync(path.join(projectRoot, "public", decodeURIComponent(match[1])))) {
            missing.push(match[1]);
          }
        }
      }
    }
  };
  inspectDirectory(path.join(projectRoot, "src"));
  const manifest = JSON.parse(fs.readFileSync(path.join(projectRoot, "public/manifest.json"), "utf8"));
  for (const icon of manifest.icons) {
    expect(fs.existsSync(path.join(projectRoot, "public", icon.src))).toBe(true);
  }
  expect([...new Set(missing)]).toEqual([]);
});
