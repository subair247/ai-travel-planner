'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full -top-40 -left-40 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full -bottom-40 -right-40 pointer-events-none" />
      
      <div className="max-w-3xl text-center z-10 space-y-6">
        <div className="text-xs uppercase tracking-widest font-mono bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full text-indigo-400 inline-block">
          Autonomous Travel Logic Engine
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-white">
          Trao AI Flight & Itinerary Synthesizer
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto font-medium">
          Generate structured, data-isolated day-by-day routing, financial micro-budgets, and climate metrics via deterministic LLM agents.
        </p>
        <div className="flex justify-center items-center gap-4 pt-4">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-500 transition text-white font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-blue-600/20"
          >
            Access Core Terminal
          </Link>
          <Link
            href="/register"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition text-slate-300 font-bold px-8 py-3 rounded-xl text-sm"
          >
            Establish Matrix Account
          </Link>
        </div>
      </div>
    </div>
  );
}