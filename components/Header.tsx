import Link from 'next/link';
import { InstagramIcon } from './icons';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-line bg-bg-sidebar">
      <div className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-6">
        <Link
          href="/"
          className="text-[17px] font-semibold tracking-tight text-ink"
        >
          skills.ai
        </Link>
        <nav className="flex items-center gap-6" aria-label="Main">
          <Link
            href="/#library"
            className="text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            Library
          </Link>
          <Link
            href="/submit"
            className="text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            Submit
          </Link>
          <a
            href="#"
            aria-label="skills.ai on Instagram"
            className="text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            <InstagramIcon />
          </a>
        </nav>
      </div>
    </header>
  );
}
