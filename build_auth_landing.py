# -*- coding: utf-8 -*-
import os

def w(path, code):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code.strip() + '\n')
    print('Generated:', path)

landing_code = """import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, BookOpen, Lightbulb, FileText, Video, Eye, MessageSquare, GitFork, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const workflowSteps = [
    { label: 'Discover', desc: 'Scan real-time YouTube, Reddit, News RSS & Trends', icon: Compass, color: '#D2F800' },
    { label: 'Research', desc: 'Pin insights, quotes, and web evidence to your canvas', icon: BookOpen, color: '#FFEFEA' },
    { label: 'Idea', desc: 'Visual Kanban boards with deterministic AI angle expansions', icon: Lightbulb, color: '#FFD028' },
    { label: 'Blueprint', desc: 'Structured editorial briefs with hook optimization', icon: FileText, color: '#2A72FF' },
    { label: 'Produce', desc: 'Task checklists, media uploads & version control', icon: Video, color: '#FF5A36' },
    { label: 'Review', desc: 'Video timeline comments, spatial pins & real-time sync', icon: Eye, color: '#D2F800' },
    { label: 'Audience', desc: 'Extract questions & convert feedback directly into ideas', icon: MessageSquare, color: '#FFEFEA' },
    { label: 'Reuse', desc: 'Parent-to-child derivative tree & asset freshness audit', icon: GitFork, color: '#FFD028' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121316] selection:bg-[#FF5A36] selection:text-white flex flex-col justify-between">
      <nav className="border-b-2 border-[#121316] bg-white px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#121316] rounded-lg flex items-center justify-center text-white font-black text-xl shadow-brutal-sm">
            C
          </div>
          <span className="font-black text-xl tracking-tight">CreatorHub</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="brutal-btn-outline text-xs px-4 py-2"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="brutal-btn text-xs px-4 py-2"
          >
            Open Studio Free
          </button>
        </div>
      </nav>

      <header className="px-6 md:px-12 pt-16 pb-12 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D2F800] border-2 border-[#121316] rounded-full text-xs font-black uppercase mb-6 shadow-brutal-sm">
          <Sparkles className="w-3.5 h-3.5" />
          The Operating System for Modern Creators
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-[#121316] uppercase font-sans mb-6">
          Create From What&apos;s <span className="bg-[#FF5A36] text-white px-2 py-0.5 rounded-lg border-2 border-[#121316] shadow-brutal inline-block">Happening Now.</span>
        </h1>
        <p className="text-lg md:text-xl text-[#6B6864] max-w-3xl mx-auto font-medium mb-8">
          The studio workspace connecting your complete lifecycle:
          <span className="text-[#121316] font-bold"> Discover → Research → Idea → Plan → Produce → Review → Audience → Reuse</span>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="brutal-btn text-base px-8 py-3.5 flex items-center gap-3 text-white"
          >
            <span>Start Creating Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="brutal-btn-outline text-base px-8 py-3.5"
          >
            Demo Studio Sign In
          </button>
        </div>
      </header>

      <section className="px-6 md:px-12 py-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="brutal-card p-6 bg-white hover:translate-y-[-2px] transition-transform">
            <span className="brutal-badge bg-[#FF5A36] text-white mb-3">ROLE 01</span>
            <h3 className="text-xl font-extrabold text-[#121316] mb-2">Creator</h3>
            <p className="text-xs text-[#6B6864] leading-relaxed">
              Leads editorial vision, crafts blueprints, refines hooks, reviews production cuts, and orchestrates content cascades.
            </p>
          </div>

          <div className="brutal-card p-6 bg-white hover:translate-y-[-2px] transition-transform">
            <span className="brutal-badge bg-[#2A72FF] text-white mb-3">ROLE 02</span>
            <h3 className="text-xl font-extrabold text-[#121316] mb-2">Producer</h3>
            <p className="text-xs text-[#6B6864] leading-relaxed">
              Executes video edits, tracks checklist milestones, manages render versions, responds to timestamped review notes.
            </p>
          </div>

          <div className="brutal-card p-6 bg-white hover:translate-y-[-2px] transition-transform">
            <span className="brutal-badge bg-[#D2F800] text-[#121316] mb-3">ROLE 03</span>
            <h3 className="text-xl font-extrabold text-[#121316] mb-2">Curator</h3>
            <p className="text-xs text-[#6B6864] leading-relaxed">
              Monitors live feeds, discovers high-signal discussions on Reddit/YouTube/News, and builds research walls.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-8 uppercase tracking-tight">
          The 8 Connected Studio Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="brutal-card p-5 bg-white flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg border-2 border-[#121316] flex items-center justify-center shadow-brutal-sm mb-3" style={{ backgroundColor: step.color }}>
                    <Icon className="w-5 h-5 text-[#121316]" />
                  </div>
                  <h4 className="font-black text-base text-[#121316] mb-1">{step.label}</h4>
                  <p className="text-xs text-[#6B6864] leading-normal">{step.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E4DDD3] flex items-center justify-between text-[11px] font-bold text-[#121316]">
                  <span>Step 0{idx + 1}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t-2 border-[#121316] bg-white px-6 md:px-12 py-8 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#6B6864]">
          <p>(c) 2026 CreatorHub Studio Inc. Built for modern high-leverage creators.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#121316] cursor-pointer" onClick={() => navigate('/login')}>Sign In</span>
            <span className="hover:text-[#121316] cursor-pointer" onClick={() => navigate('/register')}>Register</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
"""
w('frontend/src/pages/LandingPage.tsx', landing_code)

login_code = """import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('creator@creatorhub.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success && res.data?.data) {
        login(res.data.data.user, res.data.data.token);
        navigate('/app/home');
      } else {
        setError(res.data?.message || 'Login failed. Please check credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoRole = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 selection:bg-[#FF5A36] selection:text-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 cursor-pointer mb-2"
          >
            <div className="w-10 h-10 bg-[#121316] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-brutal-sm">
              C
            </div>
            <span className="font-black text-2xl tracking-tight text-[#121316]">
              CreatorHub
            </span>
          </div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#6B6864]">
            Studio Workspace Sign In
          </p>
        </div>

        <div className="brutal-card p-6 md:p-8 bg-white">
          {error && (
            <div className="mb-4 p-3 bg-[#FFEFEA] border-2 border-[#FF5A36] rounded-lg text-xs font-bold text-[#FF5A36]">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#121316] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@creatorhub.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-lg text-xs font-medium focus:outline-none focus:bg-white"
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
                <Lock className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-lg text-xs font-medium focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full brutal-btn py-3 flex items-center justify-center gap-2 mt-4 text-white cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t-2 border-[#121316]">
            <p className="text-[11px] font-black uppercase text-[#6B6864] mb-2 tracking-wider">
              Quick Switch Seed Profiles:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoRole('creator@creatorhub.com')}
                className={`p-2 rounded-lg border-2 text-center text-xs font-extrabold transition-all cursor-pointer ${
                  email === 'creator@creatorhub.com'
                    ? 'bg-[#FF5A36] text-white border-[#121316] shadow-brutal-sm'
                    : 'bg-[#FAF8F5] text-[#121316] border-[#121316] hover:bg-[#F4F0EA]'
                }`}
              >
                Creator
              </button>
              <button
                type="button"
                onClick={() => setDemoRole('producer@creatorhub.com')}
                className={`p-2 rounded-lg border-2 text-center text-xs font-extrabold transition-all cursor-pointer ${
                  email === 'producer@creatorhub.com'
                    ? 'bg-[#2A72FF] text-white border-[#121316] shadow-brutal-sm'
                    : 'bg-[#FAF8F5] text-[#121316] border-[#121316] hover:bg-[#F4F0EA]'
                }`}
              >
                Producer
              </button>
              <button
                type="button"
                onClick={() => setDemoRole('curator@creatorhub.com')}
                className={`p-2 rounded-lg border-2 text-center text-xs font-extrabold transition-all cursor-pointer ${
                  email === 'curator@creatorhub.com'
                    ? 'bg-[#D2F800] text-[#121316] border-[#121316] shadow-brutal-sm'
                    : 'bg-[#FAF8F5] text-[#121316] border-[#121316] hover:bg-[#F4F0EA]'
                }`}
              >
                Curator
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#6B6864] mt-6 font-bold">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-[#FF5A36] hover:underline">
            Register New Account
          </Link>
        </p>
      </div>
    </div>
  );
};
"""
w('frontend/src/pages/LoginPage.tsx', login_code)

register_code = """import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { User, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CREATOR');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreedTerms) {
      setError('You must agree to the Terms of Service to register.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      if (res.data?.success) {
        setSuccessMsg('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(res.data?.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 selection:bg-[#FF5A36] selection:text-white">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div onClick={() => navigate('/')} className="inline-flex items-center gap-2 cursor-pointer mb-2">
            <div className="w-10 h-10 bg-[#121316] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-brutal-sm">
              C
            </div>
            <span className="font-black text-2xl tracking-tight text-[#121316]">CreatorHub</span>
          </div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#6B6864]">
            Register Your Studio Profile
          </p>
        </div>

        <div className="brutal-card p-6 md:p-8 bg-white">
          {error && (
            <div className="mb-4 p-3 bg-[#FFEFEA] border-2 border-[#FF5A36] rounded-lg text-xs font-bold text-[#FF5A36]">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-[#E8F8F0] border-2 border-emerald-600 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#121316] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border-2 border-[#121316] rounded-lg text-xs font-medium focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#121316] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena@studio.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border-2 border-[#121316] rounded-lg text-xs font-medium focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-[#121316] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border-2 border-[#121316] rounded-lg text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#121316] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border-2 border-[#121316] rounded-lg text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#121316] mb-2">
                Select Your Primary Studio Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div
                  onClick={() => setRole('CREATOR')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    role === 'CREATOR'
                      ? 'bg-[#FFEFEA] border-[#FF5A36] shadow-brutal-sm'
                      : 'bg-[#FAF8F5] border-[#121316] hover:bg-[#F4F0EA]'
                  }`}
                >
                  <p className="text-xs font-black text-[#121316]">CREATOR</p>
                  <p className="text-[10px] text-[#6B6864] mt-0.5 leading-tight">Vision & Blueprints</p>
                </div>

                <div
                  onClick={() => setRole('PRODUCER')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    role === 'PRODUCER'
                      ? 'bg-[#EBF2FF] border-[#2A72FF] shadow-brutal-sm'
                      : 'bg-[#FAF8F5] border-[#121316] hover:bg-[#F4F0EA]'
                  }`}
                >
                  <p className="text-xs font-black text-[#121316]">PRODUCER</p>
                  <p className="text-[10px] text-[#6B6864] mt-0.5 leading-tight">Media & Edits</p>
                </div>

                <div
                  onClick={() => setRole('CURATOR')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    role === 'CURATOR'
                      ? 'bg-[#F9FFE5] border-[#121316] shadow-brutal-sm'
                      : 'bg-[#FAF8F5] border-[#121316] hover:bg-[#F4F0EA]'
                  }`}
                >
                  <p className="text-xs font-black text-[#121316]">CURATOR</p>
                  <p className="text-[10px] text-[#6B6864] mt-0.5 leading-tight">Trends & Feeds</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 border-2 border-[#121316] rounded"
              />
              <label htmlFor="terms" className="text-xs text-[#6B6864] font-medium cursor-pointer">
                I agree to the CreatorHub Terms of Service & Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full brutal-btn py-3 flex items-center justify-center gap-2 mt-4 text-white cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create Studio Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#6B6864] mt-6 font-bold">
          Already registered?{' '}
          <Link to="/login" className="text-[#FF5A36] hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
"""
w('frontend/src/pages/RegisterPage.tsx', register_code)

print('Auth and Landing pages generated!')
