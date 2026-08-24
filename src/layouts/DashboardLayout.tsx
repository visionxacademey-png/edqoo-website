import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/my-courses', label: 'My Courses', icon: BookOpen },
    { to: '/dashboard/progress', label: 'Progress Tracking', icon: Trophy },
    { to: '/dashboard/certificates', label: 'Certificates', icon: Award },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay Drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden" 
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-deep-navy-950 text-slate-300 border-r border-slate-900/80 transition-transform duration-300 transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header Branding */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-900/60 bg-deep-navy-950">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-royal-blue-600 to-light-blue-400 flex items-center justify-center text-white font-display font-extrabold text-sm shadow">
              E
            </div>
            <span className="font-display font-extrabold text-lg text-white tracking-tight">
              Edqoo LMS
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-royal-blue-900 text-white shadow-md'
                      : 'hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer User controls */}
        <div className="p-4 border-t border-slate-900/60 bg-deep-navy-950/40">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors mb-2"
          >
            <Home className="w-4 h-4" />
            Back to Public Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-semibold rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Dashboard Top Header */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-900 font-display">Student Workspace</h1>
              <p className="text-xs text-slate-500 mt-0.5">Welcome back, {user?.name || 'Learner'}</p>
            </div>
          </div>

          {/* User profile actions */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button 
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-royal-blue-500" />
            </button>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden md:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight">{user?.name}</span>
                <span className="text-[10px] text-slate-500 block leading-none">{user?.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Pages Viewer */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
