export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: FileNode[];
  /** Inline UTF-8 contents for text files ≤100KB; null for binaries / oversized files. */
  content?: string | null;
}

export interface SkillSummary {
  slug: string;
  name: string;
  description: string;
  author: string;
  verified: boolean;
  sizeKb: number;
}

export interface SkillManifestEntry extends SkillSummary {
  fileTree: FileNode[];
}
