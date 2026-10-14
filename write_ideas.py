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

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ideas');
      setIdeas(res.data);
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
        priority,
        category,
        tags: tags.length > 0 ? tags : ['creator-hub'],
        status: 'INBOX'
      });
      setIdeas([res.data, ...ideas]);
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
      const res = await api.patch(`/ideas/${ideaId}`, { status: newStatus });
      setIdeas(ideas.map(i => i._id === ideaId ? res.data : i));
      showToast(`Moved to ${newStatus.replace(/_/g, ' ')}`);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    if (!window.confirm('Are you sure you want to delete this content idea?')) return;
    try {
      await api.delete(`/ideas/${ideaId}`);
      setIdeas(ideas.filter(i => i._id !== ideaId));
      showToast('Idea removed');
    } catch (err) {
      console.error('Failed to delete idea', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
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
            <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              Content Idea Pipeline
            </span>
            <span className="text-xs font-mono text-charcoal-500">Visual Stage Management</span>
          </div>
          <h1 className="text-3xl font-black text-charcoal-950 tracking-tight">
            Idea Kanban Studio
          </h1>
          <p className="text-charcoal-600 text-sm mt-1 max-w-2xl">
            Organize sparks, prioritize angles, and advance qualified concepts from raw inbox to structured production blueprints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedIdeaTitle('');
              setAiModalOpen(true);
            }}
            className="px-4 py-2.5 bg-sand-100 hover:bg-sand-200 text-charcoal-900 border border-charcoal-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Hook & Angle Generator
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-coral-500/20"
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
            const colIdeas = ideas.filter(i => i.status === col.id);
            return (
              <div key={col.id} className="bg-sand-50/70 rounded-3xl p-4 border border-charcoal-200/80 space-y-3 min-h-[500px] flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-charcoal-200/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs uppercase font-mono text-charcoal-900">{col.label}</h3>
                      <span className="w-5 h-5 rounded-full bg-charcoal-200 text-charcoal-800 text-[10px] font-mono font-bold flex items-center justify-center">
                        {colIdeas.length}
                      </span>
                    </div>
                    <p className="text-[10px] text-charcoal-400 font-mono mt-0.5">{col.desc}</p>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
                  {colIdeas.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-charcoal-200 rounded-2xl text-[11px] text-charcoal-400 font-mono">
                      No cards here
                    </div>
                  ) : (
                    colIdeas.map((idea) => (
                      <div
                        key={idea._id}
                        className="bg-white rounded-2xl p-4 border border-charcoal-200/90 hover:border-charcoal-400 hover:shadow-md transition-all duration-200 space-y-3 group"
                      >
                        {/* Meta Tags */}
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            idea.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                            idea.priority === 'HIGH' ? 'bg-coral-100 text-coral-800' :
                            'bg-charcoal-100 text-charcoal-700'
                          }`}>
                            {idea.priority}
                          </span>

                          <span className="px-2 py-0.5 bg-sand-100 text-charcoal-800 rounded text-[9px] font-mono font-bold">
                            {idea.targetFormat?.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Title & Summary */}
                        <div>
                          <h4 className="font-bold text-xs text-charcoal-900 group-hover:text-coral-600 transition-colors leading-snug">
                            {idea.title}
                          </h4>
                          <p className="text-[11px] text-charcoal-600 line-clamp-2 mt-1 leading-relaxed">
                            {idea.summary}
                          </p>
                        </div>

                        {/* Tags */}
                        {idea.tags && idea.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {idea.tags.slice(0, 2).map((t, idx) => (
                              <span key={idx} className="text-[9px] font-mono text-charcoal-400">#{t}</span>
                            ))}
                          </div>
                        )}

                        {/* Stage Selector & Actions */}
                        <div className="pt-2 border-t border-charcoal-100 flex items-center justify-between gap-2">
                          <select
                            value={idea.status}
                            onChange={(e) => handleStatusChange(idea._id, e.target.value)}
                            className="text-[10px] font-mono bg-sand-50 border border-charcoal-200 rounded-lg px-1.5 py-1 focus:outline-none text-charcoal-700 font-bold"
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
                              className="p-1 hover:bg-amber-50 text-amber-600 rounded"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              to={`/app/blueprints?createFromIdea=${idea._id}`}
                              title="Turn into Blueprint"
                              className="p-1 hover:bg-lime-100 text-charcoal-900 rounded"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => handleDeleteIdea(idea._id)}
                              title="Delete Idea"
                              className="p-1 hover:bg-red-50 text-charcoal-400 hover:text-red-500 rounded"
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
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full border border-charcoal-200 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-charcoal-900">New Content Concept</h3>
                <p className="text-xs text-charcoal-500 font-mono">Add to your creative pipeline</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Concept Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Why Most Next.js 15 Apps Crash in Production"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Concept Summary & Core Hook</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What is the core premise, tension, or insight of this content piece?"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Target Format</label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  >
                    <option value="YOUTUBE_LONG">YouTube Long Form</option>
                    <option value="SHORT_REEL">Short / Reel / TikTok</option>
                    <option value="PODCAST">Podcast Episode</option>
                    <option value="NEWSLETTER">Newsletter / Blog</option>
                    <option value="CAROUSEL">LinkedIn / IG Carousel</option>
                    <option value="THREAD">X / Twitter Thread</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent / Breaking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. tech, nextjs, react, bugs"
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
                  className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
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
print("Wrote IdeasPage.tsx successfully!")
