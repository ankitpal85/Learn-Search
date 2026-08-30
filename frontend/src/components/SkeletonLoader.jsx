import React from 'react';

export function NotesSkeleton() {
  return (
    <div className="py-4 flex flex-col gap-6 animate-pulse">
      {/* Title skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-md bg-white/[0.06]"></div>
        <div className="h-5 w-48 bg-white/[0.06] rounded-md"></div>
      </div>

      {/* Paragraph skeleton */}
      <div className="flex flex-col gap-2.5">
        <div className="h-4 w-full bg-white/[0.04] rounded"></div>
        <div className="h-4 w-11/12 bg-white/[0.04] rounded"></div>
        <div className="h-4 w-4/5 bg-white/[0.04] rounded"></div>
      </div>

      {/* Code block skeleton */}
      <div className="rounded-xl border border-white/[0.06] bg-[#020408]/60 p-4 flex flex-col gap-2">
        <div className="h-3.5 w-24 bg-white/[0.08] rounded"></div>
        <div className="h-3.5 w-3/4 bg-white/[0.04] rounded"></div>
        <div className="h-3.5 w-5/6 bg-white/[0.04] rounded"></div>
        <div className="h-3.5 w-1/2 bg-white/[0.04] rounded"></div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-white/[0.06] overflow-hidden">
        <div className="h-8 bg-white/[0.06] w-full"></div>
        <div className="h-7 bg-white/[0.02] border-t border-white/[0.04] w-full"></div>
        <div className="h-7 bg-white/[0.02] border-t border-white/[0.04] w-full"></div>
      </div>
    </div>
  );
}

export function ClipsSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3.5 rounded-xl border border-white/[0.04] bg-slate-900/30 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-36 bg-white/[0.06] rounded"></div>
            <div className="h-3.5 w-12 bg-white/[0.06] rounded"></div>
          </div>
          <div className="h-3 w-full bg-white/[0.03] rounded"></div>
          <div className="h-3 w-4/5 bg-white/[0.03] rounded"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-3 w-20 bg-white/[0.04] rounded"></div>
            <div className="h-3 w-12 bg-white/[0.04] rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
