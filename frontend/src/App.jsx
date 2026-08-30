import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import TopicFilters from './components/TopicFilters';
import NotesViewer from './components/NotesViewer';
import VideoPlayer from './components/VideoPlayer';
import SourceClipsList from './components/SourceClipsList';
import { BookOpen, Video, Activity } from 'lucide-react';

const RANDOM_TOPICS = [
  'Hashing and Map collision handling',
  'Implement LRU Cache with get and put in O(1)',
  "Kadane's Algorithm for Maximum Subarray Sum",
  'Detect Cycle in Linked List using slow and fast pointers',
  'The Celebrity Problem using Stack optimal solution',
  "Dijkstra's Shortest Path Algorithm using Priority Queue",
  '0/1 Knapsack Problem DP memoization and tabulation',
  'Trapping Rainwater two pointer approach',
  'Sliding Window Maximum using Deque',
  'Merge K Sorted Lists using Min Heap',
  'Median of Two Sorted Arrays using Binary Search',
  'Longest Increasing Subsequence DP with Binary Search',
];

const INITIAL_QUERY = 'Hashing and Map collision handling';

export default function App() {
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total_points: 3950, total_videos: 315 });
  const [aiAnswer, setAiAnswer] = useState(null);
  const [sources, setSources] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [mobileTab, setMobileTab] = useState('notes'); // 'notes' | 'video'

  const searchInputRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const initialSearchTriggered = useRef(false);

  const executeSearch = useCallback(async (searchQuery) => {
    const q = searchQuery.trim();
    if (!q) return;
    setLoading(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, limit: 3 }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiAnswer(data.answer);
        setSources(data.sources || []);
        if (data.sources && data.sources.length > 0) {
          setActiveVideo(data.sources[0]);
        }
      } else {
        setAiAnswer(`**Error**: ${data.detail || 'Failed to fetch AI notes'}`);
      }
    } catch (err) {
      setAiAnswer(`**Network Error**: Server not responding (${err.message})`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats and run initial query on mount
  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.total_points) setStats(data);
      })
      .catch(() => {});

    if (!initialSearchTriggered.current) {
      initialSearchTriggered.current = true;
      executeSearch(INITIAL_QUERY);
    }
  }, [executeSearch]);

  const handleSearch = (searchQuery) => {
    const q = (searchQuery !== undefined ? searchQuery : query);
    setQuery(q);
    executeSearch(q);
  };

  const handleRandomTopic = () => {
    const random = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    handleSearch(random);
  };

  // Keyboard shortcut listener (/ or Ctrl+K to search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) &&
        document.activeElement !== searchInputRef.current
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePlayVideo = (video) => {
    setActiveVideo(video);
    setMobileTab('video');
    if (videoPlayerRef.current) {
      videoPlayerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const focusSearchInput = () => {
    searchInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#040810] text-[#f1f5f9] antialiased selection:bg-cyan-400 selection:text-black relative cyber-grid">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] animate-glow-wave"></div>
        <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]"></div>
      </div>

      {/* Header / Navbar */}
      <div className="relative z-50">
        <Navbar
          stats={stats}
          onFocusSearch={focusSearchInput}
          onRandomTopic={handleRandomTopic}
        />
      </div>

      {/* Mobile Tab Switcher (Visible on small screens) */}
      <div className="lg:hidden px-4 pt-3 pb-1 border-b border-white/[0.08] bg-[#040810]/95 backdrop-blur-xl sticky top-[57px] z-40">
        <div className="grid grid-cols-2 gap-2 bg-[#081220] p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setMobileTab('notes')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'notes'
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI Solution Notes</span>
          </button>
          <button
            onClick={() => setMobileTab('video')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'video'
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Clips ({sources.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-[1480px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================
            LEFT COLUMN (7 COLS): SEARCH, TOPICS, AND REVISION NOTES
        ======================================================== */}
        <section
          className={`lg:col-span-7 flex flex-col gap-3.5 ${
            mobileTab === 'notes' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Command Dock Search Box */}
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={(q) => handleSearch(q)}
            loading={loading}
            inputRef={searchInputRef}
          />

          {/* Quick Topic Chips with Difficulty Pills */}
          <TopicFilters
            onSelectTopic={(q) => handleSearch(q)}
            currentQuery={query}
          />

          {/* Revision Notes Markdown Viewer */}
          <NotesViewer
            aiAnswer={aiAnswer}
            loading={loading}
            activeTopic={query}
          />
        </section>

        {/* ========================================================
            RIGHT COLUMN (5 COLS): VIDEO PLAYER & MATCHED CLIPS
        ======================================================== */}
        <aside
          className={`lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-[80px] ${
            mobileTab === 'video' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Embedded Video Theater */}
          <VideoPlayer
            activeVideo={activeVideo}
            videoPlayerRef={videoPlayerRef}
          />

          {/* Matched Video Clips List */}
          <SourceClipsList
            sources={sources}
            activeVideo={activeVideo}
            onPlayVideo={handlePlayVideo}
            loading={loading}
          />
        </aside>

      </main>

      {/* Futuristic Telemetry Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#03060c] py-5 px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="font-bold text-slate-200 tracking-tight">
            DSA.MATRIX <span className="text-cyan-400 font-mono">v2.4</span>
          </span>
          <span>•</span>
          <span className="text-slate-400">High-Performance Neural RAG Architecture</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
          <span className="flex items-center gap-1 text-emerald-400/90">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Qdrant Connected</span>
          </span>
          <span>•</span>
          <span>Striver A2Z DSA Complete Index</span>
        </div>
      </footer>
    </div>
  );
}
