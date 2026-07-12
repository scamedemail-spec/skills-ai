import { InstagramIcon } from './icons';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-sidebar">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-ink-faint">Made by Lucian Singer</p>
        <div className="flex items-center gap-4 text-[13px] text-ink-faint">
          <a href="/privacy" className="transition-colors duration-150 hover:text-ink">
            Privacy
          </a>
          <a href="/terms" className="transition-colors duration-150 hover:text-ink">
            Terms
          </a>
          <a
            href="https://www.instagram.com/superskills.ai/?hl=en"
            target="_blank"
            rel="noreferrer"
            aria-label="skills.ai on Instagram"
            className="transition-colors duration-150 hover:text-ink"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
