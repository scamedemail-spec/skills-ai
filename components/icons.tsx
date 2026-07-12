interface IconProps {
  className?: string;
}

export function InstagramIcon({ className = 'h-[18px] w-[18px]' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SearchIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  );
}

export function VerifiedIcon({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.28-8.72a.75.75 0 0 0-1.06-1.06L7.25 8.19 5.78 6.72a.75.75 0 0 0-1.06 1.06l2 2c.3.3.77.3 1.06 0l3.5-3.5Z"
      />
    </svg>
  );
}

export function DownloadArrowIcon({ className = 'h-3 w-3' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 1.5v7M3 6l3 2.8L9 6M2 10.5h8" />
    </svg>
  );
}

export function ChevronIcon({ className = 'h-3 w-3' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 2.5 8 6l-3.5 3.5" />
    </svg>
  );
}

export function FolderIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.75 3.5c0-.41.34-.75.75-.75h3.3c.24 0 .47.12.62.31l.96 1.19h5.87c.41 0 .75.34.75.75v7.25c0 .41-.34.75-.75.75H2.5a.75.75 0 0 1-.75-.75V3.5Z" />
    </svg>
  );
}

export function FileIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 1.75h5.6l3.4 3.4v9.1a.75.75 0 0 1-.75.75H3.5a.75.75 0 0 1-.75-.75V2.5c0-.41.34-.75.75-.75Z" />
      <path d="M9 1.75V5.25h3.5" />
    </svg>
  );
}

export function UpvoteIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3.5 3.5 8.5h2.6v4h3.8v-4h2.6L8 3.5Z" />
    </svg>
  );
}

export function DownvoteIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 12.5 12.5 7.5h-2.6v-4H6.1v4H3.5L8 12.5Z" />
    </svg>
  );
}

interface StarIconProps extends IconProps {
  /** Solid fill for an earned/selected star; stroke-only outline otherwise. */
  filled?: boolean;
}

export function StarIcon({ className = 'h-4 w-4', filled = false }: StarIconProps) {
  const path = 'M8 1.6l1.98 4.28 4.62.55-3.42 3.24.9 4.63L8 12.1l-4.08 2.2.9-4.63L1.4 6.43l4.62-.55L8 1.6Z';
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export function CloseIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" />
    </svg>
  );
}
