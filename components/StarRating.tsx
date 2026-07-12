import { StarIcon } from './icons';

/** Read-only 5-star row; `value` is rounded to the nearest whole star. */
export default function StarRating({
  value,
  className = 'h-4 w-4',
}: {
  value: number;
  className?: string;
}) {
  const rounded = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5 text-accent" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} className={className} filled={n <= rounded} />
      ))}
    </span>
  );
}
