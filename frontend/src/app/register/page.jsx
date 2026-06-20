"use client";

import React, { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering baseline account configuration:", email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <form onSubmit={handleRegister} className="bg-slate-900 border border-slate-850 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl">
        <h2 className="text-xl font-bold tracking-tight text-blue-500">Establish Access Profile</h2>
        <input type="email" placeholder="Assign Email Vector" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-600" />
        <input type="password" placeholder="Secure Password Matrix" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-600" />
        <button type="submit" className="w-full bg-blue-600 font-bold py-2 rounded-xl">Deploy New Credentials</button>
      </form>
    </div>
  );
}