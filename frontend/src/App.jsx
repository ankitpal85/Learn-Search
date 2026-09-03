import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import TopicFilters from './components/TopicFilters';
import NotesViewer from './components/NotesViewer';
import VideoPlayer from './components/VideoPlayer';
import SourceClipsList from './components/SourceClipsList';
import { BookOpen, Video, Activity, Sparkles, Sun, Moon } from 'lucide-react';

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
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'

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

  // Sync data-theme attribute on <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col antialiased relative cyber-grid transition-colors duration-300 ${
      isLight
        ? 'bg-[#f8fafc] text-[#0f172a]'
        : 'bg-[#040810] text-[#f1f5f9]'
    }`}>
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {isLight ? (
          <>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-sky-400/10 rounded-full blur-[130px] animate-pulse"></div>
            <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[150px]"></div>
          </>
        ) : (
          <>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-cyan-500/10 rounded-full blur-[130px] animate-pulse"></div>
            <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px]"></div>
          </>
        )}
      </div>

      {/* Header / Navbar */}
      <div className="relative z-50">
        <Navbar
          stats={stats}
          onFocusSearch={focusSearchInput}
          onRandomTopic={handleRandomTopic}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </div>

      {/* Mobile Tab Switcher */}
      <div className={`lg:hidden px-4 pt-3 pb-1 border-b backdrop-blur-xl sticky top-[64px] z-40 ${
        isLight ? 'bg-white/95 border-slate-200' : 'bg-[#040810]/95 border-white/[0.08]'
      }`}>
        <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#081220] border-white/[0.08]'
        }`}>
          <button
            onClick={() => setMobileTab('notes')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'notes'
                ? isLight
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI Solution Notes</span>
          </button>
          <button
            onClick={() => setMobileTab('video')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'video'
                ? isLight
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Clips ({sources.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="relative z-10 flex-1 max-w-[1480px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (7 COLS): SEARCH, TOPICS, AND REVISION NOTES */}
        <section
          className={`lg:col-span-7 flex flex-col gap-4 ${
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
            theme={theme}
          />

          {/* Recommended Topic Chips */}
          <TopicFilters
            onSelectTopic={(q) => handleSearch(q)}
            currentQuery={query}
            theme={theme}
          />

          {/* AI Notes Viewer */}
          <NotesViewer
            aiAnswer={aiAnswer}
            loading={loading}
            activeTopic={query}
            theme={theme}
          />
        </section>

        {/* RIGHT COLUMN (5 COLS): VIDEO PLAYER & MATCHED CLIPS */}
        <aside
          className={`lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-[84px] ${
            mobileTab === 'video' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Video Player */}
          <VideoPlayer
            activeVideo={activeVideo}
            videoPlayerRef={videoPlayerRef}
            theme={theme}
          />

          {/* Clips List */}
          <SourceClipsList
            sources={sources}
            activeVideo={activeVideo}
            onPlayVideo={handlePlayVideo}
            loading={loading}
            theme={theme}
          />
        </aside>

      </main>

      {/* Telemetry Footer */}
      <footer className={`relative z-10 border-t py-5 px-6 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-700 shadow-inner'
          : 'bg-[#03060c] border-white/[0.08] text-slate-400'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full animate-pulse bg-emerald-500"></div>
          <span className="font-bold tracking-tight">
            AlgoMind <span className={`font-mono ${isLight ? 'text-sky-600' : 'text-cyan-400'}`}>AI v2.4</span>
          </span>
          <span>•</span>
          <span>High-Performance Neural RAG Architecture</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] opacity-80">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Activity className="w-3 h-3" />
            <span>Qdrant Connected</span>
          </span>
          <span>•</span>
          <span>Striver A2Z DSA Index</span>
        </div>
      </footer>
    </div>
  );
}
