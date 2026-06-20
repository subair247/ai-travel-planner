'use client';

import React from 'react';
import { PackingItem } from '../types';

interface PackingListProps {
  items: PackingItem[];
  onToggleItem: (itemId: string) => Promise<void>;
}

export default function PackingList({ items, onToggleItem }: PackingListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item._id}
          onClick={() => onToggleItem(item._id!)}
          className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer hover:border-slate-700 transition select-none"
        >
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
              item.isPacked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
            }`}>
              {item.isPacked && <span className="text-[10px] font-black">✓</span>}
            </div>
            <span className={`text-sm ${item.isPacked ? 'line-through text-slate-500 font-medium' : 'text-slate-200 font-medium'}`}>
              {item.item}
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-wider uppercase bg-slate-900 px-2 py-0.5 border border-slate-800 rounded text-slate-400">
            {item.category}
          </span>
        </div>
      ))}
    </div>
  );
}