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
  UserCheck,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { SEO } from '../components/common/SEO';
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
    { to: '/admin/categories', label: 'Categories & Tracks', icon: Layers, end: false },
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
      <SEO 
        title="Admin Console | Edqoo" 
        description="Private administrative portal for Edqoo platform management." 
        canonical="/admin" 
        noIndex={true} 
      />
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
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-[#050505]">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6D22B5] text-white flex items-center justify-center shadow-lg shadow-[#6D22B5]/20 font-bold">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-wide block font-display">
                EDQOO ADMIN
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#6D22B5] font-bold block">
                Control Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Live Status Indicator */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-neutral-900/90 border border-neutral-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Database className="w-3 h-3 text-[#6D22B5]" />
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
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${dbStatus?.connected ? 'bg-[#F1E8FA]/20 text-[#6D22B5] border border-[#6D22B5]/40' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
              {dbStatus?.connected ? 'Live' : 'Fallback'}
            </span>
          </div>
          {!dbStatus?.databaseUrlConfigured && (
            <p className="text-[10px] text-neutral-400 mt-1 leading-tight">
              Add Neon <code className="text-[#6D22B5]">DATABASE_URL</code> in <code className="text-[#6D22B5]">.env</code> to connect cloud PostgreSQL.
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
                      ? 'bg-[#6D22B5] text-white shadow-md shadow-[#6D22B5]/20 font-bold'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
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

          <div className="pt-4 border-t border-neutral-800 mt-4 px-3 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </span>
          </div>

          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-xl transition-colors"
          >
            <Activity className="w-4 h-4 text-[#6D22B5]" />
            <span>Student Dashboard</span>
          </Link>

          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-neutral-400" />
              <span>Public Website</span>
            </div>
            <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">View</span>
          </Link>
        </nav>

        {/* Admin User Footer */}
        <div className="p-4 border-t border-neutral-800 bg-[#050505]">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'}
              alt={user?.name || 'Admin'}
              className="w-9 h-9 rounded-full object-cover border border-[#6D22B5]/40"
            />
            <div className="overflow-hidden flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</span>
                <span className="text-[9px] bg-[#F1E8FA]/20 text-[#6D22B5] font-extrabold px-1.5 py-0.2 rounded border border-[#6D22B5]/40 uppercase">
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
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050505]">
        {/* Top Navbar */}
        <header className="bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#F1E8FA]/10 text-[#6D22B5] border border-[#6D22B5]/20 font-bold hidden sm:inline-block">
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
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#6D22B5] hover:bg-[#4B1680] text-white transition-all shadow-md shadow-[#6D22B5]/20 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">Add Course</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Open Site</span>
            </Link>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0B0B0B] text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
