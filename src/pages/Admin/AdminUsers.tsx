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
  LogOut
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
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessionsData, usersData] = await Promise.all([
        adminService.getActiveSessions(),
        adminService.getUsers(searchTerm, roleFilter)
      ]);
      setSessions(sessionsData);
      setUsers(usersData);
    } catch (err: any) {
      console.error('Error fetching admin users data:', err);
      showToast(err.message || 'Failed to fetch user directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter]);

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
        // If suspended, reload sessions to reflect revocations
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
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white font-display tracking-tight">
              User & Session Intelligence
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-purple-900/60 text-purple-300 border border-purple-700/50">
              {sessions.filter((s) => s.isActive).length} Online
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time logged-in student and staff sessions, inspect client IPs, and manage roles.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Sessions</span>
        </button>
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
              <p className="text-xs text-slate-500">When users log in, their live sessions will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Client IP Address</th>
                    <th className="py-3 px-4">Device & Browser</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSessions.map((session) => (
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
                            <span className="text-[11px] text-slate-400">{session.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                            session.userRole === 'admin'
                              ? 'bg-purple-900/60 text-purple-300 border-purple-700/50'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {session.userRole}
                        </span>
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
                      </td>
                    </tr>
                  ))}
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
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Account Roster ({filteredUsers.length})
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="text-sm font-bold text-slate-400">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Active Sessions</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((usr) => (
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
                            <span className="text-[11px] text-slate-400">{usr.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                        {usr.phone || '—'}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                            usr.role === 'admin'
                              ? 'bg-purple-900/60 text-purple-300 border-purple-700/50'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {usr.role}
                        </span>
                      </td>

                      {/* Active Sessions */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${(usr.activeSessionsCount || 0) > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                          <Activity className="w-3 h-3" />
                          <span>{usr.activeSessionsCount || 0} active</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString() : '—'}
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
                          {usr.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
