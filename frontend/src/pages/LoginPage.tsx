import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { GoogleAccountModal } from '../components/GoogleAccountModal';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

const SEED_PROFILES = [
  {
    role: 'ADMIN',
    name: 'Studio Admin',
    email: 'admin@creatorhub.com',
    password: 'AdminPass123!',
    badge: 'Admin Lead',
    color: 'bg-[#FF5A36] text-white',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop,q=80',
    desc: 'System Security, API Quotas & User Permissions'
  },
  {
    role: 'CREATOR',
    name: 'Elena Rostova',
    email: 'creator@creatorhub.com',
    password: 'Password123!',
    badge: 'Lead Creator',
    color: 'bg-[#121316] text-[#D2F800]',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop,q=80',
    desc: 'Scriptwriting, Ideation Lab & AI Blueprints'
  },
  {
    role: 'PRODUCER',
    name: 'Marcus Vance',
    email: 'producer@creatorhub.com',
    password: 'Password123!',
    badge: 'Video Producer',
    color: 'bg-[#2A72FF] text-white',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    desc: 'Production Pipeline, Schedule & Budget Milestones'
  },
  {
    role: 'CURATOR',
    name: 'Sofia Chen',
    email: 'curator@creatorhub.com',
    password: 'Password123!',
    badge: 'Trend Curator',
    color: 'bg-[#D2F800] text-[#121316]',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    desc: 'Multi-Niche Trend Radar & Audience Intelligence'
  },
  {
    role: 'EDITOR',
    name: 'Liam Gallagher',
    email: 'editor@creatorhub.com',
    password: 'Password123!',
    badge: 'Motion Editor',
    color: 'bg-[#FF9900] text-[#121316]',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    desc: 'Frame-Accurate Video Review & Asset Repurposing'
  }
];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('creator@creatorhub.com');
  const [password, setPassword] = useState('Pasword123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(SEED_PROFILES[1]);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data?.user;

      if (!token || !user) {
        throw new Error('Invalid response structure from authentication server');
      }

      login(token, user);

      if (user.role === 'ADMIN') {
        navigate('/app/admin');
      } else if (user.role === 'PRODUCUR') {
        navigate('/app/production');
      } else if (user.role === 'CURATOR') {
        navigate('/app/discover');
      } else if (user.role === 'EDITOR') {
        navigate('/app/review');
      } else {
        navigate('/app/ideas');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials or server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSeedProfile = (p: typeof SEED_PROFILES[0]) => {
    setEmail(p.email);
    setPassword(p.password);
    setActiveProfile(p);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4 selection:BjYFF5A36] selection:text-white">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 bg-[#121316] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-brutal-sm">
              C
            </div>
            <span className="font-black text-2xl tracking-tight text-[#121316]">
              CreatorHub
            </span>
          </div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#6B6864]">
            Studio Workspace Sign In & OAuth AccessPb
          </p>
        </div>

        <div className="brutal-card p-6 md:p-8 bg-white border-2 border-[#121316] rounded-3xl shadow-xl">
          {error && (
            <div className="mb-4 p-3.5 bg-[#FFEFEA] border-2 border-[#FF5A36] rounded-xl text-xs font-bold text-[#FF5A36]">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="w-full py-3.5 px-4 bg-white hover:bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-black text-[#121316] transition-all flex items-center justify-center gap-3 shadow-brutal-sm hover:translate-y-[-1px] cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12sN43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google OAuth (1-Click Chooser)</span>
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#121316]/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#6b6864] font-mono font-bold text-[10px]">
                Or Sign In With Verified Studio Credentials
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#121316] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6b6864] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@creatorhub.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase text-[#121316]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6b6864] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#6b6864] hover:text-[#121316] cursor-pointer focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#e04c2b] text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In as {activeProfile.badge}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t-2 border-[#121316]/10">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-black uppercase text-[#6b6864] tracking-wider">
                Select from 5 Verified Studio Roles:
              </p>
              <span className="text-[10px] font-mono font-bold text-[#FF5A36]">
                Role-Based Workspaces
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SEED_PROFILES.map((p) => {
                const isSelected = email === p.email;
                return (
                  <button
                    key={p.email}
                    type="button"
                    onClick={() => handleSelectSeedProfile(p)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-white border-[#121316] shadow-brutal-sm ring-2 ring-[#FF5A36]'
                        : 'bg-[#FAF8F5] border-[#121316]/30 hover:border-[#121316] hover:bg-white'
                    }`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#121316] shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[11px] text-[#121316] truncate block">
                          {p.name}
                        </span>
                      </div>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${p.color}`}>
                        {p.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 p-2.5 bg-[#FAF8F5] border border-[#121316]/20 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
              <p className="text-[10px] text-[#6b6864] leading-tight">
                <strong className="text-[#121316]">{activeProfile.name} ({activeProfile.badge}):</strong> {activeProfile.desc}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#6b6864] mt-6 font-bold">
          Don't have an account? {' '}
          <Link to="/register" className="text-[#FF5A36] hover:underline font-black">
            Register New Account
          </Link>
        </p>
      </div>

      <GoogleAccountModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        defaultRole="CREATOR"
      />
    </div>
  );
};
