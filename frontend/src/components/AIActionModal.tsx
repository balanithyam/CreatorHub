import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, Loader2, Wand2, Flame, Video, Image, Layers, MessageSquare, ArrowRight } from 'lucide-react';
import api from '../services/api';

interface AIActionModalProps {
  mode?: string;
  initialContext?: any;
  isOpen: boolean;
  onClose: () => void;
  initialAction?: string;
  contextData?: any;
}

export const AIActionModal: React.FC<AIActionModalProps> = ({
  isOpen,
  onClose,
  initialAction = 'titles_and_thumbnails',
  contextData,
}) => {
  const [topic, setTopic] = useState(contextData?.title || contextData?.topic || '10-Minute Japanese Street Ramen (3 Grocery Store Hacks)');
  const [niche, setNiche] = useState('food');
  const [actionType, setActionType] = useState(initialAction);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAI = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      if (actionType === 'titles_and_thumbnails') {
        const res = await api.post('/ai/titles-thumbnails', { topic, niche });
        if (res.data?.success) setResponse({ type: 'titles_and_thumbnails', data: res.data.data });
      } else if (actionType === 'improve_hook') {
        const res = await api.post('/ai/improve-hook', { currentHook: topic, niche });
        if (res.data?.success) setResponse({ type: 'hooks', data: res.data.data });
      } else if (actionType === 'short_script') {
        const res = await api.post('/ai/short-script', { topic, niche });
        if (res.data?.success) setResponse({ type: 'short_script', data: res.data.data });
      } else if (actionType === 'repurpose') {
        const res = await api.post('/ai/find-reusable', { title: topic });
        if (res.data?.success) setResponse({ type: 'repurpose', data: res.data.data });
      } else {
        const res = await api.post('/ai/refine-idea', { title: topic, niche });
        if (res.data?.success) setResponse({ type: 'angles', data: res.data.data });
      }
    } catch (err) {
      console.error('AI Action error', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border-2 border-[#121316] rounded-2xl shadow-brutal overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#121316] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#121316] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#D2F800]" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#121316] text-sm">Creator AI Copilot & Viral Strategist</h3>
              <p className="text-[11px] text-[#6B6864]">High-CTR titles, viral hooks, thumbnail blueprints & 60s scripts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#6B6864] hover:text-[#121316] hover:bg-[#E5E0D8] rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Action Tabs */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#6B6864] mb-2">
              Select AI Tool:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'titles_and_thumbnails', label: 'Titles & Thumbnails', icon: Image },
                { id: 'improve_hook', label: 'Viral Hooks', icon: Flame },
                { id: 'short_script', label: '60s Short Script', icon: Video },
                { id: 'repurpose', label: 'Repurpose Multiplier', icon: Layers },
              ].map((act) => {
                const Icon = act.icon;
                const active = actionType === act.id;
                return (
                  <button
                    key={act.id}
                    onClick={() => { setActionType(act.id); setResponse(null); }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex flex-col gap-1.5 cursor-pointer ${
                      active ? 'bg-[#121316] text-white border-[#121316]' : 'bg-[#FAF8F5] text-[#121316] border-[#E5E0D8] hover:bg-[#F4F0EA]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#D2F800]' : 'text-[#FF5A36]'}`} />
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic Input */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#6B6864] mb-1.5">
                Video Topic / Concept:
              </label>
              <input
                type="text"
                placeholder="e.g. 10-Minute Japanese Street Ramen, Minecraft 100 Days, iPhone 16 Review..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#121316] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#6B6864]">Niche:</span>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-2.5 py-1 text-xs font-bold text-[#121316] cursor-pointer"
                >
                  <option value="food">🍳 Food & Cooking</option>
                  <option value="gaming">🎮 Gaming</option>
                  <option value="tech">📱 Tech & Gadgets</option>
                  <option value="fitness">🏋️ Fitness</option>
                  <option value="travel">✈️ Travel</option>
                  <option value="beauty">💄 Beauty & Lifestyle</option>
                  <option value="finance">💰 Finance & Side Hustles</option>
                </select>
              </div>

              <button
                onClick={handleRunAI}
                disabled={loading || !topic.trim()}
                className="px-5 py-2.5 bg-[#121316] hover:bg-[#2A2C32] text-white disabled:opacity-50 font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#D2F800]" /> : <Wand2 className="w-4 h-4 text-[#D2F800]" />}
                Generate with AI
              </button>
            </div>
          </div>

          {/* Results Display */}
          {response && (
            <div className="space-y-4 pt-4 border-t-2 border-[#121316] animate-fade-in">
              {/* Titles and Thumbnails */}
              {response.type === 'titles_and_thumbnails' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-[#121316] tracking-wider mb-2 flex items-center gap-1.5">
                      🔥 5 High-CTR YouTube Titles:
                    </h4>
                    <div className="space-y-2">
                      {response.data.titles?.map((title: string, i: number) => (
                        <div key={i} className="p-3 bg-[#FAF8F5] border border-[#121316] rounded-xl flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-[#121316]">{i + 1}. {title}</span>
                          <button
                            onClick={() => copyToClipboard(title, `title-${i}`)}
                            className="p-1.5 text-[#6B6864] hover:text-[#121316] cursor-pointer"
                            title="Copy Title"
                          >
                            {copiedKey === `title-${i}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-[#121316] tracking-wider mb-2 flex items-center gap-1.5">
                      🎨 Thumbnail Visual Concept:
                    </h4>
                    <div className="space-y-2">
                      {response.data.thumbnailConcepts?.map((thumb: any, i: number) => (
                        <div key={i} className="p-3.5 bg-[#FFF9E6] border border-[#121316] rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[#121316]">{thumb.concept}</span>
                            <span className="px-2 py-0.5 bg-[#FF5A36] text-white text-[10px] font-mono font-bold rounded">
                              TEXT: "{thumb.overlayText}"
                            </span>
                          </div>
                          <p className="text-xs text-[#6B6864] leading-relaxed"><strong>Visual Layout:</strong> {thumb.layout}</p>
                          <p className="text-[11px] text-[#6B6864]"><strong>Palette:</strong> {thumb.colorPalette}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Viral Hooks */}
              {response.type === 'hooks' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-[#121316] tracking-wider">
                    ⚡ 3 Viral Hook Alternatives:
                  </h4>
                  {response.data.hookVariants?.map((h: any, i: number) => (
                    <div key={i} className="p-3.5 bg-[#FAF8F5] border border-[#121316] rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#FF5A36]">{h.style}</span>
                        <button
                          onClick={() => copyToClipboard(h.hook, `hook-${i}`)}
                          className="p-1.5 text-[#6B6864] hover:text-[#121316] cursor-pointer"
                        >
                          {copiedKey === `hook-${i}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs font-bold text-[#121316] italic">"{h.hook}"</p>
                      <p className="text-[11px] text-[#6B6864]">💡 <strong>Retention Cue:</strong> {h.retentionTip}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 60s Short Script */}
              {response.type === 'short_script' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase text-[#121316] tracking-wider">
                      🎬 60-Second Short / Reel Script:
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-[#6B6864]">{response.data.duration}</span>
                  </div>
                  <div className="space-y-2">
                    {response.data.scriptTimeline?.map((item: any, i: number) => (
                      <div key={i} className="p-3 bg-[#FAF8F5] border border-[#121316] rounded-xl flex items-start gap-3">
                        <span className="px-2 py-1 bg-[#121316] text-white text-[10px] font-mono font-bold rounded flex-shrink-0">
                          {item.time}
                        </span>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-[#FF5A36] font-bold">{item.cue}</span>
                          <p className="text-xs font-semibold text-[#121316]">{item.dialogue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Repurpose Multiplier */}
              {response.type === 'repurpose' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-[#121316] tracking-wider">
                    🌳 Derivative Assets to Multiply Views:
                  </h4>
                  <div className="space-y-2">
                    {response.data.reusableAssets?.map((asset: any, i: number) => (
                      <div key={i} className="p-3 bg-[#FAF8F5] border border-[#121316] rounded-xl flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-[#D2F800] text-[#121316] text-[10px] font-mono font-extrabold rounded">
                              {asset.format}
                            </span>
                            <span className="text-xs font-bold text-[#121316]">{asset.title}</span>
                          </div>
                          {asset.duration && <p className="text-[11px] text-[#6B6864] mt-0.5">Duration: {asset.duration}</p>}
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#121316] flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
