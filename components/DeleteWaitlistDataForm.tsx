'use client';

import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'success';

export default function DeleteWaitlistDataForm() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = phone.replace(/\D/g, '').length >= 7 && status !== 'submitting';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setStatus('submitting');

    try {
      const res = await fetch('/api/waitlist/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please email SingerSteinai@gmail.com.');
        setStatus('idle');
        return;
      }
      setStatus('success');
      setPhone('');
    } catch {
      setError('Something went wrong. Please email SingerSteinai@gmail.com.');
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 max-w-[420px]">
      <label htmlFor="delete-phone" className="block text-sm font-medium text-ink">
        Waitlist phone number
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="delete-phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone number"
          className="search-input !h-11 !px-4"
          required
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn btn-primary h-11 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? 'Submitting...' : 'Request deletion'}
        </button>
      </div>
      {status === 'success' && (
        <p className="mt-3 text-sm text-ink-muted">
          Request received. If that phone number was on the waitlist, it has been removed.
        </p>
      )}
      {error && <p className="mt-3 text-sm text-ink-muted">{error}</p>}
    </form>
  );
}
