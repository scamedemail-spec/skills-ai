/**
 * Minimal in-memory stand-in for the Upstash Redis client, used ONLY in local
 * development when no real Upstash credentials are configured (see getRedis()).
 * It implements exactly the command subset this app uses so that `npm run dev`
 * exercises the real route/component code path end-to-end. It is never used in
 * production — there, an unconfigured Redis stays null and features disable.
 *
 * Values are stored natively. The app's convention (JSON.stringify before
 * writing structured values to lists/hashes, JSON.parse after reading) makes
 * this behave identically to the real client for the operations we use.
 */

type Glob = string;

class FakePipeline {
  private ops: Array<() => Promise<unknown>> = [];
  constructor(private db: FakeRedis) {}

  private q(fn: () => Promise<unknown>) {
    this.ops.push(fn);
    return this;
  }

  incr(k: string) {
    return this.q(() => this.db.incr(k));
  }
  decr(k: string) {
    return this.q(() => this.db.decr(k));
  }
  incrby(k: string, by: number) {
    return this.q(() => this.db.incrby(k, by));
  }
  set(k: string, v: unknown) {
    return this.q(() => this.db.set(k, v));
  }
  del(...keys: string[]) {
    return this.q(() => this.db.del(...keys));
  }
  sadd(k: string, ...members: string[]) {
    return this.q(() => this.db.sadd(k, ...members));
  }
  srem(k: string, ...members: string[]) {
    return this.q(() => this.db.srem(k, ...members));
  }
  hset(k: string, obj: Record<string, unknown>) {
    return this.q(() => this.db.hset(k, obj));
  }
  hdel(k: string, ...fields: string[]) {
    return this.q(() => this.db.hdel(k, ...fields));
  }
  expire(k: string, seconds: number) {
    return this.q(() => this.db.expire(k, seconds));
  }
  lpush(k: string, ...values: unknown[]) {
    return this.q(() => this.db.lpush(k, ...values));
  }
  ltrim(k: string, start: number, stop: number) {
    return this.q(() => this.db.ltrim(k, start, stop));
  }

  async exec() {
    const results: unknown[] = [];
    for (const op of this.ops) results.push(await op());
    return results;
  }
}

export class FakeRedis {
  private kv = new Map<string, unknown>();
  private lists = new Map<string, unknown[]>();
  private sets = new Map<string, Set<string>>();
  private hashes = new Map<string, Map<string, unknown>>();

  async get<T = unknown>(key: string): Promise<T | null> {
    return (this.kv.has(key) ? (this.kv.get(key) as T) : null);
  }

  async set(key: string, value: unknown): Promise<'OK'> {
    this.kv.set(key, value);
    return 'OK';
  }

  async incr(key: string): Promise<number> {
    const n = ((this.kv.get(key) as number) ?? 0) + 1;
    this.kv.set(key, n);
    return n;
  }

  async decr(key: string): Promise<number> {
    const n = ((this.kv.get(key) as number) ?? 0) - 1;
    this.kv.set(key, n);
    return n;
  }

  async incrby(key: string, by: number): Promise<number> {
    const n = ((this.kv.get(key) as number) ?? 0) + by;
    this.kv.set(key, n);
    return n;
  }

  async del(...keys: string[]): Promise<number> {
    let removed = 0;
    for (const key of keys) {
      if (this.kv.delete(key)) removed++;
      this.lists.delete(key);
      this.sets.delete(key);
      this.hashes.delete(key);
    }
    return removed;
  }

  async mget<T = unknown>(...keys: string[]): Promise<(T | null)[]> {
    return keys.map((k) => (this.kv.has(k) ? (this.kv.get(k) as T) : null));
  }

  async keys(pattern: Glob): Promise<string[]> {
    const re = globToRegExp(pattern);
    const all = new Set<string>([
      ...this.kv.keys(),
      ...this.lists.keys(),
      ...this.sets.keys(),
      ...this.hashes.keys(),
    ]);
    return [...all].filter((k) => re.test(k));
  }

  async lpush(key: string, ...values: unknown[]): Promise<number> {
    const arr = this.lists.get(key) ?? [];
    for (const v of values) arr.unshift(v);
    this.lists.set(key, arr);
    return arr.length;
  }

  async ltrim(key: string, start: number, stop: number): Promise<'OK'> {
    const arr = this.lists.get(key) ?? [];
    this.lists.set(key, sliceRange(arr, start, stop));
    return 'OK';
  }

  async lrange<T = unknown>(key: string, start: number, stop: number): Promise<T[]> {
    const arr = (this.lists.get(key) ?? []) as T[];
    return sliceRange(arr, start, stop);
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    const set = this.sets.get(key) ?? new Set<string>();
    let added = 0;
    for (const m of members) {
      if (!set.has(m)) {
        set.add(m);
        added++;
      }
    }
    this.sets.set(key, set);
    return added;
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    const set = this.sets.get(key);
    if (!set) return 0;
    let removed = 0;
    for (const m of members) if (set.delete(m)) removed++;
    if (set.size === 0) this.sets.delete(key);
    return removed;
  }

  async sismember(key: string, member: string): Promise<number> {
    return this.sets.get(key)?.has(member) ? 1 : 0;
  }

  async hset(key: string, obj: Record<string, unknown>): Promise<number> {
    const h = this.hashes.get(key) ?? new Map<string, unknown>();
    let added = 0;
    for (const [field, value] of Object.entries(obj)) {
      if (!h.has(field)) added++;
      h.set(field, value);
    }
    this.hashes.set(key, h);
    return added;
  }

  async hget<T = unknown>(key: string, field: string): Promise<T | null> {
    const h = this.hashes.get(key);
    return h && h.has(field) ? (h.get(field) as T) : null;
  }

  async hgetall<T = unknown>(key: string): Promise<Record<string, T> | null> {
    const h = this.hashes.get(key);
    if (!h || h.size === 0) return null;
    return Object.fromEntries(h) as Record<string, T>;
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    const h = this.hashes.get(key);
    if (!h) return 0;
    let removed = 0;
    for (const f of fields) if (h.delete(f)) removed++;
    return removed;
  }

  async hlen(key: string): Promise<number> {
    return this.hashes.get(key)?.size ?? 0;
  }

  async expire(_key?: string, _seconds?: number): Promise<number> {
    void _key;
    void _seconds;
    return 1; // TTL is a no-op in the in-memory shim
  }

  pipeline(): FakePipeline {
    return new FakePipeline(this);
  }
}

function globToRegExp(glob: Glob): RegExp {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`);
}

/** Redis LRANGE/LTRIM semantics, including negative indices. */
function sliceRange<T>(arr: T[], start: number, stop: number): T[] {
  const len = arr.length;
  let s = start < 0 ? Math.max(len + start, 0) : start;
  const e = stop < 0 ? len + stop : Math.min(stop, len - 1);
  if (s >= len || s > e) return [];
  if (s < 0) s = 0;
  return arr.slice(s, e + 1);
}

// Persist across Next.js dev hot-reloads so in-memory data survives edits.
const globalForFake = globalThis as unknown as { __fakeRedis?: FakeRedis };

export function getFakeRedis(): FakeRedis {
  if (!globalForFake.__fakeRedis) globalForFake.__fakeRedis = new FakeRedis();
  return globalForFake.__fakeRedis;
}
