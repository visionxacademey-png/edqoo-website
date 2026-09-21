import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  PlusCircle,
  MessageSquareCheck,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Database,
  ExternalLink,
  ChevronRight,
  Activity,
  GraduationCap,
  Building2,
  Handshake,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import type { DbStatus } from '../types';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    adminService.getDbStatus().then(setDbStatus).catch(() => {
      setDbStatus({
        connected: false,
        type: 'in_memory_fallback',
        databaseUrlConfigured: false
      });
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', label: 'Overview & Metrics', icon: LayoutDashboard, end: true },
    { to: '/admin/courses', label: 'Course Management', icon: BookOpen, end: false },
    { to: '/admin/instructors', label: 'Instructor Catalog', icon: GraduationCap, end: false },
    { to: '/admin/leadership', label: 'Leadership Council', icon: ShieldCheck, end: false },
    { to: '/admin/hiring', label: 'Hiring Requests', icon: Building2, end: false },
    { to: '/admin/instructor-applications', label: 'Instructor Applications', icon: UserCheck, end: false },
    { to: '/admin/partners', label: 'Partnership Requests', icon: Handshake, end: false },
    { to: '/admin/leads', label: 'Leads & Enquiries', icon: MessageSquareCheck, end: false },
    { to: '/admin/users', label: 'Users & Telemetry', icon: Users, end: false },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans text-left">
      {/* Mobile Sidebar Overlay Drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/90">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-wide block font-display">
                EDQOO ADMIN
              </span>
              <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold block">
                Control Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Live Status Indicator */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Database className="w-3 h-3 text-purple-400" />
              Database Engine
            </span>
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dbStatus?.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${dbStatus?.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">
              {dbStatus?.connected ? 'NeonDB PostgreSQL' : 'Memory Local Store'}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${dbStatus?.connected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
              {dbStatus?.connected ? 'Live' : 'Fallback'}
            </span>
          </div>
          {!dbStatus?.databaseUrlConfigured && (
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">
              Add Neon <code className="text-purple-300">DATABASE_URL</code> in <code className="text-purple-300">.env</code> to connect cloud PostgreSQL.
            </p>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Administration
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </NavLink>
            );
          })}

          <div className="pt-4 border-t border-slate-800/80 mt-4 px-3 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </span>
          </div>

          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 rounded-xl transition-colors"
          >
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Student Dashboard</span>
          </Link>

          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Public Website</span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">View</span>
          </Link>
        </nav>

        {/* Admin User Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/90">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'}
              alt={user?.name || 'Admin'}
              className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
            />
            <div className="overflow-hidden flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</span>
                <span className="text-[9px] bg-purple-900/60 text-purple-300 font-extrabold px-1.5 py-0.2 rounded border border-purple-700/50 uppercase">
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-bold rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/50 hover:text-red-300 border border-red-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Top Navbar */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold hidden sm:inline-block">
                Admin Console
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-white font-display">
                Edqoo Platform Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/courses/new"
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Course</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Open Site</span>
            </Link>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
