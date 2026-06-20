"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "") 
      : "http://localhost:5000";

    try {
      const res = await fetch(`${baseApiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      localStorage.setItem('userToken', data.token || 'authenticated');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-850 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl">
        <h2 className="text-xl font-bold tracking-tight text-blue-500">Security Gate Access</h2>
        {error && <div className="text-xs text-red-400 bg-red-950/50 p-2 rounded border border-red-900">{error}</div>}
        <input type="email" placeholder="Email Vector" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-600" required />
        <input type="password" placeholder="Passphrase Matrix" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-600" required />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 font-bold py-2 rounded-xl disabled:opacity-50">
          {loading ? "Authenticating..." : "Authenticate User"}
        </button>
      </form>
    </div>
  );
}