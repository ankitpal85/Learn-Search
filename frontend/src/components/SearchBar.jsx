import React, { useState } from 'react';
import { Search, Sparkles, RefreshCw, X, SlidersHorizontal, ArrowRight } from 'lucide-react';

const SEARCH_MODES = [
  { id: 'all', label: 'All-in-One' },
  { id: 'code', label: 'Code & Logic' },
  { id: 'interview', label: 'Interview Qs' },
];

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  loading,
  inputRef,
}) {
  const [activeMode, setActiveMode] = useState('all');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    let fullQuery = query;
    if (activeMode === 'code' && !query.toLowerCase().includes('code')) {
      fullQuery = `${query} optimal code implementation and logic`;
    } else if (activeMode === 'interview' && !query.toLowerCase().includes('interview')) {
      fullQuery = `${query} key interview questions pitfalls and complexity`;
    }
    onSearch(fullQuery);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Search Input Box */}
      <form
        onSubmit={handleFormSubmit}
        className="command-dock flex items-center gap-2.5 sm:gap-3.5 px-3.5 sm:px-5 py-3 sm:py-3.5 transition-all relative group"
      >
        {/* Glow accent */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-emerald-500/20 rounded-2xl blur-lg opacity-40 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>

        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0 shadow-inner">
          <Search className="w-5 h-5 text-cyan-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any DSA concept, algorithm, or question (e.g. LRU Cache, Kadane's, Knapsack)..."
          className="relative flex-1 bg-transparent border-none outline-none text-white text-sm sm:text-[16px] placeholder-slate-500 font-sans tracking-tight"
          aria-label="Search DSA problems or topics"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="relative text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Clear search input"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="relative bg-gradient-to-r from-cyan-400 via-cyan-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] shrink-0"
          aria-label="Submit search"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span className="hidden sm:inline">Synthesizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Synthesize</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950 hidden sm:inline" />
            </>
          )}
        </button>
      </form>

      {/* Mode Filters Underneath */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
            <span>Mode:</span>
          </span>
          {SEARCH_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer ${
                activeMode === mode.id
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded border border-white/[0.08] text-[10px]">
            Enter
          </kbd>
          <span>to ask</span>
        </div>
      </div>
    </div>
  );
}
