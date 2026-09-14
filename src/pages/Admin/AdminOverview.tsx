import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Activity,
  BookOpen,
  MessageSquareCheck,
  PlusCircle,
  ShieldCheck,
  Database,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Phone,
  MessageCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { courseService } from '../../services/courseService';
import { normalizeCategoryName } from '../../data/courses';
import type { AdminStats, DbStatus, UserSession, Course } from '../../types';

export const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [recentSessions, setRecentSessions] = useState<UserSession[]>([]);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, dbData, sessionsData, coursesData] = await Promise.all([
        adminService.getStats(),
        adminService.getDbStatus(),
        adminService.getActiveSessions(),
        courseService.getCourses()
      ]);
      setStats(statsData);
      setDbStatus(dbData);
      setRecentSessions(sessionsData.slice(0, 5));
      setRecentCourses(coursesData.slice(0, 4));
    } catch (err) {
      console.error('Failed to load admin overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white font-display tracking-tight">
              Platform Command Center
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-purple-900/60 text-purple-300 border border-purple-700/50">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring of user sessions, NeonDB PostgreSQL status, and academic course catalog.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/courses/new"
            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Course</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Sessions */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-800/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Active Sessions
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center border border-purple-500/30 text-purple-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-display">
              {stats?.activeSessions ?? 0}
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              Online Now
            </span>
          </div>
          <Link
            to="/admin/users"
            className="mt-3 text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>Inspect Logged-In Users</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Accounts
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-display">
              {stats?.totalUsers ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">
              ({stats?.adminCount ?? 1} Admins)
            </span>
          </div>
          <Link
            to="/admin/users"
            className="mt-3 text-[11px] font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>Manage User Directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Total Courses */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Published Courses
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-display">
              {stats?.totalCourses ?? 0}
            </span>
            <span className="text-xs text-indigo-400 font-semibold">
              Live in Catalog
            </span>
          </div>
          <Link
            to="/admin/courses"
            className="mt-3 text-[11px] font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>Add / Edit Tracks</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Total Enquiries */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Student Leads
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <MessageSquareCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-display">
              {stats?.totalEnquiries ?? 0}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Enquiries
            </span>
          </div>
          <Link
            to="/admin/leads"
            className="mt-3 text-[11px] font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>Counseling Pipeline</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Database & Infrastructure Status Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                NeonDB PostgreSQL Status
              </h3>
              <p className="text-xs text-slate-400">
                Serverless SQL Database & Connection Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${dbStatus?.connected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
              {dbStatus?.connected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  NeonDB Connected
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  In-Memory Fallback Active
                </>
              )}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 font-medium block">Database Type</span>
            <span className="text-slate-200 font-bold mt-0.5 block">
              {dbStatus?.connected ? 'Neon PostgreSQL (Serverless)' : 'Memory Data Engine'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 font-medium block">DATABASE_URL Config</span>
            <span className="text-slate-200 font-bold mt-0.5 block">
              {dbStatus?.databaseUrlConfigured ? 'Configured in .env' : 'Pending in .env'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 font-medium block">Session Security</span>
            <span className="text-emerald-400 font-bold mt-0.5 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              RBAC & Active Token Verification
            </span>
          </div>
        </div>
      </div>

      {/* Quick Access Grid: Recent Logged In Sessions + Recent Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sessions Feed */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Live Logged-In Sessions</h3>
              </div>
              <Link
                to="/admin/users"
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <span>View All ({recentSessions.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentSessions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No active sessions recorded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentSessions.map((session) => {
                  const cleanPhone = (session.phone || '').replace(/[^0-9]/g, '');
                  return (
                    <div
                      key={session.id}
                      className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/70 hover:border-purple-600/50 flex items-center justify-between gap-3 transition-all group"
                    >
                      <Link to="/admin/users" className="flex items-center gap-3 overflow-hidden flex-1">
                        <img
                          src={session.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop'}
                          alt={session.userName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-purple-500 transition-colors"
                        />
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">{session.userName}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${session.userRole === 'admin' ? 'bg-purple-900/70 text-purple-300' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'}`}>
                              {session.userRole}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-mono truncate">{session.email}</span>
                            {session.phone && (
                              <span className="text-[10px] text-purple-300 font-mono font-bold hidden sm:inline-block">
                                • {session.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {session.phone && (
                          <div className="flex items-center gap-1">
                            <a
                              href={`tel:${session.phone}`}
                              className="p-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition-colors"
                              title={`Call ${session.userName}`}
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition-colors"
                                title={`WhatsApp ${session.userName}`}
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}

                        <div className="text-right">
                          <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded ${session.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-slate-800 text-slate-500'}`}>
                            {session.isActive ? 'Active' : 'Closed'}
                          </span>
                          <span className="text-[9px] text-slate-500 block mt-0.5">
                            {new Date(session.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <Link
              to="/admin/users"
              className="w-full py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Full User Directory & Role Manager</span>
            </Link>
          </div>
        </div>

        {/* Quick Course Catalog */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Course Catalog Highlights</h3>
              </div>
              <Link
                to="/admin/courses"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Manage All ({recentCourses.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentCourses.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No courses found in database.</p>
            ) : (
              <div className="space-y-2.5">
                {recentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-white truncate block">{course.title}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="text-purple-400 font-semibold">{normalizeCategoryName(course.category)}</span>
                          <span>•</span>
                          <span>₹{course.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/admin/courses/edit/${course.id}`}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex-shrink-0"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <Link
              to="/admin/courses/new"
              className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-xs font-bold text-purple-300 border border-purple-600/40 flex items-center justify-center gap-2 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Program Track</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
