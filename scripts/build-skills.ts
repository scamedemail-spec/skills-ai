/**
 * prebuild/predev script.
 *
 * Reads every folder in /content/skills/, and for each one:
 *   1. Zips the folder to /public/skills/{slug}.zip
 *   2. Builds a fileTree with inline text contents (binaries -> null)
 *   3. Parses SKILL.md frontmatter (name/description/author/verified),
 *      falling back to defaults for anything missing or malformed.
 *
 * Writes:
 *   - /public/skills-manifest.json  (full entries incl. fileTree, for the preview modal)
 *   - /lib/skills-index.json        (lightweight card data, for the homepage)
 *
 * This script must never throw on a single bad skill folder — it logs a
 * warning and keeps going, because a broken third-party submission shouldn't
 * be able to break `vercel build`.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';
import matter from 'gray-matter';
import type { FileNode, SkillManifestEntry, SkillSummary } from '../lib/types';

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'skills');
const PUBLIC_SKILLS_DIR = path.join(ROOT, 'public', 'skills');
const MANIFEST_PATH = path.join(ROOT, 'public', 'skills-manifest.json');
const INDEX_PATH = path.join(ROOT, 'lib', 'skills-index.json');

const MAX_INLINE_BYTES = 100 * 1024;
const BINARY_EXT_PATTERN = /\.(png|jpe?g|gif|webp|ico|pdf|zip|gz|woff2?|ttf|otf|mp3|mp4|mov)$/i;

function titleCase(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

function looksBinary(buf: Buffer): boolean {
  const sample = buf.subarray(0, Math.min(buf.length, 8000));
  return sample.includes(0);
}

function readFileContent(absPath: string): string | null {
  const size = statSync(absPath).size;
  if (size > MAX_INLINE_BYTES) return null;
  if (BINARY_EXT_PATTERN.test(absPath)) return null;

  const buf = readFileSync(absPath);
  if (looksBinary(buf)) return null;
  return buf.toString('utf-8');
}

function buildFileTree(dir: string, relBase = ''): FileNode[] {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const nodes: FileNode[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue; // skip dotfiles (.DS_Store, etc.)
    const abs = path.join(dir, entry.name);
    const rel = relBase ? `${relBase}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      nodes.push({ name: entry.name, path: rel, type: 'dir', children: buildFileTree(abs, rel) });
    } else {
      nodes.push({ name: entry.name, path: rel, type: 'file', content: readFileContent(abs) });
    }
  }
  // Directories first, then files, both alphabetical.
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function zipFolder(slug: string, folderAbsPath: string): number {
  const zip = new AdmZip();
  zip.addLocalFolder(folderAbsPath);
  const outPath = path.join(PUBLIC_SKILLS_DIR, `${slug}.zip`);
  zip.writeZip(outPath);
  return statSync(outPath).size;
}

interface FrontmatterResult {
  name: string;
  description: string;
  author: string;
  verified: boolean;
  pinned: boolean;
  warnings: string[];
}

function parseFrontmatter(slug: string, skillMdPath: string): FrontmatterResult {
  const warnings: string[] = [];
  const defaults = {
    name: titleCase(slug),
    description: 'No description',
    author: 'Curated',
    verified: false,
    pinned: false,
  };

  if (!existsSync(skillMdPath)) {
    return { ...defaults, warnings: [`missing SKILL.md — using all defaults`] };
  }

  let data: Record<string, unknown> = {};
  try {
    ({ data } = matter(readFileSync(skillMdPath, 'utf-8')));
  } catch (err) {
    return {
      ...defaults,
      warnings: [`SKILL.md frontmatter failed to parse (${(err as Error).message}) — using all defaults`],
    };
  }

  const name = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : defaults.name;
  if (name === defaults.name && data.name === undefined) warnings.push('missing "name"');

  const description =
    typeof data.description === 'string' && data.description.trim()
      ? data.description.trim()
      : defaults.description;
  if (description === defaults.description) warnings.push('missing "description"');

  const author = typeof data.author === 'string' && data.author.trim() ? data.author.trim() : defaults.author;
  if (author === defaults.author && data.author === undefined) warnings.push('missing "author"');

  const verified = typeof data.verified === 'boolean' ? data.verified : defaults.verified;
  if (typeof data.verified !== 'boolean') warnings.push('missing/invalid "verified"');

  // Optional — most skills omit it, so no warning when absent.
  const pinned = data.pinned === true;

  return { name, description, author, verified, pinned, warnings };
}

function main() {
  mkdirSync(PUBLIC_SKILLS_DIR, { recursive: true });
  mkdirSync(path.dirname(INDEX_PATH), { recursive: true });

  if (!existsSync(CONTENT_DIR)) {
    console.warn(`[build-skills] ${CONTENT_DIR} does not exist — writing empty manifest.`);
    writeFileSync(MANIFEST_PATH, '[]\n');
    writeFileSync(INDEX_PATH, '[]\n');
    return;
  }

  const slugs = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const manifest: SkillManifestEntry[] = [];
  const index: SkillSummary[] = [];
  const incomplete: string[] = [];

  for (const slug of slugs) {
    const folderAbs = path.join(CONTENT_DIR, slug);
    try {
      const { name, description, author, verified, pinned, warnings } = parseFrontmatter(
        slug,
        path.join(folderAbs, 'SKILL.md'),
      );
      if (warnings.length > 0) incomplete.push(`${slug} (${warnings.join(', ')})`);

      const zipBytes = zipFolder(slug, folderAbs);
      const fileTree = buildFileTree(folderAbs);
      const sizeKb = Math.max(1, Math.round(zipBytes / 1024));

      const summary: SkillSummary = { slug, name, description, author, verified, sizeKb, pinned };
      index.push(summary);
      manifest.push({ ...summary, fileTree });
    } catch (err) {
      console.warn(`[build-skills] skipping "${slug}" — ${(err as Error).message}`);
    }
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest));
  writeFileSync(INDEX_PATH, JSON.stringify(index));

  console.log(`[build-skills] built ${manifest.length} skills → ${path.relative(ROOT, MANIFEST_PATH)}`);
  if (incomplete.length > 0) {
    console.warn(
      `[build-skills] ${incomplete.length} skill(s) had incomplete frontmatter (defaults applied):\n` +
        incomplete.map((s) => `  - ${s}`).join('\n'),
    );
  }
}

main();
