"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [destination, setDestination] = useState('France');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState('High Tier');
  const [selectedInterests, setSelectedInterests] = useState(['Food', 'Culture', 'Adventure']);
  const [loading, setLoading] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  
  const [itinerary, setItinerary] = useState({
    estimatedBudget: { total: '6000', transpo: '800', accommodation: '3000', food: '2220' },
    hotels: [
      { name: 'Le Meurice, Paris', details: 'Palace hotel, 3 Michelin stars, historic luxury, central location' },
      { name: 'Villa Maïa, Lyon', details: 'Luxury boutique hotel, contemporary design, panoramic views near Old Lyon' }
    ],
    daysArray: [
      {
        dayNumber: 1,
        activities: [
          'Morning: Private skip-the-line guided tour of the Louvre Museum in Paris.',
          'Afternoon: Gourmet lunch cruise on the Seine River, followed by a private tour of Île de la Cité (Sainte-Chapelle, Notre Dame exterior).',
          'Evening: Michelin-starred dinner experience at a prestigious Parisian restaurant (e.g., Le Cinq), followed by a private illuminated monuments tour.'
        ]
      }
    ]
  });

  const [deployments, setDeployments] = useState([
    { id: 1, destination: 'France', days: 5 },
    { id: 2, destination: 'France', days: 5 }
  ]);

  const handleSignOut = () => {
    localStorage.removeItem('userToken');
    router.push('/login');
  };

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleExecuteAgent = async (e) => {
    e.preventDefault();
    setLoading(true);

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "") 
      : "http://localhost:5000";

    try {
      const res = await fetch(`${baseApiUrl}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          destination,
          days,
          budget,
          interests: selectedInterests
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setItinerary({
          estimatedBudget: data.estimatedBudget || itinerary.estimatedBudget,
          hotels: data.hotels || itinerary.hotels,
          daysArray: data.daysArray || itinerary.daysArray
        });
        setDeployments([{ id: Date.now(), destination, days }, ...deployments]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    const updatedDays = [...itinerary.daysArray];
    updatedDays[dayIndex].activities.splice(activityIndex, 1);
    setItinerary({ ...itinerary, daysArray: updatedDays });
  };

  const handleAddActivity = (dayIndex) => {
    if (!newActivity.trim()) return;
    const updatedDays = [...itinerary.daysArray];
    updatedDays[dayIndex].activities.push(newActivity.trim());
    setItinerary({ ...itinerary, daysArray: updatedDays });
    setNewActivity('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-blue-500">Trao Dashboard</h1>
          <p className="text-xxs text-slate-500 tracking-widest">ISOLATED SECURITY ZONE</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="bg-red-950/20 border border-red-900 text-red-400 hover:bg-red-900 hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-6">
          <form onSubmit={handleExecuteAgent} className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-2xl space-y-5">
            <h2 className="text-lg font-bold tracking-wide">Plan New Venture</h2>
            
            <div>
              <label className="block text-xxs text-slate-500 uppercase tracking-wider mb-2">Destination Target</label>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-slate-200" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xxs text-slate-500 uppercase tracking-wider mb-2">Duration (Days)</label>
                <input 
                  type="number" 
                  value={days} 
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-slate-200" 
                />
              </div>
              <div>
                <label className="block text-xxs text-slate-500 uppercase tracking-wider mb-2">Budget Allocation</label>
                <select 
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-slate-200 appearance-none"
                >
                  <option value="Low Tier">Low Tier</option>
                  <option value="Medium Tier">Medium Tier</option>
                  <option value="High Tier">High Tier</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xxs text-slate-500 uppercase tracking-wider mb-2">Travel Parameters / Interests</label>
              <div className="flex flex-wrap gap-2">
                {['Food', 'Culture', 'Adventure', 'Shopping', 'Nature'].map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/10' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
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
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20 text-sm tracking-wide text-white disabled:opacity-50"
            >
              {loading ? "Processing AI Vectors..." : "Execute Intelligence Agent"}
            </button>
          </form>

          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-sm font-bold tracking-wide">Active Deployments</h3>
            <div className="space-y-2">
              {deployments.map((dep) => (
                <div key={dep.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-300">{dep.destination}</span>
                  <span className="text-xxs bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-500">{dep.days} Days</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
              <span className="block text-xxs text-slate-500 uppercase tracking-wider mb-1">Total / Day</span>
              <span className="text-lg font-bold text-emerald-400">€€{itinerary.estimatedBudget.total}</span>
            </div>
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
              <span className="block text-xxs text-slate-500 uppercase tracking-wider mb-1">Transit</span>
              <span className="text-lg font-bold text-slate-200">€€{itinerary.estimatedBudget.transpo}</span>
            </div>
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
              <span className="block text-xxs text-slate-500 uppercase tracking-wider mb-1">Lodging</span>
              <span className="text-lg font-bold text-slate-200">€€{itinerary.estimatedBudget.accommodation}</span>
            </div>
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
              <span className="block text-xxs text-slate-500 uppercase tracking-wider mb-1">Subsistence</span>
              <span className="text-lg font-bold text-slate-200">€€{itinerary.estimatedBudget.food}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xxs text-blue-500 tracking-wider uppercase font-bold flex items-center gap-1">✦ Recommended Hotel Placements (Bonus Feature)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itinerary.hotels.map((hotel, index) => (
                <div key={index} className="bg-slate-900 border border-slate-850 p-4 rounded-2xl shadow-xl">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1">🏨 {hotel.name}</h4>
                  <p className="text-xxs text-slate-400 mt-1.5 leading-relaxed">{hotel.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xxs text-blue-500 tracking-wider uppercase font-bold flex items-center gap-1">✦ Dynamic Interactive Itinerary Mapping</span>
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-2xl space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              {itinerary.daysArray.map((day, dayIdx) => (
                <div key={dayIdx} className="space-y-3">
                  <h3 className="text-xs font-bold text-blue-400 border-b border-slate-800 pb-2 uppercase tracking-wider">Day {day.dayNumber} Routing Platform</h3>
                  <div className="space-y-2">
                    {day.activities.map((act, actIdx) => (
                      <div key={actIdx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-start gap-4 hover:border-slate-750 transition">
                        <p className="text-xs text-slate-300 leading-relaxed">✦ {act}</p>
                        <button 
                          onClick={() => handleRemoveActivity(dayIdx, actIdx)}
                          className="text-xxs text-red-500 font-bold hover:text-red-400 uppercase tracking-tighter shrink-0 mt-0.5"
                        >
                          [Remove]
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input 
                      type="text"
                      placeholder="Append custom activity node..."
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-600"
                    />
                    <button 
                      onClick={() => handleAddActivity(dayIdx)}
                      className="bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 text-blue-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}