'use client';

import React, { useState } from 'react';
import { ItineraryDay } from '../types';

interface ItineraryCardProps {
  itinerary: ItineraryDay[];
  onAddActivity: (dayNumber: number, title: string) => Promise<void>;
  onRemoveActivity: (dayNumber: number, activityIndex: number) => Promise<void>;
}

export default function ItineraryCard({ itinerary, onAddActivity, onRemoveActivity }: ItineraryCardProps) {
  const [newActivityName, setNewActivityName] = useState('');
  const [targetDay, setTargetDay] = useState<number>(1);

  const handleAppend = async (dayNumber: number) => {
    if (!newActivityName.trim()) return;
    await onAddActivity(dayNumber, newActivityName);
    setNewActivityName('');
  };

  return (
    <div className="space-y-6">
      {itinerary.map((day) => (
        <div key={day.dayNumber} className="border-l border-slate-800 pl-6 relative">
          <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 bg-blue-500 rounded-full" />
          <h4 className="font-bold text-sm text-slate-400 uppercase font-mono tracking-wider mb-3">Day {day.dayNumber}</h4>
          <div className="space-y-2 mb-3">
            {day.activities.map((act, index) => (
              <div key={index} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{act.title}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-text-slate-400">{act.timeOfDay}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{act.description}</p>
                </div>
                <button
                  onClick={() => onRemoveActivity(day.dayNumber, index)}
                  className="text-slate-600 hover:text-red-400 transition text-xs font-mono uppercase tracking-wider self-center"
                >
                  Purge
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Inject localized sequence activity..."
              value={targetDay === day.dayNumber ? newActivityName : ''}
              onChange={(e) => {
                setTargetDay(day.dayNumber);
                setNewActivityName(e.target.value);
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-1.5 focus:outline-none focus:border-blue-500 w-full text-white"
            />
            <button
              onClick={() => handleAppend(day.dayNumber)}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl px-4 py-1.5 text-xs font-semibold transition"
            >
              Append
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}