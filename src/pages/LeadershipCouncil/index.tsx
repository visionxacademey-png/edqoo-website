import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  PlusCircle,
  Loader2
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { leadershipService } from '../../services/leadershipService';
import { useAuth } from '../../context/AuthContext';
import { LeadershipModal } from './LeadershipModal';
import type { LeadershipCouncilMember } from '../../types';

export const LeadershipCouncil: React.FC = () => {
  const [members, setMembers] = useState<LeadershipCouncilMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<LeadershipCouncilMember | null>(null);
  const { user, isAuthenticated } = useAuth();

  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const data = await leadershipService.getMembers();
        setMembers(data);
      } catch (err) {
        console.error('Failed to load leadership council:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 text-left">
      <SEO
        title="Leadership Council | Advisory & Academic Leadership"
        description="Meet the leaders and experienced professionals who contribute to our vision, strategy, academic direction, industry engagement, and organizational growth."
        canonical="/leadership-council"
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-purple-50/70 via-slate-50 to-white text-slate-950 py-16 sm:py-24 text-center relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(109,34,181,0.08),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Strategic Direction &amp; Governance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
            Leadership Council
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Meet the leaders and experienced professionals who contribute to our vision, strategy, academic direction, industry engagement, and organizational growth.
          </p>

          {isAdmin && (
            <div className="pt-2">
              <Link
                to="/admin/leadership/new"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Council Member (Admin)</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Leadership Council</span>
        </div>
      </div>

      {/* Main Members Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Loading Leadership Council...
            </span>
          </div>
        ) : members.length === 0 ? (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-black text-slate-900">
              Council Profiles Updating
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Our leadership council information is currently being updated with certified profiles. Check back shortly or reach out to our administration.
            </p>
            {isAdmin ? (
              <div className="pt-2">
                <Link
                  to="/admin/leadership/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add First Leadership Member</span>
                </Link>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                >
                  <span>Contact Administration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => {
              const photo =
                member.profileImage ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';

              return (
                <div
                  key={member.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Member Photo & Basic Details */}
                    <div className="flex items-center gap-4">
                      <img
                        src={photo}
                        alt={member.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-100 shadow-2xs flex-shrink-0 group-hover:border-purple-300 transition-colors"
                      />
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-display font-black text-slate-950 group-hover:text-purple-600 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-xs font-bold text-purple-700 leading-tight">
                          {member.designation}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {member.organization}
                        </p>
                      </div>
                    </div>

                    {/* Short Biography */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {member.shortBio}
                    </p>

                    {/* Expertise Badges */}
                    {member.expertise && member.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {member.expertise.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md"
                          >
                            {item}
                          </span>
                        ))}
                        {member.expertise.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-purple-600 font-bold">
                            +{member.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <span>View Full Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        aria-label="LinkedIn profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Leadership Member Detail Modal */}
      <LeadershipModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
};
