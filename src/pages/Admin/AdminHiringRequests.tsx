import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit,
  Save,
  Trash2,
  RefreshCw,
  X
} from 'lucide-react';
import { hiringService } from '../../services/hiringService';
import type { HiringEnquiry, HiringRequestStatus } from '../../types';

export const AdminHiringRequests: React.FC = () => {
  const [requests, setRequests] = useState<HiringEnquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeRequest, setActiveRequest] = useState<HiringEnquiry | null>(null);
  const [statusInput, setStatusInput] = useState<HiringRequestStatus>('New');
  const [noteInput, setNoteInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await hiringService.getAllHiringRequests();
      setRequests(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch hiring requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenModal = (req: HiringEnquiry) => {
    setActiveRequest(req);
    setStatusInput(req.status);
    setNoteInput(req.notes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest) return;

    try {
      const res = await hiringService.updateHiringStatus(activeRequest.id, statusInput, noteInput);
      if (res.success && res.enquiry) {
        setActiveRequest(res.enquiry);
        showToast('Hiring request updated successfully!');
        fetchRequests();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update hiring request.', 'error');
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!window.confirm(`Are you sure you want to delete hiring request from "${company}"?`)) return;

    try {
      await hiringService.deleteHiringRequest(id);
      showToast('Hiring request deleted.');
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (activeRequest?.id === id) setActiveRequest(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete request.', 'error');
    }
  };

  const filteredRequests = requests.filter((r) => {
    const statusMatch =
      selectedStatus === 'all' || r.status.toLowerCase() === selectedStatus.toLowerCase();

    const term = searchTerm.toLowerCase().trim();
    const searchMatch =
      !term ||
      r.companyName.toLowerCase().includes(term) ||
      r.contactPerson.toLowerCase().includes(term) ||
      r.email.toLowerCase().includes(term) ||
      r.phone.includes(term) ||
      r.jobRole.toLowerCase().includes(term) ||
      r.requiredSkills.toLowerCase().includes(term) ||
      r.location.toLowerCase().includes(term);

    return statusMatch && searchMatch;
  });

  const getStatusBadge = (status: HiringRequestStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-950/70 text-blue-400 border-blue-800';
      case 'Under Review':
        return 'bg-amber-950/70 text-amber-400 border-amber-800';
      case 'Contacted':
        return 'bg-indigo-950/70 text-indigo-300 border-indigo-800';
      case 'Shortlisted':
        return 'bg-cyan-950/70 text-cyan-400 border-cyan-800';
      case 'Accepted':
        return 'bg-[#F1E8FA]/10 text-[#6D22B5] border-[#6D22B5]/40';
      case 'Rejected':
        return 'bg-red-950/70 text-red-400 border-red-800';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold border transition-all ${
            toast.type === 'success'
              ? 'bg-neutral-900 text-[#6D22B5] border-[#6D22B5]/40'
              : 'bg-red-950 text-red-300 border-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#6D22B5]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F1E8FA]/10 border border-[#6D22B5]/30 text-[#6D22B5]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                Corporate Hiring Requests
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Manage talent requirements submitted by employers and companies.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="px-3 py-2 bg-black hover:bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <input
            type="text"
            placeholder="Search by company, contact person, email, job role, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-xl py-2 pl-9 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#6D22B5] focus:ring-1 focus:ring-[#6D22B5] transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-xs text-neutral-200 focus:outline-none focus:border-[#6D22B5] focus:ring-1 focus:ring-[#6D22B5]"
          >
            <option value="all">All Statuses ({requests.length})</option>
            <option value="new">New</option>
            <option value="under review">Under Review</option>
            <option value="contacted">Contacted</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table & Content */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/90 text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Company &amp; Contact</th>
                <th className="py-3 px-4">Role &amp; Openings</th>
                <th className="py-3 px-4">Required Skills</th>
                <th className="py-3 px-4">Location &amp; Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6D22B5]" />
                    <span>Loading hiring requests...</span>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No hiring requests found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-black/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{req.companyName}</div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <span>{req.contactPerson}</span>
                        <span>•</span>
                        <a href={`mailto:${req.email}`} className="text-[#6D22B5] hover:underline">{req.email}</a>
                      </div>
                      <div className="text-[10px] text-neutral-500">{req.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{req.jobRole}</div>
                      <div className="text-[11px] text-neutral-400">{req.openings} ({req.experience})</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-neutral-400">
                      {req.requiredSkills}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-neutral-300">{req.location || 'Not Specified'}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black border border-neutral-800 text-neutral-400 font-semibold inline-block mt-0.5">
                        {req.workMode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(req)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#6D22B5] hover:text-white text-neutral-300 transition-colors"
                          title="View & Edit Status"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(req.id, req.companyName)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-400 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Status Edit Modal */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0B0B0B] border border-neutral-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#6D22B5]" />
                <h3 className="text-base font-black text-white font-display">
                  Hiring Requirement Details
                </h3>
              </div>
              <button
                onClick={() => setActiveRequest(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-black/60 p-4 rounded-xl border border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Company</span>
                  <span className="text-sm font-bold text-white block">{activeRequest.companyName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Contact Person</span>
                  <span className="text-sm font-bold text-white block">{activeRequest.contactPerson}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Email</span>
                  <a href={`mailto:${activeRequest.email}`} className="text-[#6D22B5] hover:underline">{activeRequest.email}</a>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Phone</span>
                  <span className="text-neutral-300">{activeRequest.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-black/60 p-4 rounded-xl border border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Role</span>
                  <span className="font-bold text-[#6D22B5]">{activeRequest.jobRole}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Openings</span>
                  <span className="text-neutral-300">{activeRequest.openings}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Experience</span>
                  <span className="text-neutral-300">{activeRequest.experience}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Work Mode &amp; Location</span>
                  <span className="text-neutral-300">{activeRequest.workMode} • {activeRequest.location}</span>
                </div>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Required Skills</span>
                <p className="text-neutral-300 leading-relaxed">{activeRequest.requiredSkills}</p>
              </div>

              {activeRequest.additionalRequirements && (
                <div className="bg-black/60 p-4 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Additional Requirements</span>
                  <p className="text-neutral-300 leading-relaxed">{activeRequest.additionalRequirements}</p>
                </div>
              )}

              {/* Status Update Form */}
              <form onSubmit={handleSaveStatus} className="pt-4 border-t border-neutral-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Change Status
                    </label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as HiringRequestStatus)}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6D22B5] focus:ring-1 focus:ring-[#6D22B5]"
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Internal Admin Notes
                    </label>
                    <textarea
                      rows={2}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add candidate matching notes, interview updates, or HR contact logs..."
                      className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6D22B5] focus:ring-1 focus:ring-[#6D22B5]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveRequest(null)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#6D22B5] hover:bg-[#4B1680] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#6D22B5]/20 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
