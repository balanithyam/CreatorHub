import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Clock, Video, MessageSquare, Lightbulb } from 'lucide-react';
import { api } from '../services/api';
import { Notification } from '../types';

const safeArray = (val: any) => Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(safeArray(res.data));
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}`, { read: true });
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filterUnreadOnly ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-charcoal-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-sand-200 text-charcoal-800 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-coral-500" />
              Notifications
            </span>
          </div>
          <h1 className="text-3xl font-black text-charcoal-950 tracking-tight">Studio Activity Alerts</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
              filterUnreadOnly 
                ? 'bg-charcoal-900 text-white border-charcoal-900' 
                : 'bg-sand-50 text-charcoal-700 border-charcoal-200'
            }`}
          >
            {filterUnreadOnly ? 'Showing Unread' : 'Filter Unread'}
          </button>
          
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-sand-100 hover:bg-sand-200 text-charcoal-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-lime-600" /> Mark All Read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-charcoal-200/90 shadow-sm space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-sand-50 rounded-2xl p-4 animate-pulse h-16" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-charcoal-400 font-mono text-xs">
            No notifications to display.
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.read ? 'bg-sand-50/50 border-charcoal-200/60' : 'bg-sand-50 border-coral-200/80 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-coral-100 text-coral-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-charcoal-900">{notif.title}</h4>
                  <p className="text-xs text-charcoal-600">{notif.message}</p>
                  <span className="text-[10px] font-mono text-charcoal-400 flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" /> {new Date(notif.createdAt || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkRead(notif._id)}
                  className="p-1.5 hover:bg-lime-100 text-lime-700 rounded-lg text-xs font-bold"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};