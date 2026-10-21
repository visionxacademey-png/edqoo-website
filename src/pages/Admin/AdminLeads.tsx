import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquareCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit,
  Save,
  RefreshCw,
  Tag,
  GraduationCap
} from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { normalizeCategoryName } from '../../data/courses';
import type { Enquiry, EnquiryStatus } from '../../types';

// Subtle Web Audio notification chime (zero external dependencies)
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore if audio context is blocked by browser interaction policies
  }
}

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeLead, setActiveLead] = useState<Enquiry | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [statusInput, setStatusInput] = useState<EnquiryStatus>('Submitted');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [newlyArrivedIds, setNewlyArrivedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const leadsRef = useRef<Enquiry[]>([]);
  const isInitialLoadRef = useRef(true);
  const isMountedRef = useRef(true);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const syncLeads = useCallback(async (silent: boolean = true) => {
    if (!silent) {
      setIsRefreshing(true);
    }
    try {
      const data = await enquiryService.getAllEnquiries();
      if (!isMountedRef.current) return;

      // Sort newest first by submittedAt
      const sorted = [...data].sort((a, b) => {
        const timeA = new Date(a.submittedAt || 0).getTime();
        const timeB = new Date(b.submittedAt || 0).getTime();
        return timeB - timeA;
      });

      // Deduplicate by ID
      const seen = new Set<string>();
      const deduped: Enquiry[] = [];
      for (const item of sorted) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          deduped.push(item);
        }
      }

      // Check for newly arrived enquiries (only if not initial load)
      if (!isInitialLoadRef.current && leadsRef.current.length > 0) {
        const prevIdSet = new Set(leadsRef.current.map((l) => l.id));
        const newItems = deduped.filter((l) => !prevIdSet.has(l.id));

        if (newItems.length > 0) {
          // Track new IDs to show subtle visual indicator
          setNewlyArrivedIds((prev) => {
            const next = new Set(prev);
            newItems.forEach((item) => next.add(item.id));
            return next;
          });

          // Play pleasant chime
          playNotificationChime();

          // Show subtle informative toast
          const leadTitle = newItems[0].name
            ? `${newItems[0].name} (${newItems[0].program || 'Course Enquiry'})`
            : (newItems[0].program || 'New Lead');

          showToast(
            `🔔 ${newItems.length === 1 ? 'New enquiry received' : `${newItems.length} new enquiries received`}: ${leadTitle}`,
            'success'
          );

          // Auto-clear new highlight after 12 seconds
          setTimeout(() => {
            if (isMountedRef.current) {
              setNewlyArrivedIds(new Set());
            }
          }, 12000);
        }
      }

      leadsRef.current = deduped;
      setLeads(deduped);
      setLastSyncTime(new Date());
      isInitialLoadRef.current = false;
    } catch (err: any) {
      if (!silent) {
        showToast(err.message || 'Failed to fetch enquiries.', 'error');
      }
    } finally {
      if (isMountedRef.current) {
        if (!silent) setIsRefreshing(false);
        setLoading(false);
      }
    }
  }, []);

  // Polling & Visibility synchronization lifecycle
  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial fetch
    syncLeads(false);

    let intervalId: any = null;

    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          syncLeads(true);
        }
      }, 5000);
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Visibility change handler: pause polling when tab is hidden, immediately sync when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncLeads(true);
        startPolling();
      } else {
        stopPolling();
      }
    };

    // Window focus handler: sync immediately when window gains focus
    const handleWindowFocus = () => {
      syncLeads(true);
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      isMountedRef.current = false;
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [syncLeads]);

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
        syncLeads(true);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update lead.', 'error');
    }
  };


  const filteredLeads = leads.filter((lead) => {
    const isStudentOffer =
      lead.enquiryType === 'STUDENT_OFFER' ||
      lead.category === 'Student Offer' ||
      (lead.program && lead.program.toLowerCase().includes('student offer'));

    const isEnglishMirror =
      lead.enquiryType === 'ENGLISH_MIRROR' ||
      lead.category === 'English Mirror' ||
      (lead.category && lead.category.toLowerCase().includes('english mirror')) ||
      (lead.program && lead.program.toLowerCase().includes('english mirror')) ||
      (lead.details && (lead.details.partner === 'English Mirror' || lead.details.category === 'English Mirror'));

    const statusMatch =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'english_mirror'
        ? isEnglishMirror
        : selectedStatus === 'student_offer'
        ? isStudentOffer
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
      (lead.universityName && lead.universityName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.collegeOrSchool && lead.collegeOrSchool.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.collegeName && lead.collegeName.toLowerCase().includes(searchTerm.toLowerCase()));

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white font-display tracking-tight">
              Lead & Counseling Pipeline
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-[#F1E8FA]/15 text-[#6D22B5] border border-[#6D22B5]/30">
              {leads.length} Enquiries
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40"
              title="Live auto-synchronization every 5 seconds (pauses when tab is inactive)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync (5s)
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Track student consultation requests, Tools &amp; Upskills 2-step leads, counselor notes, and admissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/admin/users"
            className="px-3.5 py-2 rounded-xl bg-[#F1E8FA]/15 hover:bg-[#F1E8FA]/25 text-[#6D22B5] border border-[#6D22B5]/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Logged-In Users Telemetry →</span>
          </Link>
          <button
            onClick={() => syncLeads(false)}
            disabled={loading || isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-300 flex items-center gap-2 transition-colors disabled:opacity-50"
            title={`Last synced: ${lastSyncTime.toLocaleTimeString()}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || isRefreshing ? 'animate-spin text-[#6D22B5]' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh Leads'}</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search student, email, course, KTU ID, university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6D22B5] focus:ring-1 focus:ring-[#6D22B5] transition-all"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-black border border-neutral-800 text-neutral-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#6D22B5] focus:ring-1 focus:ring-[#6D22B5]"
          >
            <option value="all">All Enquiries &amp; Statuses</option>
            <option value="english_mirror">English Mirror Partner Enquiries</option>
            <option value="student_offer">Student Offer Enquiries (60% Off)</option>
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
      <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-xl">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <MessageSquareCheck className="w-10 h-10 text-neutral-700 mx-auto" />
            <p className="text-sm font-bold text-neutral-400">No leads found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider text-[10px] bg-black/60">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course &amp; Category</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Lead Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredLeads.map((lead) => {
                  const isStudentOffer =
                    lead.enquiryType === 'STUDENT_OFFER' ||
                    lead.category === 'Student Offer' ||
                    (lead.program && lead.program.toLowerCase().includes('student offer'));
                  const isToolsCategory =
                    (lead.category && lead.category.toLowerCase().includes('tools')) ||
                    (lead.source && lead.source.toLowerCase().includes('tools'));
                  const isIncomplete = lead.leadStatus === 'Incomplete' || lead.status === 'Incomplete';
                  const isCompleted = lead.leadStatus === 'Completed' || (lead.profession && lead.gender);
                  const isEnglishMirror =
                    lead.enquiryType === 'ENGLISH_MIRROR' ||
                    lead.category === 'English Mirror' ||
                    (lead.program && lead.program.toLowerCase().includes('english mirror')) ||
                    lead.details?.partner === 'English Mirror';

                  const isNewlyArrived = newlyArrivedIds.has(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors duration-700 ${
                        isNewlyArrived
                          ? 'bg-[#6D22B5]/15 border-l-4 border-[#6D22B5] hover:bg-[#6D22B5]/25'
                          : 'hover:bg-neutral-800/40'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{lead.name}</span>
                          {isNewlyArrived && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#6D22B5] text-white animate-pulse tracking-wider">
                              New
                            </span>
                          )}
                          {lead.profession && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-normal">
                              {lead.profession}
                            </span>
                          )}
                        </div>
                        {(lead.collegeOrSchool || lead.collegeName) && (
                          <div className="text-[10px] font-normal text-neutral-400 mt-0.5 flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-neutral-500 inline-shrink-0" />
                            <span className="truncate max-w-[200px]">{lead.collegeOrSchool || lead.collegeName}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[#6D22B5] font-semibold block">{lead.program}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isEnglishMirror ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-purple-950/80 text-purple-300 border border-purple-700/60">
                              
                              English Mirror (Partner)
                            </span>
                          ) : isStudentOffer ? (
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#F1E8FA]/15 text-[#6D22B5] border border-[#6D22B5]/30">
                              Student Offer (60% Off)
                            </span>
                          ) : isToolsCategory ? (
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#F1E8FA]/15 text-[#6D22B5] border border-[#6D22B5]/30">
                              Tools &amp; Upskills
                            </span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-medium rounded bg-neutral-800 text-neutral-400">
                              {lead.category ? normalizeCategoryName(lead.category) : 'General Track'}
                            </span>
                          )}
                          {lead.apaarId && (
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-black text-[#6D22B5] border border-[#6D22B5]/40">
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

                      <td className="py-3.5 px-4 text-neutral-300">
                        <div className="font-mono text-[11px]">{lead.phone}</div>
                        <div className="text-[10px] text-neutral-400">{lead.email}</div>
                      </td>

                      {/* Lead Status (Step 1 vs Step 2 vs Student Offer) */}
                      <td className="py-3.5 px-4">
                        {isStudentOffer ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1E8FA]/15 text-[#6D22B5] border border-[#6D22B5]/30">
                            <Tag className="w-3 h-3 text-[#6D22B5]" />
                            Student Offer
                          </span>
                        ) : isIncomplete ? (
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

                      <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
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
                              : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenLeadModal(lead)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#F1E8FA]/15 text-[#6D22B5] hover:bg-[#F1E8FA]/25 border border-[#6D22B5]/30 transition-colors inline-flex items-center gap-1"
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
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl text-left my-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 flex-shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Lead Consultation Record
                  </h3>
                  {(activeLead.enquiryType === 'STUDENT_OFFER' || activeLead.category === 'Student Offer' || (activeLead.program && activeLead.program.toLowerCase().includes('student offer'))) ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1E8FA]/15 text-[#6D22B5] border border-[#6D22B5]/30 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#6D22B5]" />
                      Student Offer (60% Off)
                    </span>
                  ) : activeLead.category ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1E8FA]/15 text-[#6D22B5] border border-[#6D22B5]/30">
                      {normalizeCategoryName(activeLead.category)}
                    </span>
                  ) : null}
                  {activeLead.leadStatus === 'Incomplete' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      Incomplete (Step 1 Only)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Lead ID: <span className="font-mono text-neutral-300">{activeLead.id}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-300 overflow-y-auto flex-1 pr-1">
              {/* Student Offer & Institution Details */}
              {(activeLead.collegeOrSchool || activeLead.enquiryType === 'STUDENT_OFFER' || activeLead.category === 'Student Offer' || (activeLead.program && activeLead.program.toLowerCase().includes('student offer'))) && (
                <div className="space-y-2 p-3.5 rounded-xl bg-black border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6D22B5] uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-[#6D22B5]" />
                    <span>60% Student Offer Lead Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Offer Applied</span>
                      <span className="font-bold text-[#6D22B5] text-sm">60% Student Discount</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">College / School</span>
                      <span className="font-bold text-white text-sm">{activeLead.collegeOrSchool || activeLead.collegeName || '—'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* English Mirror Partner Allocation Details */}
              {(activeLead.enquiryType === 'ENGLISH_MIRROR' || activeLead.category === 'English Mirror' || (activeLead.program && activeLead.program.toLowerCase().includes('english mirror')) || activeLead.details?.partner === 'English Mirror') && (
                <div className="space-y-2 p-3.5 rounded-xl bg-purple-950/40 border border-purple-700/60">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                    
                    <span>Partner Program: English Mirror</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Partner</span>
                      <span className="font-bold text-purple-300 text-sm">English Mirror</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
                      <span className="font-bold text-white text-sm">English Mirror</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Program Track</span>
                      <span className="font-bold text-white text-sm">{activeLead.program}</span>
                    </div>
                    {activeLead.details?.planOption && (
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Selected Plan</span>
                        <span className="font-bold text-purple-200 text-sm">{activeLead.details.planOption}</span>
                      </div>
                    )}
                    {activeLead.details?.duration && (
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Selected Duration</span>
                        <span className="font-bold text-white text-sm">{activeLead.details.duration}</span>
                      </div>
                    )}
                    {activeLead.details?.preferredTiming && (
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Preferred Timing Slot</span>
                        <span className="font-bold text-slate-300 text-sm">{activeLead.details.preferredTiming}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Basic Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-black border border-neutral-800">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Student Name</span>
                  <span className="font-bold text-white text-sm">{activeLead.name}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Phone Number</span>
                  <span className="font-mono text-[#6D22B5] font-bold text-sm">{activeLead.phone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Course / Program</span>
                  <span className="text-white font-medium">{activeLead.program}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="text-neutral-300">{activeLead.email}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Lead Created At</span>
                  <span className="text-neutral-300">{new Date(activeLead.submittedAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Source</span>
                  <span className="text-neutral-300">{activeLead.source || 'Direct Website Enquiry'}</span>
                </div>
              </div>

              {/* Personal Details (Step 2) */}
              {(activeLead.state || activeLead.city || activeLead.pincode || activeLead.gender || activeLead.country) && (
                <div className="space-y-2 p-3.5 rounded-xl bg-black border border-neutral-800">
                  <div className="text-[11px] font-bold text-[#6D22B5] uppercase tracking-wider">
                    Location & Contact Details
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Pincode</span>
                      <span className="text-white font-medium">{activeLead.pincode || '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">State</span>
                      <span className="text-white font-medium">{activeLead.state || '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">City / District</span>
                      <span className="text-white font-medium">{activeLead.city || '—'}</span>
                    </div>
                    {activeLead.gender && (
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase font-bold">Gender</span>
                        <span className="text-white font-medium">{activeLead.gender}</span>
                      </div>
                    )}
                    {activeLead.dateOfBirth && (
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase font-bold">Date of Birth</span>
                        <span className="text-white font-medium">{activeLead.dateOfBirth}</span>
                      </div>
                    )}
                    {activeLead.country && (
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase font-bold">Country</span>
                        <span className="text-white font-medium">{activeLead.country}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Educational & Academic Details */}
              {activeLead.profession === 'Student' && (
                <div className="space-y-2 p-3.5 rounded-xl bg-black border border-neutral-800">
                  <div className="text-[11px] font-bold text-[#6D22B5] uppercase tracking-wider">
                    Student Academic Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Highest Qualification</span>
                      <span className="text-white font-bold">{activeLead.highestQualification || '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Year of Graduation</span>
                      <span className="text-white font-medium">{activeLead.yearOfGraduation || '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">APAAR / Credit Status</span>
                      <span className="text-white font-medium">{activeLead.apaarAbcStatus || '—'}</span>
                    </div>
                    {activeLead.apaarId && (
                      <div>
                        <span className="text-[#6D22B5] block text-[10px] uppercase font-bold">APAAR / ABC ID</span>
                        <span className="font-mono text-[#6D22B5] font-bold bg-black px-2 py-0.5 rounded border border-[#6D22B5]/40">
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
                        <span className="text-neutral-500 block text-[10px] uppercase font-bold">SWAYAM Local Chapter</span>
                        <span className="text-white font-medium">{activeLead.swayamChapter}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">College State</span>
                      <span className="text-white font-medium">{activeLead.collegeState || '—'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">College Name</span>
                      <span className="text-white font-medium">{activeLead.collegeName || '—'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">University Name</span>
                      <span className="text-white font-medium">{activeLead.universityName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Academic Level</span>
                      <span className="text-white font-medium">{activeLead.highestAcademicLevel || '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Academic Area</span>
                      <span className="text-white font-medium">{activeLead.academicArea || '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Study Year</span>
                      <span className="text-white font-medium">{activeLead.studyYear || '—'}</span>
                    </div>
                    {activeLead.rollNumber && (
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase font-bold">Roll Number</span>
                        <span className="text-white font-medium">{activeLead.rollNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Working Professional / Faculty Details */}
              {(activeLead.profession === 'Working Professional' || activeLead.profession === 'Faculty') && (
                <div className="space-y-2 p-3.5 rounded-xl bg-black border border-neutral-800">
                  <div className="text-[11px] font-bold text-[#6D22B5] uppercase tracking-wider">
                    {activeLead.profession} Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Organization / College</span>
                      <span className="text-white font-medium">{activeLead.organization || '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Designation / Department</span>
                      <span className="text-white font-medium">{activeLead.designation || activeLead.department || '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Experience</span>
                      <span className="text-white font-medium">{activeLead.yearsOfExperience || '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Highest Qualification</span>
                      <span className="text-white font-medium">{activeLead.highestQualification || '—'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeLead.message && (
                <div className="p-3 rounded-xl bg-black border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold mb-1">Student Message</span>
                  <p className="text-neutral-200">{activeLead.message}</p>
                </div>
              )}

              <form onSubmit={handleSaveStatus} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Update Pipeline Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as EnquiryStatus)}
                    className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5] focus:ring-1 focus:ring-[#6D22B5]"
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
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Counselor Follow-Up Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Record notes on student interests, counseling outcome, or follow-up schedule..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5] focus:ring-1 focus:ring-[#6D22B5]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setActiveLead(null)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold hover:bg-neutral-700"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#6D22B5] hover:bg-[#853FD5] text-xs font-bold text-black flex items-center gap-1.5"
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
