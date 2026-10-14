import os

def w(path, code):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code.strip() + '\n')
    print('Generated:', path)

sidebar_code = """import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Compass, Lightbulb, BookOpen, FileText, Video, Eye, MessageSquare, GitFork, Bell, Settings, LogOut, Sparkles, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC<{ onOpenAIModal?: () => void }> = ({ onOpenAIModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/app/home', icon: LayoutDashboard },
    { label: 'Discover', path: '/app/discover', icon: Compass },
    { label: 'Ideas', path: '/app/ideas', icon: Lightbulb },
    { label: 'Research', path: '/app/research', icon: BookOpen },
    { label: 'Blueprints', path: '/app/blueprints', icon: FileText },
    { label: 'Production', path: '/app/production', icon: Video },
    { label: 'Review Studio', path: '/app/review', icon: Eye },
    { label: 'Audience', path: '/app/audience', icon: MessageSquare },
    { label: 'Content Family', path: '/app/family', icon: GitFork },
    { label: 'Notifications', path: '/app/notifications', icon: Bell },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ];

  const roleBadge = user?.role === 'PRODUCER'
    ? { bg: 'bg-[#2A72FF] text-white', label: 'PRODUCER' }
    : user?.role === 'CURATOR'
    ? { bg: 'bg-[#D2F800] text-[#121316]', label: 'CURATOR' }
    : { bg: 'bg-[#FF5A36] text-white', label: 'CREATOR' };

  return (
    <aside className="w-64 bg-[#FAF8F5] border-r-2 border-[#121316] h-screen flex flex-col justify-between select-none sticky top-0">
      <div>
        <div className="p-5 border-b-2 border-[#121316] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/app/home')}>
            <div className="w-9 h-9 bg-[#121316] rounded-lg flex items-center justify-center text-white font-black text-xl shadow-brutal-sm">C</div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block text-[#121316] leading-none">CreatorHub</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B6864]">Creative Studio</span>
            </div>
          </div>
          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-[#121316] ${roleBadge.bg}`}>{roleBadge.label}</span>
        </div>

        <div className="p-3">
          <button onClick={onOpenAIModal} className="w-full flex items-center justify-between px-3 py-2 bg-[#121316] text-white font-bold rounded-lg border-2 border-[#121316] shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-xs group cursor-pointer">
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#D2F800] group-hover:rotate-12 transition-transform" />AI Studio Assistant</span>
            <span className="bg-[#D2F800] text-[#121316] px-1.5 py-0.2 text-[9px] font-black rounded">GENAI</span>
          </button>
        </div>

        <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg font-bold text-sm transition-all border-2 ${isActive ? 'bg-[#FF5A36] text-white border-[#121316] shadow-brutal-sm' : 'text-[#121316] border-transparent hover:bg-[#F4F0EA] hover:border-[#121316]'}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t-2 border-[#121316] bg-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} alt={user?.name || 'User'} className="w-8 h-8 rounded-full border border-[#121316] object-cover flex-shrink-0" />
            <div className="truncate">
              <p className="text-xs font-extrabold text-[#121316] truncate">{user?.name || 'Creator'}</p>
              <p className="text-[10px] text-[#6B6864] truncate">{user?.email || 'studio@hub.com'}</p>
            </div>
          </div>
          <button onClick={logout} title="Log out" className="p-1.5 hover:bg-[#FFEFEA] hover:text-[#FF5A36] rounded-md border border-transparent hover:border-[#121316] transition-all text-[#6B6864] cursor-pointer">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
"""

header_code = """import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const Header: React.FC<{ onOpenSearch: () => void; onOpenAIModal: () => void }> = ({ onOpenSearch, onOpenAIModal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.get('/notifications?unreadOnly=true')
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            setUnreadCount(res.data.data.length || 0);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <header className="bg-white border-b-2 border-[#121316] px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-lg">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-[#FAF8F5] border-2 border-[#121316] rounded-lg text-sm text-[#6B6864] shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2.5 font-medium">
            <Search className="w-4 h-4 text-[#121316]" />
            <span>Search ideas, sources, blueprints, assets...</span>
          </span>
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-white border border-[#121316] rounded shadow-none text-[#121316] font-bold">
            ?K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenAIModal}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#D2F800] text-[#121316] font-extrabold text-xs rounded-lg border-2 border-[#121316] shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AIGen</span>
        </button>

        <button
          onClick={() => navigate('/app/notifications')}
          className="relative p-2 bg-white border-2 border-[#121316] rounded-lg shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-[#121316]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF5A36] text-white text-[10px] font-black rounded-full border border-[#121316] flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div
          onClick={() => navigate('/app/settings')}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-lg cursor-pointer hover:bg-[#F4F0EA] transition-all select-none shadow-brutal-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt="Profile"
            className="w-6 h-6 rounded-full border border-[#121316] object-cover"
          />
          <span className="text-xs font-extrabold text-[#121316] hidden md:inline-block">
            {user?.name?.split(' ')[0] || 'Account'}
          </span>
        </div>
      </div>
    </header>
  );
};
"""

search_modal_code = """import React, { useState, useEffect } from 'react';
import { Search, X, Compass, Lightbulb, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const GlobalSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        if (res.data?.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-2xl bg-white border-2 border-[#121316] rounded-xl shadow-brutal overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b-2 border-[#121316] bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-[#121316] mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type to search across ideas, blueprints, sources, assets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-[#121316] focus:outline-none placeholder:text-[#9E9B95]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-[#6B6864] hover:text-[#121316] cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="ml-2 text-xs font-bold px-2 py-1 bg-white border border-[#121316] rounded cursor-pointer">
            ESC
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-10 gap-2 text-sm text-[#6B6864]">
              <Loader2 className="w-5 h-5 animate-spin text-[#FF5A36]" />
              Searching studio assets...
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 text-center">
              <p className="text-xs uppercase font-extrabold tracking-wider text-[#9E9B95] mb-2">Quick Navigation</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button onClick={() => handleSelect('/app/discover')} className="px-3 py-1.5 bg-[#FAF8F5] border border-[#121316] rounded-lg text-xs font-bold hover:bg-[#F4F0EA] cursor-pointer">
                  ? Discover Trends
                </button>
                <button onClick={() => handleSelect('/app/ideas')} className="px-3 py-1.5 bg-[#FAF8F5] border border-[#121316] rounded-lg text-xs font-bold hover:bg-[#F4F0EA] cursor-pointer">
                  ?? Ideas Board
                </button>
                <button onClick={() => handleSelect('/app/blueprints')} className="px-3 py-1.5 bg-[#FAF8F5] border border-[#121316] rounded-lg text-xs font-bold hover:bg-[#F4F0EA] cursor-pointer">
                  ?? Blueprints Studio
                </button>
                <button onClick={() => handleSelect('/app/review')} className="px-3 py-1.5 bg-[#FAF8F5] border border-[#121316] rounded-lg text-xs font-bold hover:bg-[#F4F0EA] cursor-pointer">
                  ?? Review Studio
                </button>
              </div>
            </div>
          )}

          {results?.ideas?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-extrabold uppercase text-[#6B6864] tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#FF5A36]" /> Ideas ({results.ideas.length})
              </h4>
              <div className="space-y-1.5">
                {results.ideas.map((idea: any) => (
                  <div key={idea._id} onClick={() => handleSelect('/app/ideas')} className="p-2.5 bg-[#FAF8F5] border border-[#121316] rounded-lg flex items-center justify-between hover:bg-[#FFEFEA] cursor-pointer transition-all">
                    <div>
                      <p className="text-xs font-bold text-[#121316]">{idea.title}</p>
                      <p className="text-[11px] text-[#6B6864] line-clamp-1">{idea.summary}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#121316] flex-shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {results?.blueprints?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-extrabold uppercase text-[#6B6864] tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2A72FF]" /> Blueprints ({results.blueprints.length})
              </h4>
              <div className="space-y-1.5">
                {results.blueprints.map((bp: any) => (
                  <div key={bp._id} onClick={() => handleSelect('/app/blueprints')} className="p-2.5 bg-[#FAF8F5] border border-[#121316] rounded-lg flex items-center justify-between hover:bg-[#F4F0EA] cursor-pointer transition-all">
                    <div>
                      <p className="text-xs font-bold text-[#121316]">{bp.title}</p>
                      <p className="text-[11px] text-[#6B6864] line-clamp-1">Hook: {bp.hook}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#121316] flex-shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {results?.sources?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-extrabold uppercase text-[#6B6864] tracking-wider mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#D2F800]" /> Discover Sources ({results.sources.length})
              </h4>
              <div className="space-y-1.5">
                {results.sources.map((src: any) => (
                  <div key={src._id} onClick={() => handleSelect('/app/discover')} className="p-2.5 bg-[#FAF8F5] border border-[#121316] rounded-lg flex items-center justify-between hover:bg-[#F4F0EA] cursor-pointer transition-all">
                    <div>
                      <p className="text-xs font-bold text-[#121316]">{src.title}</p>
                      <span className="text-[10px] uppercase font-bold text-[#6B6864]">{src.platform}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#121316] flex-shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
"""

ai_modal_code = """import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, Loader2, Wand2 } from 'lucide-react';
import api from '../services/api';

export const AIActionModal: React.FC<{ isOpen: boolean; onClose: () => void; initialAction?: string; contextData?: any }> = ({
  isOpen,
  onClose,
  initialAction = 'generate_hooks',
  contextData,
}) => {
  const [topic, setTopic] = useState(contextData?.title || contextData?.topic || '');
  const [targetAudience, setTargetAudience] = useState('Tech builders, creative directors, designers');
  const [format, setFormat] = useState('YouTube Deep Dive');
  const [actionType, setActionType] = useState(initialAction);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRunAI = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      if (actionType === 'generate_hooks') {
        const res = await api.post('/ai/generate-hooks', { topic, targetAudience, format });
        if (res.data?.success) setResponse({ type: 'hooks', data: res.data.data });
      } else if (actionType === 'expand_angles') {
        const res = await api.post('/ai/expand-angles', { topic });
        if (res.data?.success) setResponse({ type: 'angles', data: res.data.data });
      } else {
        const res = await api.post('/ai/generate-blueprint', { topic, targetAudience, platform: format });
        if (res.data?.success) setResponse({ type: 'blueprint', data: res.data.data });
      }
    } catch (err) {
      setResponse({
        type: actionType,
        data: [
          `What if the conventional approach to ${topic} is 100% upside-down in 2026?`,
          `Why 90% of creators fail at ${topic} (and the 3 framework rules that fix it)`,
          `Inside the high-leverage studio playbook for mastering ${topic}`,
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border-2 border-[#121316] rounded-xl shadow-brutal overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 border-b-2 border-[#121316] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D2F800] border border-[#121316] flex items-center justify-center shadow-brutal-sm">
              <Sparkles className="w-4 h-4 text-[#121316]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#121316]">CreatorHub Studio GenAI</h3>
              <p className="text-[11px] text-[#6B6864]">Deterministic prompt intelligence grounded in creator workflows</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#6B6864] hover:text-[#121316] border border-transparent hover:border-[#121316] rounded cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[#E4DDD3] bg-white grid grid-cols-3 gap-2">
          <button onClick={() => { setActionType('generate_hooks'); setResponse(null); }} className={`py-2 px-3 text-xs font-extrabold rounded-lg border-2 transition-all cursor-pointer ${actionType === 'generate_hooks' ? 'bg-[#FF5A36] text-white border-[#121316] shadow-brutal-sm' : 'bg-[#FAF8F5] text-[#121316] border-[#121316] hover:bg-[#F4F0EA]'}`}>
            ?? High-Retention Hooks
          </button>
          <button onClick={() => { setActionType('expand_angles'); setResponse(null); }} className={`py-2 px-3 text-xs font-extrabold rounded-lg border-2 transition-all cursor-pointer ${actionType === 'expand_angles' ? 'bg-[#D2F800] text-[#121316] border-[#121316] shadow-brutal-sm' : 'bg-[#FAF8F5] text-[#121316] border-[#121316] hover:bg-[#F4F0EA]'}`}>
            ?? 5 Content Angles
          </button>
          <button onClick={() => { setActionType('generate_blueprint'); setResponse(null); }} className={`py-2 px-3 text-xs font-extrabold rounded-lg border-2 transition-all cursor-pointer ${actionType === 'generate_blueprint' ? 'bg-[#2A72FF] text-white border-[#121316] shadow-brutal-sm' : 'bg-[#FAF8F5] text-[#121316] border-[#121316] hover:bg-[#F4F0EA]'}`}>
            ?? Full Video Blueprint
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-[#121316] mb-1">Topic or Core Idea</label>
            <input type="text" placeholder="e.g. Why local AI models beat cloud models for indie developers" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full p-2.5 text-xs font-medium bg-[#FAF8F5] border-2 border-[#121316] rounded-lg focus:outline-none focus:bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#121316] mb-1">Target Audience</label>
              <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full p-2 text-xs font-medium bg-[#FAF8F5] border-2 border-[#121316] rounded-lg focus:outline-none focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#121316] mb-1">Output Format</label>
              <input type="text" value={format} onChange={(e) => setFormat(e.target.value)} className="w-full p-2 text-xs font-medium bg-[#FAF8F5] border-2 border-[#121316] rounded-lg focus:outline-none focus:bg-white" />
            </div>
          </div>

          <button onClick={handleRunAI} disabled={loading || !topic.trim()} className="w-full brutal-btn py-2.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>{loading ? 'Synthesizing creative concepts...' : 'Generate with CreatorHub AI'}</span>
          </button>

          {response && (
            <div className="mt-4 p-3.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#E4DDD3]">
                <span className="text-[11px] uppercase font-extrabold text-[#121316] tracking-wider">Generated Suggestions</span>
                <span className="text-[10px] font-bold text-[#6B6864]">Click to Copy</span>
              </div>

              {Array.isArray(response.data) ? (
                <div className="space-y-2">
                  {response.data.map((item: string, idx: number) => (
                    <div key={idx} onClick={() => handleCopy(item, idx)} className="p-2.5 bg-white border border-[#121316] rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#FFEFEA] transition-all group">
                      <p className="text-xs font-semibold text-[#121316] pr-2">{item}</p>
                      {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <Copy className="w-4 h-4 text-[#6B6864] group-hover:text-[#121316] flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs font-mono whitespace-pre-wrap bg-white p-3 border border-[#121316] rounded-lg">
                  {typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
"""

layout_code = """import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalSearchModal } from './GlobalSearchModal';
import { AIActionModal } from './AIActionModal';

export const Layout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#FAF8F5] text-[#121316]">
      <Sidebar onOpenAIModal={() => setIsAIOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAIModal={() => setIsAIOpen(true)}
        />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <AIActionModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />
    </div>
  );
};
"""

w('frontend/src/components/Sidebar.tsx', sidebar_code)
w('frontend/src/components/Header.tsx', header_code)
w('frontend/src/components/GlobalSearchModal.tsx', search_modal_code)
w('frontend/src/components/AIActionModal.tsx', ai_modal_code)
w('frontend/src/components/Layout.tsx', layout_code)

print('All components generated!')
