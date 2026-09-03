import React from 'react';
import { Search, X, Loader2, Sparkles, Command } from 'lucide-react';

export default function SearchBar({ 
  query, 
  setQuery, 
  onSearch, 
  loading, 
  inputRef,
  theme
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const isLight = theme === 'light';

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative w-full group"
    >
      {/* Search Container Panel */}
      <div className={`relative flex items-center rounded-2xl border p-1.5 transition-all duration-300 shadow-xl ${
        isLight
          ? 'bg-white border-slate-300 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/20 shadow-slate-200/60'
          : 'bg-[#081220]/90 backdrop-blur-xl border-white/[0.12] focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/15'
      }`}>
        
        {/* Search Icon & Loading Indicator */}
        <div className="flex items-center justify-center pl-3.5 pr-2">
          {loading ? (
            <Loader2 className={`w-5 h-5 animate-spin ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
          ) : (
            <Search className={`w-5 h-5 group-focus-within:scale-110 transition-transform ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask any DSA concept or logic... (e.g. 'LRU Cache implementation', 'Kadane Algorithm')"
          className={`w-full bg-transparent py-3 px-2 text-sm sm:text-base font-medium focus:outline-none tracking-wide ${
            isLight
              ? 'text-slate-900 placeholder:text-slate-500'
              : 'text-slate-100 placeholder:text-slate-500'
          }`}
        />

        {/* Right side controls: Clear button, Shortcut badge & Submit button */}
        <div className="flex items-center gap-2 pr-1.5">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-mono ${
            isLight
              ? 'bg-slate-100 border-slate-300 text-slate-600'
              : 'bg-white/[0.06] border-white/[0.08] text-slate-400'
          }`}>
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 ${
              isLight
                ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/30'
                : 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 shadow-cyan-500/25'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Ask AI</span>
          </button>
        </div>

      </div>
    </form>
  );
}
