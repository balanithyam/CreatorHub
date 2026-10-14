import React, { useState, useEffect } from 'react';
import { 
  Bookmark, Plus, ExternalLink, Sparkles, Trash2, Tag, Search, 
  Lightbulb, FileText, CheckCircle2, Check, Quote, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchItem } from '../types';

const safeArray = (val: any) => Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);

export const ResearchPage: React.FC = () => {
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState('Tech');
  const [keyPointsInput, setKeyPointsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const fetchResearch = async () => {
    try {
      setLoading(true);
      const res = await api.get('/research');
      setResearchItems(safeArray(res.data));
    } catch (err) {
      console.error('Failed to load research', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const keyPoints = keyPointsInput.split('\n').map(p => p.trim()).filter(Boolean);
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      const res = await api.post('/research', {
        title,
        content,
        sourceUrl,
        category,
        keyPoints,
        tags: tags.length > 0 ? tags : ['research']
      });

      const newItem = res.data?.data || res.data;
      setResearchItems([newItem, ...researchItems]);
      setCreateModalOpen(false);
      setTitle('');
      setContent('');
      setSourceUrl('');
      setKeyPointsInput('');
      setTagsInput('');
      showToast('Research card pinned to board!');
    } catch (err) {
      console.error('Failed to create research item', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this research card?')) return;
    try {
      await api.delete(`/research/${id}`);
      setResearchItems(researchItems.filter(r => r._id !== id));
      showToast('Research card removed');
    } catch (err) {
      console.error('Failed to delete research', err);
    }
  };

  const handleConvertToIdea = async (item: ResearchItem) => {
    try {
      await api.post('/ideas', {
        title: `Deep Dive: ${item.title}`,
        summary: item.content.slice(0, 180) + '...',
        sourceUrl: item.sourceUrl,
        category: item.category || 'Tech',
        tags: [...(item.tags || []), 'synthesized-research'],
        status: 'DEVELOPING',
        priority: 'HIGH',
        targetFormat: 'YOUTUBE_LONG'
      });
      showToast(`Created content idea from research!`);
    } catch (err) {
      console.error('Failed to convert research to idea', err);
    }
  };

  const allTags = Array.from(new Set(researchItems.flatMap(r => r.tags || [])));

  const filteredItems = researchItems.filter(item => {
    const matchesTag = selectedTag === 'ALL' || item.tags?.includes(selectedTag);
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-lime-400/40 flex items-center gap-3 font-mono text-xs animate-slide-up">
          <Check className="w-4 h-4 text-lime-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-charcoal-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-lime-100 text-lime-900 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-lime-700" />
              Intelligence Wall
            </span>
            <span className="text-xs font-mono text-charcoal-500">Source Extracts, Quotes & Proof Points</span>
          </div>
          <h1 className="text-3xl font-black text-charcoal-950 tracking-tight">
            Research & Talking Points
          </h1>
          <p className="text-charcoal-600 text-sm mt-1 max-w-2xl">
            Save verified facts, benchmark results, audience quotes, and breakdown notes to ground every video and thread in solid evidence.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4 text-lime-400" />
          Add Research Note
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-charcoal-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search research cards, quotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-sand-50 border border-charcoal-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-coral-500 outline-none"
          />
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedTag('ALL')}
            className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] whitespace-nowrap transition-all ${
              selectedTag === 'ALL'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'bg-sand-50 text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            ALL TAGS
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-lime-400 text-charcoal-950 shadow-sm'
                  : 'bg-sand-50 text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Research Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-sand-50 rounded-3xl p-6 border border-charcoal-200 animate-pulse h-64" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-200 space-y-3">
          <Bookmark className="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 className="text-lg font-bold text-charcoal-900">No research cards match your criteria</h3>
          <p className="text-xs text-charcoal-500">Save trend cards from Discover or pin notes directly here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl p-6 border border-charcoal-200/90 hover:border-charcoal-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-sand-100 text-charcoal-700 text-[10px] font-mono font-bold rounded-md uppercase">
                    {item.category || 'NOTE'}
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-charcoal-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-base text-charcoal-900 leading-snug group-hover:text-coral-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-charcoal-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                {/* Key Points Bullet List */}
                {item.keyPoints && item.keyPoints.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-charcoal-100">
                    <span className="text-[10px] font-mono font-bold uppercase text-charcoal-400">Key Takeaways:</span>
                    {item.keyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-charcoal-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                        <span className="leading-snug">{pt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags & Link */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    {item.tags?.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-mono text-charcoal-400">#{t}</span>
                    ))}
                  </div>

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-mono text-charcoal-500 hover:text-coral-600 flex items-center gap-1"
                    >
                      Source Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Bottom */}
              <div className="pt-3 border-t border-charcoal-100">
                <button
                  onClick={() => handleConvertToIdea(item)}
                  className="w-full px-3 py-2 bg-sand-50 hover:bg-sand-100 border border-charcoal-200 rounded-xl text-xs font-bold text-charcoal-900 transition-all flex items-center justify-center gap-2"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Convert to Content Idea
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Research Note Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full border border-charcoal-200 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-charcoal-900">Pin Research Dossier</h3>
                <p className="text-xs text-charcoal-500 font-mono">Store facts, benchmarks, and talking points</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateResearch} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Research Subject / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bun 1.2 vs Node 22 Benchmark Statistics"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Synthesis & Summary Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed breakdown, quotes, arguments..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Key Talking Points (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="Point 1&#10;Point 2&#10;Point 3"
                  value={keyPointsInput}
                  onChange={(e) => setKeyPointsInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none resize-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Source URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  >
                    <option value="Tech">Tech</option>
                    <option value="AI">AI</option>
                    <option value="Creator">Creator Economy</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Monetization">Monetization</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="benchmarks, perf, javascript"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-charcoal-900 hover:bg-coral-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Pin to Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};