import React from 'react';
import { Sparkles } from 'lucide-react';

const TOPIC_SUGGESTIONS = [
  { label: 'Hashing & Maps', query: 'Hashing and Map collision handling', difficulty: 'Easy', color: 'emerald' },
  { label: 'LRU Cache O(1)', query: 'Implement LRU Cache with get and put in O(1)', difficulty: 'Medium', color: 'cyan' },
  { label: "Kadane's Algo", query: "Kadane's Algorithm for Maximum Subarray Sum", difficulty: 'Medium', color: 'cyan' },
  { label: 'Cycle in Linked List', query: 'Detect Cycle in Linked List using slow and fast pointers', difficulty: 'Easy', color: 'emerald' },
  { label: 'Celebrity Problem', query: 'The Celebrity Problem using Stack optimal solution', difficulty: 'Medium', color: 'cyan' },
  { label: "Dijkstra's Algo", query: "Dijkstra's Shortest Path Algorithm using Priority Queue", difficulty: 'Hard', color: 'purple' },
  { label: '0/1 Knapsack DP', query: '0/1 Knapsack Problem DP memoization and tabulation', difficulty: 'Hard', color: 'purple' },
  { label: 'Trapping Rainwater', query: 'Trapping Rainwater two pointer approach', difficulty: 'Hard', color: 'purple' },
  { label: 'Sliding Window Max', query: 'Sliding Window Maximum using Deque', difficulty: 'Hard', color: 'purple' },
  { label: 'Merge K Sorted Lists', query: 'Merge K Sorted Lists using Min Heap', difficulty: 'Hard', color: 'purple' },
];

export default function TopicFilters({ onSelectTopic, currentQuery }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-0.5 no-scrollbar">
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 uppercase tracking-wider shrink-0 mr-1 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1.5 rounded-lg">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Topics:</span>
      </div>
      {TOPIC_SUGGESTIONS.map((topic, i) => {
        const isSelected = currentQuery.toLowerCase().includes(topic.label.toLowerCase().slice(0, 5));
        
        let diffColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (topic.difficulty === 'Medium') diffColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
        if (topic.difficulty === 'Hard') diffColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';

        return (
          <button
            key={i}
            onClick={() => onSelectTopic(topic.query)}
            className={`text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm ${
              isSelected
                ? 'bg-cyan-500/15 text-cyan-200 border-cyan-400/50 shadow-md shadow-cyan-500/15 ring-1 ring-cyan-400/30'
                : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border-white/[0.08] hover:border-cyan-500/30'
            }`}
          >
            <span>{topic.label}</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${diffColor}`}>
              {topic.difficulty}
            </span>
          </button>
        );
      })}
    </div>
  );
}
