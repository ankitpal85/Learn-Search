import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

export default function CodeBlock({ children, className, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If inline code
  if (!className && !String(children).includes('\n')) {
    return (
      <code className="bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded-md border border-cyan-500/25 font-mono text-[0.875em]" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-white/[0.1] bg-[#02050b] shadow-2xl group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#08101e] border-b border-white/[0.08] text-xs">
        <div className="flex items-center gap-3">
          {/* Terminal Dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-cyan-300">
              {language || 'cpp / python'}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/[0.08] hover:border-cyan-500/40 transition-all cursor-pointer font-mono text-[11px]"
          title="Copy code snippet"
          aria-label="Copy code snippet"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] sm:text-[13.5px] font-mono text-slate-100 leading-relaxed no-scrollbar m-0 bg-[#02050b]">
        <code>{codeContent}</code>
      </pre>
    </div>
  );
}
