import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { instructorService } from '../../services/instructorService';
import type { Instructor } from '../../types';
import { getCacheBustedImageUrl } from '../../utils/imageUrl';

export const AdminInstructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadInstructors = async () => {
    setLoading(true);
    try {
      const data = await instructorService.getInstructors();
      setInstructors(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load instructors.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  const handleDeleteInstructor = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove instructor "${name}"? This action cannot be undone.`)) return;

    try {
      const res = await instructorService.deleteInstructor(id);
      if (res.success) {
        showToast(`Instructor "${name}" removed successfully.`);
        setInstructors((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete instructor.', 'error');
    }
  };

  const filteredInstructors = instructors.filter((inst) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      inst.name.toLowerCase().includes(term) ||
      (inst.designation && inst.designation.toLowerCase().includes(term)) ||
      (inst.organization && inst.organization.toLowerCase().includes(term)) ||
      (inst.qualifications && inst.qualifications.toLowerCase().includes(term)) ||
      (inst.expertise && inst.expertise.some((e) => e.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold border transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
              : 'bg-red-950 text-red-300 border-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F1E8FA]/15 border border-[#6D22B5]/30 text-[#6D22B5]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                Instructor &amp; Faculty Management
              </h1>
              <p className="text-xs text-neutral-400">
                Manage, add, edit, or remove faculty profiles and curriculum assignments.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadInstructors}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6D22B5]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/admin/instructors/new"
            className="px-3.5 py-2 bg-[#6D22B5] hover:bg-[#4B1680] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-[#6D22B5]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Instructor</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
            Total Active Faculty
          </span>
          <span className="text-2xl font-black text-white font-display mt-1 block">
            {instructors.length}
          </span>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
            Average Experience
          </span>
          <span className="text-2xl font-black text-[#6D22B5] font-display mt-1 block">
            10+ Years
          </span>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
            Live Website View
          </span>
          <span className="text-xs font-semibold text-neutral-400 mt-2 inline-flex items-center gap-1">
            Directory Disabled (Public)
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search instructors by name, designation, organization, or qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-xl py-2 pl-10 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#6D22B5] focus:ring-1 focus:ring-[#6D22B5] transition-colors"
          />
        </div>
      </div>

      {/* Instructors Table / Cards */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="w-6 h-6 text-[#6D22B5] animate-spin" />
            <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
              Loading Instructors Database...
            </span>
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-sm font-bold text-neutral-300">No instructors found</p>
            <p className="text-xs text-neutral-500">Try adjusting your search criteria or add a new instructor.</p>
            <Link
              to="/admin/instructors/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6D22B5] text-white rounded-lg text-xs font-bold hover:bg-[#853FD5] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Instructor</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-black/60 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="py-3.5 px-4">Instructor Profile</th>
                  <th className="py-3.5 px-4">Designation &amp; Org</th>
                  <th className="py-3.5 px-4">Experience &amp; Degree</th>
                  <th className="py-3.5 px-4">Courses Handled</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-xs">
                {filteredInstructors.map((inst) => {
                  const photo = getCacheBustedImageUrl(
                    inst.profileImage || inst.image,
                    inst.updatedAt || inst.imageUpdatedAt,
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
                  );
                  return (
                    <tr key={inst.id} className="hover:bg-neutral-800/40 transition-colors">
                      {/* Photo & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={photo}
                            alt={inst.name}
                            className="w-11 h-11 rounded-xl object-cover border border-neutral-700 flex-shrink-0"
                          />
                          <div>
                            <Link
                              to={`/admin/instructors/edit/${inst.id}`}
                              className="font-bold text-white hover:text-[#6D22B5] transition-colors block"
                            >
                              {inst.name}
                            </Link>
                            <span className="text-[11px] text-[#6D22B5] font-semibold block">
                              ID: {inst.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Designation & Organization */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="text-neutral-200 font-semibold block">
                            {inst.designation || inst.role}
                          </span>
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-neutral-500" />
                            {inst.organization}
                          </span>
                        </div>
                      </td>

                      {/* Experience & Qualifications */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded bg-[#F1E8FA]/15 border border-[#6D22B5]/30 text-[#6D22B5] text-[10px] font-bold">
                            {inst.experience || 'Experienced'}
                          </span>
                          <p className="text-[11px] text-neutral-400 truncate max-w-[200px]" title={inst.qualifications}>
                            {inst.qualifications || 'Certified Professional'}
                          </p>
                        </div>
                      </td>

                      {/* Courses Handled */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 max-w-xs">
                          {inst.courses && inst.courses.length > 0 ? (
                            <span className="text-neutral-300 text-[11px] font-medium block truncate" title={inst.courses.join(', ')}>
                              {inst.courses.slice(0, 2).join(', ')}
                              {inst.courses.length > 2 && ` (+${inst.courses.length - 2} more)`}
                            </span>
                          ) : (
                            <span className="text-neutral-500 text-[11px] italic">No courses assigned</span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/instructors/${inst.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                            title="Preview Public Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            to={`/admin/instructors/edit/${inst.id}`}
                            className="p-1.5 rounded-lg bg-[#F1E8FA]/15 hover:bg-[#F1E8FA]/25 border border-[#6D22B5]/30 text-[#6D22B5] transition-colors"
                            title="Edit Profile"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDeleteInstructor(inst.id, inst.name)}
                            className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-400 transition-colors"
                            title="Delete Instructor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

    </div>
  );
};
