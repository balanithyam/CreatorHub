import React, { useState, useEffect } from 'react';
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
