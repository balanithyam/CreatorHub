modal_code = r"""import React, { useState } from 'react';
import { User, Plus, ArrowRight, Check, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

const PRESET_GOOGLE_ACCOUNTS = [
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'CREATOR',
    badge: 'Creator Lead'
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.vance.media@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'PRODUCER',
    badge: 'Production & Video'
  },
  {
    name: 'Sofia Chen',
    email: 'sofia.chen.trends@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'CURATOR',
    badge: 'Trends & Feeds'
  }
];

export const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'CREATOR'
}) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = async (account: { name: string; email: string; avatar: string; role: string }) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/google', {
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        role: account.role || defaultRole,
      });

      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data?.user;

      if (token && user) {
        login(token, user);
        onClose();
        navigate('/app');
      } else {
        setError('Failed to authenticate with Google account.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    handleSelectAccount({
      name: customName || customEmail.split('@')[0],
      email: customEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: defaultRole
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121316]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border-2 border-[#121316] shadow-2xl space-y-6 relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#6B6864] hover:text-[#121316] text-sm font-black p-1 rounded-full hover:bg-[#FAF8F5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto flex items-center justify-center bg-[#FAF8F5] border border-gray-200 rounded-full shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-black text-[#121316]">Choose an account</h3>
          <p className="text-xs text-[#6B6864]">to continue to <strong className="text-[#121316]">CreatorHub Studio</strong></p>
        </div>

        {error && (
          <div className="p-3 bg-[#FFEFEA] border-2 border-[#FF5A36] rounded-xl text-xs font-bold text-[#FF5A36]">
            {error}
          </div>
        )}

        {!customMode ? (
          <div className="space-y-3">
            {PRESET_GOOGLE_ACCOUNTS.map((acc, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectAccount(acc)}
                className="p-3.5 bg-[#FAF8F5] hover:bg-[#F4F0EA] border-2 border-transparent hover:border-[#121316] rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full border border-[#121316] object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-xs text-[#121316] group-hover:text-[#FF5A36] transition-colors">
                        {acc.name}
                      </p>
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-[#121316] text-white rounded">
                        {acc.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6864] font-medium">{acc.email}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6B6864] group-hover:text-[#121316] group-hover:translate-x-1 transition-all" />
              </div>
            ))}

            {/* Use another account button */}
            <div
              onClick={() => setCustomMode(true)}
              className="p-3.5 bg-white hover:bg-[#FAF8F5] border-2 border-dashed border-[#121316]/40 hover:border-[#121316] rounded-2xl cursor-pointer transition-all flex items-center gap-3 text-[#121316]"
            >
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#121316]/30 flex items-center justify-center text-[#6B6864]">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-xs">Use another Google account</p>
                <p className="text-[10px] text-[#6B6864]">Sign in with custom Gmail or Workspace</p>
              </div>
            </div>
          </div>
        ) : (
          /* Custom account input form */
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#121316] mb-1">
                Google Account Email *
              </label>
              <input
                type="email"
                required
                placeholder="your.name@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#121316] mb-1">
                Display Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCustomMode(false)}
                className="px-4 py-2 text-xs font-bold text-[#6B6864] hover:text-[#121316]"
              >
                Back to accounts
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#121316] hover:bg-[#FF5A36] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In with Account'}
              </button>
            </div>
          </form>
        )}

        <p className="text-[10px] text-center text-[#6B6864] leading-relaxed">
          To continue, Google will share your name, email address, and language preference with CreatorHub.
        </p>
      </div>
    </div>
  );
};
"""

with open(r'D:\CreatorHub\frontend\src\components\GoogleAccountModal.tsx', 'w', encoding='utf-8') as f:
    f.write(modal_code.strip())

print("Created GoogleAccountModal.tsx successfully!")
