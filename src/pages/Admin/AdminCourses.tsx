import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { PROGRAM_CATEGORIES, normalizeCategoryName } from '../../data/courses';
import type { Course } from '../../types';

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load courses.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await courseService.deleteCourse(id);
      if (res.success) {
        showToast(`Course "${title}" deleted successfully.`);
        setCourses((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete course.', 'error');
    }
  };

  const handleToggleFeatured = async (course: Course) => {
    const updatedFeatured = !course.featured;
    try {
      const res = await courseService.updateCourse(course.id, { featured: updatedFeatured });
      if (res.success) {
        showToast(`"${course.title}" is now ${updatedFeatured ? 'Featured' : 'Standard'}.`);
        setCourses((prev) =>
          prev.map((c) => (c.id === course.id ? { ...c, featured: updatedFeatured } : c))
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update course.', 'error');
    }
  };

  const handleToggleStatus = async (course: Course) => {
    const newStatus = course.status === 'available' ? 'coming-soon' : 'available';
    try {
      const res = await courseService.updateCourse(course.id, { status: newStatus });
      if (res.success) {
        showToast(`"${course.title}" status changed to ${newStatus}.`);
        setCourses((prev) =>
          prev.map((c) => (c.id === course.id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update course status.', 'error');
    }
  };

  const availableCategories = [...PROGRAM_CATEGORIES];

  const filteredCourses = courses.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(term) ||
      (c.categories || [c.category]).some((cat) => cat.toLowerCase().includes(term)) ||
      c.description.toLowerCase().includes(term);
    const matchesCategory =
      selectedCategory === 'all' ||
      (c.categories || [c.category]).some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* Toast */}
      {toast && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-bold shadow-lg transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border border-emerald-800'
              : 'bg-red-950 text-red-200 border border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white font-display tracking-tight">
              Course Management Catalog
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              {courses.length} Programs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create, update syllabus, set pricing, adjust curriculum modules, and manage course visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={loadCourses}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/courses/new"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md shadow-purple-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Course</span>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search programs by title or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="coming-soon">Coming Soon</option>
          </select>
        </div>
      </div>

      {/* Courses List Table / Cards */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm">
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-sm font-bold text-slate-400">No courses match your filter.</p>
            <Link
              to="/admin/courses/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-xs font-bold text-white hover:bg-purple-500"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create First Course</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3 px-4">Program Track</th>
                  <th className="py-3 px-4">Categories</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4">Duration & Live Hours</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Course Title & Thumb */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                        />
                        <div className="overflow-hidden">
                          <Link
                            to={`/admin/courses/edit/${course.id}`}
                            className="font-bold text-white hover:text-purple-400 truncate block transition-colors"
                          >
                            {course.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">
                            /{course.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(course.categories || [course.category]).map((rawCat) => {
                          const cat = normalizeCategoryName(rawCat);
                          return (
                            <span key={cat} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-purple-300 border border-purple-900/50">
                              {cat}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Price */}
                    {/* <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        ₹{course.price.toLocaleString('en-IN')}
                      </div>
                      {course.originalPrice > course.price && (
                        <div className="text-[10px] text-slate-500 line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td> */}

                    {/* Duration & Live Hours */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-purple-400" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {course.liveHours ? `${course.liveHours} Live` : `${course.lessons} Practical Lessons`}
                      </div>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(course)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                          course.featured
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                        title="Click to toggle featured badge"
                      >
                        <span>{course.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(course)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          course.status === 'available'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-slate-800 text-amber-400 border-amber-900/60'
                        }`}
                        title="Click to toggle status"
                      >
                        {course.status === 'available' ? 'Available' : 'Coming Soon'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/courses/${course.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          title="Preview public page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          to={`/admin/courses/edit/${course.id}`}
                          className="p-1.5 rounded-lg bg-purple-900/40 text-purple-300 hover:bg-purple-900/70 border border-purple-700/50 transition-colors"
                          title="Edit course and syllabus"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-200 border border-red-900/50 transition-colors"
                          title="Delete course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
};
