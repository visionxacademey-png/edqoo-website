import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Home,
  BookOpen,
  ArrowRight,
  Brain,
  Code2,
  BarChart3,
  Wrench,
  PhoneCall
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

export const NotFound: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { openEnquiryModal } = useEnquiry();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const quickLinks = [
    { title: 'Data Science & AI Track', path: '/programs/data-science-and-ai', icon: Brain },
    { title: 'Python Programming', path: '/programs/python', icon: Code2 },
    { title: 'Data Analytics & AI', path: '/programs/data-analytics-and-ai', icon: BarChart3 },
    { title: 'Tools & Upskills Fast-Tracks', path: '/tools-and-upskills', icon: Wrench }
  ];

  return (
    <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-16 px-4 text-slate-900">
      <SEO
        title="404 - Page Not Found | Edqoo"
        description="The requested page could not be found. Explore Edqoo's online courses in Data Science, AI, Python, Machine Learning, and Data Analytics."
        canonical="/404"
        noIndex={true}
      />

      <div className="max-w-2xl w-full mx-auto text-center space-y-8">
        {/* 404 Badge & Numbers */}
        <div className="space-y-3">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full uppercase tracking-wider inline-block">
            Error 404
          </span>
          <h1 className="text-5xl sm:text-7xl font-display font-black text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search courses (e.g. Python, AI, Power BI)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 text-xs text-slate-900 rounded-xl focus:outline-none focus:border-purple-600 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="btn-primary px-4 py-2.5 text-xs font-bold rounded-xl shadow-2xs"
          >
            Search
          </button>
        </form>

        {/* Quick Program Links */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs text-left space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Explore Popular Program Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className="p-3 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50/50 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 group-hover:text-purple-700">
                    <IconComp className="w-4 h-4 text-purple-600" />
                    <span>{item.title}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-2xs inline-flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/courses"
            className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl shadow-2xs transition-colors inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Browse All Courses</span>
          </Link>
          <button
            onClick={() => openEnquiryModal('404 Callback Request')}
            className="px-5 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Talk to Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
