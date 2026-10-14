code = r"""import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Plus, Sparkles, Video, ArrowRight, Trash2, Copy, 
  Check, Clock, Layers, Users, HelpCircle, Edit3, Send
} from 'lucide-react';
import { api } from '../services/api';
import { Blueprint, Idea } from '../types';
import { AIActionModal } from '../components/AIActionModal';

export const BlueprintsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const createFromIdeaId = searchParams.get('createFromIdea');

  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New / Edit Blueprint Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formTargetFormat, setFormTargetFormat] = useState('YOUTUBE_LONG');
  const [formTargetAudience, setFormTargetAudience] = useState('');
  const [formEstimatedDuration, setFormEstimatedDuration] = useState('10-12 mins');
  const [formHook, setFormHook] = useState('');
  const [formSections, setFormSections] = useState<Array<{ title: string; duration: string; content: string }>>([
    { title: 'Pattern Interrupt & Stakes', duration: '0:00 - 0:30', content: 'Hook the viewer with an unexpected benchmark failure.' },
    { title: 'Core Problem Breakdown', duration: '0:30 - 2:30', content: 'Show exactly why naive implementations break in production.' },
    { title: 'The Architectural Solution', duration: '2:30 - 7:00', content: 'Step-by-step code walkthrough with screen recordings.' },
    { title: 'Conclusion & Next Steps', duration: '7:00 - 9:00', content: 'Summary checklist and link to the open-source repo.' }
  ]);

  const fetchBlueprints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blueprints');
      setBlueprints(res.data);
      if (res.data.length > 0 && !selectedBlueprint) {
        setSelectedBlueprint(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load blueprints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlueprints();
  }, []);

  useEffect(() => {
    if (createFromIdeaId) {
      api.get(`/ideas/${createFromIdeaId}`).then((res) => {
        const idea: Idea = res.data;
        setIsEditing(true);
        setSelectedBlueprint(null);
        setFormTitle(idea.title);
        setFormTargetFormat(idea.targetFormat || 'YOUTUBE_LONG');
        setFormHook(idea.summary || '');
        setFormTargetAudience('Intermediate to advanced software developers');
      }).catch(err => console.error(err));
    }
  }, [createFromIdeaId]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddSection = () => {
    setFormSections([
      ...formSections,
      { title: `Section ${formSections.length + 1}`, duration: '1-2 mins', content: 'Detail key talking points or visual cues.' }
    ]);
  };

  const handleUpdateSection = (index: number, field: string, val: string) => {
    const updated = [...formSections];
    updated[index] = { ...updated[index], [field]: val };
    setFormSections(updated);
  };

  const handleRemoveSection = (index: number) => {
    setFormSections(formSections.filter((_, idx) => idx !== index));
  };

  const handleSaveBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formTitle,
        targetFormat: formTargetFormat,
        targetAudience: formTargetAudience,
        estimatedDuration: formEstimatedDuration,
        hook: formHook,
        sections: formSections,
        ideaId: createFromIdeaId || undefined
      };

      let res;
      if (selectedBlueprint && !createFromIdeaId) {
        res = await api.put(`/blueprints/${selectedBlueprint._id}`, payload);
        setBlueprints(blueprints.map(b => b._id === selectedBlueprint._id ? res.data : b));
        setSelectedBlueprint(res.data);
      } else {
        res = await api.post('/blueprints', payload);
        setBlueprints([res.data, ...blueprints]);
        setSelectedBlueprint(res.data);
      }

      setIsEditing(false);
      showToast('Blueprint saved successfully!');
    } catch (err) {
      console.error('Failed to save blueprint', err);
    }
  };

  const handleSendToProduction = async (blueprint: Blueprint) => {
    try {
      const res = await api.post('/content', {
        title: blueprint.title,
        description: blueprint.hook || `Scripted blueprint for ${blueprint.targetFormat}`,
        format: blueprint.targetFormat || 'YOUTUBE_LONG',
        status: 'PRODUCTION',
        blueprintId: blueprint._id
      });
      showToast('Transferred to Production Studio!');
      navigate(`/app/production?contentId=${res.data._id}`);
    } catch (err) {
      console.error('Failed to send to production', err);
    }
  };

  const handleCopyMarkdown = (blueprint: Blueprint) => {
    const md = `# ${blueprint.title}\n\n**Format:** ${blueprint.targetFormat}\n**Duration:** ${blueprint.estimatedDuration}\n**Target Audience:** ${blueprint.targetAudience}\n\n## Hook\n${blueprint.hook}\n\n## Script Breakdown\n` +
      blueprint.sections.map((s, idx) => `### ${idx + 1}. ${s.title} (${s.duration})\n${s.content}\n`).join('\n');
    navigator.clipboard.writeText(md);
    showToast('Markdown script copied to clipboard!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-lime-400/40 flex items-center gap-3 font-mono text-xs animate-slide-up">
          <Check className="w-4 h-4 text-lime-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-charcoal-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-cyan-100 text-cyan-900 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-700" />
              Content Blueprint Studio
            </span>
            <span className="text-xs font-mono text-charcoal-500">Modular Narrative & Script Outlines</span>
          </div>
          <h1 className="text-3xl font-black text-charcoal-950 tracking-tight">
            Editorial Blueprints
          </h1>
          <p className="text-charcoal-600 text-sm mt-1 max-w-2xl">
            Structure tight narrative arcs, sequence visual b-roll cues, test retention hooks, and hand off bulletproof briefs to your production team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAiModalOpen(true)}
            className="px-4 py-2.5 bg-sand-100 hover:bg-sand-200 text-charcoal-900 border border-charcoal-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-600" />
            AI Outline Synthesizer
          </button>

          <button
            onClick={() => {
              setIsEditing(true);
              setSelectedBlueprint(null);
              setFormTitle('');
              setFormHook('');
              setFormTargetAudience('');
            }}
            className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-coral-500/20"
          >
            <Plus className="w-4 h-4" />
            New Blueprint
          </button>
        </div>
      </div>

      {/* Main Studio View (Sidebar list + Blueprint Inspector / Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List: Available Blueprints */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-charcoal-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <h3 className="font-bold text-xs uppercase font-mono text-charcoal-800">Master Blueprints</h3>
            <span className="text-xs font-mono text-charcoal-400">{blueprints.length} total</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-sand-50 rounded-2xl p-4 animate-pulse h-20" />
              ))}
            </div>
          ) : blueprints.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-charcoal-200 rounded-2xl text-xs text-charcoal-500">
              No blueprints created yet. Click "New Blueprint" to start writing.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
              {blueprints.map((bp) => (
                <div
                  key={bp._id}
                  onClick={() => {
                    setSelectedBlueprint(bp);
                    setIsEditing(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedBlueprint?._id === bp._id && !isEditing
                      ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-md'
                      : 'bg-sand-50/70 hover:bg-sand-100/80 border-charcoal-200/80 text-charcoal-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedBlueprint?._id === bp._id && !isEditing
                        ? 'bg-charcoal-800 text-cyan-300'
                        : 'bg-cyan-100 text-cyan-900'
                    }`}>
                      {bp.targetFormat}
                    </span>
                    <span className={`text-[10px] font-mono ${
                      selectedBlueprint?._id === bp._id && !isEditing ? 'text-charcoal-400' : 'text-charcoal-500'
                    }`}>
                      {bp.sections?.length || 0} blocks
                    </span>
                  </div>

                  <h4 className="font-bold text-xs line-clamp-1">{bp.title}</h4>
                  <p className={`text-[11px] line-clamp-2 ${
                    selectedBlueprint?._id === bp._id && !isEditing ? 'text-charcoal-300' : 'text-charcoal-600'
                  }`}>
                    {bp.hook || 'No hook defined.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Pane: Selected Blueprint Detail or Editor */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 lg:p-8 border border-charcoal-200/90 shadow-sm">
          {isEditing ? (
            /* Editing / Creating Form */
            <form onSubmit={handleSaveBlueprint} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
                <div>
                  <h3 className="text-xl font-black text-charcoal-950">
                    {selectedBlueprint ? 'Edit Blueprint Brief' : 'Draft New Blueprint'}
                  </h3>
                  <p className="text-xs text-charcoal-500 font-mono">Fill in narrative sections and visual cues</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    Save Blueprint
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Content Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Architecture of High-Throughput WebSockets"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Format</label>
                  <select
                    value={formTargetFormat}
                    onChange={(e) => setFormTargetFormat(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  >
                    <option value="YOUTUBE_LONG">YouTube Long Form</option>
                    <option value="SHORT_REEL">Short / Reel / TikTok</option>
                    <option value="PODCAST">Podcast Episode</option>
                    <option value="NEWSLETTER">Newsletter / Blog</option>
                    <option value="CAROUSEL">Carousel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Target Audience Profile</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior backend engineers & system architects"
                    value={formTargetAudience}
                    onChange={(e) => setFormTargetAudience(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Estimated Target Runtime</label>
                  <input
                    type="text"
                    placeholder="e.g. 8-10 minutes"
                    value={formEstimatedDuration}
                    onChange={(e) => setFormEstimatedDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  />
                </div>
              </div>

              {/* Hook Box */}
              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">The 15-Second Retention Hook</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What is the exact opening sentence and visual pattern interrupt in seconds 0-15?"
                  value={formHook}
                  onChange={(e) => setFormHook(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none resize-none font-medium"
                />
              </div>

              {/* Modular Narrative Sections */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase text-charcoal-800">Narrative & Visual Blocks ({formSections.length})</h4>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-3 py-1 bg-sand-100 hover:bg-sand-200 text-charcoal-800 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Block
                  </button>
                </div>

                <div className="space-y-3">
                  {formSections.map((sec, idx) => (
                    <div key={idx} className="p-4 bg-sand-50 rounded-2xl border border-charcoal-200/80 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-charcoal-900 text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Block Title (e.g. Problem Demonstration)"
                          value={sec.title}
                          onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-charcoal-200 rounded-lg text-xs font-bold focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g. 0:30 - 2:00)"
                          value={sec.duration}
                          onChange={(e) => handleUpdateSection(idx, 'duration', e.target.value)}
                          className="w-32 px-3 py-1.5 bg-white border border-charcoal-200 rounded-lg text-xs font-mono focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="text-charcoal-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Bullet points, script lines, b-roll footage notes..."
                        value={sec.content}
                        onChange={(e) => handleUpdateSection(idx, 'content', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-charcoal-200 rounded-lg text-xs focus:outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          ) : selectedBlueprint ? (
            /* Selected Blueprint Reading View */
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-cyan-100 text-cyan-900 text-[10px] font-mono font-bold rounded-md">
                      {selectedBlueprint.targetFormat}
                    </span>
                    <span className="text-xs font-mono text-charcoal-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {selectedBlueprint.estimatedDuration || '8-10 mins'}
                    </span>
                    <span className="text-xs font-mono text-charcoal-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {selectedBlueprint.targetAudience || 'General Creators'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-charcoal-950">{selectedBlueprint.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyMarkdown(selectedBlueprint)}
                    className="p-2.5 bg-sand-100 hover:bg-sand-200 text-charcoal-700 rounded-xl text-xs font-bold transition-all"
                    title="Copy Markdown Outline"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setFormTitle(selectedBlueprint.title);
                      setFormTargetFormat(selectedBlueprint.targetFormat);
                      setFormTargetAudience(selectedBlueprint.targetAudience || '');
                      setFormEstimatedDuration(selectedBlueprint.estimatedDuration || '');
                      setFormHook(selectedBlueprint.hook || '');
                      setFormSections(selectedBlueprint.sections || []);
                      setIsEditing(true);
                    }}
                    className="px-4 py-2.5 bg-sand-100 hover:bg-sand-200 text-charcoal-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => handleSendToProduction(selectedBlueprint)}
                    className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 text-charcoal-950 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Hand Off to Production
                  </button>
                </div>
              </div>

              {/* Hook Banner */}
              <div className="bg-sand-50 rounded-2xl p-5 border border-charcoal-200/80 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-coral-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> The 15-Second Retention Hook:
                </span>
                <p className="text-sm font-semibold text-charcoal-900 leading-relaxed italic">
                  "{selectedBlueprint.hook}"
                </p>
              </div>

              {/* Blocks Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase text-charcoal-500">Timeline & Visual Cues</h3>
                
                <div className="space-y-3">
                  {selectedBlueprint.sections?.map((sec, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-white border border-charcoal-200/90 rounded-2xl shadow-sm space-y-2 hover:border-charcoal-400 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-charcoal-100 text-charcoal-800 text-xs font-mono font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="font-bold text-sm text-charcoal-900">{sec.title}</h4>
                        </div>
                        <span className="px-2.5 py-0.5 bg-sand-100 text-charcoal-700 font-mono text-[11px] rounded-md font-bold">
                          {sec.duration}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-600 pl-8 leading-relaxed whitespace-pre-line">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-charcoal-400 font-mono text-xs">
              Select a blueprint from the left list or create a new one.
            </div>
          )}
        </div>

      </div>

      {/* AI Outline Assistant Modal */}
      <AIActionModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        mode="BLUEPRINT"
        initialContext={selectedBlueprint?.title || formTitle || 'Building High Performance Full-Stack Applications'}
      />
    </div>
  );
};
"""
with open(r'D:\CreatorHub\frontend\src\pages\BlueprintsPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code.strip())
print("Wrote BlueprintsPage.tsx successfully!")
