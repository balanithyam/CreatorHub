import React, { useState } from 'react';
import { Image, Smartphone, Monitor, Sparkles, CheckCircle2, AlertTriangle, Eye, ThumbsUp } from 'lucide-react';

export const ThumbnailTesterPage: React.FC = () => {
  const [titleA, setTitleA] = useState('How I Built a $100k SaaS in 30 Days (Step-by-Step)');
  const [titleB, setTitleB] = useState('Stop Coding Normal Apps! Do THIS Instead in 2026');
  const [imageA, setImageA] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80');
  const [imageB, setImageB] = useState('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80');
  const [channelName] = useState('Alex Rivera Tech');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  const powerWords = ['How I', 'Built', 'Secret', 'Stop', 'THIS', '2026', '$100k', 'Step-by-Step', 'Instant', 'Never'];

  const calculateScore = (title: string, img: string) => {
    let score = 50;
    if (title.length >= 25 && title.length <= 60) score += 20;
    else if (title.length > 70) score -= 15;

    const hasPowerWord = powerWords.some(pw => title.toLowerCase().includes(pw.toLowerCase()));
    if (hasPowerWord) score += 15;

    const hasNumbers = /\d+/.test(title);
    if (hasNumbers) score += 10;

    if (img && img.startsWith('http')) score += 5;
    return Math.min(score, 98);
  };

  const scoreA = calculateScore(titleA, imageA);
  const scoreB = calculateScore(titleB, imageB);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#121316] text-white p-6 rounded-2xl border-2 border-[#121316] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D2F800] text-[#121316]">FEATURE #1</span>
            <span className="text-xs font-mono text-[#FAF8F5]/70">Visual A/B Feed Simulator</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1 flex items-center gap-2">
            <Image className="w-6 h-6 text-[#D2F800]" />
            Thumbnail & Title Tester
          </h1>
          <p className="text-sm text-[#FAF8F5]/80 mt-1 max-w-2xl">
            Simulate how your video thumbnail and title compete in real YouTube & Reels feeds before you publish. Scores readability, length, and CTR power words.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-[#23252b] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mobile' ? 'bg-[#D2F800] text-[#121316]' : 'text-white/70 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile Feed
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'desktop' ? 'bg-[#D2F800] text-[#121316]' : 'text-white/70 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop Grid
          </button>
        </div>
      </div>

      {/* Inputs & A/B Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Variation A */}
        <div className="bg-white border-2 border-[#121316] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#2A72FF] text-white">VARIATION A</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#121316]">
              <Sparkles className="w-4 h-4 text-[#FF5A36]" />
              Estimated CTR Score: <span className="font-black text-sm text-[#2A72FF]">{scoreA}%</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#121316] block mb-1">Title Headline</label>
              <input
                type="text"
                value={titleA}
                onChange={(e) => setTitleA(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2A72FF]"
              />
              <div className="flex justify-between text-[10px] text-[#6b6864] mt-1 font-mono">
                <span>{titleA.length} characters</span>
                <span className={titleA.length > 60 ? 'text-[#FF5A36] font-bold' : 'text-green-600'}>
                  {titleA.length > 60 ? 'Truncates on Mobile (>60 chars)' : 'Ideal Mobile Length'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#121316] block mb-1">Thumbnail Image URL</label>
              <input
                type="text"
                value={imageA}
                onChange={(e) => setImageA(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2A72FF]"
              />
            </div>
          </div>

          {/* Feed Preview Card */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#6b6864] block mb-2">Live Feed Appearance</span>
            <div className={viewMode === 'mobile' ? 'max-w-xs mx-auto bg-black text-white rounded-2xl overflow-hidden p-3 space-y-2' : 'bg-gray-100 rounded-xl p-3'}>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                <img src={imageA} alt="Preview A" className="w-full h-full object-cover" />
                <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">12:45</span>
              </div>
              <div className="flex gap-2.5 pt-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2A72FF] to-[#D2F800] shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold leading-snug line-clamp-2">{titleA}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{channelName} • 142K views • 2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variation B */}
        <div className="bg-white border-2 border-[#121316] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#D2F800] text-[#121316]">VARIATION B</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#121316]">
              <Sparkles className="w-4 h-4 text-[#FF5A36]" />
              Estimated CTR Score: <span className="font-black text-sm text-green-600">{scoreB}%</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#121316] block mb-1">Title Headline</label>
              <input
                type="text"
                value={titleB}
                onChange={(e) => setTitleB(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D2F800]"
              />
              <div className="flex justify-between text-[10px] text-[#6b6864] mt-1 font-mono">
                <span>{titleB.length} characters</span>
                <span className={titleB.length > 60 ? 'text-[#FF5A36] font-bold' : 'text-green-600'}>
                  {titleB.length > 60 ? 'Truncates on Mobile (>60 chars)' : 'Ideal Mobile Length'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#121316] block mb-1">Thumbnail Image URL</label>
              <input
                type="text"
                value={imageB}
                onChange={(e) => setImageB(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D2F800]"
              />
            </div>
          </div>

          {/* Feed Preview Card */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#6b6864] block mb-2">Live Feed Appearance</span>
            <div className={viewMode === 'mobile' ? 'max-w-xs mx-auto bg-black text-white rounded-2xl overflow-hidden p-3 space-y-2' : 'bg-gray-100 rounded-xl p-3'}>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                <img src={imageB} alt="Preview B" className="w-full h-full object-cover" />
                <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">09:12</span>
              </div>
              <div className="flex gap-2.5 pt-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5A36] to-[#D2F800] shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold leading-snug line-clamp-2">{titleB}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{channelName} • 280K views • 5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
