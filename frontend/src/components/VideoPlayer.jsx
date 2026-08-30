import React from 'react';
import { ExternalLink, Play, MonitorPlay } from 'lucide-react';

export default function VideoPlayer({ activeVideo, videoPlayerRef }) {
  const getEmbedUrl = (video) => {
    if (!video) return '';
    const videoId = video.video_id;
    const startSec = Math.floor(video.start || 0);
    return `https://www.youtube.com/embed/${videoId}?start=${startSec}&autoplay=1&rel=0`;
  };

  return (
    <div ref={videoPlayerRef} className="neural-card p-4 sm:p-5 flex flex-col gap-3.5 relative">
      {/* Active Video Player Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
            <MonitorPlay className="w-4 h-4 text-cyan-400" />
            {activeVideo ? (
              <span className="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                {activeVideo.start_fmt} - {activeVideo.end_fmt}
              </span>
            ) : (
              'Lecture Preview'
            )}
          </span>
        </div>

        {activeVideo?.youtube_url && (
          <a
            href={activeVideo.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-mono transition-all cursor-pointer shadow-sm shadow-cyan-500/10"
            title="Open lecture on YouTube at exact timestamp"
          >
            <span>Open YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Embedded Frame with Ambient Glow */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/90 border border-white/[0.1] shadow-2xl flex items-center justify-center group">
        {activeVideo ? (
          <iframe
            src={getEmbedUrl(activeVideo)}
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-none"
          ></iframe>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2.5 text-slate-500 text-xs text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400">
              <Play className="w-6 h-6 ml-0.5 text-slate-400" />
            </div>
            <span className="max-w-xs font-medium text-slate-400">
              Select any timestamped video clip from below to jump straight to the explanation
            </span>
          </div>
        )}
      </div>

      {/* Video Title and Context */}
      {activeVideo && (
        <div className="flex flex-col gap-1 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
          <div className="text-xs sm:text-sm text-slate-100 font-bold leading-snug line-clamp-2">
            {activeVideo.title}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-cyan-400/90 font-medium">
              Timestamp: {activeVideo.start_fmt} → {activeVideo.end_fmt}
            </span>
            <span className="text-slate-500">Striver's DSA Lecture</span>
          </div>
        </div>
      )}
    </div>
  );
}
