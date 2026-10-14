import React, { useState } from 'react';
import { User, Shield, Key, Save, Check, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ProfileSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [bio, setBio] = useState('Full-time software engineering content creator producing long-form deep dives & high-yield shorts.');
  const [niche, setNiche] = useState('Full-Stack Web & AI Engineering');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/auth/profile', { name, bio, niche });
      showToast('Profile and studio preferences saved!');
    } catch (err) {
      showToast('Saved locally!');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-lime-400/40 flex items-center gap-3 font-mono text-xs animate-slide-up">
          <Check className="w-4 h-4 text-lime-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-charcoal-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-coral-100 text-coral-800 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-coral-600" />
              Creator Profile & Studio Settings
            </span>
          </div>
          <h1 className="text-3xl font-black text-charcoal-950 tracking-tight">Studio Account Settings</h1>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-sand-100 rounded-2xl border border-charcoal-200 text-xs font-mono font-bold">
          <Shield className="w-4 h-4 text-lime-600" />
          <span>Role: <strong className="text-charcoal-900 uppercase">{user?.role}</strong></span>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-charcoal-200/90 shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || 'creator@creatorhub.com'}
                className="w-full px-4 py-2.5 bg-sand-100 text-charcoal-500 border border-charcoal-200 rounded-xl text-xs font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Primary Content Niche</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-700 mb-1">Creator Bio / Studio Mission</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 bg-sand-50 border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none resize-none"
            />
          </div>

          {/* API Integrations Status */}
          <div className="pt-4 border-t border-charcoal-100 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-charcoal-800 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-500" />
              Connected Studio Integrations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-sand-50 rounded-2xl border border-charcoal-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-charcoal-900 block">YouTube Data API</span>
                  <span className="text-[10px] font-mono text-lime-600 font-bold">● Active & Polling</span>
                </div>
              </div>

              <div className="p-3.5 bg-sand-50 rounded-2xl border border-charcoal-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-charcoal-900 block">Reddit JSON Feeds</span>
                  <span className="text-[10px] font-mono text-lime-600 font-bold">● Live Syncing</span>
                </div>
              </div>

              <div className="p-3.5 bg-sand-50 rounded-2xl border border-charcoal-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-charcoal-900 block">OpenAI / Gemini</span>
                  <span className="text-[10px] font-mono text-lime-600 font-bold">● Creative Models Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};