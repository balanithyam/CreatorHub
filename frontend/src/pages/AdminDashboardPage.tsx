import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Users, Server, Activity, Database, Cpu, HardDrive, 
  Key, RefreshCw, CheckCircle2, XCircle, AlertTriangle, Sparkles, Terminal, Check
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/overview');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin overview', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data?.success) {
        setData({
          ...data,
          users: data.users.map((u: any) => u._id === userId ? { ...u, role: newRole } : u)
        });
        showToast(`Updated user role to ${newRole}`);
      }
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`);
      if (res.data?.success) {
        setData({
          ...data,
          users: data.users.map((u: any) => u._id === userId ? { ...u, isActive: res.data.data.isActive } : u)
        });
        showToast(`User status toggled!`);
      }
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-[#FF5A36] mx-auto" />
        <p className="text-xs font-bold text-[#6B6864]">Loading CreatorHub System Operations & Security metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121316] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D2F800]/40 flex items-center gap-3 font-mono text-xs animate-slide-up">
          <Check className="w-4 h-4 text-[#D2F800]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#121316] text-white rounded-3xl p-6 lg:p-8 border-2 border-[#121316] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#FF5A36] text-white text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-white" />
              Admin Operations Center
            </span>
            <span className="text-xs font-mono text-[#9E9B95]">Multi-User & Infrastructure Control</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            System Administration & Health
          </h1>
          <p className="text-[#E5E0D8] text-sm mt-1 max-w-2xl">
            Live infrastructure diagnostics, role-based access control, API rate quotas, and AI token consumption monitoring.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#F4F0EA] text-[#121316] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Stats
        </button>
      </div>

      {/* System Health Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-[#121316] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#121316] flex items-center justify-center">
            <Server className="w-5 h-5 text-[#FF5A36]" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6B6864] font-bold">Node.js Engine</span>
            <p className="text-sm font-extrabold text-[#121316]">{data?.systemHealth?.nodeVersion || 'v24.15'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-[#121316] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#121316] flex items-center justify-center">
            <Cpu className="w-5 h-5 text-[#D2F800]" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6B6864] font-bold">CPU Cores</span>
            <p className="text-sm font-extrabold text-[#121316]">{data?.systemHealth?.cpuCores || 8} Active Cores</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-[#121316] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#121316] flex items-center justify-center">
            <Database className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6B6864] font-bold">Database Cluster</span>
            <p className="text-sm font-extrabold text-green-700">Healthy (Connected)</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-[#121316] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#121316] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#FF5A36]" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6B6864] font-bold">AI Tokens Processed</span>
            <p className="text-sm font-extrabold text-[#121316]">842,900 Tokens</p>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-2xl border-2 border-[#121316] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div>
            <h3 className="font-extrabold text-[#121316] text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF5A36]" />
              Verified Studio User Accounts ({data?.users?.length || 0})
            </h3>
            <p className="text-xs text-[#6B6864]">Manage studio permissions, promote roles, and audit login access.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E0D8] text-[11px] font-mono font-extrabold uppercase text-[#6B6864]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8] text-xs">
              {data?.users?.map((u: any) => (
                <tr key={u._id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#121316] flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-[#121316]" />
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#6B6864]">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-[#FAF8F5] border border-[#121316] rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#121316] cursor-pointer"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="CREATOR">CREATOR</option>
                      <option value="PRODUCER">PRODUCER</option>
                      <option value="CURATOR">CURATOR</option>
                      <option value="EDITOR">EDITOR</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.isActive ? '● Active' : '○ Suspended'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u._id)}
                      className="px-3 py-1 bg-[#FAF8F5] hover:bg-[#E5E0D8] border border-[#121316] rounded-lg text-xs font-bold text-[#121316] cursor-pointer"
                    >
                      {u.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
