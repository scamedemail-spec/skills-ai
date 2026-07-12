import type { Metadata } from 'next';
import { getRedis } from '@/lib/redis';

export const metadata: Metadata = {
  title: 'Waitlist admin — skills.ai',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface WaitlistEntry {
  firstName: string;
  lastName: string;
  phone: string;
  ts: string;
}

function parseEntry(raw: string): WaitlistEntry | null {
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.firstName === 'string' &&
      typeof parsed.lastName === 'string' &&
      typeof parsed.phone === 'string' &&
      typeof parsed.ts === 'string'
    ) {
      return parsed as WaitlistEntry;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const redis = getRedis();

  if (!redis) {
    return (
      <div className="mx-auto max-w-[700px] px-6 py-16">
        <h1 className="font-serif text-2xl font-medium">Waitlist</h1>
        <p className="mt-3 text-ink-muted">
          Redis isn&rsquo;t configured — set UPSTASH_REDIS_REST_URL / TOKEN to see signups here.
        </p>
      </div>
    );
  }

  const raw = await redis.lrange('waitlist:entries', 0, -1);
  const entries = raw.map(parseEntry).filter((e): e is WaitlistEntry => e !== null);

  return (
    <div className="mx-auto max-w-[700px] px-6 py-16">
      <h1 className="font-serif text-2xl font-medium">Waitlist</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {entries.length} {entries.length === 1 ? 'person' : 'people'} on the list.
      </p>

      {entries.length > 0 ? (
        <table className="mt-8 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-line bg-bg-sidebar px-3 py-2 text-left font-medium">
                Name
              </th>
              <th className="border border-line bg-bg-sidebar px-3 py-2 text-left font-medium">
                Phone
              </th>
              <th className="border border-line bg-bg-sidebar px-3 py-2 text-left font-medium">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i}>
                <td className="border border-line px-3 py-2">
                  {entry.firstName} {entry.lastName}
                </td>
                <td className="border border-line px-3 py-2">{entry.phone}</td>
                <td className="border border-line px-3 py-2 text-ink-muted">
                  {new Date(entry.ts).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-8 text-ink-muted">No one has joined yet.</p>
      )}
    </div>
  );
}
