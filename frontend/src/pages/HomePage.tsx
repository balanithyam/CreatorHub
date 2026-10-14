import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, TrendingUp, Lightbulb, FileText, Video, MessageSquare, 
  ArrowUpRight, Clock, Plus, CheckCircle2, AlertCircle, RefreshCw, Eye, Flame, ExternalLink, Layers,
  ShieldAlert, DollarSign, Mic, Image, Radio, Compass, BookOpen
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

  const safeArray = (val: any) => Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);

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

      if (ideasRes.status === 'fulfilled') setIdeas(safeArray(ideasRes.value.data));
      if (bpRes.status === 'fulfilled') setBlueprints(safeArray(bpRes.value.data));
      if (contentRes.status === 'fulfilled') setContentItems(safeArray(contentRes.value.data));
      if (feedbackRes.status === 'fulfilled') setFeedbacks(safeArray(feedbackRes.value.data));
      if (activityRes.status === 'fulfilled') setActivities(safeArray(activityRes.value.data));
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const currentIdeas = safeArray(ideas);
  const currentContent = safeArray(contentItems);
  const currentBlueprints = safeArray(blueprints);
  const currentFeedbacks = safeArray(feedbacks);
  const currentActivities = safeArray(activities);

  const pendingReviews = currentContent.filter(c => c.status === 'IN_REVIEW' || c.status === 'in_review' || c.status === 'DRAFT');
  const inProduction = currentContent.filter(c => c.status === 'PRODUCTION' || c.status === 'in_production');
  const topIdeas = currentIdeas.filter(i => i.status === 'READY_FOR_BLUEPRINT' || i.status === 'ready' || i.status === 'DEVELOPING' || i.status === 'developing').slice(0, 3);
  const unprocessedAudience = currentFeedbacks.filter(f => !f.convertedToIdea && f.status !== 'converted').slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Studio Cockpit Header */}
      <div className="bg-[#121316] text-white rounded-3xl p-6 lg:p-8 border border-charcoal-800 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-[#FF5A36]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-64 h-64 bg-[#D2F800]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-[#D2F800] text-[#121316] text-xs font-mono font-black rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#121316] animate-pulse" />
                Live Studio Cockpit
              </span>
              <span className="text-xs font-mono text-gray-400">
                Logged in as <strong className="text-white capitalize">{user?.role?.toLowerCase() || 'creator'}</strong>
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
              Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] to-amber-300">{user?.name?.split(' ')[0] || 'Creator'}</span>
            </h1>
            <p className="text-gray-300 text-sm mt-1 max-w-xl">
              Here is what needs your creative direction today. Live sources are monitored, {pendingReviews.length} media cuts await review, and {unprocessedAudience.length} audience signals are ready to be converted.
            </p>
          </div>

          {/* Quick Cockpit Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/app/discover" 
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <TrendingUp className="w-4 h-4 text-[#FF5A36]" />
              Scan Live Trends
            </Link>
            <Link 
              to="/app/ideas" 
              className="px-4 py-2.5 bg-[#FF5A36] hover:bg-[#e04c2b] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              New Content Idea
            </Link>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-800">
          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10">
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
              Active Ideas
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{currentIdeas.length}</div>
            <div className="text-[11px] text-[#D2F800] mt-0.5 flex items-center gap-1 font-mono">
              <span>{currentIdeas.filter(i => i.status === 'READY_FOR_BLUEPRINT' || i.status === 'ready').length} ready for script</span>
            </div>
          </div>

          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10">
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
              Blueprints Ready
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{currentBlueprints.length}</div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
              Structured narrative briefs
            </div>
          </div>

          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10">
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
              Review Queue
              <Video className="w-3.5 h-3.5 text-[#FF5A36]" />
            </div>
            <div className="text-2xl font-black text-[#FF5A36] mt-1">{pendingReviews.length}</div>
            <div className="text-[11px] text-coral-300 mt-0.5 font-mono">
              Requires timestamp approval
            </div>
          </div>

          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10">
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
              Audience Signals
              <MessageSquare className="w-3.5 h-3.5 text-[#D2F800]" />
            </div>
            <div className="text-2xl font-black text-[#D2F800] mt-1">{currentFeedbacks.length}</div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
              {unprocessedAudience.length} pending convert
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Role Focus Command Center */}
      <div className="bg-white border-2 border-[#121316] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b-2 border-[#121316]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#121316] flex items-center justify-center text-white shrink-0">
              {user?.role === 'ADMIN' && <ShieldAlert className="w-5 h-5 text-[#FF5A36]" />}
              {user?.role === 'CREATOR' && <Lightbulb className="w-5 h-5 text-[#D2F800]" />}
              {user?.role === 'PRODUCER' && <Video className="w-5 h-5 text-[#2A72FF]" />}
              {user?.role === 'CURATOR' && <Compass className="w-5 h-5 text-[#D2F800]" />}
              {user?.role === 'EDITOR' && <Eye className="w-5 h-5 text-[#FF9900]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[#121316] text-[#D2F800]">
                  Your Role Focus: {user?.role || 'CREATOR'}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#6B6864]">Tailored Daily Workflow</span>
              </div>
              <h2 className="text-lg font-black text-[#121316] tracking-tight">
                {user?.role === 'ADMIN' && 'System Governance & Workspace Administration'}
                {user?.role === 'CREATOR' && 'Creative Ideation, Scriptwriting & Filming Queue'}
                {user?.role === 'PRODUCER' && 'Production Operations & Release Pipeline'}
                {user?.role === 'CURATOR' && 'Market Intelligence & Trend Signal Detection'}
                {user?.role === 'EDITOR' && 'Post-Production Review & Multi-Format Repurposing'}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-[#6B6864]">Studio Member:</span>
            <p className="text-xs font-black text-[#121316]">{user?.name} ({user?.email})</p>
          </div>
        </div>

        {/* Role-Specific Daily Tasks & Quick Launchers */}
        {user?.role === 'ADMIN' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/app/admin" className="p-4 rounded-2xl bg-[#FFEFEA] border-2 border-[#FF5A36] hover:bg-[#FFE5DC] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <ShieldAlert className="w-5 h-5 text-[#FF5A36]" />
                <ArrowUpRight className="w-4 h-4 text-[#FF5A36] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Admin Control Console</h3>
              <p className="text-xs text-[#6B6864] mt-1">Manage user roles, toggle account statuses, and monitor system health telemetry.</p>
            </Link>
            <Link to="/app/production" className="p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <Video className="w-5 h-5 text-[#2A72FF]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Studio Production Board</h3>
              <p className="text-xs text-[#6B6864] mt-1">Oversee all {currentContent.length} active studio projects moving across production stages.</p>
            </Link>
            <Link to="/app/sponsorship-calculator" className="p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-[#28A745]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Commercial Deal Calculator</h3>
              <p className="text-xs text-[#6B6864] mt-1">Audit rate cards and CPM estimates for brand deals across channels.</p>
            </Link>
          </div>
        )}

        {user?.role === 'CREATOR' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link to="/app/ideas" className="p-4 rounded-2xl bg-[#F4FFB8]/40 border-2 border-[#121316] hover:bg-[#F4FFB8] transition-all group shadow-brutal-sm">
              <div className="flex items-center justify-between mb-2">
                <Lightbulb className="w-5 h-5 text-[#121316]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Ideas Lab ({currentIdeas.length})</h3>
              <p className="text-xs text-[#6B6864] mt-1">Score raw concepts and convert high-potential ideas to scripts.</p>
            </Link>
            <Link to="/app/blueprints" className="p-4 rounded-2xl bg-white border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-[#FF5A36]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Script Blueprints</h3>
              <p className="text-xs text-[#6B6864] mt-1">Structure narrative hooks, beats, and multi-format adaptations.</p>
            </Link>
            <Link to="/app/teleprompter" className="p-4 rounded-2xl bg-white border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <Mic className="w-5 h-5 text-[#2A72FF]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Studio Prompter</h3>
              <p className="text-xs text-[#6B6864] mt-1">Live filming prompter with variable pacing and mirror beam mode.</p>
            </Link>
            <Link to="/app/thumbnail-tester" className="p-4 rounded-2xl bg-white border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <Image className="w-5 h-5 text-[#9C27B0]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Thumbnail A/B Test</h3>
              <p className="text-xs text-[#6B6864] mt-1">Preview CTR visibility against real YouTube competitive feeds.</p>
            </Link>
          </div>
        )}

        {user?.role === 'PRODUCER' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/app/production" className="p-4 rounded-2xl bg-[#EBF3FF] border-2 border-[#2A72FF] hover:bg-[#DCEBFF] transition-all group shadow-brutal-sm">
              <div className="flex items-center justify-between mb-2">
                <Video className="w-5 h-5 text-[#2A72FF]" />
                <ArrowUpRight className="w-4 h-4 text-[#2A72FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Production Kanban Board</h3>
              <p className="text-xs text-[#6B6864] mt-1">Drag and drop projects, assign team leads, and set shoot deadlines.</p>
            </Link>
            <Link to="/app/review" className="p-4 rounded-2xl bg-white border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-[#FF5A36]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Sign-Off Approvals ({pendingReviews.length})</h3>
              <p className="text-xs text-[#6B6864] mt-1">Stamp final release authorization or send cuts back for revisions.</p>
            </Link>
            <Link to="/app/sponsorship-calculator" className="p-4 rounded-2xl bg-white border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-[#28A745]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Sponsorship Dealmaker</h3>
              <p className="text-xs text-[#6B6864] mt-1">Calculate fair sponsor rates based on views, exclusivity, and deliverables.</p>
            </Link>
          </div>
        )}

        {user?.role === 'CURATOR' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/app/discover" className="p-4 rounded-2xl bg-[#F4FFB8]/40 border-2 border-[#121316] hover:bg-[#F4FFB8] transition-all group shadow-brutal-sm">
              <div className="flex items-center justify-between mb-2">
                <Compass className="w-5 h-5 text-[#121316]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Live Trend Radar</h3>
              <p className="text-xs text-[#6B6864] mt-1">Track breakout YouTube and Reddit topics across 6 content niches.</p>
            </Link>
            <Link to="/app/audience" className="p-4 rounded-2xl bg-white border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-5 h-5 text-[#D2F800]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Audience Listener ({unprocessedAudience.length})</h3>
              <p className="text-xs text-[#6B6864] mt-1">Mine high-demand audience comments and convert them into video ideas.</p>
            </Link>
            <Link to="/app/research" className="p-4 rounded-2xl bg-white border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-5 h-5 text-[#FF5A36]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Topic Intel Dossiers</h3>
              <p className="text-xs text-[#6B6864] mt-1">Build cited dossiers and competitor hook breakdowns for creators.</p>
            </Link>
          </div>
        )}

        {user?.role === 'EDITOR' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/app/review" className="p-4 rounded-2xl bg-[#FFF5E6] border-2 border-[#FF9900] hover:bg-[#FFEAD0] transition-all group shadow-brutal-sm">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-[#FF9900]" />
                <ArrowUpRight className="w-4 h-4 text-[#FF9900] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Review Studio Player ({pendingReviews.length})</h3>
              <p className="text-xs text-[#6B6864] mt-1">Upload video cuts, scrub frame-by-frame, and resolve timecoded feedback.</p>
            </Link>
            <Link to="/app/family" className="p-4 rounded-2xl bg-white border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <Layers className="w-5 h-5 text-[#2A72FF]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Content Family (Asset Graph)</h3>
              <p className="text-xs text-[#6B6864] mt-1">Repurpose long-form cuts into short-form TikToks, Reels, and carousels.</p>
            </Link>
            <Link to="/app/thumbnail-tester" className="p-4 rounded-2xl bg-white border-2 border-[#121316]/20 hover:border-[#121316] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <Image className="w-5 h-5 text-[#9C27B0]" />
                <ArrowUpRight className="w-4 h-4 text-[#121316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-black text-sm text-[#121316]">Thumbnail Visualizer</h3>
              <p className="text-xs text-[#6B6864] mt-1">Test render thumbnail assets across mobile and desktop mockups.</p>
            </Link>
          </div>
        )}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Pipeline & Review Actions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Urgent Review Studio Rail */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#121316]/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-[#121316] flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#FF5A36]" />
                  Media Review Queue
                </h2>
                <p className="text-xs text-[#6B6864] font-mono">Timestamped feedback & collaborative sign-off</p>
              </div>
              <Link 
                to="/app/review" 
                className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1 group"
              >
                Open Review Studio <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {pendingReviews.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border-2 border-dashed border-[#121316]/20">
                <CheckCircle2 className="w-8 h-8 text-[#28A745] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#121316]">All cuts are reviewed and approved!</p>
                <p className="text-xs text-[#6B6864] mt-1">Upload fresh cuts in the Production Studio.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingReviews.map((item) => (
                  <div 
                    key={item._id} 
                    className="p-4 bg-[#FAF8F5] hover:bg-[#F4F0EA] border-2 border-[#121316]/10 hover:border-[#121316] rounded-2xl transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 bg-[#FFEFEA] text-[#FF5A36] text-[10px] font-mono font-bold rounded-full">
                          {item.format || item.type || 'VIDEO'}
                        </span>
                        <span className="text-[10px] font-mono text-[#6B6864] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(item.updatedAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[#121316] line-clamp-1 group-hover:text-[#FF5A36] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#6B6864] line-clamp-2 mt-1">
                        {item.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#121316]/10 flex items-center justify-between">
                      <span className="text-xs font-mono text-[#6B6864]">
                        {item.versions?.length || 1} versions uploaded
                      </span>
                      <Link
                        to={`/app/review?contentId=${item._id}`}
                        className="px-3 py-1.5 bg-[#121316] hover:bg-[#FF5A36] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
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
          <div className="bg-white rounded-3xl p-6 border-2 border-[#121316]/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-[#121316] flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Ready to Script & Blueprint
                </h2>
                <p className="text-xs text-[#6B6864] font-mono">Top priority ideas vetted for production</p>
              </div>
              <Link 
                to="/app/ideas" 
                className="text-xs font-bold text-[#121316] hover:underline flex items-center gap-1 group"
              >
                View Kanban Board <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3">
              {topIdeas.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#6B6864] bg-[#FAF8F5] rounded-2xl">
                  No pending ideas. Create concepts in the Idea Kanban.
                </div>
              ) : (
                topIdeas.map((idea) => (
                  <div 
                    key={idea._id} 
                    className="p-4 border-2 border-[#121316]/10 hover:border-[#121316] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-[#FAF8F5]"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          idea.priority === 'high' || idea.priority === 'HIGH' || idea.priority === 'URGENT' 
                            ? 'bg-[#FFEFEA] text-[#FF5A36]' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {idea.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
                        </span>
                        <span className="px-2 py-0.5 bg-[#D2F800]/40 text-[#121316] rounded text-[10px] font-mono font-bold">
                          {idea.targetFormat || 'YOUTUBE_LONG'}
                        </span>
                        {idea.tags?.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[10px] font-mono text-[#6B6864]">#{t}</span>
                        ))}
                      </div>
                      <h3 className="font-bold text-sm text-[#121316]">{idea.title}</h3>
                      <p className="text-xs text-[#6B6864] line-clamp-1">{idea.summary}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/app/blueprints?createFromIdea=${idea._id}`}
                        className="px-3 py-2 bg-[#D2F800] hover:bg-lime-400 text-[#121316] font-black text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Create Blueprint
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Content Family Derivative Ecosystem */}
          <div className="bg-[#121316] text-white rounded-3xl p-6 border border-gray-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#D2F800]" />
                  Content Multiplier & Asset Family
                </h2>
                <p className="text-xs text-gray-400 font-mono">Turn 1 Pillar Video into 6+ Reels, Blogs & Carousels</p>
              </div>
              <Link 
                to="/app/family" 
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#D2F800] border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                Open Family Tree <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
              <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10">
                <span className="text-[11px] font-mono text-gray-400">Pillar Content</span>
                <p className="text-base font-bold text-white mt-1">Deep Dive YouTube Cuts</p>
                <p className="text-[11px] text-[#D2F800] font-mono mt-2">100% core narrative integrity</p>
              </div>
              <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10">
                <span className="text-[11px] font-mono text-gray-400">Derivative Micro-Assets</span>
                <p className="text-base font-bold text-white mt-1">Shorts & Twitter Threads</p>
                <p className="text-[11px] text-amber-300 font-mono mt-2">Auto-linked back to master</p>
              </div>
              <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10">
                <span className="text-[11px] font-mono text-gray-400">Asset Reuse Rate</span>
                <p className="text-base font-bold text-[#D2F800] mt-1">4.2x Multiplier</p>
                <p className="text-[11px] text-gray-400 font-mono mt-2">Saves ~14 hrs/week</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Audience Signals & Recent Studio Activity */}
        <div className="space-y-8">
          
          {/* Audience Signal Box */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#121316]/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-[#121316] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#28A745]" />
                  Audience Signal Radar
                </h2>
                <p className="text-xs text-[#6B6864] font-mono">Community questions & high-intent requests</p>
              </div>
              <Link to="/app/audience" className="text-xs font-bold text-[#121316] hover:underline">
                All ({currentFeedbacks.length})
              </Link>
            </div>

            {unprocessedAudience.length === 0 ? (
              <p className="text-xs text-[#6B6864] py-4 text-center">No unhandled audience signals.</p>
            ) : (
              <div className="space-y-3">
                {unprocessedAudience.map((fb) => (
                  <div key={fb._id} className="p-3.5 bg-[#FAF8F5] rounded-2xl border-2 border-[#121316]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-200 text-[#121316] rounded-full font-bold uppercase">
                        {fb.sourcePlatform || fb.platform || 'COMMUNITY'}
                      </span>
                      <span className="text-[10px] font-mono text-[#6B6864]">{fb.authorName || 'Viewer'}</span>
                    </div>
                    <p className="text-xs text-[#121316] italic">"{fb.content}"</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[10px] font-mono font-bold ${
                        fb.sentiment === 'POSITIVE' || fb.sentiment === 'positive' ? 'text-[#28A745]' : 'text-amber-600'
                      }`}>
                        {fb.sentiment?.toUpperCase() || 'QUESTION'}
                      </span>
                      <Link
                        to={`/app/ideas?convertFromFeedback=${fb._id}`}
                        className="text-[11px] font-bold text-[#FF5A36] hover:underline flex items-center gap-1"
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
          <div className="bg-white rounded-3xl p-6 border-2 border-[#121316]/10 shadow-sm">
            <h2 className="text-lg font-black text-[#121316] flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-[#121316]" />
              Studio Activity Stream
            </h2>
            <p className="text-xs text-[#6B6864] font-mono mb-4">Real-time team edits & version logs</p>

            <div className="space-y-4">
              {currentActivities.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#6B6864] font-mono">
                  No recent activities recorded.
                </div>
              ) : (
                currentActivities.slice(0, 5).map((act, idx) => (
                  <div key={act._id || idx} className="flex items-start gap-3 text-xs">
                    <div className="w-7 h-7 rounded-xl bg-gray-100 text-[#121316] flex items-center justify-center font-bold text-[11px] shrink-0 font-mono">
                      {act.user?.name ? act.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-[#121316] font-medium leading-relaxed">
                        <strong className="text-[#121316] font-bold">{act.user?.name || act.entityTitle || 'Team member'}</strong> {act.description}
                      </p>
                      <p className="text-[10px] font-mono text-[#6B6864]">
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