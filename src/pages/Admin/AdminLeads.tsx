import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquareCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit,
  Save,
  RefreshCw
} from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import type { Enquiry, EnquiryStatus } from '../../types';

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeLead, setActiveLead] = useState<Enquiry | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [statusInput, setStatusInput] = useState<EnquiryStatus>('Submitted');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await enquiryService.getAllEnquiries();
      setLeads(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch enquiries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleOpenLeadModal = (lead: Enquiry) => {
    setActiveLead(lead);
    setStatusInput(lead.status);
    setNoteInput(lead.notes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;

    try {
      const res = await enquiryService.updateEnquiryStatus(activeLead.id, statusInput, noteInput);
      if (res.success && res.enquiry) {
        setActiveLead(res.enquiry);
        showToast('Lead status updated successfully!');
        fetchLeads();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update lead.', 'error');
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = selectedStatus === 'all' ? true : lead.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.program.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* Toast Notification */}
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
              Lead & Counseling Pipeline
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-purple-900/60 text-purple-300 border border-purple-700/50">
              {leads.length} Enquiries
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track student consultation requests, record counselor notes, and update admission status.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/admin/users"
            className="px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Logged-In Users Telemetry →</span>
          </Link>
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Leads</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by student name, email, or program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-up Required">Follow-up Required</option>
            <option value="Resolved">Resolved</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <MessageSquareCheck className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-sm font-bold text-slate-400">No leads found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Program Track</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {lead.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-purple-300 font-semibold">{lead.program}</span>
                      {lead.learningMode && (
                        <span className="text-[10px] text-slate-500 block">{lead.learningMode}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-mono text-[11px]">{lead.phone}</div>
                      <div className="text-[10px] text-slate-400">{lead.email}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(lead.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          lead.status === 'Converted'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : lead.status === 'Contacted'
                            ? 'bg-blue-950 text-blue-300 border-blue-800'
                            : lead.status === 'Follow-up Required'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenLeadModal(lead)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-900/40 text-purple-300 hover:bg-purple-900/70 border border-purple-700/50 transition-colors inline-flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Student Consultation Record
              </h3>
              <button
                onClick={() => setActiveLead(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name</span>
                  <span className="font-bold text-white text-sm">{activeLead.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Contact</span>
                  <span className="font-mono text-purple-300">{activeLead.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Program</span>
                  <span className="text-white font-medium">{activeLead.program}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Email</span>
                  <span className="text-slate-300">{activeLead.email}</span>
                </div>
              </div>

              {activeLead.message && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Student Message</span>
                  <p className="text-slate-200">{activeLead.message}</p>
                </div>
              )}

              <form onSubmit={handleSaveStatus} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Update Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as EnquiryStatus)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Converted">Converted (Enrolled)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Counselor Follow-Up Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Record notes on student interests, counseling outcome, or follow-up schedule..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveLead(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Update</span>
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
