import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Video, Plus, Upload, CheckCircle2, Circle, Clock, ArrowRight, 
  Trash2, FileText, Check, Eye, AlertCircle, Sparkles, Folder, Play
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ContentItem } from '../types';

const safeArray = (val: any) => Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);

export const ProductionPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedContentParam = searchParams.get('contentId');

  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // New Content Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFormat, setNewFormat] = useState('YOUTUBE_LONG');
  const [newDesc, setNewDesc] = useState('');

  // Upload Cut Modal
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionNotes, setVersionNotes] = useState('');
  const [versionUrl, setVersionUrl] = useState('');

  // Add Task Input
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content');
      const items = safeArray(res.data);
      setContentList(items);
      if (items.length > 0) {
        if (selectedContentParam) {
          const match = items.find((c: ContentItem) => c._id === selectedContentParam);
          setSelectedItem(match || items[0]);
        } else if (!selectedItem) {
          setSelectedItem(items[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load production list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [selectedContentParam]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/content', {
        title: newTitle,
        format: newFormat,
        description: newDesc,
        status: 'PRODUCTION',
        tasks: [
          { title: 'Record A-Roll Talking Head Footage', completed: false },
          { title: 'Capture B-Roll Terminal Demos & UI', completed: false },
          { title: 'Audio Level Balancing & Noise Gate', completed: false },
          { title: 'Render Draft Cut v1', completed: false }
        ]
      });
      const created = res.data?.data || res.data;
      setContentList([created, ...contentList]);
      setSelectedItem(created);
      setCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      showToast('Created new production project!');
    } catch (err) {
      console.error('Failed to create content project', err);
    }
  };

  const handleToggleTask = async (taskIndex: number) => {
    if (!selectedItem) return;
    try {
      const updatedTasks = [...(selectedItem.tasks || [])];
      updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;

      const res = await api.patch(`/content/${selectedItem._id}`, {
        tasks: updatedTasks
      });
      setSelectedItem(res.data);
      setContentList(contentList.map(c => c._id === selectedItem._id ? res.data : c));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !newTaskTitle.trim()) return;
    try {
      const updatedTasks = [...(selectedItem.tasks || []), { title: newTaskTitle.trim(), completed: false }];
      const res = await api.patch(`/content/${selectedItem._id}`, { tasks: updatedTasks });
      setSelectedItem(res.data);
      setContentList(contentList.map(c => c._id === selectedItem._id ? res.data : c));
      setNewTaskTitle('');
      showToast('Task added to checklist');
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const handleUploadVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      const res = await api.post(`/content/${selectedItem._id}/versions`, {
        versionNumber: (selectedItem.versions?.length || 0) + 1,
        notes: versionNotes || 'New production export rendered.',
        mediaUrl: versionUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        mediaType: 'VIDEO'
      });
      const updated = res.data?.data || res.data;
      setSelectedItem(updated);
      setContentList(contentList.map(c => c._id === selectedItem._id ? updated : c));
      setVersionModalOpen(false);
      setVersionNotes('');
      setVersionUrl('');
      showToast('New media cut uploaded and sent to Review Queue!');
    } catch (err) {
      console.error('Failed to upload version', err);
    }
  };

  const completedCount = selectedItem?.tasks?.filter(t => t.completed).length || 0;
  const totalCount = selectedItem?.tasks?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
            <span className="px-3 py-1 bg-coral-100 text-coral-800 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-coral-600" />
              Production Workspace
            </span>
            <span className="text-xs font-mono text-charcoal-500">Asset Tracking & Version Pipelines</span>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase ${
              user?.role === 'PRODUCER' || user?.role === 'ADMIN' ? 'bg-[#2A72FF] text-white' : 'bg-[#121316] text-[#D2F800]'
            }`}>
              {user?.role === 'PRODUCER' ? 'Pipeline Director (Full Authority)' :
               user?.role === 'ADMIN' ? 'Studio Admin (Full Control)' :
               user?.role === 'EDITOR' ? 'Post-Production Lead (Cut Uploads)' :
               `Contributor (${user?.role || 'Creator'})`}
            </span>
          </div>
          <h1 className="text-3xl font-black text-charcoal-950 tracking-tight">
            Media Production Studio
          </h1>
          <p className="text-charcoal-600 text-sm mt-1 max-w-2xl">
            Track filming checklists, render video revisions, attach raw b-roll assets, and push new cuts straight to the timestamp review studio.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-coral-500/20"
        >
          <Plus className="w-4 h-4" />
          New Production Project
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List: Active Production Items */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-charcoal-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <h3 className="font-bold text-xs uppercase font-mono text-charcoal-800">In Production</h3>
            <span className="text-xs font-mono text-charcoal-400">{contentList.length} tracks</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-sand-50 rounded-2xl p-4 animate-pulse h-20" />
              ))}
            </div>
          ) : contentList.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-charcoal-200 rounded-2xl text-xs text-charcoal-500">
              No active production items. Create one to begin.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
              {contentList.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedItem?._id === item._id
                      ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-md'
                      : 'bg-sand-50/70 hover:bg-sand-100/80 border-charcoal-200/80 text-charcoal-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedItem?._id === item._id
                        ? 'bg-charcoal-800 text-coral-300'
                        : 'bg-coral-100 text-coral-900'
                    }`}>
                      {item.format}
                    </span>
                    <span className={`text-[10px] font-mono ${
                      selectedItem?._id === item._id ? 'text-charcoal-400' : 'text-charcoal-500'
                    }`}>
                      v{item.versions?.length || 1}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs line-clamp-1">{item.title}</h4>
                  
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-mono text-[10px] ${
                      selectedItem?._id === item._id ? 'text-lime-400' : 'text-charcoal-500'
                    }`}>
                      {item.tasks?.filter(t => t.completed).length || 0}/{item.tasks?.length || 0} tasks done
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      item.status === 'PUBLISHED' ? 'bg-lime-200 text-lime-900' : 'bg-charcoal-200 text-charcoal-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Pane: Production Track Details & Checklist & Versions */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 lg:p-8 border border-charcoal-200/90 shadow-sm">
          {selectedItem ? (
            <div className="space-y-8">
              
              {/* Header Info & Review CTA */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-coral-100 text-coral-900 text-[10px] font-mono font-bold rounded-md">
                      {selectedItem.format}
                    </span>
                    <span className="text-xs font-mono text-charcoal-500">
                      Current: Version {selectedItem.versions?.length || 1}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-charcoal-950">{selectedItem.title}</h2>
                  <p className="text-xs text-charcoal-600">{selectedItem.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVersionModalOpen(true)}
                    className="px-4 py-2.5 bg-sand-100 hover:bg-sand-200 text-charcoal-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Cut
                  </button>

                  <Link
                    to={`/app/review?contentId=${selectedItem._id}`}
                    className="px-5 py-2.5 bg-charcoal-900 hover:bg-coral-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-lime-400" /> Open Review Studio
                  </Link>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-sand-50 rounded-2xl p-4 border border-charcoal-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-charcoal-800">Production Checklist Progress</span>
                  <span className="font-bold text-coral-600">{progressPercent}% Completed</span>
                </div>
                <div className="w-full h-2.5 bg-charcoal-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-coral-500 to-lime-400 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Task Checklist */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase text-charcoal-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-600" />
                  Filming & Editing Milestones ({completedCount}/{totalCount})
                </h3>

                <div className="space-y-2">
                  {selectedItem.tasks?.map((task, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleToggleTask(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        task.completed 
                          ? 'bg-lime-50/70 border-lime-200/90 text-charcoal-900' 
                          : 'bg-white border-charcoal-200/80 hover:border-charcoal-400 text-charcoal-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-charcoal-300 shrink-0" />
                        )}
                        <span className={`text-xs font-medium ${task.completed ? 'line-through text-charcoal-500' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-charcoal-400">
                        {task.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add task form */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a new milestone or b-roll task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-4 py-2 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-charcoal-900 text-white text-xs font-bold rounded-xl hover:bg-charcoal-800"
                  >
                    Add Milestone
                  </button>
                </form>
              </div>

              {/* Version History Rail */}
              <div className="space-y-4 pt-4 border-t border-charcoal-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase text-charcoal-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-coral-600" />
                    Rendered Video Cuts & Versions ({selectedItem.versions?.length || 0})
                  </h3>
                </div>

                {(!selectedItem.versions || selectedItem.versions.length === 0) ? (
                  <p className="text-xs text-charcoal-400 py-4 font-mono">No video cuts uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem.versions.map((ver, idx) => (
                      <div key={ver._id || idx} className="p-4 bg-sand-50 rounded-2xl border border-charcoal-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-charcoal-900 text-white rounded">
                            Cut v{ver.versionNumber}
                          </span>
                          <span className="text-[10px] font-mono text-charcoal-500">
                            {new Date(ver.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal-700 font-medium">"{ver.notes}"</p>
                        <div className="pt-2 flex items-center justify-between">
                          <Link
                            to={`/app/review?contentId=${selectedItem._id}&version=${ver.versionNumber}`}
                            className="text-xs font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" /> Launch Frame Review
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-charcoal-400 font-mono text-xs">
              Select a production track from the left to view checklists and versions.
            </div>
          )}
        </div>

      </div>

      {/* New Project Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full border border-charcoal-200 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-charcoal-900">New Media Production Track</h3>
                <p className="text-xs text-charcoal-500 font-mono">Initialize assets, milestones & cuts</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateContent} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Class: Micro-Frontends at Scale"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Format</label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
                >
                  <option value="YOUTUBE_LONG">YouTube Long Form</option>
                  <option value="SHORT_REEL">Short / Reel</option>
                  <option value="PODCAST">Podcast Episode</option>
                  <option value="NEWSLETTER">Newsletter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Project Description & Brief</label>
                <textarea
                  rows={3}
                  placeholder="Brief synopsis of what is being recorded..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Initialize Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Version Modal */}
      {versionModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full border border-charcoal-200 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-charcoal-900">Upload Media Cut / Revision</h3>
                <p className="text-xs text-charcoal-500 font-mono">Push export into Review Studio</p>
              </div>
              <button onClick={() => setVersionModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleUploadVersion} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Changelog & Revision Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Cut v2: Fixed audio hum in intro, replaced thumbnail title, trimmed 5s off section 2."
                  value={versionNotes}
                  onChange={(e) => setVersionNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Media Video Stream URL (or MP4 Direct Link)</label>
                <input
                  type="url"
                  placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  value={versionUrl}
                  onChange={(e) => setVersionUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none font-mono"
                />
                <p className="text-[10px] text-charcoal-400 font-mono mt-1">Leave blank to use sample high-definition video stream.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVersionModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-charcoal-900 hover:bg-coral-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Push to Review Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};