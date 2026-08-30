import React from 'react';
import { ListVideo, Clock, Play, Sparkles } from 'lucide-react';
import { ClipsSkeleton } from './SkeletonLoader';

export default function SourceClipsList({ sources, activeVideo, onPlayVideo, loading }) {
  return (
    <div className="neural-card p-4 sm:p-5 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ListVideo className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Matched Video Transcripts ({sources.length})
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
          Ranked by Qdrant
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <ClipsSkeleton />
      ) : sources.length === 0 ? (
        <div className="py-10 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-slate-600 mb-1" />
          <p>No video clips found for this query yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
          {sources.map((item, idx) => {
            const isCurrent = activeVideo?.id === item.id;
            const matchPercent = Math.round((item.score || 0.6) * 100);

            // Match pill color
            let matchColor = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
            if (matchPercent >= 85) {
              matchColor = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
            } else if (matchPercent < 70) {
              matchColor = 'bg-purple-500/10 text-purple-300 border-purple-500/30';
            }

            return (
              <div
                key={item.id || idx}
                onClick={() => onPlayVideo(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative group ${
                  isCurrent
                    ? 'bg-[#0b172a] border-cyan-400/60 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400/40'
                    : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] hover:border-cyan-500/30 hover:-translate-y-0.5'
                }`}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onPlayVideo(item);
                  }
                }}
              >
                {/* Title & Match Score */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="text-xs font-bold text-slate-100 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 font-bold ${matchColor}`}>
                    {matchPercent}% Match
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-[11.5px] text-slate-400 line-clamp-2 italic leading-relaxed font-sans">
                  "{item.text}"
                </p>

                {/* Footer Time & Play status */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-indigo-300 text-[11px] bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{item.start_fmt} - {item.end_fmt}</span>
                  </div>

                  <span
                    className={`font-bold text-[11px] flex items-center gap-1.5 ${
                      isCurrent
                        ? 'text-cyan-300'
                        : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  >
                    {isCurrent ? (
                      <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded-md border border-cyan-400/30">
                        {/* Audio equalizer animation */}
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-1"></span>
                          <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-2"></span>
                          <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-3"></span>
                        </div>
                        <span>Playing Clip</span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 group-hover:text-cyan-300">
                        <Play className="w-3 h-3 fill-slate-400 group-hover:fill-cyan-300" />
                        <span>Jump to Clip</span>
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
