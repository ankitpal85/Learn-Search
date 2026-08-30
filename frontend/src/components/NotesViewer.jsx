import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  Copy,
  Check,
  AlertCircle,
  Volume2,
  VolumeX,
  Share2,
  Printer,
  Zap,
} from 'lucide-react';
import CodeBlock from './CodeBlock';
import { NotesSkeleton } from './SkeletonLoader';

export default function NotesViewer({ aiAnswer, loading, activeTopic }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopyNotes = () => {
    if (!aiAnswer) return;
    navigator.clipboard.writeText(aiAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `DSA Notes: ${activeTopic || 'Revision'}`,
        text: aiAnswer,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleTextToSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Clean markdown tags for clear speech
      const cleanText = aiAnswer
        .replace(/[#*`_~|>-]/g, ' ')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .slice(0, 1500); // Read first 1500 chars

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isError = aiAnswer && (aiAnswer.startsWith('**Error**') || aiAnswer.startsWith('**Network Error**'));

  return (
    <div className="neural-card p-5 sm:p-7 flex flex-col mt-3 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                AI Revision Solution & Architecture
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold">
                High-Yield
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Synthesized from Striver's Lecture Transcripts & Qdrant Chunks
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        {aiAnswer && !loading && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Read */}
            <button
              onClick={handleTextToSpeech}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border-white/[0.08]'
              }`}
              title={isSpeaking ? 'Stop reading' : 'Read notes aloud'}
              aria-label="Read notes aloud"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
              title="Print / Save PDF"
              aria-label="Print notes"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
              title="Share notes"
              aria-label="Share notes"
            >
              {shared ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Copy Full Notes */}
            <button
              onClick={handleCopyNotes}
              className="flex items-center gap-1.5 text-xs text-cyan-200 hover:text-white px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 transition-all cursor-pointer font-mono font-semibold shadow-sm active:scale-95"
              aria-label="Copy full revision notes"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Notes Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy Notes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div>
        {loading ? (
          <NotesSkeleton />
        ) : isError ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3.5 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-rose-200 text-sm">Failed to generate revision notes</span>
              <div className="dsa-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiAnswer}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : aiAnswer ? (
          <div className="dsa-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
              }}
            >
              {aiAnswer}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
              <Zap className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <span className="text-sm font-semibold text-white">Ask any DSA Question or pick a Topic</span>
              <p className="text-slate-500 text-xs">
                The Neural Engine will analyze 3,950+ video transcripts and generate structured revision notes with optimal code.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
