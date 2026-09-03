import React from 'react';

export default function SkeletonLoader({ type = 'notes', theme }) {
  const isLight = theme === 'light';

  if (type === 'clips') {
    return (
      <div className={`w-full rounded-2xl border p-4 space-y-3 animate-shimmer ${
        isLight ? 'bg-white border-slate-300' : 'bg-[#081220]/80 border-white/[0.08]'
      }`}>
        <div className={`h-4 rounded-md w-1/3 ${isLight ? 'bg-slate-200' : 'bg-white/[0.08]'}`}></div>
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-3.5 rounded-xl border space-y-2 ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#040810]/60 border-white/[0.05]'
            }`}>
              <div className={`h-4 rounded w-3/4 ${isLight ? 'bg-slate-300' : 'bg-white/[0.08]'}`}></div>
              <div className={`h-3 rounded w-full ${isLight ? 'bg-slate-200' : 'bg-white/[0.05]'}`}></div>
              <div className={`h-3 rounded w-1/2 ${isLight ? 'bg-slate-200' : 'bg-white/[0.05]'}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-2xl border p-6 sm:p-8 space-y-6 animate-shimmer shadow-2xl ${
      isLight ? 'bg-white border-slate-300' : 'bg-[#081220]/90 backdrop-blur-xl border-white/[0.12]'
    }`}>
      {/* Header skeleton */}
      <div className={`flex items-center justify-between border-b pb-4 ${
        isLight ? 'border-slate-200' : 'border-white/[0.08]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-lg ${isLight ? 'bg-sky-200' : 'bg-cyan-500/20'}`}></div>
          <div className={`h-6 rounded-md w-48 ${isLight ? 'bg-slate-200' : 'bg-white/[0.1]'}`}></div>
        </div>
        <div className={`h-8 rounded-lg w-28 ${isLight ? 'bg-slate-200' : 'bg-white/[0.06]'}`}></div>
      </div>

      {/* Body paragraphs skeleton */}
      <div className="space-y-3">
        <div className={`h-4 rounded w-full ${isLight ? 'bg-slate-200' : 'bg-white/[0.08]'}`}></div>
        <div className={`h-4 rounded w-11/12 ${isLight ? 'bg-slate-200' : 'bg-white/[0.08]'}`}></div>
        <div className={`h-4 rounded w-4/5 ${isLight ? 'bg-slate-200' : 'bg-white/[0.08]'}`}></div>
      </div>

      {/* Table skeleton */}
      <div className={`my-4 p-4 rounded-xl border space-y-2 ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#040810]/80 border-white/[0.08]'
      }`}>
        <div className={`h-4 rounded w-1/4 ${isLight ? 'bg-sky-200' : 'bg-cyan-500/20'}`}></div>
        <div className={`h-10 rounded w-full ${isLight ? 'bg-slate-200' : 'bg-white/[0.05]'}`}></div>
        <div className={`h-10 rounded w-full ${isLight ? 'bg-slate-200' : 'bg-white/[0.05]'}`}></div>
      </div>

      {/* Code block skeleton */}
      <div className={`rounded-xl border p-4 space-y-2 ${
        isLight ? 'bg-slate-900 border-slate-700' : 'bg-[#03060c] border-white/[0.08]'
      }`}>
        <div className="h-4 bg-slate-700 rounded w-1/6"></div>
        <div className="h-24 bg-slate-800 rounded w-full"></div>
      </div>
    </div>
  );
}
