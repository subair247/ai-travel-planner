"use client";

import React, { useState } from 'react';

export default function Dashboard() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('Medium Tier');
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [activeDeployments, setActiveDeployments] = useState([]);
  
  const [newActivityText, setNewActivityText] = useState({});

  const handleInterestToggle = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleExecuteAgent = async () => {
    if (!destination) return alert("Please specify a target destination vector.");
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, days, budget, interests }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedTrip(data);
        setActiveDeployments([data, ...activeDeployments]);
      }
    } catch (error) {
      console.error("Execution failure exception:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncTripEdits = async (updated) => {
    setSelectedTrip(updated);
    setActiveDeployments(activeDeployments.map(t => t._id === updated._id ? updated : t));
    
    if (updated._id) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/trips/${updated._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.error("Failed cloud syncing execution:", err);
      }
    }
  };

  const handleRemoveActivity = (dayIndex, actIndex) => {
    if (!selectedTrip || !selectedTrip.daysArray) return;
    const updatedDaysArray = [...selectedTrip.daysArray];
    updatedDaysArray[dayIndex].activities.splice(actIndex, 1);
    syncTripEdits({ ...selectedTrip, daysArray: updatedDaysArray });
  };

  const handleAddActivity = (dayIndex, dayNumber) => {
    const textToAdd = newActivityText[dayNumber]?.trim();
    if (!textToAdd || !selectedTrip || !selectedTrip.daysArray) return;

    const updatedDaysArray = [...selectedTrip.daysArray];
    updatedDaysArray[dayIndex].activities.push(textToAdd);
    
    setNewActivityText({ ...newActivityText, [dayNumber]: "" });
    syncTripEdits({ ...selectedTrip, daysArray: updatedDaysArray });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-3xl font-black text-blue-500 tracking-tight">Trao Dashboard</h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">Isolated Security Zone</p>
        </div>
        <button className="bg-red-950/40 border border-red-900 text-red-400 text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-900/30 transition-all">Sign Out</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-slate-200">Plan New Venture</h2>
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5 tracking-wider">Destination Target</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Paris, France" className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-600 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5 tracking-wider">Duration (Days)</label>
                <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-600 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5 tracking-wider">Budget Allocation</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-600 transition-colors">
                  <option value="Low Tier">Low Tier</option>
                  <option value="Medium Tier">Medium Tier</option>
                  <option value="High Tier">High Tier</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5 tracking-wider">Travel Parameters / Interests</label>
              <div className="flex flex-wrap gap-2">
                {['Food', 'Culture', 'Adventure', 'Shopping', 'Nature'].map((tag) => {
                  const isActive = interests.includes(tag);
                  return (
                    <button key={tag} type="button" onClick={() => handleInterestToggle(tag)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${isActive ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'}`}>{tag}</button>
                  );
                })}
              </div>
            </div>
            <button onClick={handleExecuteAgent} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center gap-2">{loading ? "Synthesizing Core Data Matrix..." : "Execute Intelligence Agent"}</button>
          </div>

          <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl shadow-xl">
            <h3 className="text-base font-bold text-slate-200 mb-3">Active Deployments</h3>
            {activeDeployments.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono">No active itineraries mapping this profile context.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeDeployments.map((trip, idx) => (
                  <div key={idx} onClick={() => setSelectedTrip(trip)} className={`bg-slate-950 border rounded-xl p-3 cursor-pointer transition-colors flex justify-between items-center ${selectedTrip?.destination === trip.destination ? 'border-blue-500' : 'border-slate-850 hover:border-slate-700'}`}>
                    <span className="text-xs font-bold text-slate-300">{trip.destination}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">{trip.days} Days</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-900/80 rounded-2xl p-6 shadow-2xl min-h-[500px] flex flex-col justify-between">
          {!selectedTrip ? (
            <div className="m-auto text-center space-y-4 max-w-sm">
              <div className="text-2xl animate-pulse text-slate-700">✦</div>
              <p className="text-xs font-mono text-slate-500 leading-relaxed">No vector baseline detected. Complete the tactical planning matrix to initialize full-stack execution.</p>
            </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Total / Day</div>
                  <div className="text-xl font-black text-emerald-400">€{selectedTrip?.estimatedBudget?.total || "450"}</div>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Transit</div>
                  <div className="text-sm font-bold mt-0.5 text-slate-200">€{selectedTrip?.estimatedBudget?.transpo || "10-20"}</div>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Lodging</div>
                  <div className="text-sm font-bold mt-0.5 text-slate-200">€{selectedTrip?.estimatedBudget?.accommodation || "250-400"}</div>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Subsistence</div>
                  <div className="text-sm font-bold mt-0.5 text-slate-200">€{selectedTrip?.estimatedBudget?.food || "50-100"}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">✦ Recommended Hotel Placements (Bonus Feature)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTrip.hotels?.map((hotel, hIdx) => (
                    <div key={hIdx} className="bg-slate-950/80 border border-slate-850 p-3 rounded-xl font-mono text-xs">
                      <div className="font-bold text-slate-200">🏨 {hotel.name}</div>
                      <div className="text-slate-500 text-[11px] mt-1">{hotel.details}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-4 max-h-[350px] overflow-y-auto pr-1">
                <h4 className="text-xs font-mono text-blue-400 uppercase tracking-wider">✦ Dynamic Interactive Itinerary Mapping</h4>
                {selectedTrip.daysArray?.map((day, dIdx) => (
                  <div key={dIdx} className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3 shadow-inner">
                    <div className="text-xs font-bold font-mono text-slate-400 border-b border-slate-900 pb-1.5 flex justify-between">
                      <span>DAY {day.dayNumber} ROUTING PLATFORM</span>
                    </div>
                    
                    <ul className="space-y-2 font-mono text-[11px]">
                      {day.activities.map((act, aIdx) => (
                        <li key={aIdx} className="bg-slate-900/60 border border-slate-900 px-3 py-2 rounded-lg flex justify-between items-start gap-4 text-slate-300">
                          <span className="leading-relaxed">🔹 {act}</span>
                          <button 
                            onClick={() => handleRemoveActivity(dIdx, aIdx)}
                            className="text-red-500 hover:text-red-400 text-[10px] font-bold tracking-tighter uppercase transition-colors"
                          >
                            [Remove]
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2 pt-1">
                      <input 
                        type="text" 
                        placeholder="Append custom activity node..." 
                        value={newActivityText[day.dayNumber] || ""}
                        onChange={(e) => setNewActivityText({ ...newActivityText, [day.dayNumber]: e.target.value })}
                        className="flex-1 bg-slate-900 border border-slate-880 rounded-lg px-3 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-600 font-mono"
                      />
                      <button 
                        onClick={() => handleAddActivity(dIdx, day.dayNumber)}
                        className="bg-blue-950/60 border border-blue-900 text-blue-400 font-bold px-3 py-1 rounded-lg text-xs hover:bg-blue-900/50 font-mono transition-all"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}