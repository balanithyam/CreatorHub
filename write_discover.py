code = r"""import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Sparkles, Plus, ExternalLink, Bookmark, Lightbulb, 
  RefreshCw, Filter, Search, Youtube, Newspaper, MessageCircle, Flame, Check, HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Source } from '../types';
import { AIActionModal } from '../components/AIActionModal';

export const DiscoverPage: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterPlatform, setFilterPlatform] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Custom Source Modal
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customCategory, setCustomCategory] = useState('Tech');
  const [customPlatform, setCustomPlatform] = useState('RSS_FEED');
  const [customSummary, setCustomSummary] = useState('');

  const fetchSources = async () => {
    try {
      setLoading(true);
      const res = await api.get('/discover');
      setSources(res.data);
    } catch (err) {
      console.error('Failed to fetch discover feeds', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSources();
    setRefreshing(false);
    showToast('Live trends refreshed from web sources');
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleTurnIntoIdea = async (source: Source) => {
    try {
      await api.post('/ideas', {
        title: `Content Angle: ${source.title}`,
        summary: source.summary || `Derived from trending discovery: ${source.url}`,
        sourceUrl: source.url,
        sourcePlatform: source.platform,
        category: source.category || 'Tech',
        tags: [source.platform.toLowerCase(), 'trending', source.category?.toLowerCase() || 'general'],
        status: 'INBOX',
        priority: 'MEDIUM',
        targetFormat: 'YOUTUBE_LONG'
      });
      showToast(`Created new Idea from "${source.title.slice(0, 30)}..."`);
    } catch (err) {
      console.error('Failed to turn into idea', err);
    }
  };

  const handleSaveToResearch = async (source: Source) => {
    try {
      await api.post('/research', {
        title: source.title,
        content: source.summary || source.snippet || 'Saved directly from live radar.',
        sourceUrl: source.url,
        category: source.category || 'Tech',
        tags: [source.platform.toLowerCase(), 'live-discovery'],
        keyPoints: [
          'High audience resonance detected',
          'Potential cross-platform derivative opportunity',
          `Published via ${source.platform}`
        ]
      });
      showToast(`Saved to Research Wall!`);
    } catch (err) {
      console.error('Failed to save to research', err);
    }
  };

  const handleAddCustomSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/discover', {
        title: customTitle,
        url: customUrl,
        category: customCategory,
        platform: customPlatform,
        summary: customSummary || 'Manually tracked creator intelligence source.',
        trendScore: 85
      });
      setSources([res.data, ...sources]);
      setCustomModalOpen(false);
      setCustomTitle('');
      setCustomUrl('');
      setCustomSummary('');
      showToast('Custom trend source added to radar!');
    } catch (err) {
      console.error('Failed to add custom source', err);
    }
  };

  const filteredSources = sources.filter(s => {
    const matchesCat = filterCategory === 'ALL' || s.category?.toUpperCase() === filterCategory;
    const matchesPlat = filterPlatform === 'ALL' || s.platform?.toUpperCase() === filterPlatform;
    const matchesQuery = !searchQuery || 
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesPlat && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-lime-400/40 flex items-center gap-3 animate-slide-up font-mono text-xs">
          <Check className="w-4 h-4 text-lime-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-charcoal-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-coral-100 text-coral-800 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-coral-600" />
              Live Web Radar
            </span>
            <span className="text-xs font-mono text-charcoal-500">Real-time RSS, Trends, YouTube & Discussion Signals</span>
          </div>
          <h1 className="text-3xl font-black text-charcoal-950 tracking-tight">
            Discover What's Trending Now.
          </h1>
          <p className="text-charcoal-600 text-sm mt-1 max-w-2xl">
            Never stare at a blank page. Monitor breakout discussions, analyze viral angles, and turn verified web intelligence straight into production-ready blueprints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 bg-sand-100 hover:bg-sand-200 text-charcoal-900 border border-charcoal-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-coral-500' : ''}`} />
            {refreshing ? 'Scanning Web...' : 'Refresh Radar'}
          </button>

          <button
            onClick={() => setCustomModalOpen(true)}
            className="px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4 text-lime-400" />
            Track Custom RSS/Link
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-charcoal-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search trend topics, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-sand-50/70 border border-charcoal-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-coral-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-sand-50 p-1 rounded-xl border border-charcoal-200/80 text-xs">
            {['ALL', 'TECH', 'AI', 'CREATOR', 'CODING', 'DESIGN'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all ${
                  filterCategory === cat
                    ? 'bg-charcoal-900 text-white shadow-sm'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1 bg-sand-50 p-1 rounded-xl border border-charcoal-200/80 text-xs">
            {['ALL', 'YOUTUBE', 'REDDIT', 'RSS_FEED', 'TRENDS'].map((plat) => (
              <button
                key={plat}
                onClick={() => setFilterPlatform(plat)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all ${
                  filterPlatform === plat
                    ? 'bg-coral-500 text-white shadow-sm'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                {plat === 'RSS_FEED' ? 'NEWS' : plat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-charcoal-200 animate-pulse space-y-4">
              <div className="h-4 bg-sand-200 rounded w-1/3" />
              <div className="h-6 bg-sand-200 rounded w-3/4" />
              <div className="h-16 bg-sand-200 rounded w-full" />
              <div className="h-8 bg-sand-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-200 space-y-4">
          <TrendingUp className="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 className="text-lg font-bold text-charcoal-900">No trending sources found for this filter</h3>
          <p className="text-xs text-charcoal-500 max-w-md mx-auto">
            Try switching filters or add a custom RSS link to start tracking your preferred creator topics.
          </p>
          <button
            onClick={() => { setFilterCategory('ALL'); setFilterPlatform('ALL'); setSearchQuery(''); }}
            className="px-4 py-2 bg-charcoal-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map((source) => (
            <div
              key={source._id}
              className="bg-white rounded-3xl p-6 border border-charcoal-200/90 hover:border-charcoal-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Platform & Trend Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-charcoal-100 text-charcoal-800 text-[10px] font-mono font-bold rounded-md uppercase flex items-center gap-1">
                      {source.platform === 'YOUTUBE' && <Youtube className="w-3 h-3 text-red-600" />}
                      {source.platform === 'REDDIT' && <MessageCircle className="w-3 h-3 text-orange-600" />}
                      {source.platform === 'RSS_FEED' && <Newspaper className="w-3 h-3 text-blue-600" />}
                      {source.platform}
                    </span>
                    <span className="text-[10px] font-mono text-charcoal-400">
                      {source.category || 'General'}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 bg-lime-100 text-lime-900 text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 text-lime-600" />
                    {source.trendScore || 85} Score
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-black text-base text-charcoal-950 leading-snug group-hover:text-coral-600 transition-colors">
                  {source.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-charcoal-600 leading-relaxed line-clamp-3">
                  {source.summary || source.snippet || 'Extracted intelligence topic ready for synthesis.'}
                </p>

                {/* Direct Link */}
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-charcoal-400 hover:text-charcoal-700 flex items-center gap-1 pt-1"
                  >
                    View raw source <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-charcoal-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSaveToResearch(source)}
                    className="px-3 py-2 bg-sand-50 hover:bg-sand-100 border border-charcoal-200/80 rounded-xl text-xs font-bold text-charcoal-800 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-charcoal-600" />
                    Save Research
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTopic(source.title);
                      setAiModalOpen(true);
                    }}
                    className="px-3 py-2 bg-sand-50 hover:bg-sand-100 border border-charcoal-200/80 rounded-xl text-xs font-bold text-charcoal-800 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    AI Angles
                  </button>
                </div>

                <button
                  onClick={() => handleTurnIntoIdea(source)}
                  className="w-full px-3 py-2.5 bg-charcoal-900 hover:bg-coral-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-lime-400" />
                  Turn into Content Idea
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Angle Assistant Modal */}
      <AIActionModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        mode="EXPLAIN"
        initialContext={selectedTopic}
      />

      {/* Custom Source Modal */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full border border-charcoal-200 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-charcoal-900">Track Custom Intelligence Feed</h3>
                <p className="text-xs text-charcoal-500 font-mono">Add any RSS feed, YouTube URL, or Reddit community</p>
              </div>
              <button onClick={() => setCustomModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleAddCustomSource} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Source Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OpenAI Announces GPT-5 Developer Beta"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Source URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://news.ycombinator.com/item?id=..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Platform</label>
                  <select
                    value={customPlatform}
                    onChange={(e) => setCustomPlatform(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  >
                    <option value="RSS_FEED">News / RSS</option>
                    <option value="YOUTUBE">YouTube</option>
                    <option value="REDDIT">Reddit</option>
                    <option value="TRENDS">Google Trends</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  >
                    <option value="Tech">Tech</option>
                    <option value="AI">AI</option>
                    <option value="Creator">Creator Economy</option>
                    <option value="Coding">Coding</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Key Context / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Why is this relevant? What is the creator angle?"
                  value={customSummary}
                  onChange={(e) => setCustomSummary(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Add to Radar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
"""
with open(r'D:\CreatorHub\frontend\src\pages\DiscoverPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code.strip())
print("Wrote DiscoverPage.tsx successfully!")
