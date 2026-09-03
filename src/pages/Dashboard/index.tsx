import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquareCheck,
  Clock,
  CheckCircle2,
  PhoneCall,
  User,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MessageCircle,
  X,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEnquiry } from '../../context/EnquiryContext';
import { enquiryService } from '../../services/enquiryService';
import type { Enquiry, EnquiryStatus } from '../../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { openEnquiryModal } = useEnquiry();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
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

  // Status Badge Helper
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

  const totalSubmitted = enquiries.length;
  const activeReview = enquiries.filter((e) => ['Submitted', 'Under Review'].includes(e.status)).length;
  const inContact = enquiries.filter((e) => ['Contacted', 'Follow-up Required'].includes(e.status)).length;
  const resolvedCount = enquiries.filter((e) => ['Resolved', 'Converted', 'Closed'].includes(e.status)).length;

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-0.5 bg-white/20 border border-white/30 text-white text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-xs">
              User Profile & Enquiries
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm max-w-xl leading-relaxed">
            Manage your profile details and track the status of your submitted course enquiries and counselor follow-ups.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 flex-shrink-0">
          <button
            onClick={() => openEnquiryModal()}
            className="btn-primary bg-white text-purple-900 border-white hover:bg-purple-50 hover:text-purple-950 px-5 py-3 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4 text-purple-700" />
            <span>Submit New Enquiry</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0">
            <MessageSquareCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Enquiries
            </span>
            <span className="text-2xl font-display font-extrabold text-slate-900 block mt-0.5">
              {totalSubmitted}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Under Review
            </span>
            <span className="text-2xl font-display font-extrabold text-slate-900 block mt-0.5">
              {activeReview}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Contacted / Active
            </span>
            <span className="text-2xl font-display font-extrabold text-slate-900 block mt-0.5">
              {inContact}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Resolved / Followed Up
            </span>
            <span className="text-2xl font-display font-extrabold text-slate-900 block mt-0.5">
              {resolvedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: My Enquiries (8 cols) vs Profile Card & Quick Contact (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: My Enquiries List (8 cols) */}
        <section className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                My Submitted Enquiries
              </h3>
              <p className="text-xs text-slate-500">
                Track status updates and follow-up notes from our education advisors.
              </p>
            </div>
            <button
              onClick={fetchEnquiries}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 p-10 rounded-2xl text-center space-y-2 shadow-2xs">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Loading your enquiries...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center space-y-4 shadow-2xs">
              <MessageSquareCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-display font-bold text-slate-900 text-sm">
                No course enquiries submitted yet
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Explore our Cybersecurity and Data Science programs to submit an enquiry or request a counseling callback.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link to="/courses" className="btn-primary px-5 py-2.5 text-xs font-bold rounded-lg shadow-sm">
                  Explore Programs
                </Link>
                <button
                  onClick={() => openEnquiryModal()}
                  className="btn-secondary px-5 py-2.5 text-xs font-bold rounded-lg"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {enquiries.map((enquiry) => (
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

                    <h4 className="font-display font-bold text-sm text-slate-900">
                      {enquiry.program}
                    </h4>

                    {enquiry.message && (
                      <p className="text-xs text-slate-500 line-clamp-1 italic">
                        "{enquiry.message}"
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium pt-1">
                      {enquiry.preferredContactMethod && (
                        <span>Mode: <strong>{enquiry.preferredContactMethod}</strong></span>
                      )}
                      {enquiry.preferredCallbackTime && (
                        <span>Callback: <strong>{enquiry.preferredCallbackTime}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 flex-shrink-0">
                    <button
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right: Profile Info & Support Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                Profile Information
              </h3>
              <Link
                to="/dashboard/settings"
                className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
              >
                Edit Profile
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Full Name
                </span>
                <span className="font-semibold text-slate-900 block mt-0.5">{user?.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Email Address
                </span>
                <span className="font-semibold text-slate-900 block mt-0.5">{user?.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Contact Phone
                </span>
                <span className="font-semibold text-slate-900 block mt-0.5">{user?.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Account Type
                </span>
                <span className="font-semibold text-purple-700 block mt-0.5 capitalize">
                  {user?.role === 'admin' ? 'Staff / Lead Manager' : 'Student / Candidate'}
                </span>
              </div>
            </div>
          </div>

          {/* Direct Support Card */}
          <div className="bg-gradient-to-br from-purple-50/70 to-slate-50 border border-purple-200/80 p-6 rounded-2xl shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-display font-bold text-sm text-slate-900">
                Need Immediate Help?
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our academic counselors are available on WhatsApp and Phone for prompt assistance with program curriculums and admission queries.
            </p>
            <div className="space-y-2 pt-1">
              <a
                href="https://wa.me/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                to="/contact"
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 block text-center"
              >
                <PhoneCall className="w-4 h-4 text-purple-600" />
                <span>Contact Support Page</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* View Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block">
                  Enquiry Reference: {selectedEnquiry.id}
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  Enquiry Details
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
                  Interested Program
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
                  <span className="text-slate-400 font-bold text-[10px] uppercase block">Preferred Mode</span>
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
                {selectedEnquiry.experienceLevel && (
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Background</span>
                    <span className="font-semibold text-slate-800 block">
                      {selectedEnquiry.experienceLevel}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Submitted Message / Requirement
                </span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedEnquiry.message || 'No additional note provided.'}
                </p>
              </div>

              {selectedEnquiry.notes && (
                <div className="space-y-1 pt-1">
                  <span className="font-bold text-purple-700 uppercase tracking-wider text-[10px] block">
                    Advisor Follow-up Note
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
