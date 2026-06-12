import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { SiteContent } from "./types";

// Reads and parses content/content.yaml at build time (static export).
// Edit that YAML file to update the site — no code changes needed.
export function getContent(): SiteContent {
  const filePath = path.join(process.cwd(), "content", "content.yaml");
  const raw = fs.readFileSync(filePath, "utf8");
  return yaml.load(raw) as SiteContent;
}
