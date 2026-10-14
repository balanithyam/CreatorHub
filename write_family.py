code = r"""import React, { useState, useEffect } from 'react';
import { 
  Layers, Plus, Sparkles, ArrowRight, GitFork, RefreshCw, 
  Check, FileText, Video, Share2, Eye, Award, Clock
} from 'lucide-react';
import { api } from '../services/api';
import { ContentItem } from '../types';

export const ContentFamilyPage: React.FC = () => {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState<ContentItem | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [childTitle, setChildTitle] = useState('');
  const [childFormat, setChildFormat] = useState('SHORT_REEL');
  const [childDesc, setChildDesc] = useState('');

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content');
      setContentList(res.data);
      if (res.data.length > 0 && !selectedParent) {
        // Pick first pillar or item
        const pillar = res.data.find((c: ContentItem) => !c.parentContentId) || res.data[0];
        setSelectedParent(pillar);
      }
    } catch (err) {
      console.error('Failed to load content family', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateDerivative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParent) return;
    try {
      const res = await api.post('/content', {
        title: childTitle,
        format: childFormat,
        description: childDesc || `Derivative asset repurposed from master pillar "${selectedParent.title}"`,
        parentContentId: selectedParent._id,
        status: 'PRODUCTION',
        tasks: [
          { title: 'Extract key highlight clip', completed: false },
          { title: 'Reframe to 9:16 vertical ratio', completed: false },
          { title: 'Add kinetic captions and hook text', completed: false }
        ]
      });

      setContentList([res.data, ...contentList]);
      setCreateModalOpen(false);
      setChildTitle('');
      setChildDesc('');
      showToast('🎉 Created linked derivative asset!');
    } catch (err) {
      console.error('Failed to spawn derivative', err);
    }
  };

  // Find pillars (items without parent) and children (items with parent)
  const pillars = contentList.filter(c => !c.parentContentId);
  const derivatives = selectedParent 
    ? contentList.filter(c => c.parentContentId === selectedParent._id)
    : [];

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
      <div className="bg-charcoal-900 text-white rounded-3xl p-6 lg:p-8 border border-charcoal-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-lime-400 text-charcoal-950 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-charcoal-950" />
              Asset Repurposing & Multiplier Engine
            </span>
            <span className="text-xs font-mono text-charcoal-400">Pillar-to-Derivative Architecture</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Content Family Ecosystem
          </h1>
          <p className="text-charcoal-300 text-sm mt-1 max-w-2xl">
            Never publish a single piece of content in isolation. Connect long-form pillar videos to micro-hooks, carousels, newsletters, and shorts while preserving asset lineage.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 text-charcoal-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Spawn Derivative Asset
        </button>
      </div>

      {/* Multiplier KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-charcoal-200/90 shadow-sm space-y-1">
          <span className="text-xs font-mono font-bold text-charcoal-400 uppercase">Average Repurposing Rate</span>
          <div className="text-3xl font-black text-charcoal-950 mt-1">4.6x</div>
          <p className="text-xs text-lime-600 font-mono font-bold">4.6 micro-assets per master pillar</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-charcoal-200/90 shadow-sm space-y-1">
          <span className="text-xs font-mono font-bold text-charcoal-400 uppercase">Estimated Production Time Saved</span>
          <div className="text-3xl font-black text-coral-600 mt-1">~16 hrs</div>
          <p className="text-xs text-charcoal-500 font-mono">By reusing core research dossiers</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-charcoal-200/90 shadow-sm space-y-1">
          <span className="text-xs font-mono font-bold text-charcoal-400 uppercase">Audience Reach Multiplier</span>
          <div className="text-3xl font-black text-charcoal-950 mt-1">+320%</div>
          <p className="text-xs text-charcoal-500 font-mono">Cross-channel distribution synergy</p>
        </div>
      </div>

      {/* Main Family Tree Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 4 Cols: Pillar Selector */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-charcoal-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <h3 className="font-bold text-xs uppercase font-mono text-charcoal-800">Pillar Content Masters</h3>
            <span className="text-xs font-mono text-charcoal-400">{pillars.length} pillars</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {pillars.map((pillar) => {
              const childCount = contentList.filter(c => c.parentContentId === pillar._id).length;
              return (
                <div
                  key={pillar._id}
                  onClick={() => setSelectedParent(pillar)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedParent?._id === pillar._id
                      ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-md'
                      : 'bg-sand-50/70 hover:bg-sand-100/80 border-charcoal-200/80 text-charcoal-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedParent?._id === pillar._id
                        ? 'bg-charcoal-800 text-lime-400'
                        : 'bg-sand-200 text-charcoal-800'
                    }`}>
                      {pillar.format}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-lime-500 flex items-center gap-1">
                      <GitFork className="w-3 h-3" /> {childCount} derivatives
                    </span>
                  </div>

                  <h4 className="font-bold text-xs line-clamp-1">{pillar.title}</h4>
                  <p className={`text-[11px] line-clamp-1 ${
                    selectedParent?._id === pillar._id ? 'text-charcoal-300' : 'text-charcoal-500'
                  }`}>
                    {pillar.description || 'Pillar master asset.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Visual Lineage Tree Diagram */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 lg:p-8 border border-charcoal-200/90 shadow-sm space-y-6">
          {selectedParent ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-charcoal-100">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-coral-600">Active Family Lineage Tree</span>
                  <h2 className="text-xl font-black text-charcoal-950 mt-0.5">{selectedParent.title}</h2>
                </div>

                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Derivative
                </button>
              </div>

              {/* Visual Parent Node */}
              <div className="p-6 bg-charcoal-900 text-white rounded-3xl border border-charcoal-800 shadow-lg space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-lime-400 text-charcoal-950 text-xs font-mono font-bold rounded-full flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Master Pillar Content
                  </span>
                  <span className="text-xs font-mono text-charcoal-400">
                    Status: <strong className="text-white">{selectedParent.status}</strong>
                  </span>
                </div>

                <h3 className="text-lg font-bold">{selectedParent.title}</h3>
                <p className="text-xs text-charcoal-300">{selectedParent.description}</p>
              </div>

              {/* Connecting Tree Branch Indicator */}
              <div className="flex items-center justify-center py-2">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-charcoal-300" />
                  <span className="px-3 py-1 bg-sand-100 text-charcoal-700 text-[10px] font-mono font-bold rounded-full border border-charcoal-300">
                    Repurposed Into {derivatives.length} Micro-Assets
                  </span>
                  <div className="w-0.5 h-6 bg-charcoal-300" />
                </div>
              </div>

              {/* Derivatives Grid */}
              {derivatives.length === 0 ? (
                <div className="p-8 text-center bg-sand-50 rounded-2xl border border-dashed border-charcoal-300 text-xs text-charcoal-500">
                  No derivatives created for this pillar yet. Click "Spawn Derivative Asset" to generate vertical shorts, carousels, or threads!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {derivatives.map((deriv) => (
                    <div
                      key={deriv._id}
                      className="p-5 bg-sand-50/80 hover:bg-sand-100 border border-charcoal-200/90 rounded-2xl shadow-sm space-y-3 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-coral-100 text-coral-900 text-[10px] font-mono font-bold rounded">
                          {deriv.format}
                        </span>
                        <span className="text-[10px] font-mono text-charcoal-400">
                          {deriv.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-charcoal-900">{deriv.title}</h4>
                      <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                        {deriv.description}
                      </p>

                      <div className="pt-2 border-t border-charcoal-200/60 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-charcoal-500">
                          {deriv.tasks?.filter(t => t.completed).length || 0}/{deriv.tasks?.length || 0} tasks done
                        </span>
                        <span className="text-coral-600 font-bold text-xs flex items-center gap-1">
                          In Production <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-20 text-charcoal-400 font-mono text-xs">
              Select a pillar content master on the left.
            </div>
          )}
        </div>

      </div>

      {/* Spawn Derivative Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full border border-charcoal-200 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-charcoal-900">Spawn Linked Derivative Asset</h3>
                <p className="text-xs text-charcoal-500 font-mono">Repurpose from: {selectedParent?.title.slice(0, 30)}...</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateDerivative} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Derivative Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 45-Second Hook Clip: Why Next.js 15 Breaks"
                  value={childTitle}
                  onChange={(e) => setChildTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Target Derivative Format</label>
                <select
                  value={childFormat}
                  onChange={(e) => setChildFormat(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                >
                  <option value="SHORT_REEL">Short / Reel / TikTok (9:16)</option>
                  <option value="CAROUSEL">LinkedIn / Instagram Carousel</option>
                  <option value="NEWSLETTER">Substack / Blog Breakdown</option>
                  <option value="THREAD">X / Twitter Thread</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Repurposing Strategy / Focus Angle</label>
                <textarea
                  rows={3}
                  placeholder="Which specific timestamp or insight from the pillar video is being extracted?"
                  value={childDesc}
                  onChange={(e) => setChildDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none resize-none"
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
                  className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 text-charcoal-950 font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Create Derivative Asset
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
with open(r'D:\CreatorHub\frontend\src\pages\ContentFamilyPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code.strip())
print("Wrote ContentFamilyPage.tsx successfully!")
