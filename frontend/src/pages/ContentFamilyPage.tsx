import React, { useState, useEffect } from 'react';
import { 
  Layers, Plus, Sparkles, ArrowRight, GitFork, RefreshCw, 
  Check, FileText, Video, Share2, Eye, Award, Clock, Flame, Film, MessageSquare, Linkedin, Twitter, Mail
} from 'lucide-react';
import { api } from '../services/api';
import { ContentItem } from '../types';

const safeArray = (val: any) => Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);

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

  // AI Repurpose state
  const [aiLoading, setAiLoading] = useState(false);
  const [repurposePlan, setRepurposePlan] = useState<any>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content');
      const items = safeArray(res.data);
      setContentList(items);
      if (items.length > 0) {
        const pillar = items.find((c: ContentItem) => !c.parentContentId) || items[0];
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
          { title: 'Extract 45s key highlight clip from Master Cut', completed: true },
          { title: 'Reframe to 9:16 vertical ratio for Reels/TikTok', completed: false },
          { title: 'Add kinetic captions & zoom-in transitions', completed: false }
        ]
      });

      const created = res.data?.data || res.data;
      setContentList([created, ...contentList]);
      setCreateModalOpen(false);
      setChildTitle('');
      setChildDesc('');
      showToast('⚡ Spawned new linked derivative asset in production pipeline!');
    } catch (err) {
      console.error('Failed to spawn derivative', err);
    }
  };

  const handleRunAiRepurpose = async () => {
    if (!selectedParent) return;
    try {
      setAiLoading(true);
      const res = await api.post('/ai/find-reusable', { title: selectedParent.title });
      if (res.data?.success) {
        setRepurposePlan(res.data.data);
        showToast('✨ AI generated multi-platform repurposing multiplier!');
      }
    } catch (err) {
      console.error('Failed to run AI repurposing', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Find pillars (items without parent) and children (items with parent)
  const pillars = contentList.filter(c => !c.parentContentId);
  const derivatives = selectedParent 
    ? contentList.filter(c => c.parentContentId === selectedParent._id)
    : [];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121316] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D2F800]/40 flex items-center gap-3 font-mono text-xs animate-slide-up">
          <Check className="w-4 h-4 text-[#D2F800]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#121316] text-white rounded-3xl p-6 lg:p-8 border-2 border-[#121316] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#D2F800] text-[#121316] text-xs font-mono font-black rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#121316]" />
              Asset Repurposing & Multiplier Engine
            </span>
            <span className="text-xs font-mono text-[#9E9B95]">Pillar-to-Derivative Architecture</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Content Family Ecosystem
          </h1>
          <p className="text-[#E5E0D8] text-sm mt-1 max-w-2xl">
            Never publish a video in isolation. Connect your master YouTube long-form video to 3 Shorts, an Instagram Carousel, and a newsletter while preserving asset lineage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 bg-[#D2F800] hover:bg-[#bce000] text-[#121316] font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#121316]" />
            Spawn Derivative Asset
          </button>
        </div>
      </div>

      {/* Multiplier Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border-2 border-[#121316] shadow-xs">
          <span className="text-xs font-mono uppercase text-[#6B6864] font-bold">Average Repurposing Rate</span>
          <div className="text-3xl font-black text-[#121316] mt-1">4.6x</div>
          <p className="text-xs text-[#6B6864] mt-1">4.6 micro-assets per master pillar video</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-[#121316] shadow-xs">
          <span className="text-xs font-mono uppercase text-[#6B6864] font-bold">Production Time Saved</span>
          <div className="text-3xl font-black text-[#FF5A36] mt-1">~16 hrs</div>
          <p className="text-xs text-[#6B6864] mt-1">By reusing core research and master footage</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-[#121316] shadow-xs">
          <span className="text-xs font-mono uppercase text-[#6B6864] font-bold">Audience Reach Multiplier</span>
          <div className="text-3xl font-black text-[#121316] mt-1">+320%</div>
          <p className="text-xs text-[#6B6864] mt-1">Cross-channel distribution synergy</p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Master Pillar Videos */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#121316] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="font-extrabold text-[#121316] text-sm">Pillar Content Masters</h3>
              <span className="text-xs font-mono font-bold text-[#6B6864]">{pillars.length} pillars</span>
            </div>

            <div className="space-y-2.5">
              {pillars.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedParent(item)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-1.5 ${
                    selectedParent?._id === item._id
                      ? 'bg-[#FAF8F5] border-[#121316] shadow-xs'
                      : 'bg-white border-[#E5E0D8] hover:border-[#121316]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#FF5A36] text-white text-[10px] font-mono font-bold rounded">
                      MASTER PILLAR
                    </span>
                    <span className="text-[10px] font-mono text-[#6B6864] uppercase">{item.format || 'YOUTUBE_LONG'}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#121316] leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-[#6B6864] line-clamp-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Connected Derivative Ecosystem & AI Generator (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedParent ? (
            <div className="bg-white rounded-2xl border-2 border-[#121316] p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div>
                  <span className="text-xs font-mono uppercase text-[#FF5A36] font-extrabold">Active Tree Root</span>
                  <h2 className="text-xl font-black text-[#121316]">{selectedParent.title}</h2>
                </div>

                <button
                  onClick={handleRunAiRepurpose}
                  disabled={aiLoading}
                  className="px-4 py-2 bg-[#121316] hover:bg-[#2A2C32] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D2F800]" />
                  {aiLoading ? 'Analyzing Footage...' : 'AI Repurpose Scan'}
                </button>
              </div>

              {/* Spawned Derivatives List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase text-[#121316] tracking-wider">
                    Connected Derivative Assets ({derivatives.length})
                  </h4>
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="text-xs font-bold text-[#FF5A36] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Asset
                  </button>
                </div>

                {derivatives.length === 0 && !repurposePlan && (
                  <div className="py-10 text-center rounded-xl border border-dashed border-[#E5E0D8] space-y-3 p-6">
                    <Layers className="w-8 h-8 text-[#9E9B95] mx-auto" />
                    <p className="text-xs font-semibold text-[#6B6864]">
                      No derivative assets spawned yet. Click "AI Repurpose Scan" to generate 3 Shorts, a Carousel, and an Email Newsletter!
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {derivatives.map((deriv) => (
                    <div key={deriv._id} className="p-4 bg-[#FAF8F5] border border-[#121316] rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#D2F800] text-[#121316] text-[10px] font-mono font-bold rounded">
                          {deriv.format || 'SHORT_REEL'}
                        </span>
                        <span className="text-[10px] font-mono text-[#6B6864]">LINKED TO PILLAR</span>
                      </div>
                      <h5 className="font-bold text-xs text-[#121316]">{deriv.title}</h5>
                      <p className="text-[11px] text-[#6B6864] line-clamp-2">{deriv.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Repurposing Recommendations */}
              {repurposePlan && (
                <div className="space-y-3 pt-4 border-t border-[#E5E0D8] animate-fade-in">
                  <h4 className="text-xs font-extrabold uppercase text-[#121316] tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D2F800]" />
                    AI Multiplier Blueprint for this Video:
                  </h4>
                  <div className="space-y-2.5">
                    {repurposePlan.reusableAssets?.map((asset: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-[#FFF9E6] border border-[#121316] rounded-xl flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-[#FF5A36] text-white text-[10px] font-mono font-bold rounded">
                              {asset.format}
                            </span>
                            <span className="text-xs font-bold text-[#121316]">{asset.title}</span>
                          </div>
                          <p className="text-[11px] text-[#6B6864]"><strong>Hook Strategy:</strong> {asset.hook || asset.length || 'High retention clip'}</p>
                        </div>
                        <button
                          onClick={() => {
                            setChildTitle(asset.title);
                            setChildFormat(asset.format);
                            setChildDesc(`Repurposed from "${selectedParent.title}". Strategy: ${asset.hook || ''}`);
                            setCreateModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-[#121316] text-white rounded-lg text-xs font-bold hover:bg-[#2A2C32] cursor-pointer whitespace-nowrap flex-shrink-0"
                        >
                          Deploy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-[#6B6864] bg-white rounded-2xl border-2 border-[#121316]">
              Select a pillar content master on the left.
            </div>
          )}
        </div>
      </div>

      {/* Spawn Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border-2 border-[#121316] rounded-2xl shadow-brutal p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#121316]">Spawn Derivative Asset</h3>
            <p className="text-xs text-[#6B6864]">
              Linking new asset to master pillar: <strong>"{selectedParent?.title}"</strong>
            </p>

            <form onSubmit={handleCreateDerivative} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#6B6864] mb-1">Asset Title:</label>
                <input
                  type="text"
                  required
                  value={childTitle}
                  onChange={(e) => setChildTitle(e.target.value)}
                  placeholder="e.g. 45s Hook Reel: The 10-Minute Ramen Broth Hack"
                  className="w-full bg-[#FAF8F5] border border-[#121316] rounded-xl px-4 py-2.5 text-xs font-medium text-[#121316] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#6B6864] mb-1">Target Format:</label>
                <select
                  value={childFormat}
                  onChange={(e) => setChildFormat(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#121316] rounded-xl px-4 py-2.5 text-xs font-bold text-[#121316] focus:outline-none"
                >
                  <option value="SHORT_REEL">📱 Short / Reel / TikTok (9:16)</option>
                  <option value="X_THREAD">🧵 X / Twitter Infographic Thread</option>
                  <option value="LINKEDIN_CAROUSEL">📑 LinkedIn Visual Carousel</option>
                  <option value="NEWSLETTER">✉️ Email Newsletter Deep Dive</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#6B6864] mb-1">Description & Repurposing Notes:</label>
                <textarea
                  rows={3}
                  value={childDesc}
                  onChange={(e) => setChildDesc(e.target.value)}
                  placeholder="Notes on the excerpt, key timestamps, or kinetic caption style..."
                  className="w-full bg-[#FAF8F5] border border-[#121316] rounded-xl p-3 text-xs font-medium text-[#121316] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B6864] hover:text-[#121316] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#121316] text-white rounded-xl text-xs font-bold hover:bg-[#2A2C32] cursor-pointer"
                >
                  Spawn to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
