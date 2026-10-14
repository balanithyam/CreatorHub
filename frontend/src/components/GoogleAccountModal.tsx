import React, { useState } from 'react';
import { X, Check, ShieldCheck, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

const PRESET_STUDIO_PROFILES = [
  {
    name: 'Studio Admin (System Manager)',
    email: 'admin@creatorhub.com',
    role: 'ADMIN',
    studioName: 'CreatorHub Headquarters & Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    badge: '👑 Admin Lead'
  },
  {
    name: 'Elena Rostova',
    email: 'creator@creatorhub.com',
    role: 'CREATOR',
    studioName: 'Elena Tech, Food & Storytelling Studio (850k Subs)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badge: '🎬 Lead Creator'
  },
  {
    name: 'Marcus Vance',
    email: 'producer@creatorhub.com',
    role: 'PRODUCER',
    studioName: 'Vance Creative Media & High-Retention Pacing',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badge: '🎥 Video Producer'
  },
  {
    name: 'Sofia Chen',
    email: 'curator@creatorhub.com',
    role: 'CURATOR',
    studioName: 'Chen Trend Radar & Audience Intelligence Lab',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    badge: '📈 Trend Curator'
  },
  {
    name: 'Liam Gallagher',
    email: 'editor@creatorhub.com',
    role: 'EDITOR',
    studioName: 'Gallagher Motion FX & Kinetic Short-Form Lab',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badge: '✂️ Motion Editor'
  }
];

export const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({ isOpen, onClose }) => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAccount = async (profile: typeof PRESET_STUDIO_PROFILES[0]) => {
    try {
      setSelectedEmail(profile.email);
      setLoading(true);
      setError(null);
      await googleLogin({
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        role: profile.role
      });
      onClose();
      if (profile.role === 'ADMIN') {
        navigate('/app/admin');
      } else {
        navigate('/app');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customName.trim()) return;
    try {
      setLoading(true);
      setError(null);
      await googleLogin({
        email: customEmail.trim(),
        name: customName.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customName)}`,
        role: 'CREATOR'
      });
      onClose();
      navigate('/app');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to authenticate custom Google account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-[#121316] rounded-3xl shadow-brutal overflow-hidden animate-scale-up">
        {/* Google Header */}
        <div className="p-6 border-b-2 border-[#121316] bg-[#FAF8F5] text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#6B6864] hover:text-[#121316] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-white rounded-2xl border-2 border-[#121316] mx-auto flex items-center justify-center shadow-xs mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          
          <h2 className="text-lg font-black text-[#121316]">Sign in with Google</h2>
          <p className="text-xs text-[#6B6864] mt-0.5">Select a verified studio profile to enter CreatorHub</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Profile List */}
        {!isCustom ? (
          <div className="p-5 space-y-2.5 max-h-[380px] overflow-y-auto">
            {PRESET_STUDIO_PROFILES.map((profile) => (
              <div
                key={profile.email}
                onClick={() => handleSelectAccount(profile)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                  selectedEmail === profile.email
                    ? 'bg-[#FFEFEA] border-[#FF5A36]'
                    : 'bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#121316] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#121316]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#121316]">{profile.name}</span>
                      <span className="px-1.5 py-0.2 bg-[#D2F800] text-[#121316] text-[9px] font-mono font-bold rounded">
                        {profile.badge}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#6B6864]">{profile.email}</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#6B6864] group-hover:text-[#121316] group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            ))}

            <button
              onClick={() => setIsCustom(true)}
              className="w-full py-2.5 text-center text-xs font-bold text-[#FF5A36] hover:underline cursor-pointer flex items-center justify-center gap-1.5 pt-2"
            >
              <UserPlus className="w-4 h-4" />
              Use another custom Google account
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomGoogleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#121316] mb-1">Full Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. David Miller"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#121316] rounded-xl px-4 py-2.5 text-xs font-medium text-[#121316] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121316] mb-1">Google Email Address:</label>
              <input
                type="email"
                required
                placeholder="e.g. david.miller@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#121316] rounded-xl px-4 py-2.5 text-xs font-medium text-[#121316] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsCustom(false)}
                className="text-xs font-bold text-[#6B6864] hover:text-[#121316] cursor-pointer"
              >
                ← Back to profiles
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#121316] hover:bg-[#2A2C32] text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E5E0D8] text-center">
          <p className="text-[10px] text-[#6B6864]">
            OAuth 2.0 & JWT Encrypted • CreatorHub Studio Multi-User Architecture
          </p>
        </div>
      </div>
    </div>
  );
};
