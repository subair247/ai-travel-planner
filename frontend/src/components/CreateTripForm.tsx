'use client';

import React, { useState } from 'react';

interface CreateTripFormProps {
  onSubmit: (tripData: {
    destination: string;
    durationDays: number;
    budgetTier: string;
    interests: string[];
  }) => Promise<void>;
  isLoading: boolean;
}

export default function CreateTripForm({ onSubmit, isLoading }: CreateTripFormProps) {
  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState(3);
  const [budgetTier, setBudgetTier] = useState('Medium');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const availableInterests = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    await onSubmit({ destination, durationDays, budgetTier, interests: selectedInterests });
    setDestination('');
    setSelectedInterests([]);
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium uppercase font-mono tracking-wider text-slate-400 mb-1">Destination Target</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          placeholder="e.g. Kyoto, Japan"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase font-mono tracking-wider text-slate-400 mb-1">Duration (Days)</label>
          <input
            type="number"
            min={1}
            max={14}
            value={durationDays}
            onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase font-mono tracking-wider text-slate-400 mb-1">Budget Allocation</label>
          <select
            value={budgetTier}
            onChange={(e) => setBudgetTier(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition text-sm"
          >
            <option value="Low">Low Cost</option>
            <option value="Medium">Medium Tier</option>
            <option value="High">Premium High</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium uppercase font-mono tracking-wider text-slate-400 mb-2">Travel Parameters / Interests</label>
        <div className="flex flex-wrap gap-2">
          {availableInterests.map(interest => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                type="button"
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                  isSelected ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 transition text-white font-semibold py-2.5 rounded-xl text-sm"
      >
        {isLoading ? 'Synthesizing Itinerary...' : 'Execute Intelligence Agent'}
      </button>
    </form>
  );
}