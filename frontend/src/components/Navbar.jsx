import React from 'react';
import { Database, Cpu, Sparkles, Command, Dices, ShieldCheck } from 'lucide-react';

export default function Navbar({ stats, onFocusSearch, onRandomTopic }) {
  return (
    <header className="border-b border-white/[0.08] bg-[#040810]/85 backdrop-blur-2xl px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 transition-all">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3.5">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative w-10 h-10 rounded-xl bg-[#08101e] border border-cyan-400/40 flex items-center justify-center font-extrabold text-cyan-400 shadow-inner">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              DSA<span className="text-cyan-400">.MATRIX</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold tracking-wider shadow-sm shadow-cyan-500/20">
              NEURAL RAG
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
            <span>Striver A2Z Video Vector Intelligence</span>
          </span>
        </div>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Random Topic Button */}
        <button
          type="button"
          onClick={onRandomTopic}
          className="hidden md:flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-100 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400/50 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium shadow-sm shadow-purple-500/10"
          title="Pick a random DSA challenge"
        >
          <Dices className="w-3.5 h-3.5 text-purple-400" />
          <span>Surprise Problem</span>
        </button>

        {/* Quick Search Shortcut */}
        <button
          type="button"
          onClick={onFocusSearch}
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-mono shadow-inner"
          aria-label="Focus search input"
          title="Press / or Ctrl+K to search"
        >
          <Command className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline text-slate-400">Search</span>
          <kbd className="bg-slate-900 text-cyan-300 px-1.5 py-0.5 rounded text-[10px] border border-cyan-500/20 font-bold">
            ⌘K
          </kbd>
        </button>

        {/* LLM Engine */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-indigo-200">Groq LLM</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
        </div>

        {/* Live Vector Points Counter */}
        <div className="flex items-center gap-2 text-xs font-mono bg-[#081220] px-3.5 py-1.5 rounded-xl border border-cyan-500/30 shadow-sm shadow-cyan-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400 hidden xs:inline" />
            <span className="font-bold text-white tracking-wide">
              {(stats?.total_points || 3950).toLocaleString()}
            </span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">vectors</span>
          </div>
        </div>
      </div>
    </header>
  );
}
