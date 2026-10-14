import React, { useState } from 'react';
import { DollarSign, FileText, CheckCircle2, Calculator, ArrowRight, Copy, Check, Download, Sparkles } from 'lucide-react';

export const SponsorshipCalculatorPage: React.FC = () => {
  const [niche, setNiche] = useState('Tech & Software');
  const [avgViews, setAvgViews] = useState(45000);
  const [dealType, setDealType] = useState<'dedicated' | 'integrated' | 'shoutout'>('integrated');
  const [sponsorName, setSponsorName] = useState('Acme AI Tools');
  const [creatorName, setCreatorName] = useState('Alex Rivera (CreatorHub Studio)');
  const [copied, setCopied] = useState(false);

  // CPM Benchmarks
  const cpmByNiche: Record<string, { min: number; max: number }> = {
    'Tech & Software': { min: 25, max: 45 },
    'Finance & Crypto': { min: 35, max: 65 },
    'Business & Productivity': { min: 22, max: 40 },
    'Gaming & Esports': { min: 12, max: 22 },
    'Lifestyle & Fitness': { min: 15, max: 28 },
    'Education & Design': { min: 20, max: 35 },
  };

  const currentCpm = cpmByNiche[niche] || { min: 20, max: 35 };
  const baseAvgCpm = (currentCpm.min + currentCpm.max) / 2;

  // Deal Multipliers
  const multiplier = dealType === 'dedicated' ? 2.5 : dealType === 'integrated' ? 1.0 : 0.45;
  const estimatedPrice = Math.round((avgViews / 1000) * baseAvgCpm * multiplier);
  const minPrice = Math.round((avgViews / 1000) * currentCpm.min * multiplier);
  const maxPrice = Math.round((avgViews / 1000) * currentCpm.max * multiplier);

  const invoiceNumber = 'INV-' + Math.floor(100000 + Math.random() * 900000);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const invoiceSummary = `INVOICE: ${invoiceNumber}
Date: ${today}
To: ${sponsorName}
From: ${creatorName}
Item: 60-Second ${dealType.toUpperCase()} Video Sponsorship (${niche})
Guaranteed View Expectation: ${avgViews.toLocaleString()} views
Total Due: $${estimatedPrice.toLocaleString()} USD
Payment Terms: Net 15 via Wire / Stripe`;

  const copyInvoice = () => {
    navigator.clipboard.writeText(invoiceSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#121316] text-white p-6 rounded-2xl border-2 border-[#121316] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D2F800] text-[#121316]">FEATURE #3</span>
            <span className="text-xs font-mono text-[#FAF8F5]/70">Creator Monetization Engine</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#D2F800]" />
            Sponsorship Rate & Invoice Generator
          </h1>
          <p className="text-sm text-[#FAF8F5]/80 mt-1 max-w-2xl">
            Never undercharge brands again. Calculate exact industry CPM market rates based on your verified audience niche, and generate clean professional sponsor invoices in 1 click.
          </p>
        </div>
      </div>

      {/* Main Calculator & Invoice Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 bg-white border-2 border-[#121316] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-xs font-mono font-bold uppercase text-[#6b6864]">Campaign Parameters</span>
            <span className="text-xs font-bold text-[#2A72FF]">Industry CPM Model</span>
          </div>

          <div className="space-y-3">
            {/* Niche select */}
            <div>
              <label className="text-xs font-bold text-[#121316] block mb-1">Content Niche / Category</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#121316] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2A72FF] bg-white"
              >
                {Object.keys(cpmByNiche).map((n) => (
                  <option key={n} value={n}>
                    {n} (${cpmByNiche[n].min} - ${cpmByNiche[n].max} CPM)
                  </option>
                ))}
              </select>
            </div>

            {/* Average Views */}
            <div>
              <label className="text-xs font-bold text-[#121316] block mb-1">
                Average Views per Video: <span className="text-[#2A72FF]">{avgViews.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={avgViews}
                onChange={(e) => setAvgViews(Number(e.target.value))}
                className="w-full accent-[#121316]"
              />
            </div>

            {/* Deal Type */}
            <div>
              <label className="text-xs font-bold text-[#121316] block mb-1">Placement Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'integrated', label: '60s Integration', desc: '1.0x CPM' },
                  { id: 'dedicated', label: 'Dedicated Video', desc: '2.5x CPM' },
                  { id: 'shoutout', label: 'Quick Shoutout', desc: '0.45x CPM' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDealType(type.id as any)}
                    className={`p-2.5 rounded-xl border-2 border-[#121316] text-left transition-all ${
                      dealType === type.id ? 'bg-[#121316] text-white shadow-xs' : 'bg-gray-50 text-[#121316]'
                    }`}
                  >
                    <p className="text-xs font-black">{type.label}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sponsor details */}
            <div className="pt-2 border-t space-y-2">
              <div>
                <label className="text-xs font-bold text-[#121316] block mb-1">Sponsor / Brand Name</label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2A72FF]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#121316] block mb-1">Creator / Studio Name</label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2A72FF]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Rate Summary & Invoice */}
        <div className="lg:col-span-7 space-y-4">
          {/* Rate Card Banner */}
          <div className="bg-gradient-to-tr from-[#121316] to-[#23252b] text-white p-6 rounded-2xl border-2 border-[#121316] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D2F800] font-bold block">Recommended Price Quote</span>
              <p className="text-4xl font-black text-white tracking-tight mt-1">${estimatedPrice.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Suggested Range: ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()} USD
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-lg bg-[#D2F800] text-[#121316] text-xs font-black">
                {Math.round(baseAvgCpm * multiplier)} USD Effective CPM
              </span>
            </div>
          </div>

          {/* Printable Invoice Card */}
          <div className="bg-white border-2 border-[#121316] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-sm font-black text-[#121316]">OFFICIAL BRAND INVOICE</span>
                <p className="text-[10px] font-mono text-[#6b6864]">{invoiceNumber} • Generated on {today}</p>
              </div>
              <button
                onClick={copyInvoice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-[#121316] text-xs font-bold hover:bg-gray-100 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Details'}
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-xs text-[#121316] space-y-2 leading-relaxed whitespace-pre-wrap">
              {invoiceSummary}
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-[#6b6864] pt-2">
              <span>Standard CreatorHub Verified Rate</span>
              <span className="text-green-600 font-bold">100% Ready to Send</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
