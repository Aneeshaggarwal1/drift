'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn('credentials', {
        email,
        callbackUrl: '/',
        redirect: true,
      });
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#E8A838] mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
            Drift
          </h1>
          <p className="text-[#A09A90] text-sm">Your personal travel companion</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
          <h2 className="text-[#F5F0E8] font-semibold mb-1">Sign in</h2>
          <p className="text-[#A09A90] text-sm mb-6">Enter your email to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[#A09A90] text-xs mb-1.5">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#F5F0E8] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#E8A838] transition-colors"
                autoFocus
              />
            </div>

            {error && <p className="text-[#D4756B] text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8A838] text-[#0F0F0F] font-semibold rounded-lg py-2.5 text-sm hover:bg-[#d4972e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
