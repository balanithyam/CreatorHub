code = r"""import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, TrendingUp, Lightbulb, FileText, Video, MessageSquare, 
  ArrowUpRight, Clock, Plus, CheckCircle2, AlertCircle, RefreshCw, Eye, Flame, ExternalLink, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Idea, Blueprint, ContentItem, Feedback, Activity } from '../types';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ideasRes, bpRes, contentRes, feedbackRes, activityRes] = await Promise.allSettled([
        api.get('/ideas'),
        api.get('/blueprints'),
        api.get('/content'),
        api.get('/audience'),
        api.get('/activity')
      ]);

      if (ideasRes.status === 'fulfilled') setIdeas(ideasRes.value.data);
      if (bpRes.status === 'fulfilled') setBlueprints(bpRes.value.data);
      if (contentRes.status === 'fulfilled') setContentItems(contentRes.value.data);
      if (feedbackRes.status === 'fulfilled') setFeedbacks(feedbackRes.value.data);
      if (activityRes.status === 'fulfilled') setActivities(activityRes.value.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingReviews = contentItems.filter(c => c.status === 'IN_REVIEW' || c.status === 'DRAFT');
  const inProduction = contentItems.filter(c => c.status === 'PRODUCTION');
  const topIdeas = ideas.filter(i => i.status === 'READY_FOR_BLUEPRINT' || i.status === 'DEVELOPING').slice(0, 3);
  const unprocessedAudience = feedbacks.filter(f => !f.convertedToIdea).slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Studio Cockpit Header */}
      <div className="bg-charcoal-900 text-white rounded-3xl p-6 lg:p-8 border border-charcoal-800 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-64 h-64 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-lime-400 text-charcoal-950 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-charcoal-950 animate-pulse" />
                Live Studio Cockpit
              </span>
              <span className="text-xs font-mono text-charcoal-400">
                Logged in as <strong className="text-white capitalize">{user?.role?.toLowerCase()}</strong>
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
              Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-amber-300">{user?.name?.split(' ')[0] || 'Creator'}</span>
            </h1>
            <p className="text-charcoal-300 text-sm mt-1 max-w-xl">
              Here is what needs your creative direction today. Live sources are monitored, {pendingReviews.length} media cuts await review, and {unprocessedAudience.length} audience signals are ready to be converted.
            </p>
          </div>

          {/* Quick Cockpit Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/app/discover" 
              className="px-4 py-2.5 bg-charcoal-800 hover:bg-charcoal-700 text-white border border-charcoal-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <TrendingUp className="w-4 h-4 text-coral-400" />
              Scan Live Trends
            </Link>
            <Link 
              to="/app/ideas" 
              className="px-4 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-coral-500/20 flex items-center gap-2 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              New Content Idea
            </Link>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-charcoal-800">
          <div className="p-3 bg-charcoal-950/60 rounded-2xl border border-charcoal-800/80">
            <div className="text-xs font-mono text-charcoal-400 flex items-center justify-between">
              Active Ideas
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{ideas.length}</div>
            <div className="text-[11px] text-lime-400 mt-0.5 flex items-center gap-1 font-mono">
              <span>{ideas.filter(i => i.status === 'READY_FOR_BLUEPRINT').length} ready for script</span>
            </div>
          </div>

          <div className="p-3 bg-charcoal-950/60 rounded-2xl border border-charcoal-800/80">
            <div className="text-xs font-mono text-charcoal-400 flex items-center justify-between">
              Blueprints Ready
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{blueprints.length}</div>
            <div className="text-[11px] text-charcoal-400 mt-0.5 font-mono">
              Structured narrative briefs
            </div>
          </div>

          <div className="p-3 bg-charcoal-950/60 rounded-2xl border border-charcoal-800/80">
            <div className="text-xs font-mono text-charcoal-400 flex items-center justify-between">
              Review Queue
              <Video className="w-3.5 h-3.5 text-coral-400" />
            </div>
            <div className="text-2xl font-black text-coral-400 mt-1">{pendingReviews.length}</div>
            <div className="text-[11px] text-coral-300 mt-0.5 font-mono">
              Requires timestamp approval
            </div>
          </div>

          <div className="p-3 bg-charcoal-950/60 rounded-2xl border border-charcoal-800/80">
            <div className="text-xs font-mono text-charcoal-400 flex items-center justify-between">
              Audience Signals
              <MessageSquare className="w-3.5 h-3.5 text-lime-400" />
            </div>
            <div className="text-2xl font-black text-lime-400 mt-1">{feedbacks.length}</div>
            <div className="text-[11px] text-charcoal-400 mt-0.5 font-mono">
              {unprocessedAudience.length} pending convert
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Pipeline & Review Actions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Urgent Review Studio Rail */}
          <div className="bg-white rounded-3xl p-6 border border-charcoal-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-charcoal-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-coral-500" />
                  Media Review Queue
                </h2>
                <p className="text-xs text-charcoal-500 font-mono">Timestamped feedback & collaborative sign-off</p>
              </div>
              <Link 
                to="/app/review" 
                className="text-xs font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1 group"
              >
                Open Review Studio <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {pendingReviews.length === 0 ? (
              <div className="p-8 text-center bg-sand-50 rounded-2xl border border-dashed border-charcoal-200">
                <CheckCircle2 className="w-8 h-8 text-lime-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-charcoal-800">All cuts are reviewed and approved!</p>
                <p className="text-xs text-charcoal-500 mt-1">Upload fresh cuts in the Production Studio.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingReviews.map((item) => (
                  <div 
                    key={item._id} 
                    className="p-4 bg-sand-50/70 hover:bg-sand-100/80 border border-charcoal-200/90 rounded-2xl transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 bg-coral-100 text-coral-800 text-[10px] font-mono font-bold rounded-full">
                          {item.format}
                        </span>
                        <span className="text-[10px] font-mono text-charcoal-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(item.updatedAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-charcoal-900 line-clamp-1 group-hover:text-coral-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-charcoal-600 line-clamp-2 mt-1">
                        {item.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-charcoal-200/60 flex items-center justify-between">
                      <span className="text-xs font-mono text-charcoal-500">
                        {item.versions?.length || 1} versions uploaded
                      </span>
                      <Link
                        to={`/app/review?contentId=${item._id}`}
                        className="px-3 py-1.5 bg-charcoal-900 hover:bg-coral-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review Cut
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ideas to Blueprint Next */}
          <div className="bg-white rounded-3xl p-6 border border-charcoal-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-charcoal-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Ready to Script & Blueprint
                </h2>
                <p className="text-xs text-charcoal-500 font-mono">Top priority ideas vetted for production</p>
              </div>
              <Link 
                to="/app/ideas" 
                className="text-xs font-bold text-charcoal-700 hover:text-charcoal-900 flex items-center gap-1 group"
              >
                View Kanban Board <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3">
              {topIdeas.map((idea) => (
                <div 
                  key={idea._id} 
                  className="p-4 border border-charcoal-200/70 hover:border-charcoal-300 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-sand-50/50"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        idea.priority === 'HIGH' || idea.priority === 'URGENT' 
                          ? 'bg-coral-100 text-coral-800' 
                          : 'bg-charcoal-100 text-charcoal-700'
                      }`}>
                        {idea.priority} PRIORITY
                      </span>
                      <span className="px-2 py-0.5 bg-lime-100 text-lime-900 rounded text-[10px] font-mono font-bold">
                        {idea.targetFormat}
                      </span>
                      {idea.tags?.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-charcoal-500">#{t}</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-sm text-charcoal-900">{idea.title}</h3>
                    <p className="text-xs text-charcoal-600 line-clamp-1">{idea.summary}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/app/blueprints?createFromIdea=${idea._id}`}
                      className="px-3 py-2 bg-lime-400 hover:bg-lime-500 text-charcoal-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Create Blueprint
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Family Derivative Ecosystem */}
          <div className="bg-gradient-to-br from-charcoal-900 to-charcoal-950 text-white rounded-3xl p-6 border border-charcoal-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-lime-400" />
                  Content Multiplier & Asset Family
                </h2>
                <p className="text-xs text-charcoal-400 font-mono">Turn 1 Pillar Video into 6+ Reels, Blogs & Carousels</p>
              </div>
              <Link 
                to="/app/family" 
                className="px-3 py-1.5 bg-charcoal-800 hover:bg-charcoal-700 text-lime-400 border border-charcoal-700 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                Open Family Tree <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
              <div className="p-3.5 bg-charcoal-900/80 rounded-2xl border border-charcoal-800">
                <span className="text-[11px] font-mono text-charcoal-400">Pillar Content</span>
                <p className="text-base font-bold text-white mt-1">Deep Dive YouTube Cuts</p>
                <p className="text-[11px] text-lime-400 font-mono mt-2">100% core narrative integrity</p>
              </div>
              <div className="p-3.5 bg-charcoal-900/80 rounded-2xl border border-charcoal-800">
                <span className="text-[11px] font-mono text-charcoal-400">Derivative Micro-Assets</span>
                <p className="text-base font-bold text-white mt-1">Shorts & Twitter Threads</p>
                <p className="text-[11px] text-amber-300 font-mono mt-2">Auto-linked back to master</p>
              </div>
              <div className="p-3.5 bg-charcoal-900/80 rounded-2xl border border-charcoal-800">
                <span className="text-[11px] font-mono text-charcoal-400">Asset Reuse Rate</span>
                <p className="text-base font-bold text-lime-400 mt-1">4.2x Multiplier</p>
                <p className="text-[11px] text-charcoal-400 font-mono mt-2">Saves ~14 hrs/week</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Audience Signals & Recent Studio Activity */}
        <div className="space-y-8">
          
          {/* Audience Signal Box */}
          <div className="bg-white rounded-3xl p-6 border border-charcoal-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-charcoal-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-lime-600" />
                  Audience Signal Radar
                </h2>
                <p className="text-xs text-charcoal-500 font-mono">Community questions & high-intent requests</p>
              </div>
              <Link to="/app/audience" className="text-xs font-bold text-charcoal-600 hover:text-charcoal-900">
                All ({feedbacks.length})
              </Link>
            </div>

            {unprocessedAudience.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-4 text-center">No unhandled audience signals.</p>
            ) : (
              <div className="space-y-3">
                {unprocessedAudience.map((fb) => (
                  <div key={fb._id} className="p-3.5 bg-sand-50 rounded-2xl border border-charcoal-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-charcoal-200 text-charcoal-800 rounded-full font-bold">
                        {fb.sourcePlatform || 'COMMUNITY'}
                      </span>
                      <span className="text-[10px] font-mono text-charcoal-500">{fb.authorName || 'Viewer'}</span>
                    </div>
                    <p className="text-xs text-charcoal-800 italic">"{fb.content}"</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[10px] font-mono font-bold ${
                        fb.sentiment === 'POSITIVE' ? 'text-lime-600' : 'text-amber-600'
                      }`}>
                        {fb.sentiment || 'NEUTRAL'}
                      </span>
                      <Link
                        to={`/app/ideas?convertFromFeedback=${fb._id}`}
                        className="text-[11px] font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Turn into Idea
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Stream */}
          <div className="bg-white rounded-3xl p-6 border border-charcoal-200/80 shadow-sm">
            <h2 className="text-lg font-black text-charcoal-900 flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-charcoal-600" />
              Studio Activity Stream
            </h2>
            <p className="text-xs text-charcoal-500 font-mono mb-4">Real-time team edits & version logs</p>

            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-6 text-xs text-charcoal-400 font-mono">
                  No recent activities recorded.
                </div>
              ) : (
                activities.slice(0, 5).map((act, idx) => (
                  <div key={act._id || idx} className="flex items-start gap-3 text-xs">
                    <div className="w-7 h-7 rounded-xl bg-charcoal-100 text-charcoal-800 flex items-center justify-center font-bold text-[11px] shrink-0 font-mono">
                      {act.user?.name ? act.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-charcoal-900 font-medium leading-relaxed">
                        <strong className="text-charcoal-950 font-bold">{act.user?.name || 'Team member'}</strong> {act.description}
                      </p>
                      <p className="text-[10px] font-mono text-charcoal-400">
                        {new Date(act.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
"""
with open(r'D:\CreatorHub\frontend\src\pages\HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(code.strip())
print("Wrote HomePage.tsx successfully!")
