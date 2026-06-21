"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [destination, setDestination] = useState('France');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState('High Tier');
  const [selectedInterests, setSelectedInterests] = useState(['Food', 'Culture', 'Adventure']);

  const handleSignOut = () => {
    localStorage.removeItem('userToken');
    router.push('/login');
  };

  const handleExecuteAgent = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Trao Dashboard</h1>
          <p className="text-xs text-slate-500 tracking-wider">ISOLATED SECURITY ZONE</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="bg-red-950/40 border border-red-900 text-red-400 hover:bg-red-650 hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-2xl space-y-4">
          <h2 className="text-lg font-bold">Plan New Venture</h2>
          
          <div>
            <label className="block text-xxs text-slate-500 uppercase font-bold mb-1">Destination Target</label>
            <input 
              type="text" 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-600" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xxs text-slate-500 uppercase font-bold mb-1">Duration (Days)</label>
              <input 
                type="number" 
                value={days} 
                onChange={(e) => setDays(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-600" 
              />
            </div>
            <div>
              <label className="block text-xxs text-slate-500 uppercase font-bold mb-1">Budget Allocation</label>
              <select 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-600 appearance-none"
              >
                <option>Low Tier</option>
                <option>Medium Tier</option>
                <option>High Tier</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleExecuteAgent}
            className="w-full bg-blue-600 font-bold py-3 rounded-xl transition hover:bg-blue-700 shadow-lg shadow-blue-600/20"
          >
            Execute Intelligence Agent
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl">
              <span className="block text-xxs text-slate-500 uppercase mb-1">Total / Day</span>
              <span className="text-xl font-bold text-emerald-400">€€6000</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl">
              <span className="block text-xxs text-slate-500 uppercase mb-1">Transit</span>
              <span className="text-xl font-bold">€€800</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl">
              <span className="block text-xxs text-slate-500 uppercase mb-1">Lodging</span>
              <span className="text-xl font-bold">€€3000</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl">
              <span className="block text-xxs text-slate-500 uppercase mb-1">Subsistence</span>
              <span className="text-xl font-bold">€€2220</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}