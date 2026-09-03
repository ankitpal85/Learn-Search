import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import SkeletonLoader from './SkeletonLoader';
import { 
  BookOpen, 
  Cpu, 
  Code2, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Layers
} from 'lucide-react';

export default function NotesViewer({ aiAnswer, loading, activeTopic, theme }) {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'logic'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const speechRef = useRef(null);

  const isLight = theme === 'light';

  // Stop speech if answer changes or component unmounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [aiAnswer]);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window) || !aiAnswer) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Clean markdown tags for speech synthesis
      const plainText = aiAnswer
        .replace(/```[\s\S]*?```/g, 'Code block omitted.')
        .replace(/[#*`_~]/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(plainText.substring(0, 1000));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopy = () => {
    if (!aiAnswer) return;
    navigator.clipboard.writeText(aiAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!aiAnswer) return;
    const blob = new Blob([aiAnswer], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTopic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <SkeletonLoader type="notes" theme={theme} />;
  }

  if (!aiAnswer) {
    return (
      <div className={`w-full rounded-2xl border p-12 text-center flex flex-col items-center justify-center gap-4 ${
        isLight
          ? 'bg-white border-slate-300 text-slate-900 shadow-xl'
          : 'bg-[#081220]/60 border-white/[0.08] text-white'
      }`}>
        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center ${
          isLight ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
        }`}>
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="text-base font-bold">Select or Type a DSA Topic</h3>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Get instant brute-to-optimal logic breakdowns, time/space complexity analysis, and verified video lecture clips.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300 ${
      isLight
        ? 'bg-white border-slate-300 text-slate-900 shadow-slate-200/80'
        : 'bg-[#081220]/90 backdrop-blur-xl border-white/[0.12] text-slate-100'
    }`}>
      
      {/* Top Header & Tab Navigation Bar */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b p-3 sm:px-5 gap-3 ${
        isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#040810]/70 border-white/[0.08]'
      }`}>
        
        {/* Navigation Tabs */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          isLight ? 'bg-white border-slate-300' : 'bg-[#081220] border-white/[0.08]'
        }`}>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'notes'
                ? isLight
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">AI Revision Notes</span>
          </button>
          
          <button
            onClick={() => setActiveTab('logic')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'logic'
                ? isLight
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Complexity & Logic</span>
          </button>
        </div>

        {/* Action Controls: Audio Reader, Copy, Download */}
        <div className="flex items-center gap-2 justify-end">
          
          {/* Text-to-Speech Voice Reader Button */}
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isSpeaking
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-300 animate-pulse'
                : isLight
                  ? 'bg-white hover:bg-slate-200/80 border-slate-300 text-slate-800'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08] text-slate-300'
            }`}
            title="Listen to voice summary"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="whitespace-nowrap">Stop Voice</span>
                <span className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-rose-500 animate-bounce"></span>
                  <span className="w-1 h-4 bg-rose-500 animate-bounce delay-100"></span>
                  <span className="w-1 h-2 bg-rose-500 animate-bounce delay-200"></span>
                </span>
              </>
            ) : (
              <>
                <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
                <span className="hidden sm:inline whitespace-nowrap">Voice Summary</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isLight
                ? 'bg-white hover:bg-slate-200/80 border-slate-300 text-slate-800'
                : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08] text-slate-300'
            }`}
            title="Copy Markdown Notes"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-emerald-600 dark:text-emerald-400 whitespace-nowrap">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isLight
                ? 'bg-white hover:bg-slate-200/80 border-slate-300 text-slate-800'
                : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08] text-slate-300'
            }`}
            title="Export as Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5 opacity-70 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Export</span>
          </button>

        </div>

      </div>

      {/* Markdown Content Area */}
      <div className={`p-5 sm:p-7 overflow-x-auto leading-relaxed text-sm sm:text-base ${
        isLight ? 'text-slate-900 bg-white' : 'text-slate-200 bg-[#081220]/90'
      }`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-([\w+-]+)/.exec(className || '');
              const content = String(children).replace(/\n$/, '');
              const isMultiLine = content.includes('\n');
              const isBlock = !inline && (Boolean(match) || isMultiLine || Boolean(className));

              if (isBlock) {
                return (
                  <CodeBlock
                    language={match ? match[1] : ''}
                    value={content}
                    theme={theme}
                  />
                );
              }
              return (
                <code
                  className={`font-mono text-xs px-1.5 py-0.5 rounded-md border font-semibold ${
                    isLight
                      ? 'bg-sky-100/80 border-sky-300 text-sky-900'
                      : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300'
                  }`}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight pb-3 mb-4 border-b flex items-center gap-2 ${
                isLight ? 'text-slate-900 border-slate-200' : 'text-white border-white/[0.1]'
              }`}>
                <Sparkles className={`w-5 h-5 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className={`text-lg font-bold mt-6 mb-3 flex items-center gap-2 ${
                isLight ? 'text-sky-700' : 'text-cyan-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-sky-600' : 'bg-cyan-400'}`}></span>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className={`text-base font-semibold mt-4 mb-2 ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              }`}>
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className={`mb-4 leading-relaxed text-sm sm:text-base font-normal ${
                isLight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className={`list-disc list-inside space-y-1.5 mb-4 text-sm sm:text-base ${
                isLight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className={`list-decimal list-inside space-y-1.5 mb-4 text-sm sm:text-base ${
                isLight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                {children}
              </ol>
            ),
            table: ({ children }) => (
              <div className={`my-5 overflow-x-auto rounded-xl border shadow-md ${
                isLight ? 'border-slate-300' : 'border-white/[0.1]'
              }`}>
                <table className={`w-full text-left text-xs sm:text-sm border-collapse ${
                  isLight ? 'bg-white' : 'bg-[#040810]/80'
                }`}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className={`font-mono border-b uppercase text-[11px] tracking-wider ${
                isLight ? 'bg-slate-100 text-sky-800 border-slate-300' : 'bg-[#081220] text-cyan-300 border-white/[0.1]'
              }`}>
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="p-3 font-semibold">{children}</th>
            ),
            td: ({ children }) => (
              <td className={`p-3 border-t font-mono text-xs ${
                isLight ? 'border-slate-200 text-slate-800' : 'border-white/[0.05] text-slate-300'
              }`}>{children}</td>
            ),
          }}
        >
          {aiAnswer}
        </ReactMarkdown>
      </div>

    </div>
  );
}
