import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, Globe, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const Header: React.FC<{ onOpenSearch: () => void; onOpenAIModal: () => void }> = ({ onOpenSearch, onOpenAIModal }) => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
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
    <header className="bg-white border-b-2 border-[#121316] px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Search Trigger */}
      <div className="flex-1 max-w-lg">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-4 py-2 bg-[#FAF8F5] border border-[#121316] rounded-xl text-xs font-semibold text-[#6B6864] hover:bg-[#F4F0EA] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#121316]" />
            <span>{t('search_placeholder')}</span>
          </div>
          <kbd className="px-2 py-0.5 bg-white border border-[#121316] rounded text-[10px] font-mono font-bold text-[#121316]">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#121316] rounded-xl px-2.5 py-1">
          <Globe className="w-3.5 h-3.5 text-[#121316]" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent text-xs font-bold text-[#121316] cursor-pointer focus:outline-none"
          >
            <option value="en">🇺🇸 EN</option>
            <option value="es">🇪🇸 ES</option>
            <option value="fr">🇫🇷 FR</option>
            <option value="de">🇩🇪 DE</option>
            <option value="ja">🇯🇵 JA</option>
            <option value="hi">🇮🇳 HI</option>
          </select>
        </div>

        {/* AI Actions Button */}
        <button
          onClick={onOpenAIModal}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#D2F800] border-2 border-[#121316] text-[#121316] text-xs font-extrabold rounded-xl hover:bg-[#bce000] transition-all cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
          <span>{t('ai_actions')}</span>
        </button>

        {/* Admin Link if role is ADMIN */}
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => navigate('/app/admin')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF5A36] text-white text-xs font-bold rounded-xl hover:bg-[#e04523] cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            <span>{t('admin')}</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/app/notifications')}
          className="relative p-2 bg-[#FAF8F5] border border-[#121316] rounded-xl text-[#121316] hover:bg-[#F4F0EA] transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5A36] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <div
          onClick={() => navigate('/app/profile')}
          className="flex items-center gap-2 pl-2 border-l border-[#E5E0D8] cursor-pointer"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover border border-[#121316]"
          />
        </div>
      </div>
    </header>
  );
};
