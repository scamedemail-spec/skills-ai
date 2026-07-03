export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skills.ai';

/** The one-liner shown by the "Copy install" button. `?src=cli` serves a tar.gz stream. */
export function installCommand(slug: string): string {
  return `curl -sSL ${SITE_URL}/api/skills/${slug}/download?src=cli | tar -xz -C ~/.claude/skills/`;
}

/** Clipboard write with a fallback for non-secure contexts. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
