import React from 'react';
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
