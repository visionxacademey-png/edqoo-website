import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit,
  Save,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  FileText,
  X
} from 'lucide-react';
import { instructorApplicationService } from '../../services/instructorApplicationService';
import type { InstructorApplication, InstructorApplicationStatus } from '../../types';

export const AdminInstructorApplications: React.FC = () => {
  const [applications, setApplications] = useState<InstructorApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeApp, setActiveApp] = useState<InstructorApplication | null>(null);
  const [statusInput, setStatusInput] = useState<InstructorApplicationStatus>('New');
  const [noteInput, setNoteInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await instructorApplicationService.getAllApplications();
      setApplications(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch instructor applications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenModal = (app: InstructorApplication) => {
    setActiveApp(app);
    setStatusInput(app.status);
    setNoteInput(app.notes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApp) return;

    try {
      const res = await instructorApplicationService.updateApplicationStatus(activeApp.id, statusInput, noteInput);
      if (res.success && res.application) {
        setActiveApp(res.application);
        showToast('Application updated successfully!');
        fetchApplications();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update application.', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete application from "${name}"?`)) return;

    try {
      await instructorApplicationService.deleteApplication(id);
      showToast('Application deleted.');
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (activeApp?.id === id) setActiveApp(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete application.', 'error');
    }
  };

  const filteredApps = applications.filter((a) => {
    const statusMatch =
      selectedStatus === 'all' || a.status.toLowerCase() === selectedStatus.toLowerCase();

    const term = searchTerm.toLowerCase().trim();
    const searchMatch =
      !term ||
      a.name.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term) ||
      a.phone.includes(term) ||
      a.designation.toLowerCase().includes(term) ||
      a.organization.toLowerCase().includes(term) ||
      a.qualification.toLowerCase().includes(term) ||
      a.expertise.toLowerCase().includes(term) ||
      a.courses.toLowerCase().includes(term);

    return statusMatch && searchMatch;
  });

  const getStatusBadgeClass = (status: InstructorApplicationStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-950/80 text-blue-400 border-blue-800';
      case 'Under Review':
        return 'bg-purple-950/80 text-purple-400 border-purple-800';
      case 'Contacted':
        return 'bg-amber-950/80 text-amber-400 border-amber-800';
      case 'Shortlisted':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-800';
      case 'Accepted':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
      case 'Rejected':
        return 'bg-red-950/80 text-red-400 border-red-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-purple-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                Instructor Applications
              </h1>
              <p className="text-xs text-slate-400">
                Review candidate credentials, qualifications, teaching experience, and resumes.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchApplications}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <input
            type="text"
            placeholder="Search candidate name, email, expertise, courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-600"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="sm:col-span-4 relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-100 focus:outline-none focus:border-purple-600"
          >
            <option value="all">All Application Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Contacted">Contacted</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
            <span className="text-xs text-slate-400 font-semibold">Loading Instructor Applications...</span>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <GraduationCap className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No instructor applications found</h3>
            <p className="text-xs text-slate-500">Applications submitted on /become-an-instructor will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Candidate</th>
                  <th className="px-4 py-3.5">Designation & Org</th>
                  <th className="px-4 py-3.5">Expertise & Courses</th>
                  <th className="px-4 py-3.5">Experience</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-100">{app.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-purple-400" />
                        <span>{app.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{app.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-200">{app.designation}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        <span>{app.organization}</span>
                      </div>
                      <div className="text-[10px] text-purple-300/80 mt-0.5">{app.qualification}</div>
                    </td>
                    <td className="px-4 py-3.5 max-w-[220px]">
                      <div className="font-semibold text-slate-200 truncate">{app.expertise}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">Teaches: {app.courses}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-200">{app.experience}</div>
                      <div className="text-[11px] text-slate-500">Teaching: {app.teachingExperience}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(app)}
                          className="px-2.5 py-1.5 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => handleDelete(app.id, app.name)}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded-lg transition-colors"
                          title="Delete application"
                        >
                          <Trash2 className="w-3 h-3" />
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

      {/* Review Modal */}
      {activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setActiveApp(null)} className="fixed inset-0 bg-black/75 backdrop-blur-xs" />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] z-10 space-y-5 text-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Instructor Application: {activeApp.name}</span>
                </h3>
                <span className="text-[11px] text-slate-400">ID: {activeApp.id} &bull; Submitted {new Date(activeApp.submittedAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setActiveApp(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Candidate Name</span>
                <span className="font-bold text-white text-sm">{activeApp.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Email & Phone</span>
                <span className="text-purple-300 font-semibold block">{activeApp.email}</span>
                <span className="text-slate-400">{activeApp.phone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Designation & Org</span>
                <span className="text-slate-200 font-semibold">{activeApp.designation}</span>
                <span className="text-slate-400 block">{activeApp.organization}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Highest Qualification</span>
                <span className="text-slate-200 font-semibold">{activeApp.qualification}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Area of Expertise</span>
                <span className="text-purple-300 font-semibold">{activeApp.expertise}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Experience</span>
                <span className="text-slate-200">Total: {activeApp.experience}</span>
                <span className="text-slate-400 block">Teaching: {activeApp.teachingExperience}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Courses They Can Teach</span>
                <span className="text-slate-200 font-semibold">{activeApp.courses}</span>
              </div>
              {activeApp.linkedin && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">LinkedIn</span>
                  <a href={activeApp.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline flex items-center gap-1">
                    <span>{activeApp.linkedin}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {activeApp.portfolio && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Portfolio / GitHub</span>
                  <a href={activeApp.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline flex items-center gap-1">
                    <span>{activeApp.portfolio}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Professional Bio</span>
              <p className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-300 leading-relaxed">
                {activeApp.bio}
              </p>
            </div>

            {/* Resume */}
            {activeApp.resume && (
              <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="font-bold text-purple-200 block">Resume Attached / Provided</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-sm block">{activeApp.resume}</span>
                  </div>
                </div>
                {activeApp.resume.startsWith('data:') ? (
                  <a
                    href={activeApp.resume}
                    download={`${activeApp.name.replace(/\s+/g, '_')}_Resume`}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs"
                  >
                    Download
                  </a>
                ) : activeApp.resume.startsWith('http') ? (
                  <a
                    href={activeApp.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs inline-flex items-center gap-1"
                  >
                    <span>View Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">{activeApp.resume}</span>
                )}
              </div>
            )}

            {activeApp.additionalInformation && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Additional Information</span>
                <p className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-300 leading-relaxed">
                  {activeApp.additionalInformation}
                </p>
              </div>
            )}

            {/* Status & Internal Notes Form */}
            <form onSubmit={handleSaveStatus} className="pt-3 border-t border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Application Status
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as InstructorApplicationStatus)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-600"
                  >
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Internal Academic Review Notes
                  </label>
                  <textarea
                    rows={2}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add interview feedback, course alignment, or next review steps..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveApp(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/30"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Status & Notes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
