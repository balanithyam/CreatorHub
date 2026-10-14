import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Sparkles, Plus, ExternalLink, Bookmark, Lightbulb, 
  RefreshCw, Filter, Search, Youtube, Newspaper, MessageCircle, Flame, Check, HelpCircle, Link as LinkIcon, ArrowRight, Video, Gamepad2, Smartphone, Utensils, Dumbbell, Sparkle, Plane, DollarSign, Film
} from 'lucide-react';
import { api } from '../services/api';
import { Source } from '../types';
import { AIActionModal } from '../components/AIActionModal';

const NICHES = [
  { id: 'all', label: 'All Niches', icon: Sparkles },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'tech', label: 'Tech & Gadgets', icon: Smartphone },
  { id: 'food', label: 'Food & Cooking', icon: Utensils },
  { id: 'fitness', label: 'Fitness & Gym', icon: Dumbbell },
  { id: 'beauty', label: 'Beauty & Lifestyle', icon: Sparkle },
  { id: 'travel', label: 'Travel & Vlogs', icon: Plane },
  { id: 'finance', label: 'Finance & Hustle', icon: DollarSign },
  { id: 'entertainment', label: 'Entertainment', icon: Film },
];

export const DiscoverPage: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Live URL Importer State
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);

  // Custom Source Modal
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customCategory, setCustomCategory] = useState('tech');
  const [customPlatform, setCustomPlatform] = useState('YOUTUBE');
  const [customSummary, setCustomSummary] = useState('');

  const safeArray = (val: any) => Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);

  const fetchSources = async (niche = selectedNiche, query = searchQuery) => {
    try {
      setLoading(true);
      const params: any = {};
      if (niche && niche !== 'all') params.niche = niche;
      if (query && query.trim()) params.query = query.trim();

      const res = await api.get('/discover', { params });
      setSources(safeArray(res.data));
    } catch (err) {
      console.error('Failed to fetch discover feed', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSources(selectedNiche, searchQuery);
  }, [selectedNiche]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSources(selectedNiche, searchQuery);
  };

  const handleImportUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl.trim()) return;
    try {
      setImporting(true);
      const res = await api.post('/discover/import-url', { url: importUrl.trim() });
      const imported = res.data?.data || res.data;
      if (imported) {
        setSources([imported, ...sources]);
        setImportUrl('');
        showToast('🔗 Successfully imported video concept from link!');
      }
    } catch (err) {
      console.error('Failed to import URL', err);
      showToast('⚠️ Could not extract URL. Please check the link.');
    } finally {
      setImporting(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleTurnToIdea = async (source: Source) => {
    try {
      await api.post('/ideas', {
        title: source.title,
        summary: source.summary || `Discovered from ${source.platform}: ${source.url}`,
        sourceUrl: source.url,
        category: selectedNiche !== 'all' ? selectedNiche : 'General',
        tags: [...(source.topicTags || []), source.platform.toLowerCase()],
        status: 'DEVELOPING',
        priority: 'HIGH',
        targetFormat: 'video'
      });
      showToast(`💡 Turned "${source.title.slice(0, 30)}..." into a Content Idea!`);
    } catch (err) {
      console.error('Failed to turn source to idea', err);
    }
  };

  const handleSaveSource = async (source: Source) => {
    try {
      await api.post('/discover/save', {
        sourceId: source.sourceId || source._id,
        title: source.title,
        url: source.url,
        platform: source.platform,
        summary: source.summary,
        author: source.author,
        thumbnail: source.thumbnail,
        metrics: source.metrics,
        topicTags: source.topicTags
      });
      setSources(sources.map(s => (s.sourceId === source.sourceId ? { ...s, isSaved: true } : s)));
      showToast('🔖 Saved trend to your intelligence library');
    } catch (err) {
      console.error('Failed to save source', err);
    }
  };

  const handleOpenAiExplainer = (topic: string) => {
    setSelectedTopic(topic);
    setAiModalOpen(true);
  };

  const filteredSources = sources.filter(item => {
    const matchesPlatform = filterPlatform === 'ALL' || item.platform === filterPlatform;
    return matchesPlatform;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121316] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D2F800]/40 flex items-center gap-3 font-mono text-xs animate-slide-up">
          <Check className="w-4 h-4 text-[#D2F800]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* AI Action Modal */}
      <AIActionModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialAction="generate_hooks"
        contextData={{ title: selectedTopic }}
      />

      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E5E0D8] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#D2F800]/30 text-[#121316] text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-[#D2F800]">
              <Flame className="w-3.5 h-3.5 text-[#FF5A36]" />
              Universal Creator Radar
            </span>
            <span className="text-xs font-mono text-[#6B6864]">Gaming, Tech, Cooking, Fitness, Travel & Lifestyle</span>
          </div>
          <h1 className="text-3xl font-black text-[#121316] tracking-tight">
            Discover Viral Trends & Live Signals
          </h1>
          <p className="text-[#6B6864] text-sm mt-1 max-w-2xl">
            Real-time inspirations across every creator niche. Turn any trending video, discussion, or URL into high-retention hooks and blueprints in 1 click.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setRefreshing(true); fetchSources(selectedNiche, searchQuery); }}
            className="p-2.5 bg-[#FAF8F5] hover:bg-[#F4F0EA] border border-[#121316] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            title="Refresh live feeds"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#FF5A36]' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Live URL Importer Bar */}
      <div className="bg-[#FAF8F5] border-2 border-[#121316] rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleImportUrl} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#121316] flex-shrink-0">
            <LinkIcon className="w-4 h-4 text-[#FF5A36]" />
            <span>Import Any Link:</span>
          </div>
          <input
            type="url"
            placeholder="Paste any YouTube video, Instagram Reel, TikTok, or Reddit link..."
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            className="flex-1 w-full bg-white border border-[#121316] rounded-xl px-4 py-2.5 text-xs font-medium text-[#121316] placeholder:text-[#9E9B95] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
          />
          <button
            type="submit"
            disabled={importing || !importUrl.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#121316] hover:bg-[#2A2C32] text-white disabled:opacity-50 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            {importing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D2F800]" />
                Extracting...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#D2F800]" />
                Analyze & Extract
              </>
            )}
          </button>
        </form>
      </div>

      {/* Niche Selector Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B6864]">Select Creator Niche:</span>
          <span className="text-xs font-mono text-[#6B6864]">{filteredSources.length} trending concepts</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((niche) => {
            const Icon = niche.icon;
            const active = selectedNiche === niche.id;
            return (
              <button
                key={niche.id}
                onClick={() => setSelectedNiche(niche.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                  active 
                    ? 'bg-[#121316] text-white border-[#121316] shadow-sm' 
                    : 'bg-white hover:bg-[#FAF8F5] text-[#121316] border-[#E5E0D8]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#D2F800]' : 'text-[#6B6864]'}`} />
                {niche.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Search & Platform Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#6B6864] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search any keyword, challenge, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E5E0D8] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-[#121316] placeholder:text-[#9E9B95] focus:outline-none focus:border-[#121316]"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'YOUTUBE', 'REDDIT', 'NEWS', 'TRENDS'].map((plat) => (
            <button
              key={plat}
              onClick={() => setFilterPlatform(plat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterPlatform === plat 
                  ? 'bg-[#FF5A36] text-white' 
                  : 'bg-white text-[#6B6864] hover:text-[#121316] border border-[#E5E0D8]'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#FF5A36] mx-auto" />
          <p className="text-xs font-bold text-[#6B6864]">Scanning live YouTube, Reddit, and creator signals...</p>
        </div>
      )}

      {/* Grid of Sources */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map((source, index) => (
            <div 
              key={source._id || source.sourceId || index}
              className="bg-white rounded-2xl border border-[#E5E0D8] hover:border-[#121316] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Thumbnail Preview */}
                {source.thumbnail && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#121316]/5 border border-[#E5E0D8]">
                    <img 
                      src={source.thumbnail} 
                      alt={source.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-1 bg-[#121316]/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold rounded-lg uppercase">
                      {source.platform}
                    </span>
                    {source.trendScore && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#D2F800] text-[#121316] text-[10px] font-mono font-black rounded-md flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#FF5A36]" />
                        {source.trendScore} Hot
                      </span>
                    )}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-[#6B6864] line-clamp-1">{source.author || 'Creator Signal'}</span>
                  </div>
                  <h3 className="font-extrabold text-[#121316] text-sm leading-snug group-hover:text-[#FF5A36] transition-colors line-clamp-2">
                    {source.title}
                  </h3>
                  <p className="text-[#6B6864] text-xs mt-1.5 line-clamp-3 leading-relaxed">
                    {source.summary}
                  </p>
                </div>

                {/* Topic Tags */}
                {source.topicTags && source.topicTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {source.topicTags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#FAF8F5] text-[#6B6864] rounded text-[10px] font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTurnToIdea(source)}
                    className="px-3 py-1.5 bg-[#121316] hover:bg-[#FF5A36] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-[#D2F800]" />
                    Turn to Idea
                  </button>
                  <button
                    onClick={() => handleOpenAiExplainer(source.title)}
                    className="p-1.5 bg-[#FAF8F5] hover:bg-[#E5E0D8] text-[#121316] rounded-lg transition-all cursor-pointer"
                    title="Generate viral hooks with AI"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                  </button>
                </div>

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#6B6864] hover:text-[#121316] transition-colors cursor-pointer"
                    title="Open original source link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
