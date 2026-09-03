import React from 'react';
import { Flame, Code2, Zap, Trophy, Lightbulb } from 'lucide-react';

const FEATURED_TOPICS = [
  { name: 'LRU Cache O(1)', query: 'Implement LRU Cache with get and put in O(1)', level: 'Hard' },
  { name: "Kadane's Algorithm", query: "Kadane's Algorithm for Maximum Subarray Sum", level: 'Medium' },
  { name: 'Cycle Detection', query: 'Detect Cycle in Linked List using slow and fast pointers', level: 'Easy' },
  { name: "Dijkstra's Shortest Path", query: "Dijkstra's Shortest Path Algorithm using Priority Queue", level: 'Hard' },
  { name: '0/1 Knapsack DP', query: '0/1 Knapsack Problem DP memoization and tabulation', level: 'Medium' },
  { name: 'Celebrity Problem', query: 'The Celebrity Problem using Stack optimal solution', level: 'Medium' },
  { name: 'Trapping Rainwater', query: 'Trapping Rainwater two pointer approach', level: 'Hard' },
];

export default function TopicFilters({ onSelectTopic, currentQuery, theme }) {
  const isLight = theme === 'light';

  const getBadgeColor = (level) => {
    switch (level) {
      case 'Easy':
        return isLight
          ? 'text-emerald-700 bg-emerald-100 border-emerald-300'
          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Medium':
        return isLight
          ? 'text-amber-800 bg-amber-100 border-amber-300'
          : 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Hard':
        return isLight
          ? 'text-rose-800 bg-rose-100 border-rose-300'
          : 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return isLight
          ? 'text-sky-800 bg-sky-100 border-sky-300'
          : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className={`flex items-center justify-between px-1 text-xs font-mono ${
        isLight ? 'text-slate-600' : 'text-slate-400'
      }`}>
        <span className={`flex items-center gap-1.5 font-bold tracking-wider uppercase ${
          isLight ? 'text-slate-900' : 'text-slate-300'
        }`}>
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Recommended High-Yield Topics</span>
        </span>
        <span className="text-[11px] opacity-75 hidden sm:inline">
          Striver's A2Z Core Sheet
        </span>
      </div>

      {/* Topics Scrollable Container */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
        {FEATURED_TOPICS.map((topic, idx) => {
          const isActive = currentQuery.toLowerCase().includes(topic.name.toLowerCase());
          return (
            <button
              key={idx}
              onClick={() => onSelectTopic(topic.query)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? isLight
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20 scale-[1.02]'
                    : 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 scale-[1.02]'
                  : isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
                    : 'bg-[#081220]/80 hover:bg-[#0e1c30] border-white/[0.08] hover:border-cyan-500/30 text-slate-300'
              }`}
            >
              <span>{topic.name}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono border ${getBadgeColor(topic.level)}`}>
                {topic.level}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
