import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  UserCheck,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEnquiry } from '../context/EnquiryContext';
import { EnquiryModal } from '../components/ui/EnquiryModal';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { openEnquiryModal } = useEnquiry();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/enquiries', label: 'My Enquiries', icon: MessageSquareCheck },
    { to: '/dashboard/settings', label: 'Profile & Settings', icon: Settings },
  ];

  // If user has admin role or for staff lead management
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-left">
      {/* Mobile Sidebar Overlay Drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden" 
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white text-slate-700 border-r border-slate-200 transition-transform duration-300 transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header Official Branding */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.jpg" 
              alt="EDQOO - Your skill partner" 
              className="h-9 w-auto object-contain max-w-[140px]" 
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Capsule */}
        <div className="p-4 mx-3 my-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'}
            alt={user?.name || 'User'}
            className="w-10 h-10 rounded-full object-cover border border-purple-200"
          />
          <div className="overflow-hidden flex-1">
            <span className="text-xs font-bold text-slate-900 block truncate">{user?.name || 'User'}</span>
            <span className="text-[10px] text-purple-700 font-medium block truncate">{user?.email}</span>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-2 pb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              User Menu
            </span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-purple-600'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Admin Lead Management Link */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-100 mt-3 space-y-1.5">
              <div className="px-2 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Staff / Admin
                </span>
              </div>
              <NavLink
                to="/dashboard/admin-leads"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-purple-600'
                  }`
                }
              >
                <UserCheck className="w-4 h-4 flex-shrink-0" />
                <span>Lead Management</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Sidebar Quick Action CTA */}
        <div className="p-4 mx-3 mb-2 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <span className="text-[11px] font-bold text-slate-900 block leading-tight">
            Need Course Guidance?
          </span>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Speak directly with an academic counselor.
          </p>
          <button
            type="button"
            onClick={() => openEnquiryModal()}
            className="w-full btn-primary py-1.5 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-3 h-3" />
            <span>New Enquiry</span>
          </button>
        </div>

        {/* Sidebar Footer User controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-purple-600 hover:bg-white transition-colors mb-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Dashboard Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-2xs flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-950 font-display">
                Profile & Enquiry Dashboard
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Manage your account profile and track submitted program enquiries.
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openEnquiryModal()}
              className="btn-primary px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Enquire Now</span>
            </button>

            <Link
              to="/courses"
              className="hidden md:inline-flex px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-purple-600 hover:bg-purple-50 border border-slate-200 rounded-lg transition-colors"
            >
              Explore Programs
            </Link>
          </div>
        </header>

        {/* Dashboard Pages Viewer */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>

      {/* Global Enquiry / Advisory Modal for Dashboard */}
      <EnquiryModal />
    </div>
  );
};
