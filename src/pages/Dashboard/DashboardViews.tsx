import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  MessageSquareCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  User as UserIcon,
  Phone,
  Search,
  Calendar,
  X,
  PlusCircle,
  ShieldCheck,
  Save,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEnquiry } from '../../context/EnquiryContext';
import { enquiryService } from '../../services/enquiryService';
import type { Enquiry, EnquiryStatus } from '../../types';

// ============================================================================
// 1. My Enquiries Dedicated View
// ============================================================================
export const MyEnquiries: React.FC = () => {
  const { user } = useAuth();
  const { openEnquiryModal } = useEnquiry();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    if (user?.email) {
      const data = await enquiryService.getUserEnquiries(user.email);
      setEnquiries(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, [user?.email]);

  const filtered = enquiries.filter((e) => {
    const matchesFilter = filterStatus === 'all' ? true : e.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      e.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.message && e.message.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Clock className="w-3 h-3" />
            Submitted
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      case 'Contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <PhoneCall className="w-3 h-3" />
            Contacted
          </span>
        );
      case 'Follow-up Required':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
            <Clock className="w-3 h-3" />
            Follow-up Required
          </span>
        );
      case 'Resolved':
      case 'Converted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-display font-extrabold text-slate-900">My Course Enquiries</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View submitted inquiries and advisory follow-up communications.
          </p>
        </div>
        <button
          onClick={() => openEnquiryModal()}
          className="btn-primary px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Enquiry</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-purple-600 text-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'under review', label: 'Under Review' },
            { id: 'contacted', label: 'Contacted' },
            { id: 'resolved', label: 'Resolved' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === tab.id
                  ? 'bg-purple-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-purple-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiry Cards */}
      {loading ? (
        <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-2xs">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your enquiries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center space-y-4 shadow-2xs">
          <MessageSquareCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-display font-bold text-slate-900 text-sm">No enquiries found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || filterStatus !== 'all'
              ? 'No enquiries match the selected filter.'
              : 'You have not submitted any program enquiries yet.'}
          </p>
          <button
            onClick={() => openEnquiryModal()}
            className="btn-primary px-5 py-2 text-xs font-bold rounded-lg"
          >
            Submit an Enquiry
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs hover:border-purple-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  {getStatusBadge(enquiry.status)}
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {new Date(enquiry.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-slate-900">
                  {enquiry.program}
                </h3>

                {enquiry.message && (
                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    "{enquiry.message}"
                  </p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium pt-1">
                  {enquiry.preferredContactMethod && (
                    <span>Preferred Mode: <strong>{enquiry.preferredContactMethod}</strong></span>
                  )}
                  {enquiry.preferredCallbackTime && (
                    <span>Callback: <strong>{enquiry.preferredCallbackTime}</strong></span>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 flex-shrink-0">
                <button
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block">
                  Enquiry ID: {selectedEnquiry.id}
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  Enquiry Information
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-purple-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-500">Current Status</span>
                {getStatusBadge(selectedEnquiry.status)}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Selected Course / Program
                </span>
                <span className="font-bold text-sm text-slate-900 block">
                  {selectedEnquiry.program}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold text-[10px] uppercase block">Submitted On</span>
                  <span className="font-semibold text-slate-800 block">
                    {new Date(selectedEnquiry.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold text-[10px] uppercase block">Contact Mode</span>
                  <span className="font-semibold text-slate-800 block">
                    {selectedEnquiry.preferredContactMethod || 'Phone Call'}
                  </span>
                </div>
                {selectedEnquiry.preferredCallbackTime && (
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Callback Time</span>
                    <span className="font-semibold text-slate-800 block">
                      {selectedEnquiry.preferredCallbackTime}
                    </span>
                  </div>
                )}
                {selectedEnquiry.location && (
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Location</span>
                    <span className="font-semibold text-slate-800 block">
                      {selectedEnquiry.location}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Requirement / Question
                </span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedEnquiry.message || 'No additional message.'}
                </p>
              </div>

              {selectedEnquiry.notes && (
                <div className="space-y-1 pt-1">
                  <span className="font-bold text-purple-700 uppercase tracking-wider text-[10px] block">
                    Advisor Follow-up Notes
                  </span>
                  <p className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-950 font-medium leading-relaxed">
                    {selectedEnquiry.notes}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="btn-primary px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. Settings & Profile Configuration View
// ============================================================================
interface ProfileInputs {
  name: string;
  phone: string;
}

export const Settings: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInputs>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || ''
    }
  });

  const onSubmit = async (data: ProfileInputs) => {
    updateUserProfile(data.name, data.phone);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-xl mx-auto">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-display font-extrabold text-slate-900">Profile & Account Settings</h2>
        <p className="text-xs text-slate-500">Update your contact details for counseling correspondence.</p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profile configuration saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
        {/* Input: Name */}
        <div className="space-y-1">
          <label htmlFor="settings-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="settings-name"
              {...register('name', { required: 'Name is required' })}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
            />
            <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          {errors.name && <span className="text-[10px] text-red-500 block font-medium">{errors.name.message}</span>}
        </div>

        {/* Input: Phone */}
        <div className="space-y-1">
          <label htmlFor="settings-phone" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Contact Phone Number
          </label>
          <div className="relative">
            <input
              type="text"
              id="settings-phone"
              placeholder="e.g. +91 9999999999"
              {...register('phone')}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Locked Input: Email */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Email Address (Verified)
          </label>
          <input
            type="text"
            disabled
            value={user?.email || ''}
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="btn-primary px-5 py-2.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// 3. Admin Lead Management View
// ============================================================================
export const AdminLeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeLead, setActiveLead] = useState<Enquiry | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [statusInput, setStatusInput] = useState<EnquiryStatus>('Submitted');
  const [loading, setLoading] = useState(true);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const data = await enquiryService.getAllEnquiries();
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleOpenLeadModal = (lead: Enquiry) => {
    setActiveLead(lead);
    setStatusInput(lead.status);
    setNoteInput(lead.notes || '');
    setUpdateMsg(null);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;

    const res = await enquiryService.updateEnquiryStatus(activeLead.id, statusInput, noteInput);
    if (res.success && res.enquiry) {
      setActiveLead(res.enquiry);
      setUpdateMsg('Lead status updated successfully!');
      fetchLeads();
      setTimeout(() => setUpdateMsg(null), 3000);
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
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-display font-extrabold text-slate-900">Lead & Enquiry Management</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin console to review student enquiries, track counseling calls, and record follow-up notes.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email, phone, or program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-purple-600 text-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-purple-600 text-slate-900 font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted (New)</option>
            <option value="Under Review">Under Review</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-up Required">Follow-up Required</option>
            <option value="Resolved">Resolved</option>
            <option value="Converted">Converted (Offline)</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Program</th>
                <th className="py-3.5 px-4">Contact Mode</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No leads match the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{lead.name}</span>
                      <span className="text-[11px] text-slate-500 block">{lead.email}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{lead.phone}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-semibold text-slate-900 block truncate">{lead.program}</span>
                      {lead.message && (
                        <span className="text-[10px] text-slate-400 block truncate">{lead.message}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-700 block">{lead.preferredContactMethod || 'Phone'}</span>
                      {lead.preferredCallbackTime && (
                        <span className="text-[10px] text-slate-400 block">{lead.preferredCallbackTime}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(lead.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenLeadModal(lead)}
                        className="px-3 py-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Manage Lead Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn text-left text-xs">
            <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block">
                  Lead Management
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  {activeLead.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-purple-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-6 space-y-4">
              {updateMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-semibold">
                  {updateMsg}
                </div>
              )}

              {/* Lead Details Summary */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Email</span>
                  <a href={`mailto:${activeLead.email}`} className="font-semibold text-purple-600 block hover:underline">
                    {activeLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone</span>
                  <a href={`tel:${activeLead.phone}`} className="font-semibold text-purple-600 block hover:underline">
                    {activeLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Interested Program</span>
                  <span className="font-semibold text-slate-800 block">{activeLead.program}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Submission Date</span>
                  <span className="font-semibold text-slate-800 block">
                    {new Date(activeLead.submittedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Candidate Message */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Candidate Message</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {activeLead.message || 'No additional note.'}
                </p>
              </div>

              {/* Status Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Enquiry Status
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as EnquiryStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600"
                >
                  <option value="Submitted">Submitted (New Lead)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                  <option value="Interested">Interested</option>
                  <option value="Converted">Converted (Offline Process Completed)</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Follow-up Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Follow-up Notes & Log
                </label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Record call summary, candidate expectations, or next contact schedule..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveLead(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 text-xs font-bold rounded-lg shadow-sm"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
