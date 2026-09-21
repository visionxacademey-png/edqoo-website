import React, { useState, useEffect } from 'react';
import {
  Handshake,
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
  MapPin,
  X
} from 'lucide-react';
import { partnerService } from '../../services/partnerService';
import type { PartnerEnquiry, PartnerRequestStatus } from '../../types';

export const AdminPartnerRequests: React.FC = () => {
  const [requests, setRequests] = useState<PartnerEnquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeRequest, setActiveRequest] = useState<PartnerEnquiry | null>(null);
  const [statusInput, setStatusInput] = useState<PartnerRequestStatus>('New');
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
      const data = await partnerService.getAllPartnerRequests();
      setRequests(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch partnership requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenModal = (req: PartnerEnquiry) => {
    setActiveRequest(req);
    setStatusInput(req.status);
    setNoteInput(req.notes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest) return;

    try {
      const res = await partnerService.updatePartnerStatus(activeRequest.id, statusInput, noteInput);
      if (res.success && res.enquiry) {
        setActiveRequest(res.enquiry);
        showToast('Partnership proposal updated successfully!');
        fetchRequests();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update proposal.', 'error');
    }
  };

  const handleDelete = async (id: string, org: string) => {
    if (!window.confirm(`Are you sure you want to delete proposal from "${org}"?`)) return;

    try {
      await partnerService.deletePartnerRequest(id);
      showToast('Partnership request deleted.');
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (activeRequest?.id === id) setActiveRequest(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete request.', 'error');
    }
  };

  const filteredRequests = requests.filter((r) => {
    const statusMatch =
      selectedStatus === 'all' || r.status.toLowerCase() === selectedStatus.toLowerCase();

    const typeMatch =
      selectedType === 'all' || r.organizationType.toLowerCase() === selectedType.toLowerCase();

    const term = searchTerm.toLowerCase().trim();
    const searchMatch =
      !term ||
      r.organizationName.toLowerCase().includes(term) ||
      r.contactPerson.toLowerCase().includes(term) ||
      r.designation.toLowerCase().includes(term) ||
      r.email.toLowerCase().includes(term) ||
      r.phone.includes(term) ||
      r.partnershipArea.toLowerCase().includes(term) ||
      r.location.toLowerCase().includes(term);

    return statusMatch && typeMatch && searchMatch;
  });

  const getStatusBadgeClass = (status: PartnerRequestStatus) => {
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
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                Partnership Enquiries
              </h1>
              <p className="text-xs text-slate-400">
                Manage university alliances, corporate training partnerships, and institutional MOUs.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchRequests}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            placeholder="Search organization, contact person, email, area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-600"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="sm:col-span-3 relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-100 focus:outline-none focus:border-purple-600"
          >
            <option value="all">All Organization Types</option>
            <option value="Company">Company</option>
            <option value="Educational Institution">Educational Institution</option>
            <option value="Training Organization">Training Organization</option>
            <option value="Technology Company">Technology Company</option>
            <option value="Other">Other</option>
          </select>
          <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="sm:col-span-3 relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-100 focus:outline-none focus:border-purple-600"
          >
            <option value="all">All Proposal Statuses</option>
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

      {/* Requests Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
            <span className="text-xs text-slate-400 font-semibold">Loading Partnership Enquiries...</span>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Handshake className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No partnership enquiries found</h3>
            <p className="text-xs text-slate-500">Proposals submitted on /become-a-partner will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Organization</th>
                  <th className="px-4 py-3.5">Contact Person</th>
                  <th className="px-4 py-3.5">Partnership Area</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-100">{req.organizationName}</div>
                      <div className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider mt-0.5">
                        {req.organizationType}
                      </div>
                      {req.website && (
                        <a
                          href={req.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-slate-400 hover:text-purple-300 flex items-center gap-1 mt-0.5"
                        >
                          <span>{req.website.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-200">{req.contactPerson}</div>
                      <div className="text-[11px] text-slate-400">{req.designation}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-purple-400" />
                        <span>{req.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{req.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <div className="font-semibold text-slate-200 truncate">{req.partnershipArea}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{req.proposal}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{req.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(req)}
                          className="px-2.5 py-1.5 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => handleDelete(req.id, req.organizationName)}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded-lg transition-colors"
                          title="Delete proposal"
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
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setActiveRequest(null)} className="fixed inset-0 bg-black/75 backdrop-blur-xs" />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] z-10 space-y-5 text-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Partnership Proposal: {activeRequest.organizationName}</span>
                </h3>
                <span className="text-[11px] text-slate-400">ID: {activeRequest.id} &bull; Submitted {new Date(activeRequest.submittedAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setActiveRequest(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Organization</span>
                <span className="font-bold text-white text-sm">{activeRequest.organizationName}</span>
                <span className="text-purple-300 font-semibold block text-[11px]">{activeRequest.organizationType}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Contact Person</span>
                <span className="font-bold text-slate-100">{activeRequest.contactPerson}</span>
                <span className="text-slate-400 block">{activeRequest.designation}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Email & Phone</span>
                <span className="text-purple-300 font-semibold block">{activeRequest.email}</span>
                <span className="text-slate-400">{activeRequest.phone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Location</span>
                <span className="text-slate-200">{activeRequest.location}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Partnership Area</span>
                <span className="text-purple-300 font-semibold text-sm">{activeRequest.partnershipArea}</span>
              </div>
              {activeRequest.website && (
                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Website</span>
                  <a href={activeRequest.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline flex items-center gap-1">
                    <span>{activeRequest.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Proposal Content */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Partnership Proposal</span>
              <p className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 leading-relaxed font-sans">
                {activeRequest.proposal}
              </p>
            </div>

            {activeRequest.additionalInformation && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Additional Information</span>
                <p className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-300 leading-relaxed">
                  {activeRequest.additionalInformation}
                </p>
              </div>
            )}

            {/* Status & Notes */}
            <form onSubmit={handleSaveStatus} className="pt-3 border-t border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Proposal Status
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as PartnerRequestStatus)}
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
                    Internal Alliance Notes
                  </label>
                  <textarea
                    rows={2}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add notes about partnership discussion, MOU draft, or scheduled meetings..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveRequest(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/30"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Proposal Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
