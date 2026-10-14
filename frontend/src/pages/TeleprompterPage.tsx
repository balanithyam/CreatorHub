import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind, Mic, Type, Eye, Volume2 } from 'lucide-react';

export const TeleprompterPage: React.FC = () => {
  const [script, setScript] = useState(`Welcome back to CreatorHub! In today's video, we are breaking down the exact 3-part blueprint top creators use to produce 10x more content without burning out.

First, let's talk about the Live Idea Pipeline. Most people spend 4 hours staring at a blank screen. Instead, we scan live high-velocity search trends and convert them into structured video blueprints in under 60 seconds.

Second, the Context-Aware Review workflow. Stop sending messy unorganized timestamps over email or messaging apps. With timeline-pinned feedback, editors and producers can pinpoint the exact frame that needs a cut or color grade.

Finally, the Asset Dependency Graph. Take one 10-minute long-form video and automatically map out 5 short-form reels, 2 carousels, and an email newsletter. Every asset stays linked and in sync.`);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(120); // Words per minute
  const [fontSize, setFontSize] = useState(24); // px
  const [isMirrored, setIsMirrored] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          // Calculate scroll step based on WPM
          const step = Math.max(1, Math.round(speed / 60));
          scrollRef.current.scrollTop += step;
        }
        setElapsedSeconds((prev) => prev + 1);
      }, 200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;
  const estimatedTotalMinutes = (wordCount / (speed || 120)).toFixed(1);

  const resetPrompt = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#121316] text-white p-6 rounded-2xl border-2 border-[#121316] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D2F800] text-[#121316]">FEATURE #2</span>
            <span className="text-xs font-mono text-[#FAF8F5]/70">Smooth Speech Delivery</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1 flex items-center gap-2">
            <Mic className="w-6 h-6 text-[#D2F800]" />
            Studio Teleprompter
          </h1>
          <p className="text-sm text-[#FAF8F5]/80 mt-1 max-w-2xl">
            Read scripts smoothly while looking directly at your camera lens. Includes dynamic WPM speed control, eye-line guide marker, mirror mode for beam-splitter glass, and duration stopwatch.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-3 bg-[#23252b] px-4 py-2.5 rounded-xl border border-white/10">
          <div className="text-center">
            <span className="text-[10px] font-mono text-gray-400 block uppercase">Word Count</span>
            <span className="font-mono font-black text-sm text-[#D2F800]">{wordCount}</span>
          </div>
          <div className="h-6 w-px bg-white/20"></div>
          <div className="text-center">
            <span className="text-[10px] font-mono text-gray-400 block uppercase">Est. Time</span>
            <span className="font-mono font-black text-sm text-white">{estimatedTotalMinutes} min</span>
          </div>
          <div className="h-6 w-px bg-white/20"></div>
          <div className="text-center">
            <span className="text-[10px] font-mono text-gray-400 block uppercase">Elapsed</span>
            <span className="font-mono font-black text-sm text-[#FF5A36]">
              {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Script Editor & Controls */}
        <div className="lg:col-span-5 bg-white border-2 border-[#121316] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-xs font-mono font-bold uppercase text-[#6b6864]">Script Source</span>
            <span className="text-[10px] font-mono text-[#2A72FF] font-bold">Auto-synced</span>
          </div>

          <div>
            <textarea
              rows={12}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full p-3 border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2A72FF] leading-relaxed resize-none"
              placeholder="Paste or write your video script here..."
            />
          </div>

          {/* Controls */}
          <div className="space-y-3 pt-2 border-t">
            {/* Speed slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#121316] mb-1">
                <span>Pacing Speed: {speed} WPM</span>
                <span className="text-[10px] text-[#6b6864] font-mono">Standard: 120-150 WPM</span>
              </div>
              <input
                type="range"
                min="60"
                max="240"
                step="5"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-[#121316]"
              />
            </div>

            {/* Font Size slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#121316] mb-1">
                <span>Display Font Size: {fontSize}px</span>
                <span className="text-[10px] text-[#6b6864] font-mono">Legible at 6 feet</span>
              </div>
              <input
                type="range"
                min="18"
                max="48"
                step="2"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-[#121316]"
              />
            </div>

            {/* Mirror Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-[#121316]">Mirror Mode (Glass Reflection)</span>
              <button
                type="button"
                onClick={() => setIsMirrored(!isMirrored)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border-2 border-[#121316] transition-all ${
                  isMirrored ? 'bg-[#D2F800] text-[#121316]' : 'bg-gray-100 text-[#6b6864]'
                }`}
              >
                {isMirrored ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Prompter Screen */}
        <div className="lg:col-span-7 bg-[#0b0c0e] border-2 border-[#121316] rounded-2xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          {/* Eye Level Line Marker */}
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-[#FF5A36]/60 pointer-events-none z-10 flex items-center justify-between px-4">
            <span className="text-[9px] font-mono uppercase font-bold text-[#FF5A36] bg-[#0b0c0e] px-1">EYE LEVEL FOCUS</span>
            <span className="text-[9px] font-mono uppercase font-bold text-[#FF5A36] bg-[#0b0c0e] px-1">LOOK HERE</span>
          </div>

          {/* Prompter Scrolling Area */}
          <div
            ref={scrollRef}
            className={`h-96 overflow-y-auto px-6 py-12 text-white font-sans font-bold leading-relaxed scroll-smooth select-none ${
              isMirrored ? 'scale-x-[-1]' : ''
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {script}
          </div>

          {/* Playback Action Bar */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-4 bg-[#0b0c0e] z-20">
            <button
              onClick={() => {
                if (scrollRef.current) scrollRef.current.scrollTop -= 80;
              }}
              className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
              title="Rewind 5 lines"
            >
              <Rewind className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm cursor-pointer transition-all shadow-md ${
                isPlaying
                  ? 'bg-[#FF5A36] text-white hover:bg-[#e04825]'
                  : 'bg-[#D2F800] text-[#121316] hover:bg-[#bce000]'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              {isPlaying ? 'PAUSE PROMPTER' : 'START PROMPTER'}
            </button>

            <button
              onClick={() => {
                if (scrollRef.current) scrollRef.current.scrollTop += 80;
              }}
              className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
              title="Fast Forward 5 lines"
            >
              <FastForward className="w-5 h-5" />
            </button>

            <button
              onClick={resetPrompt}
              className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer ml-2"
              title="Reset to Top"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
