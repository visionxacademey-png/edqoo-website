import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  Search,
  RefreshCw,
  CheckCircle2,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
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
  Mail,
  Fingerprint,
  Cpu,
  Clock,
  Copy,
  Check,
  HardDrive
} from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import type { AdminUser, UserSession, DeviceInfo } from '../../types/index.js';

export const AdminUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'users'>('sessions');
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [osFilter, setOsFilter] = useState('all');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [sessionStatusFilter, setSessionStatusFilter] = useState<'all' | 'online' | 'closed'>('all');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [inspectingSession, setInspectingSession] = useState<UserSession | null>(null);
  const [inspectingUser, setInspectingUser] = useState<AdminUser | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [sessionsData, usersData] = await Promise.all([
        adminService.getActiveSessions(),
        adminService.getUsers(searchTerm, roleFilter, osFilter, deviceTypeFilter)
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
  }, [roleFilter, osFilter, deviceTypeFilter]);

  // Auto-refresh every 15 seconds when autoRefresh is enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, roleFilter, osFilter, deviceTypeFilter, searchTerm]);

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
        setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, isActive: false } : s));
        if (inspectingSession?.id === sessionId) {
          setInspectingSession((prev) => prev ? { ...prev, isActive: false } : null);
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

  // Helper: Device icon
  const renderDeviceIcon = (deviceType?: string) => {
    const type = (deviceType || '').toLowerCase();
    if (type.includes('mobile') || type.includes('phone')) return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
    if (type.includes('tablet') || type.includes('ipad')) return <Tablet className="w-3.5 h-3.5 text-cyan-400" />;
    if (type.includes('laptop') || type.includes('macbook')) return <Laptop className="w-3.5 h-3.5 text-purple-400" />;
    return <Monitor className="w-3.5 h-3.5 text-blue-400" />;
  };

  // Helper: OS badge
  const renderOsBadge = (os?: string, version?: string) => {
    const osName = os || 'Unknown';
    const osLower = osName.toLowerCase();

    let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
    if (osLower.includes('win')) {
      colorClasses = 'bg-sky-950/80 text-sky-300 border-sky-700/60';
    } else if (osLower.includes('mac') || osLower.includes('ios') || osLower.includes('apple')) {
      colorClasses = 'bg-slate-800 text-slate-200 border-slate-600';
    } else if (osLower.includes('android')) {
      colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
    } else if (osLower.includes('linux') || osLower.includes('ubuntu')) {
      colorClasses = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
    } else if (osLower.includes('chrome')) {
      colorClasses = 'bg-purple-950/80 text-purple-300 border-purple-700/60';
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${colorClasses}`}>
        <span>{osName}</span>
        {version && <span className="font-normal opacity-80">{version}</span>}
      </span>
    );
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    const term = searchTerm.toLowerCase();
    const dev = s.deviceInfo || {};
    const matchesSearch =
      (s.userName && s.userName.toLowerCase().includes(term)) ||
      (s.email && s.email.toLowerCase().includes(term)) ||
      (s.phone && s.phone.includes(term)) ||
      (s.ipAddress && s.ipAddress.includes(term)) ||
      (s.os && s.os.toLowerCase().includes(term)) ||
      (s.browser && s.browser.toLowerCase().includes(term)) ||
      (s.deviceId && s.deviceId.toLowerCase().includes(term)) ||
      (s.fingerprint && s.fingerprint.toLowerCase().includes(term)) ||
      (dev.deviceModel && dev.deviceModel.toLowerCase().includes(term));

    const matchesStatus =
      sessionStatusFilter === 'all' ||
      (sessionStatusFilter === 'online' && s.isActive) ||
      (sessionStatusFilter === 'closed' && !s.isActive);

    const matchesOs = osFilter === 'all' || (s.os && s.os.toLowerCase().includes(osFilter.toLowerCase()));
    const matchesDeviceType = deviceTypeFilter === 'all' || (s.deviceType && s.deviceType.toLowerCase() === deviceTypeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesOs && matchesDeviceType;
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const dev = u.deviceInfo || {};
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term)) ||
      (u.lastOs && u.lastOs.toLowerCase().includes(term)) ||
      (u.lastBrowser && u.lastBrowser.toLowerCase().includes(term)) ||
      (u.lastDeviceId && u.lastDeviceId.toLowerCase().includes(term)) ||
      (u.lastDeviceType && u.lastDeviceType.toLowerCase().includes(term)) ||
      (dev.deviceModel && dev.deviceModel.toLowerCase().includes(term));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesOs = osFilter === 'all' || (u.lastOs && u.lastOs.toLowerCase().includes(osFilter.toLowerCase()));
    const matchesDeviceType = deviceTypeFilter === 'all' || (u.lastDeviceType && u.lastDeviceType.toLowerCase() === deviceTypeFilter.toLowerCase());

    return matchesSearch && matchesRole && matchesOs && matchesDeviceType;
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
              Registered Users & Device Telemetry
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {activeSessionsCount} Live Now
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of authenticated students, staff, active sessions, client hardware signatures, OS, and device fingerprints.
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
          <span>Registered Users & Device Directory</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-400">
            {users.length}
          </span>
          {activeTab === 'users' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Search name, email, phone, IP, OS, or device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* OS Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
            <Filter className="w-3 h-3 text-purple-400" />
            <select
              value={osFilter}
              onChange={(e) => setOsFilter(e.target.value)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All OS</option>
              <option value="windows" className="bg-slate-900">Windows</option>
              <option value="mac" className="bg-slate-900">macOS</option>
              <option value="android" className="bg-slate-900">Android</option>
              <option value="ios" className="bg-slate-900">iOS</option>
              <option value="linux" className="bg-slate-900">Linux</option>
            </select>
          </div>

          {/* Device Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
            <Laptop className="w-3 h-3 text-purple-400" />
            <select
              value={deviceTypeFilter}
              onChange={(e) => setDeviceTypeFilter(e.target.value)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Devices</option>
              <option value="laptop" className="bg-slate-900">💻 Laptop</option>
              <option value="desktop" className="bg-slate-900">🖥️ Desktop</option>
              <option value="mobile" className="bg-slate-900">📱 Mobile</option>
              <option value="tablet" className="bg-slate-900">📟 Tablet</option>
            </select>
          </div>

          {activeTab === 'users' && (
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
              <Shield className="w-3 h-3 text-purple-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Roles</option>
                <option value="admin" className="bg-slate-900">Administrators</option>
                <option value="user" className="bg-slate-900">Students</option>
              </select>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSessionStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  sessionStatusFilter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All ({sessions.length})
              </button>
              <button
                type="button"
                onClick={() => setSessionStatusFilter('online')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  sessionStatusFilter === 'online'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live ({activeSessionsCount})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: Active Logged In Sessions */}
      {activeTab === 'sessions' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Live Session Telemetry ({filteredSessions.length})
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Showing device model, OS, IP, and fingerprint for active users
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
                    <th className="py-3 px-4">Device & OS Info</th>
                    <th className="py-3 px-4">Client IP Address</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSessions.map((session) => {
                    const cleanPhone = (session.phone || '').replace(/[^0-9]/g, '');
                    const dev = session.deviceInfo || {};
                    const displayOs = session.os || dev.os || 'Unknown OS';
                    const displayDeviceType = session.deviceType || dev.deviceType || 'Desktop';
                    const displayBrowser = session.browser || dev.browser || 'Web Browser';

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

                        {/* Device & OS Info (NEW / ENHANCED) */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-bold">
                                {renderDeviceIcon(displayDeviceType)}
                                <span>{displayDeviceType}</span>
                              </span>
                              {renderOsBadge(displayOs, session.osVersion || dev.osVersion)}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[200px]" title={`${displayBrowser} • ${session.screenResolution || dev.screenResolution || 'Standard Display'}`}>
                              <span>{displayBrowser}</span>
                              {session.screenResolution && (
                                <span className="text-slate-500 ml-1.5">({session.screenResolution.split('(')[0].trim()})</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* IP Address */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                            <Globe className="w-3.5 h-3.5 text-slate-500" />
                            <span>{session.ipAddress}</span>
                          </div>
                          {session.timezone && (
                            <span className="text-[10px] text-slate-500 block truncate max-w-[140px] mt-0.5" title={session.timezone}>
                              {session.timezone}
                            </span>
                          )}
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
                    <th className="py-3 px-4">Device & Telemetry</th>
                    <th className="py-3 px-4">Active Sessions</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((usr) => {
                    const cleanPhone = (usr.phone || '').replace(/[^0-9]/g, '');
                    const dev = usr.deviceInfo || {};
                    const displayOs = usr.lastOs || dev.os;
                    const displayDeviceType = usr.lastDeviceType || dev.deviceType || 'Desktop';
                    const displayBrowser = usr.lastBrowser || dev.browser;

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

                        {/* Device & Telemetry (NEW / REQUESTED FEATURE) */}
                        <td className="py-3.5 px-4">
                          {displayOs || displayBrowser ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-bold">
                                  {renderDeviceIcon(displayDeviceType)}
                                  <span>{displayDeviceType}</span>
                                </span>
                                {renderOsBadge(displayOs, dev.osVersion)}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[210px]" title={`${displayBrowser || 'Browser'} • ${dev.screenResolution || usr.lastTimezone || 'Screen Recorded'}`}>
                                <span>{displayBrowser || 'Web Browser'}</span>
                                {dev.screenResolution && (
                                  <span className="text-slate-500 ml-1.5">({dev.screenResolution.split('(')[0].trim()})</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono italic">First login pending</span>
                          )}
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
                              title="Inspect full device specs, fingerprint, and telemetry"
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

      {/* INSPECT SESSION MODAL (WITH FULL DEVICE TELEMETRY) */}
      {inspectingSession && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Live Session & Device Hardware Telemetry
                  </h3>
                  <p className="text-[11px] text-slate-400">Authenticated telemetry stream for session {inspectingSession.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingSession(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* User Profile Card */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={inspectingSession.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop'}
                alt={inspectingSession.userName}
                className="w-12 h-12 rounded-full object-cover border border-purple-500/40"
              />
              <div className="overflow-hidden flex-1">
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

            {/* FULL DEVICE INFORMATION SECTION */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <Laptop className="w-3.5 h-3.5 text-purple-400" />
                <span>Recorded Device & Hardware Telemetry</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Device ID */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-purple-400" />
                      Device Identifier (ID)
                    </span>
                    <span className="font-mono text-slate-200 font-bold text-[11px] truncate block mt-0.5" title={inspectingSession.deviceId || inspectingSession.deviceInfo?.deviceId}>
                      {inspectingSession.deviceId || inspectingSession.deviceInfo?.deviceId || 'dev-gen-auto'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inspectingSession.deviceId || inspectingSession.deviceInfo?.deviceId || '', 'Device ID')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex-shrink-0"
                    title="Copy Device ID"
                  >
                    {copiedId === 'Device ID' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Device Fingerprint */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                      <Fingerprint className="w-3 h-3 text-emerald-400" />
                      Device Fingerprint
                    </span>
                    <span className="font-mono text-emerald-300 font-bold text-[11px] truncate block mt-0.5" title={inspectingSession.fingerprint || inspectingSession.deviceInfo?.fingerprint}>
                      {inspectingSession.fingerprint || inspectingSession.deviceInfo?.fingerprint || 'fp-generated'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inspectingSession.fingerprint || inspectingSession.deviceInfo?.fingerprint || '', 'Fingerprint')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex-shrink-0"
                    title="Copy Fingerprint Hash"
                  >
                    {copiedId === 'Fingerprint' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Device Type & Model */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    {renderDeviceIcon(inspectingSession.deviceType || inspectingSession.deviceInfo?.deviceType)}
                    Device Type & Model
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold text-[11px]">
                      {inspectingSession.deviceType || inspectingSession.deviceInfo?.deviceType || 'Desktop'}
                    </span>
                    <span className="text-slate-300 font-medium text-[11px] truncate">
                      {inspectingSession.deviceModel || inspectingSession.deviceInfo?.deviceModel || 'PC Workstation / Laptop'}
                    </span>
                  </div>
                </div>

                {/* Operating System & Version */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-sky-400" />
                    Operating System & Build
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {renderOsBadge(inspectingSession.os || inspectingSession.deviceInfo?.os, inspectingSession.osVersion || inspectingSession.deviceInfo?.osVersion)}
                  </div>
                </div>

                {/* Browser & Version */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    Browser & Engine
                  </span>
                  <span className="text-slate-200 font-bold text-[11px] block mt-0.5 truncate">
                    {inspectingSession.browser || inspectingSession.deviceInfo?.browser || 'Modern Web Browser'}
                    {inspectingSession.browserVersion ? ` (v${inspectingSession.browserVersion})` : ''}
                  </span>
                </div>

                {/* Screen Resolution */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-cyan-400" />
                    Screen Resolution & Display
                  </span>
                  <span className="text-slate-200 font-mono text-[11px] font-bold block mt-0.5">
                    {inspectingSession.screenResolution || inspectingSession.deviceInfo?.screenResolution || '1920 × 1080 (1.25x DPR, 24-bit)'}
                  </span>
                </div>

                {/* Device Language */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Globe className="w-3 h-3 text-amber-400" />
                    Language & Locale
                  </span>
                  <span className="text-slate-200 font-bold text-[11px] block mt-0.5">
                    {inspectingSession.language || inspectingSession.deviceInfo?.language || 'en-US'}
                  </span>
                </div>

                {/* Timezone */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    Time Zone & Local Time
                  </span>
                  <span className="text-slate-200 font-bold text-[11px] block mt-0.5 truncate">
                    {inspectingSession.timezone || inspectingSession.deviceInfo?.timezone || 'Asia/Kolkata (UTC+05:30)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Session Network Information */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Client IP Address</span>
                <span className="font-mono text-slate-200 font-bold block mt-0.5">{inspectingSession.ipAddress}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Last Active</span>
                <span className="text-emerald-400 font-bold block mt-0.5">{new Date(inspectingSession.lastActiveAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">User-Agent Signature</span>
              <p className="text-slate-400 font-mono text-[10px] leading-relaxed break-all">{inspectingSession.userAgent}</p>
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

      {/* INSPECT USER MODAL (WITH COMPLETE REGISTERED DEVICE TELEMETRY) */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    User Profile & Registered Device Information
                  </h3>
                  <p className="text-[11px] text-slate-400">Complete client fingerprint & device specifications for {inspectingUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={inspectingUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop'}
                alt={inspectingUser.name}
                className="w-12 h-12 rounded-full object-cover border border-purple-500/40"
              />
              <div className="overflow-hidden flex-1">
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

            {/* FULL DEVICE INFORMATION SECTION */}
            {(() => {
              const dev: DeviceInfo = inspectingUser.deviceInfo || {};
              const displayDeviceId = inspectingUser.lastDeviceId || dev.deviceId || 'dev-gen-auto';
              const displayFingerprint = dev.fingerprint || `fp-${inspectingUser.id.substring(4)}`;
              const displayDeviceType = inspectingUser.lastDeviceType || dev.deviceType || 'Desktop';
              const displayOs = inspectingUser.lastOs || dev.os || 'Windows / macOS';
              const displayOsVersion = dev.osVersion || '';
              const displayBrowser = inspectingUser.lastBrowser || dev.browser || 'Web Browser';
              const displayBrowserVersion = dev.browserVersion || '';
              const displayDeviceModel = dev.deviceModel || `${displayOs} Workstation / PC`;
              const displayResolution = dev.screenResolution || '1920 × 1080 (1.25x DPR, 24-bit)';
              const displayLanguage = dev.language || 'en-IN / English';
              const displayTimezone = inspectingUser.lastTimezone || dev.timezone || 'Asia/Kolkata (UTC+05:30)';
              const displayIp = inspectingUser.lastIp || '127.0.0.1 (Local Client)';

              return (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider">
                    <Laptop className="w-3.5 h-3.5 text-purple-400" />
                    <span>Registered Device & Hardware Telemetry (10 Attributes)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* Device Identifier */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="overflow-hidden pr-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                          <HardDrive className="w-3 h-3 text-purple-400" />
                          Device Identifier (Device ID)
                        </span>
                        <span className="font-mono text-slate-200 font-bold text-[11px] truncate block mt-0.5" title={displayDeviceId}>
                          {displayDeviceId}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(displayDeviceId, 'Device ID')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex-shrink-0"
                        title="Copy Device ID"
                      >
                        {copiedId === 'Device ID' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Device Fingerprint */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="overflow-hidden pr-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                          <Fingerprint className="w-3 h-3 text-emerald-400" />
                          Hardware Fingerprint Hash
                        </span>
                        <span className="font-mono text-emerald-300 font-bold text-[11px] truncate block mt-0.5" title={displayFingerprint}>
                          {displayFingerprint}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(displayFingerprint, 'Fingerprint')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex-shrink-0"
                        title="Copy Fingerprint Hash"
                      >
                        {copiedId === 'Fingerprint' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Device Type & Model */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        {renderDeviceIcon(displayDeviceType)}
                        Device Type & Model
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold text-[11px]">
                          {displayDeviceType}
                        </span>
                        <span className="text-slate-300 font-medium text-[11px] truncate">
                          {displayDeviceModel}
                        </span>
                      </div>
                    </div>

                    {/* Operating System & Version */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-sky-400" />
                        Operating System & Version
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {renderOsBadge(displayOs, displayOsVersion)}
                      </div>
                    </div>

                    {/* Browser & Version */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        Browser & Web Engine
                      </span>
                      <span className="text-slate-200 font-bold text-[11px] block mt-0.5 truncate">
                        {displayBrowser} {displayBrowserVersion ? `(v${displayBrowserVersion})` : ''}
                      </span>
                    </div>

                    {/* Screen Resolution */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <Monitor className="w-3 h-3 text-cyan-400" />
                        Screen Resolution & Color Depth
                      </span>
                      <span className="text-slate-200 font-mono text-[11px] font-bold block mt-0.5">
                        {displayResolution}
                      </span>
                    </div>

                    {/* Device Language */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <Globe className="w-3 h-3 text-amber-400" />
                        Device Language & Locale
                      </span>
                      <span className="text-slate-200 font-bold text-[11px] block mt-0.5">
                        {displayLanguage}
                      </span>
                    </div>

                    {/* Timezone */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" />
                        Time Zone & Local Region
                      </span>
                      <span className="text-slate-200 font-bold text-[11px] block mt-0.5 truncate">
                        {displayTimezone}
                      </span>
                    </div>

                    {/* Last Client IP */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <Globe className="w-3 h-3 text-blue-400" />
                        Last Client IP Address
                      </span>
                      <span className="text-slate-200 font-mono font-bold text-[11px] block mt-0.5">
                        {displayIp}
                      </span>
                    </div>

                    {/* Active Sessions count */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        Connected Sessions
                      </span>
                      <span className="text-emerald-400 font-bold text-[11px] block mt-0.5">
                        {inspectingUser.activeSessionsCount || 0} device(s) currently active
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* User Account Timeline */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Account Created</span>
                <span className="text-slate-300 block mt-0.5">{inspectingUser.createdAt ? new Date(inspectingUser.createdAt).toLocaleDateString() : '—'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Last Login / Activity</span>
                <span className="text-emerald-400 font-bold block mt-0.5">{inspectingUser.lastLoginAt ? new Date(inspectingUser.lastLoginAt).toLocaleString() : '—'}</span>
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
