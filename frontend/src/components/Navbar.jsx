import React from 'react';
import { 
  Terminal, 
  Search, 
  Dices, 
  Sun, 
  Moon, 
  Cpu, 
  Layers, 
  Sparkles,
  Zap 
} from 'lucide-react';

export default function Navbar({ 
  stats, 
  onFocusSearch, 
  onRandomTopic, 
  theme, 
  onToggleTheme 
}) {
  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300 ${
      theme === 'light'
        ? 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
        : 'bg-[#040810]/85 border-white/[0.08] text-white'
    }`}>
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={onRandomTopic} title="Click to load random topic">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className={`w-full h-full rounded-[11px] flex items-center justify-center ${
                theme === 'light' ? 'bg-slate-100' : 'bg-[#081220]'
              }`}>
                <Terminal className={`w-5 h-5 group-hover:rotate-12 transition-transform ${
                  theme === 'light' ? 'text-sky-600' : 'text-cyan-400'
                }`} />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-[#040810] animate-pulse"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-1">
                Algo<span className={`${theme === 'light' ? 'text-sky-600' : 'text-cyan-400'}`}>Mind</span>
              </h1>
              <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                theme === 'light'
                  ? 'bg-sky-500/10 text-sky-700 border-sky-500/20'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              }`}>
                <Sparkles className="w-2.5 h-2.5" /> AI v2.4
              </span>
            </div>
            <p className={`text-[11px] hidden md:block font-medium ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Striver's A2Z DSA • Qdrant Vector Cloud & Groq LLM
            </p>
          </div>
        </div>

        {/* Center: System Telemetry Pill */}
        <div className={`hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full border text-xs font-mono shadow-inner ${
          theme === 'light'
            ? 'bg-slate-100/90 border-slate-200 text-slate-700'
            : 'bg-[#081220]/90 border-white/[0.08] text-slate-300'
        }`}>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-bold">
              {(stats?.total_points || 3950).toLocaleString()}
            </span>
            <span className="opacity-75">vectors</span>
          </div>
          <span className="opacity-40">•</span>
          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-bold">315</span>
            <span className="opacity-75">lectures</span>
          </div>
        </div>

        {/* Right: Action Buttons (Search Trigger, Random Topic, Light/Dark Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Trigger */}
          <button
            onClick={onFocusSearch}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700'
                : 'bg-[#081220] hover:bg-[#0e1c30] border-white/[0.1] text-slate-300 hover:border-cyan-500/40'
            }`}
            title="Focus search input (Shortcut: / or ⌘K)"
          >
            <Search className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-400'}`} />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/[0.08] opacity-70">
              ⌘K
            </kbd>
          </button>

          {/* Random Topic Generator */}
          <button
            onClick={onRandomTopic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/20 text-sky-700'
                : 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border-cyan-500/30 text-cyan-300'
            }`}
            title="Explore a random DSA topic"
          >
            <Dices className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">Random Topic</span>
          </button>

          {/* Dark vs Light Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-md ${
              theme === 'light'
                ? 'bg-amber-400/20 border-amber-400/40 text-amber-900 hover:bg-amber-400/30 shadow-amber-500/10'
                : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 shadow-cyan-500/15'
            }`}
            title={`Switch Theme Mode (Current: ${theme === 'light' ? 'Light Mode' : 'Dark Mode'})`}
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-4 h-4 text-amber-600 animate-spin-slow" />
                <span className="font-mono">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-cyan-400" />
                <span className="font-mono">Dark Mode</span>
              </>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
