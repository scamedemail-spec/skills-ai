'use client';

import { useState } from 'react';

type Stage = 'idle' | 'form' | 'submitting' | 'success';

export default function WaitlistForm() {
  const [stage, setStage] = useState<Stage>('idle');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState(''); // honeypot — hidden from real users
  const [error, setError] = useState<string | null>(null);

  const digitCount = phone.replace(/\D/g, '').length;
  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0 && digitCount >= 7;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setStage('submitting');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone, hp: company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setStage('form');
        return;
      }
      setStage('success');
    } catch {
      setError('Something went wrong. Please try again.');
      setStage('form');
    }
  };

  if (stage === 'success') {
    return (
      <div className="mt-10 rounded-lg border border-line bg-bg-card p-6 text-center">
        <p className="text-[16px] font-medium text-ink">You&rsquo;re on the list ✓</p>
        <p className="mt-1 text-sm text-ink-muted">We&rsquo;ll text you when it&rsquo;s your turn.</p>
      </div>
    );
  }

  if (stage === 'idle') {
    return (
      <div className="mt-10">
        <button type="button" className="btn btn-primary" onClick={() => setStage('form')}>
          Join waitlist
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 w-full max-w-[360px] text-left">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          maxLength={100}
          required
          autoFocus
          className="search-input !px-4"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          maxLength={100}
          required
          className="search-input !px-4"
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="search-input !px-4"
        />

        {/* Honeypot — off-screen, real users never see or fill this in. */}
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0"
        />

        <button
          type="submit"
          disabled={!canSubmit || stage === 'submitting'}
          className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {stage === 'submitting' ? 'Joining…' : 'Submit'}
        </button>

        {error && <p className="text-sm text-ink-muted">{error}</p>}
      </div>
    </form>
  );
}
