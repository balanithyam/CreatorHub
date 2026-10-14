# 1. DiscoverPage
discover_code = r"""import React, { useState, useEffect } from 'react';
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

  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customCategory, setCustomCategory] = useState('Tech');
  const [customPlatform, setCustomPlatform] = useState('RSS_FEED');
  const [customSummary, setCustomSummary] = useState('');

  const safeArray = (val: any) => Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);

  const fetchSources = async () => {
    try {
      setLoading(true);
      const res = await api.get('/discover');
      setSources(safeArray(res.data));
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
      setSources([res.data?.data || res.data, ...safeArray(sources)]);
      setCustomModalOpen(false);
      setCustomTitle('');
      setCustomUrl('');
      setCustomSummary('');
      showToast('Custom trend source added to radar!');
    } catch (err) {
      console.error('Failed to add custom source', err);
    }
  };

  const currentSources = safeArray(sources);
  const filteredSources = currentSources.filter(s => {
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#121316] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D2F800]/40 flex items-center gap-3 animate-slide-up font-mono text-xs">
          <Check className="w-4 h-4 text-[#D2F800]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-[#121316]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#FFEFEA] text-[#FF5A36] text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FF5A36]" />
              Live Web Radar
            </span>
            <span className="text-xs font-mono text-[#6B6864]">Real-time RSS, Trends, YouTube & Discussion Signals</span>
          </div>
          <h1 className="text-3xl font-black text-[#121316] tracking-tight">
            Discover What's Trending Now.
          </h1>
          <p className="text-[#6B6864] text-sm mt-1 max-w-2xl">
            Never stare at a blank page. Monitor breakout discussions, analyze viral angles, and turn verified web intelligence straight into production-ready blueprints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#F4F0EA] text-[#121316] border-2 border-[#121316]/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#FF5A36]' : ''}`} />
            {refreshing ? 'Scanning Web...' : 'Refresh Radar'}
          </button>

          <button
            onClick={() => setCustomModalOpen(true)}
            className="px-4 py-2.5 bg-[#121316] hover:bg-[#FF5A36] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D2F800]" />
            Track Custom RSS/Link
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border-2 border-[#121316]/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6864]" />
          <input
            type="text"
            placeholder="Search trend topics, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border-2 border-[#121316]/10 rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#121316]/10 text-xs">
            {['ALL', 'TECH', 'AI', 'CREATOR', 'CODING', 'DESIGN'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[#121316] text-white shadow-sm'
                    : 'text-[#6B6864] hover:text-[#121316]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#121316]/10 text-xs">
            {['ALL', 'YOUTUBE', 'REDDIT', 'RSS_FEED', 'TRENDS'].map((plat) => (
              <button
                key={plat}
                onClick={() => setFilterPlatform(plat)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all cursor-pointer ${
                  filterPlatform === plat
                    ? 'bg-[#FF5A36] text-white shadow-sm'
                    : 'text-[#6B6864] hover:text-[#121316]'
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
            <div key={n} className="bg-white rounded-3xl p-6 border-2 border-[#121316]/10 animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-16 bg-gray-200 rounded w-full" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-[#121316]/10 space-y-4">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-[#121316]">No trending sources found for this filter</h3>
          <p className="text-xs text-[#6B6864] max-w-md mx-auto">
            Try switching filters or add a custom RSS link to start tracking your preferred creator topics.
          </p>
          <button
            onClick={() => { setFilterCategory('ALL'); setFilterPlatform('ALL'); setSearchQuery(''); }}
            className="px-4 py-2 bg-[#121316] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map((source) => (
            <div
              key={source._id || source.sourceId}
              className="bg-white rounded-3xl p-6 border-2 border-[#121316]/10 hover:border-[#121316] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Platform & Trend Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-gray-100 text-[#121316] text-[10px] font-mono font-bold rounded-md uppercase flex items-center gap-1">
                      {source.platform === 'YOUTUBE' || source.platform === 'youtube' ? <Youtube className="w-3 h-3 text-red-600" /> : null}
                      {source.platform === 'REDDIT' || source.platform === 'reddit' ? <MessageCircle className="w-3 h-3 text-orange-600" /> : null}
                      {source.platform === 'RSS_FEED' || source.platform === 'news' ? <Newspaper className="w-3 h-3 text-blue-600" /> : null}
                      {source.platform}
                    </span>
                    <span className="text-[10px] font-mono text-[#6B6864]">
                      {source.category || 'General'}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 bg-[#D2F800]/40 text-[#121316] text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-600" />
                    {source.trendScore || 85} Score
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-black text-base text-[#121316] leading-snug group-hover:text-[#FF5A36] transition-colors">
                  {source.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-[#6B6864] leading-relaxed line-clamp-3">
                  {source.summary || source.snippet || 'Extracted intelligence topic ready for synthesis.'}
                </p>

                {/* Direct Link */}
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-[#6B6864] hover:text-[#121316] flex items-center gap-1 pt-1"
                  >
                    View raw source <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSaveToResearch(source)}
                    className="px-3 py-2 bg-[#FAF8F5] hover:bg-[#F4F0EA] border border-[#121316]/20 rounded-xl text-xs font-bold text-[#121316] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-[#6B6864]" />
                    Save Research
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTopic(source.title);
                      setAiModalOpen(true);
                    }}
                    className="px-3 py-2 bg-[#FAF8F5] hover:bg-[#F4F0EA] border border-[#121316]/20 rounded-xl text-xs font-bold text-[#121316] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    AI Angles
                  </button>
                </div>

                <button
                  onClick={() => handleTurnIntoIdea(source)}
                  className="w-full px-3 py-2.5 bg-[#121316] hover:bg-[#FF5A36] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-[#D2F800]" />
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
    </div>
  );
};
"""

with open(r'D:\CreatorHub\frontend\src\pages\DiscoverPage.tsx', 'w', encoding='utf-8') as f:
    f.write(discover_code.strip())

print("Updated DiscoverPage.tsx!")
