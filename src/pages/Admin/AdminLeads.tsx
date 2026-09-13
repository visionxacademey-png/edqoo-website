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
    const statusMatch =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'incomplete'
        ? (lead.leadStatus === 'Incomplete' || lead.status === 'Incomplete')
        : selectedStatus === 'completed'
        ? (lead.leadStatus === 'Completed' || lead.status === 'Completed' || lead.status === 'Submitted')
        : lead.status.toLowerCase() === selectedStatus.toLowerCase() ||
          (lead.leadStatus && lead.leadStatus.toLowerCase() === selectedStatus.toLowerCase());

    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.category && lead.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.ktuId && lead.ktuId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.universityName && lead.universityName.toLowerCase().includes(searchTerm.toLowerCase()));

    return statusMatch && matchesSearch;
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
            Track student consultation requests, Tools &amp; Upskills 2-step leads, counselor notes, and admissions.
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
            placeholder="Search student, email, course, KTU ID, university..."
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
            <option value="all">All Enquiries &amp; Statuses</option>
            <option value="incomplete">Incomplete Leads (Step 1)</option>
            <option value="completed">Completed Enquiries (Step 2)</option>
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
                  <th className="py-3 px-4">Course &amp; Category</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Lead Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map((lead) => {
                  const isToolsCategory =
                    (lead.category && lead.category.toLowerCase().includes('tools')) ||
                    (lead.source && lead.source.toLowerCase().includes('tools'));
                  const isIncomplete = lead.leadStatus === 'Incomplete' || lead.status === 'Incomplete';
                  const isCompleted = lead.leadStatus === 'Completed' || (lead.profession && lead.gender);

                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{lead.name}</span>
                          {lead.profession && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal">
                              {lead.profession}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-purple-300 font-semibold block">{lead.program}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isToolsCategory ? (
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                              Tools &amp; Upskills
                            </span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-medium rounded bg-slate-800 text-slate-400">
                              {lead.category || 'General Track'}
                            </span>
                          )}
                          {lead.apaarId && (
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-purple-950/60 text-purple-300 border border-purple-800/60">
                              APAAR: {lead.apaarId}
                            </span>
                          )}
                          {lead.ktuId && (
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
                              KTU: {lead.ktuId}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="font-mono text-[11px]">{lead.phone}</div>
                        <div className="text-[10px] text-slate-400">{lead.email}</div>
                      </td>

                      {/* Lead Status (Step 1 vs Step 2) */}
                      <td className="py-3.5 px-4">
                        {isIncomplete ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Incomplete (Step 1)
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Completed (Step 2)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800/80">
                            New Lead
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(lead.submittedAt).toLocaleDateString()}
                      </td>

                      {/* Pipeline Stage */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            lead.status === 'Converted'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : lead.status === 'Contacted'
                              ? 'bg-blue-950 text-blue-300 border-blue-800'
                              : lead.status === 'Follow-up Required'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : lead.status === 'Incomplete'
                              ? 'bg-amber-950/50 text-amber-300/80 border-amber-900/40'
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl text-left my-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Lead Consultation Record
                  </h3>
                  {activeLead.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      {activeLead.category}
                    </span>
                  )}
                  {activeLead.leadStatus === 'Incomplete' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      Incomplete (Step 1 Only)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  Lead ID: <span className="font-mono text-slate-300">{activeLead.id}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 overflow-y-auto flex-1 pr-1">
              {/* Basic Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name</span>
                  <span className="font-bold text-white text-sm">{activeLead.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                  <span className="font-mono text-purple-300 font-bold text-sm">{activeLead.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Course / Program</span>
                  <span className="text-white font-medium">{activeLead.program}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="text-slate-300">{activeLead.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Lead Created At</span>
                  <span className="text-slate-300">{new Date(activeLead.submittedAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Source</span>
                  <span className="text-slate-300">{activeLead.source || 'Direct Website Enquiry'}</span>
                </div>
              </div>

              {/* Personal Details (Step 2) */}
              {(activeLead.state || activeLead.city || activeLead.pincode || activeLead.gender || activeLead.country) && (
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                    Location & Contact Details
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Pincode</span>
                      <span className="text-white font-medium">{activeLead.pincode || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">State</span>
                      <span className="text-white font-medium">{activeLead.state || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">City / District</span>
                      <span className="text-white font-medium">{activeLead.city || '—'}</span>
                    </div>
                    {activeLead.gender && (
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Gender</span>
                        <span className="text-white font-medium">{activeLead.gender}</span>
                      </div>
                    )}
                    {activeLead.dateOfBirth && (
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Date of Birth</span>
                        <span className="text-white font-medium">{activeLead.dateOfBirth}</span>
                      </div>
                    )}
                    {activeLead.country && (
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Country</span>
                        <span className="text-white font-medium">{activeLead.country}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Educational & Academic Details */}
              {activeLead.profession === 'Student' && (
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                    Student Academic Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Highest Qualification</span>
                      <span className="text-white font-bold">{activeLead.highestQualification || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Year of Graduation</span>
                      <span className="text-white font-medium">{activeLead.yearOfGraduation || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">APAAR / Credit Status</span>
                      <span className="text-white font-medium">{activeLead.apaarAbcStatus || '—'}</span>
                    </div>
                    {activeLead.apaarId && (
                      <div>
                        <span className="text-purple-400 block text-[10px] uppercase font-bold">APAAR / ABC ID</span>
                        <span className="font-mono text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                          {activeLead.apaarId}
                        </span>
                      </div>
                    )}
                    {activeLead.ktuId && (
                      <div>
                        <span className="text-amber-400 block text-[10px] uppercase font-bold">KTU ID</span>
                        <span className="font-mono text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                          {activeLead.ktuId}
                        </span>
                      </div>
                    )}
                    {activeLead.swayamChapter && (
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">SWAYAM Local Chapter</span>
                        <span className="text-white font-medium">{activeLead.swayamChapter}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">College State</span>
                      <span className="text-white font-medium">{activeLead.collegeState || '—'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">College Name</span>
                      <span className="text-white font-medium">{activeLead.collegeName || '—'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">University Name</span>
                      <span className="text-white font-medium">{activeLead.universityName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Academic Level</span>
                      <span className="text-white font-medium">{activeLead.highestAcademicLevel || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Academic Area</span>
                      <span className="text-white font-medium">{activeLead.academicArea || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Study Year</span>
                      <span className="text-white font-medium">{activeLead.studyYear || '—'}</span>
                    </div>
                    {activeLead.rollNumber && (
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Roll Number</span>
                        <span className="text-white font-medium">{activeLead.rollNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Working Professional / Faculty Details */}
              {(activeLead.profession === 'Working Professional' || activeLead.profession === 'Faculty') && (
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                    {activeLead.profession} Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Organization / College</span>
                      <span className="text-white font-medium">{activeLead.organization || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Designation / Department</span>
                      <span className="text-white font-medium">{activeLead.designation || activeLead.department || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Experience</span>
                      <span className="text-white font-medium">{activeLead.yearsOfExperience || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Highest Qualification</span>
                      <span className="text-white font-medium">{activeLead.highestQualification || '—'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeLead.message && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Student Message</span>
                  <p className="text-slate-200">{activeLead.message}</p>
                </div>
              )}

              <form onSubmit={handleSaveStatus} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Update Pipeline Status</label>
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
                    <option value="Incomplete">Incomplete (Step 1 Only)</option>
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
