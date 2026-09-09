import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  Search,
  RefreshCw,
  CheckCircle2,
  Laptop,
  Globe,
  AlertCircle,
  Filter,
  LogOut,
  Shield,
  Eye,
  UserCheck,
  Radio,
  Phone,
  MessageCircle,
  Mail
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { AdminUser, UserSession } from '../../types';

export const AdminUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'users'>('sessions');
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [inspectingSession, setInspectingSession] = useState<UserSession | null>(null);
  const [inspectingUser, setInspectingUser] = useState<AdminUser | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [sessionsData, usersData] = await Promise.all([
        adminService.getActiveSessions(),
        adminService.getUsers(searchTerm, roleFilter)
      ]);
      setSessions(sessionsData);
      setUsers(usersData);
    } catch (err: any) {
      console.error('Error fetching admin users data:', err);
      if (!silent) {
        showToast(err.message || 'Failed to fetch user directory.', 'error');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter]);

  // Auto-refresh every 15 seconds when autoRefresh is enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, roleFilter, searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleRevokeSession = async (sessionId: string, userEmail: string) => {
    if (!window.confirm(`Are you sure you want to terminate the active session for ${userEmail}?`)) return;

    try {
      const res = await adminService.revokeSession(sessionId);
      if (res.success) {
        showToast(`Session for ${userEmail} revoked successfully.`);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (inspectingSession?.id === sessionId) {
          setInspectingSession(null);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to revoke session.', 'error');
    }
  };

  const handleToggleRole = async (userId: string, currentRole: 'admin' | 'user', userName: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${userName}'s role from ${currentRole.toUpperCase()} to ${newRole.toUpperCase()}?`)) return;

    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        showToast(`${userName} is now an ${newRole.toUpperCase()}.`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        if (inspectingUser?.id === userId) {
          setInspectingUser((prev) => prev ? { ...prev, role: newRole } : null);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update role.', 'error');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean, userName: string) => {
    const newStatus = !currentStatus;
    const actionText = newStatus ? 'activate' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${actionText} account for ${userName}?`)) return;

    try {
      const res = await adminService.updateUserStatus(userId, newStatus);
      if (res.success) {
        showToast(`Account for ${userName} has been ${newStatus ? 'activated' : 'suspended'}.`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: newStatus } : u))
        );
        if (inspectingUser?.id === userId) {
          setInspectingUser((prev) => prev ? { ...prev, isActive: newStatus } : null);
        }
        if (!newStatus) {
          adminService.getActiveSessions().then(setSessions);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update account status.', 'error');
    }
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.userName.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      (s.phone && s.phone.includes(term)) ||
      s.ipAddress.includes(term)
    );
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone && u.phone.includes(term));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activeSessionsCount = sessions.filter((s) => s.isActive).length;
  const adminSessionsCount = sessions.filter((s) => s.isActive && s.userRole === 'admin').length;
  const studentSessionsCount = sessions.filter((s) => s.isActive && s.userRole !== 'admin').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* Toast Notification */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-bold shadow-lg transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border border-emerald-800'
              : 'bg-red-950 text-red-200 border border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-white font-display tracking-tight">
              Logged-in Users & Session Telemetry
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {activeSessionsCount} Live Now
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of authenticated students, staff, active sessions, client IP addresses, and device signatures.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Auto Refresh Toggle */}
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              autoRefresh
                ? 'bg-purple-950/70 text-purple-300 border-purple-700/80 shadow-xs'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle 15s auto-polling"
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'text-purple-400 animate-pulse' : 'text-slate-600'}`} />
            <span>{autoRefresh ? 'Live Polling: ON' : 'Live Polling: OFF'}</span>
          </button>

          {/* Manual Sync Button */}
          <button
            onClick={() => loadData(false)}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Sessions */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-800/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Active Sessions
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-400 border border-purple-500/30">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-display">
              {activeSessionsCount}
            </span>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Connected
            </span>
          </div>
        </div>

        {/* Total Registered Accounts */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Registered Accounts
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-display">
              {users.length}
            </span>
            <span className="text-[11px] text-slate-400">
              Directory Total
            </span>
          </div>
        </div>

        {/* Online Administrators */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Admins Logged In
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-900/40 flex items-center justify-center text-purple-300">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-display">
              {adminSessionsCount}
            </span>
            <span className="text-[11px] text-purple-300">
              Staff Sessions
            </span>
          </div>
        </div>

        {/* Online Students */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Students Logged In
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-900/40 flex items-center justify-center text-emerald-300">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-display">
              {studentSessionsCount}
            </span>
            <span className="text-[11px] text-emerald-400">
              Student Sessions
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 px-1 text-xs font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === 'sessions' ? 'text-purple-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Active Logged-In Sessions</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-900/70 text-purple-300 border border-purple-700/50">
            {sessions.length}
          </span>
          {activeTab === 'sessions' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-1 text-xs font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === 'users' ? 'text-purple-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Registered Users Directory</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-400">
            {users.length}
          </span>
          {activeTab === 'users' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by name, email, phone, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {activeTab === 'users' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators Only</option>
              <option value="user">Students Only</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Active Logged In Sessions */}
      {activeTab === 'sessions' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Live Session Telemetry
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredSessions.length} active sessions
            </span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="text-sm font-bold text-slate-400">No active sessions found matching criteria.</p>
              <p className="text-xs text-slate-500">When users log in, their live sessions and phone numbers will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                    <th className="py-3 px-4">Logged-In User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Client IP Address</th>
                    <th className="py-3 px-4">Device & Browser</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSessions.map((session) => {
                    const cleanPhone = (session.phone || '').replace(/[^0-9]/g, '');
                    return (
                      <tr key={session.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* User Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={session.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop'}
                              alt={session.userName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <span className="font-bold text-white block">{session.userName}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{session.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                              session.userRole === 'admin'
                                ? 'bg-purple-900/60 text-purple-300 border-purple-700/50'
                                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                            }`}
                          >
                            {session.userRole === 'admin' ? 'Admin' : 'Student'}
                          </span>
                        </td>

                        {/* Contact Phone & Quick Actions */}
                        <td className="py-3.5 px-4">
                          {session.phone ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-200 font-bold text-[11px]">{session.phone}</span>
                              <div className="flex items-center gap-1">
                                <a
                                  href={`tel:${session.phone}`}
                                  className="p-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition-colors"
                                  title="Call user directly"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                                {cleanPhone && (
                                  <a
                                    href={`https://wa.me/${cleanPhone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition-colors"
                                    title="Open WhatsApp chat"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">Not Provided</span>
                          )}
                        </td>

                        {/* IP Address */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                            <Globe className="w-3.5 h-3.5 text-slate-500" />
                            <span>{session.ipAddress}</span>
                          </div>
                        </td>

                        {/* User Agent / Device */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Laptop className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                            <span className="truncate text-[11px]" title={session.userAgent}>
                              {session.userAgent}
                            </span>
                          </div>
                        </td>

                        {/* Last Active */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-300">
                            <span className="block font-semibold">
                              {new Date(session.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(session.lastActiveAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              session.isActive
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${session.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                            {session.isActive ? 'Online' : 'Terminated'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectingSession(session)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                              title="Inspect full session telemetry and contact user"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {session.isActive && (
                              <button
                                onClick={() => handleRevokeSession(session.id, session.email)}
                                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-200 border border-red-900/50 transition-colors inline-flex items-center gap-1"
                                title="Force terminate this session"
                              >
                                <LogOut className="w-3 h-3" />
                                <span>Revoke</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Registered Accounts Directory */}
      {activeTab === 'users' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                All Registered Users & Candidate Directory ({filteredUsers.length})
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {filteredUsers.filter(u => u.role === 'admin').length} Admins • {filteredUsers.filter(u => u.role !== 'admin').length} Students
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="text-sm font-bold text-slate-400">No users found matching criteria.</p>
              <p className="text-xs text-slate-500">Registered users, student logins, and enquired leads will automatically populate here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                    <th className="py-3 px-4">User Profile</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Active Sessions</th>
                    <th className="py-3 px-4">Last Login / Activity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((usr) => {
                    const cleanPhone = (usr.phone || '').replace(/[^0-9]/g, '');
                    return (
                      <tr key={usr.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Name & Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={usr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop'}
                              alt={usr.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <span className="font-bold text-white block">{usr.name}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{usr.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Phone & Direct Quick Outreach */}
                        <td className="py-3.5 px-4">
                          {usr.phone ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-200 font-bold text-[11px]">{usr.phone}</span>
                              <div className="flex items-center gap-1">
                                <a
                                  href={`tel:${usr.phone}`}
                                  className="p-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition-colors"
                                  title="Call user"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                                {cleanPhone && (
                                  <a
                                    href={`https://wa.me/${cleanPhone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition-colors"
                                    title="WhatsApp user"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">Not Provided</span>
                          )}
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                              usr.role === 'admin'
                                ? 'bg-purple-900/60 text-purple-300 border-purple-700/50'
                                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                            }`}
                          >
                            {usr.role === 'admin' ? 'Administrator' : 'Student'}
                          </span>
                        </td>

                        {/* Active Sessions */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${(usr.activeSessionsCount || 0) > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <Activity className={`w-3.5 h-3.5 ${(usr.activeSessionsCount || 0) > 0 ? 'animate-pulse text-emerald-400' : 'text-slate-600'}`} />
                            <span>{usr.activeSessionsCount || 0} active</span>
                          </span>
                        </td>

                        {/* Last Login / Activity */}
                        <td className="py-3.5 px-4 text-[11px]">
                          {usr.lastLoginAt ? (
                            <div>
                              <span className="text-slate-200 font-semibold block">
                                {new Date(usr.lastLoginAt).toLocaleDateString()}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(usr.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ) : usr.createdAt ? (
                            <span className="text-slate-400">{new Date(usr.createdAt).toLocaleDateString()}</span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        {/* Account Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              usr.isActive !== false
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                                : 'bg-red-950 text-red-400 border border-red-800/80'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${usr.isActive !== false ? 'bg-emerald-400' : 'bg-red-500'}`} />
                            {usr.isActive !== false ? 'Active' : 'Suspended'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectingUser(usr)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                              title="Inspect user details and contact"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Role Toggle */}
                            <button
                              onClick={() => handleToggleRole(usr.id, usr.role === 'admin' ? 'admin' : 'user', usr.name)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-colors ${
                                usr.role === 'admin'
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                                  : 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 border-purple-700/50'
                              }`}
                              title={usr.role === 'admin' ? 'Demote to student' : 'Promote to admin'}
                            >
                              {usr.role === 'admin' ? 'Demote' : 'Make Admin'}
                            </button>

                            {/* Suspend / Activate Toggle */}
                            <button
                              onClick={() => handleToggleStatus(usr.id, usr.isActive !== false, usr.name)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-colors ${
                                usr.isActive !== false
                                  ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-800/60'
                                  : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/60'
                              }`}
                            >
                              {usr.isActive !== false ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* INSPECT SESSION MODAL */}
      {inspectingSession && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Active Session & Contact Telemetry
                </h3>
              </div>
              <button
                onClick={() => setInspectingSession(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={inspectingSession.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop'}
                alt={inspectingSession.userName}
                className="w-12 h-12 rounded-full object-cover border border-purple-500/40"
              />
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{inspectingSession.userName}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase ${inspectingSession.userRole === 'admin' ? 'bg-purple-900/70 text-purple-300' : 'bg-slate-800 text-slate-300'}`}>
                    {inspectingSession.userRole}
                  </span>
                </div>
                <span className="text-xs text-purple-400 font-mono block mt-0.5">{inspectingSession.email}</span>
              </div>
            </div>

            {/* Direct Outreach Action Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/50 via-slate-950 to-emerald-950/40 border border-purple-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Candidate Contact Number
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {inspectingSession.phone || 'No phone recorded'}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {inspectingSession.phone ? (
                  <>
                    <a
                      href={`tel:${inspectingSession.phone}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-900/40"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={`https://wa.me/${(inspectingSession.phone || '').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No phone number submitted for this account.</p>
                )}
                <a
                  href={`mailto:${inspectingSession.email}`}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  title="Send Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Session ID</span>
                <span className="font-mono text-slate-300 text-[11px] truncate block mt-0.5">{inspectingSession.id}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Client IP</span>
                <span className="font-mono text-slate-200 font-bold block mt-0.5">{inspectingSession.ipAddress}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Session Started</span>
                <span className="text-slate-300 block mt-0.5">{new Date(inspectingSession.createdAt).toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Last Active</span>
                <span className="text-emerald-400 font-bold block mt-0.5">{new Date(inspectingSession.lastActiveAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Device Signature & Browser</span>
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{inspectingSession.userAgent}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${inspectingSession.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                <span className={`w-2 h-2 rounded-full ${inspectingSession.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                {inspectingSession.isActive ? 'Session Active & Online' : 'Session Terminated'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingSession(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Close
                </button>
                {inspectingSession.isActive && (
                  <button
                    type="button"
                    onClick={() => handleRevokeSession(inspectingSession.id, inspectingSession.email)}
                    className="px-4 py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Terminate Session</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT USER MODAL */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  User Profile & Contact Details
                </h3>
              </div>
              <button
                onClick={() => setInspectingUser(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={inspectingUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop'}
                alt={inspectingUser.name}
                className="w-12 h-12 rounded-full object-cover border border-purple-500/40"
              />
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{inspectingUser.name}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase ${inspectingUser.role === 'admin' ? 'bg-purple-900/70 text-purple-300' : 'bg-slate-800 text-slate-300'}`}>
                    {inspectingUser.role}
                  </span>
                </div>
                <span className="text-xs text-purple-400 font-mono block mt-0.5">{inspectingUser.email}</span>
              </div>
            </div>

            {/* Direct Outreach Action Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/50 via-slate-950 to-emerald-950/40 border border-purple-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Candidate Contact Number
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {inspectingUser.phone || 'No phone recorded'}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {inspectingUser.phone ? (
                  <>
                    <a
                      href={`tel:${inspectingUser.phone}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-900/40"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={`https://wa.me/${(inspectingUser.phone || '').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No phone number submitted for this account.</p>
                )}
                <a
                  href={`mailto:${inspectingUser.email}`}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  title="Send Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">User ID</span>
                <span className="font-mono text-slate-300 text-[11px] truncate block mt-0.5">{inspectingUser.id}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Account Created</span>
                <span className="text-slate-300 block mt-0.5">{inspectingUser.createdAt ? new Date(inspectingUser.createdAt).toLocaleDateString() : '—'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Last Login</span>
                <span className="text-emerald-400 font-bold block mt-0.5">{inspectingUser.lastLoginAt ? new Date(inspectingUser.lastLoginAt).toLocaleString() : '—'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Active Sessions</span>
                <span className="text-emerald-400 font-bold block mt-0.5">{inspectingUser.activeSessionsCount || 0} active device(s)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setInspectingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

