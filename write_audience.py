code = r"""import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, Plus, Sparkles, Filter, CheckCircle2, ArrowRight, 
  HelpCircle, ThumbsUp, AlertCircle, Check, Search, Youtube, Twitter, Disc
} from 'lucide-react';
import { api } from '../services/api';
import { Feedback } from '../types';

export const AudiencePage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState('YOUTUBE');
  const [sentiment, setSentiment] = useState<'POSITIVE' | 'NEUTRAL' | 'QUESTION' | 'CRITIQUE'>('QUESTION');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/audience');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Failed to load audience feedback', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/audience', {
        authorName: authorName || 'Anonymous Viewer',
        content,
        sourcePlatform,
        sentiment,
        convertedToIdea: false
      });
      setFeedbacks([res.data, ...feedbacks]);
      setCreateModalOpen(false);
      setAuthorName('');
      setContent('');
      showToast('Audience signal captured!');
    } catch (err) {
      console.error('Failed to create feedback', err);
    }
  };

  const handleConvertToIdea = async (fb: Feedback) => {
    try {
      await api.post('/ideas', {
        title: `Community Answer: ${fb.content.slice(0, 60)}...`,
        summary: `Directly requested by viewer ${fb.authorName || 'Community Member'}: "${fb.content}"`,
        sourcePlatform: fb.sourcePlatform,
        category: 'Creator',
        tags: ['audience-qa', fb.sourcePlatform.toLowerCase()],
        status: 'DEVELOPING',
        priority: 'HIGH',
        targetFormat: 'SHORT_REEL'
      });

      // Mark feedback as converted
      const res = await api.patch(`/audience/${fb._id}`, { convertedToIdea: true });
      setFeedbacks(feedbacks.map(f => f._id === fb._id ? res.data : f));
      showToast('🎉 Converted audience request into Content Idea!');
    } catch (err) {
      console.error('Failed to convert feedback', err);
    }
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesSent = selectedSentiment === 'ALL' || fb.sentiment === selectedSentiment;
    const matchesSearch = !searchQuery || 
      fb.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.authorName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSent && matchesSearch;
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
              <MessageSquare className="w-3.5 h-3.5 text-lime-700" />
              Audience Request Radar
            </span>
            <span className="text-xs font-mono text-charcoal-500">Community Q&A & Intent Extraction</span>
          </div>
          <h1 className="text-3xl font-black text-charcoal-950 tracking-tight">
            Understand Audience Signals
          </h1>
          <p className="text-charcoal-600 text-sm mt-1 max-w-2xl">
            Never guess what your subscribers want. Capture recurring confusion points, technical questions, and suggestions to drive high-converting follow-up videos.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4 text-lime-400" />
          Log Audience Feedback
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-charcoal-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search viewer feedback, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-sand-50 border border-charcoal-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-coral-500 outline-none"
          />
        </div>

        {/* Sentiment Filter */}
        <div className="flex items-center gap-1 bg-sand-50 p-1 rounded-xl border border-charcoal-200/80 text-xs">
          {['ALL', 'QUESTION', 'POSITIVE', 'NEUTRAL', 'CRITIQUE'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSentiment(s)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all ${
                selectedSentiment === s
                  ? 'bg-charcoal-900 text-white shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Feedback Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-sand-50 rounded-3xl p-6 border border-charcoal-200 animate-pulse h-48" />
          ))}
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-200 space-y-3">
          <MessageSquare className="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 className="text-lg font-bold text-charcoal-900">No audience feedback found</h3>
          <p className="text-xs text-charcoal-500">Log viewer comments or sync your platform channels.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeedbacks.map((fb) => (
            <div
              key={fb._id}
              className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between group space-y-4 ${
                fb.convertedToIdea
                  ? 'border-lime-300 bg-lime-50/20'
                  : 'border-charcoal-200/90 hover:border-charcoal-400 hover:shadow-lg'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-charcoal-100 text-charcoal-800 text-[10px] font-mono font-bold rounded-md uppercase">
                    {fb.sourcePlatform}
                  </span>
                  
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    fb.sentiment === 'QUESTION' ? 'bg-amber-100 text-amber-900' :
                    fb.sentiment === 'POSITIVE' ? 'bg-lime-100 text-lime-900' :
                    'bg-sand-100 text-charcoal-700'
                  }`}>
                    {fb.sentiment}
                  </span>
                </div>

                <p className="text-sm font-semibold text-charcoal-900 leading-relaxed italic">
                  "{fb.content}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-charcoal-100 text-xs font-mono text-charcoal-500">
                  <span>Author: <strong className="text-charcoal-800">{fb.authorName || 'Viewer'}</strong></span>
                  {fb.convertedToIdea && (
                    <span className="text-lime-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Converted
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {!fb.convertedToIdea ? (
                  <button
                    onClick={() => handleConvertToIdea(fb)}
                    className="w-full px-4 py-2.5 bg-charcoal-900 hover:bg-coral-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                    Turn into Content Idea
                  </button>
                ) : (
                  <Link
                    to="/app/ideas"
                    className="w-full px-4 py-2 bg-sand-100 hover:bg-sand-200 text-charcoal-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    View in Kanban <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Feedback Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full border border-charcoal-200 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-charcoal-900">Log Audience Signal</h3>
                <p className="text-xs text-charcoal-500 font-mono">Record questions, critiques or feedback</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Viewer / Subscriber Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex (YouTube Subscriber)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Feedback / Question Text *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Can you make a follow up showing how to setup WebSockets with Redis Pub/Sub in Node 22?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Platform</label>
                  <select
                    value={sourcePlatform}
                    onChange={(e) => setSourcePlatform(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  >
                    <option value="YOUTUBE">YouTube</option>
                    <option value="DISCORD">Discord</option>
                    <option value="TWITTER">Twitter / X</option>
                    <option value="SUBSTACK">Substack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Sentiment / Intent</label>
                  <select
                    value={sentiment}
                    onChange={(e: any) => setSentiment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  >
                    <option value="QUESTION">Question / Inquiry</option>
                    <option value="POSITIVE">Positive Praise</option>
                    <option value="NEUTRAL">General Note</option>
                    <option value="CRITIQUE">Constructive Critique</option>
                  </select>
                </div>
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
                  Save Feedback
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
with open(r'D:\CreatorHub\frontend\src\pages\AudiencePage.tsx', 'w', encoding='utf-8') as f:
    f.write(code.strip())
print("Wrote AudiencePage.tsx successfully!")
