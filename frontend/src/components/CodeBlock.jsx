import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';

export default function CodeBlock({ language, value, theme }) {
  const [copied, setCopied] = useState(false);
  const isLight = theme === 'light';

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`my-5 rounded-xl border overflow-hidden shadow-xl group dark-code-block ${
      isLight
        ? 'bg-slate-900 border-slate-700 text-slate-100'
        : 'bg-[#03060c] border-white/[0.12] text-slate-200'
    }`}>
      
      {/* Code Header Bar */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b text-xs font-mono select-none ${
        isLight
          ? 'bg-slate-800 border-slate-700 text-sky-400'
          : 'bg-[#081220] border-white/[0.08] text-cyan-400'
      }`}>
        <div className="flex items-center gap-2 font-bold tracking-wider">
          <Terminal className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="uppercase text-slate-200">
            {language ? language : 'code'}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer border border-white/10 whitespace-nowrap shrink-0"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-[11px] whitespace-nowrap">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 opacity-70" />
              <span className="text-[11px] whitespace-nowrap">Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Snippet Box */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed bg-[#03060c] text-slate-100 selection:bg-cyan-500/30">
        <pre className="m-0 bg-transparent text-slate-100 p-0 border-0">
          <code className="bg-transparent text-slate-100 p-0 border-0">{value}</code>
        </pre>
      </div>

    </div>
  );
}
