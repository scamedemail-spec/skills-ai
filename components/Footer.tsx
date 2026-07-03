import { InstagramIcon } from './icons';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-sidebar">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-8">
        <p className="text-[13px] text-ink-faint">
          Made by [your name here]. Not affiliated with Anthropic.
        </p>
        <a
          href="#"
          aria-label="skills.ai on Instagram"
          className="text-ink-faint transition-colors duration-150 hover:text-ink"
        >
          <InstagramIcon />
        </a>
      </div>
    </footer>
  );
}
