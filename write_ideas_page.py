code = r"""import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Plus, Lightbulb, Sparkles, Filter, MoreVertical, Trash2, ArrowRight, 
  CheckCircle2, Clock, Tag, Flame, AlertCircle, Check
} from 'lucide-react';
import { api } from '../services/api';
import { Idea } from '../types';
import { AIActionModal } from '../components/AIActionModal';

const COLUMNS = [
  { id: 'INBOX', label: 'Inbox', desc: 'Raw signals & ideas' },
  { id: 'DEVELOPING', label: 'Developing', desc: 'Research & angles' },
  { id: 'READY_FOR_BLUEPRINT', label: 'Ready for Script', desc: 'Approved for blueprint' },
  { id: 'IN_PRODUCTION', label: 'In Production', desc: 'Filming & editing' },
  { id: 'PUBLISHED', label: 'Published', desc: 'Live & distributing' },
];

export const IdeasPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const convertFromFeedback = searchParams.get('convertFromFeedback');

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedIdeaTitle, setSelectedIdeaTitle] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [targetFormat, setTargetFormat] = useState('YOUTUBE_LONG');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('Tech');
  const [tagsInput, setTagsInput] = useState('');

  const safeArray = (val: any) => Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ideas');
      setIdeas(safeArray(res.data));
    } catch (err) {
      console.error('Failed to load ideas', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  useEffect(() => {
    if (convertFromFeedback) {
      setCreateModalOpen(true);
      setTitle(`Audience Requested Topic #${convertFromFeedback.slice(-4)}`);
      setSummary(`Spawned directly from viewer community feedback ID: ${convertFromFeedback}`);
      setTagsInput('audience-request, community');
    }
  }, [convertFromFeedback]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const res = await api.post('/ideas', {
        title,
        summary,
        targetFormat,
        priority: priority.toLowerCase(),
        category,
        tags: tags.length > 0 ? tags : ['creator-hub'],
        status: 'INBOX',
        stage: 'inbox'
      });
      const created = res.data?.data || res.data;
      setIdeas([created, ...safeArray(ideas)]);
      setCreateModalOpen(false);
      setTitle('');
      setSummary('');
      setTagsInput('');
      showToast('New content idea added to Kanban board!');
    } catch (err) {
      console.error('Failed to create idea', err);
    }
  };

  const handleStatusChange = async (ideaId: string, newStatus: string) => {
    try {
      const res = await api.patch(`/ideas/${ideaId}/stage`, { stage: newStatus.toLowerCase(), status: newStatus });
      const updated = res.data?.data || res.data;
      setIdeas(safeArray(ideas).map(i => i._id === ideaId ? updated : i));
      showToast(`Moved to ${newStatus.replace(/_/g, ' ')}`);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    if (!window.confirm('Are you sure you want to delete this content idea?')) return;
    try {
      await api.delete(`/ideas/${ideaId}`);
      setIdeas(safeArray(ideas).filter(i => i._id !== ideaId));
      showToast('Idea removed');
    } catch (err) {
      console.error('Failed to delete idea', err);
    }
  };

  const currentIdeas = safeArray(ideas);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121316] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D2F800]/40 flex items-center gap-3 font-mono text-xs animate-slide-up">
          <Check className="w-4 h-4 text-[#D2F800]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-[#121316]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              Content Idea Pipeline
            </span>
            <span className="text-xs font-mono text-[#6B6864]">Visual Stage Management</span>
          </div>
          <h1 className="text-3xl font-black text-[#121316] tracking-tight">
            Idea Kanban Studio
          </h1>
          <p className="text-[#6B6864] text-sm mt-1 max-w-2xl">
            Organize sparks, prioritize angles, and advance qualified concepts from raw inbox to structured production blueprints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedIdeaTitle('');
              setAiModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#F4F0EA] text-[#121316] border border-[#121316]/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Hook & Angle Generator
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 bg-[#FF5A36] hover:bg-[#e04c2b] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Idea
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((c) => (
            <div key={c} className="bg-sand-50 rounded-2xl p-4 border border-charcoal-200 animate-pulse h-96" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {COLUMNS.map((col) => {
            const colIdeas = currentIdeas.filter(i => {
              const st = (i.status || i.stage || '').toUpperCase();
              return st === col.id || st === col.id.replace('READY_FOR_BLUEPRINT', 'READY');
            });
            return (
              <div key={col.id} className="bg-[#FAF8F5] rounded-3xl p-4 border-2 border-[#121316]/10 space-y-3 min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-[#121316]/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs uppercase font-mono text-[#121316]">{col.label}</h3>
                      <span className="w-5 h-5 rounded-full bg-gray-200 text-[#121316] text-[10px] font-mono font-bold flex items-center justify-center">
                        {colIdeas.length}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6B6864] font-mono mt-0.5">{col.desc}</p>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
                  {colIdeas.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-[#121316]/10 rounded-2xl text-[11px] text-[#6B6864] font-mono">
                      No cards here
                    </div>
                  ) : (
                    colIdeas.map((idea) => (
                      <div
                        key={idea._id}
                        className="bg-white rounded-2xl p-4 border-2 border-[#121316]/10 hover:border-[#121316] hover:shadow-md transition-all duration-200 space-y-3 group"
                      >
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            idea.priority === 'URGENT' || idea.priority === 'high' || idea.priority === 'HIGH' 
                              ? 'bg-[#FFEFEA] text-[#FF5A36]' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {idea.priority?.toUpperCase() || 'MEDIUM'}
                          </span>

                          <span className="px-2 py-0.5 bg-[#D2F800]/40 text-[#121316] rounded text-[9px] font-mono font-bold">
                            {(idea.targetFormat || 'VIDEO').replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-[#121316] group-hover:text-[#FF5A36] transition-colors leading-snug">
                            {idea.title}
                          </h4>
                          <p className="text-[11px] text-[#6B6864] line-clamp-2 mt-1 leading-relaxed">
                            {idea.summary}
                          </p>
                        </div>

                        {idea.tags && idea.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {idea.tags.slice(0, 2).map((t, idx) => (
                              <span key={idx} className="text-[9px] font-mono text-[#6B6864]">#{t}</span>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                          <select
                            value={idea.status || idea.stage || 'INBOX'}
                            onChange={(e) => handleStatusChange(idea._id, e.target.value)}
                            className="text-[10px] font-mono bg-[#FAF8F5] border border-gray-300 rounded-lg px-1.5 py-1 focus:outline-none text-[#121316] font-bold cursor-pointer"
                          >
                            {COLUMNS.map(c => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedIdeaTitle(idea.title);
                                setAiModalOpen(true);
                              }}
                              title="Generate AI Angles"
                              className="p-1 hover:bg-amber-50 text-amber-600 rounded cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              to={`/app/blueprints?createFromIdea=${idea._id}`}
                              title="Turn into Blueprint"
                              className="p-1 hover:bg-[#D2F800] text-[#121316] rounded"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => handleDeleteIdea(idea._id)}
                              title="Delete Idea"
                              className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Angle Modal */}
      <AIActionModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        mode="HOOK"
        initialContext={selectedIdeaTitle}
      />

      {/* Create Idea Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#121316]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full border-2 border-[#121316] shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#121316]">New Content Concept</h3>
                <p className="text-xs text-[#6B6864] font-mono">Add to your creative pipeline</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-[#6B6864] hover:text-[#121316] text-lg font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#121316] mb-1">Concept Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Why Most Next.js 15 Apps Crash in Production"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border-2 border-[#121316]/10 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#121316] mb-1">Concept Summary & Core Hook</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What is the core premise, tension, or insight of this content piece?"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border-2 border-[#121316]/10 rounded-xl text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#121316] mb-1">Target Format</label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border-2 border-[#121316]/10 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="YOUTUBE_LONG">YouTube Long Form</option>
                    <option value="SHORT_REEL">Short / Reel / TikTok</option>
                    <option value="PODCAST">Podcast Episode</option>
                    <option value="NEWSLETTER">Newsletter / Blog</option>
                    <option value="CAROUSEL">LinkedIn / IG Carousel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#121316] mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border-2 border-[#121316]/10 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent / Breaking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#121316] mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. tech, nextjs, react, bugs"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border-2 border-[#121316]/10 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B6864] hover:text-[#121316] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF5A36] hover:bg-[#e04c2b] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Idea
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

with open(r'D:\CreatorHub\frontend\src\pages\IdeasPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code.strip())

print("Updated IdeasPage.tsx!")
