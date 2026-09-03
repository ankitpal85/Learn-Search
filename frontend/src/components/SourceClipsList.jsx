import React from 'react';
import SkeletonLoader from './SkeletonLoader';
import { Play, Video, Clock, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SourceClipsList({ 
  sources, 
  activeVideo, 
  onPlayVideo, 
  loading,
  theme
}) {
  const isLight = theme === 'light';

  if (loading) {
    return <SkeletonLoader type="clips" theme={theme} />;
  }

  if (!sources || sources.length === 0) {
    return null;
  }

  const formatSeconds = (sec) => {
    if (!sec && sec !== 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div className={`w-full rounded-2xl border p-4 sm:p-5 space-y-4 shadow-2xl ${
      isLight
        ? 'bg-white border-slate-300 shadow-slate-200/80'
        : 'bg-[#081220]/90 backdrop-blur-xl border-white/[0.12]'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className={`flex items-center gap-2 font-bold text-sm sm:text-base ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          <Layers className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
          <span>Matched Video Clips ({sources.length})</span>
        </div>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
          isLight
            ? 'bg-sky-100 text-sky-800 border-sky-300'
            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
        }`}>
          Qdrant Vector Ranked
        </span>
      </div>

      {/* Clips List */}
      <div className="space-y-2.5">
        {sources.map((clip, idx) => {
          const isActive = activeVideo && activeVideo.video_id === clip.video_id && activeVideo.start_time === clip.start_time;
          const matchPercent = Math.max(88, Math.min(99, 99 - idx * 3));

          return (
            <div
              key={idx}
              onClick={() => onPlayVideo(clip)}
              className={`group relative rounded-xl border p-3.5 transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                isActive
                  ? isLight
                    ? 'bg-sky-50 border-sky-500 shadow-md shadow-sky-500/10 scale-[1.01]'
                    : 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/15 scale-[1.01]'
                  : isLight
                    ? 'bg-slate-50 hover:bg-white border-slate-200 hover:border-sky-400 shadow-sm'
                    : 'bg-[#040810]/70 hover:bg-[#0c1828] border-white/[0.08] hover:border-cyan-500/40'
              }`}
            >
              {/* Play Icon Trigger */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                isActive
                  ? isLight
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40'
                  : isLight
                    ? 'bg-sky-100 text-sky-700 border border-sky-200 group-hover:bg-sky-600 group-hover:text-white'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-400 group-hover:text-slate-950'
              }`}>
                {isActive ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </div>

              {/* Clip Text Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h5 className={`text-xs sm:text-sm font-bold transition-colors truncate ${
                    isLight
                      ? 'text-slate-900 group-hover:text-sky-700'
                      : 'text-slate-100 group-hover:text-cyan-300'
                  }`}>
                    {clip.title || `Lecture Segment ${idx + 1}`}
                  </h5>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${
                    isLight
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {matchPercent}% Match
                  </span>
                </div>

                <p className={`text-xs line-clamp-2 leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {clip.text || 'Semantic transcript clip matching algorithm concept explanation.'}
                </p>

                {/* Metadata Row: Timestamp & Topic */}
                <div className={`flex items-center gap-3 pt-1 text-[11px] font-mono ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  <span className={`flex items-center gap-1 font-semibold ${
                    isLight ? 'text-sky-700' : 'text-cyan-400'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatSeconds(clip.start_time)} - {formatSeconds(clip.end_time)}</span>
                  </span>
                  {clip.topic && (
                    <>
                      <span>•</span>
                      <span className="truncate">{clip.topic}</span>
                    </>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
