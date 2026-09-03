import React from 'react';
import { Video, Play, ExternalLink, Clock, Sparkles } from 'lucide-react';

export default function VideoPlayer({ activeVideo, videoPlayerRef, theme }) {
  const isLight = theme === 'light';

  if (!activeVideo) {
    return (
      <div 
        ref={videoPlayerRef}
        className={`w-full rounded-2xl border p-8 text-center flex flex-col items-center justify-center gap-3 min-h-[260px] ${
          isLight
            ? 'bg-white border-slate-300 shadow-lg'
            : 'bg-[#081220]/80 border-white/[0.08]'
        }`}
      >
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
          isLight ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
        }`}>
          <Video className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>No Video Clip Selected</h4>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Search a DSA topic to auto-retrieve matched YouTube video clips.
          </p>
        </div>
      </div>
    );
  }

  const { video_id, start_time, title, channel_title } = activeVideo;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video_id}?start=${start_time || 0}&autoplay=1&rel=0`;
  const formattedTime = `${Math.floor((start_time || 0) / 60)}m ${(start_time || 0) % 60}s`;

  return (
    <div 
      ref={videoPlayerRef}
      className={`w-full rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300 ${
        isLight
          ? 'bg-white border-slate-300 shadow-slate-200/80'
          : 'bg-[#081220]/90 backdrop-blur-xl border-white/[0.12]'
      }`}
    >
      {/* Active Clip Header & Timestamp Banner */}
      <div className={`px-4 py-3 border-b flex items-center justify-between gap-2 ${
        isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#040810]/80 border-white/[0.08]'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className={`text-xs font-mono font-bold tracking-tight truncate ${
            isLight ? 'text-slate-900' : 'text-slate-200'
          }`}>
            {title || 'Lecture Clip'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
            isLight
              ? 'bg-sky-100 text-sky-800 border-sky-300'
              : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{formattedTime}</span>
          </span>
          <a
            href={`https://youtu.be/${video_id}?t=${start_time || 0}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1 rounded-md transition-colors ${
              isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
            title="Open on YouTube"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Responsive YouTube Player */}
      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={embedUrl}
          title={title || 'YouTube video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>

      {/* Channel info footer */}
      <div className={`px-4 py-2.5 text-xs font-mono flex items-center justify-between ${
        isLight ? 'bg-slate-50 text-slate-700 border-t border-slate-200' : 'bg-[#040810]/60 text-slate-400'
      }`}>
        <span>Channel: <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{channel_title || 'take U forward'}</strong></span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Deep-Linked Timestamp</span>
      </div>
    </div>
  );
}
