import React from 'react';
import {
  X,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  ExternalLink,
  Globe,
  Mail,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import type { LeadershipCouncilMember } from '../../types';

interface LeadershipModalProps {
  member: LeadershipCouncilMember | null;
  onClose: () => void;
}

export const LeadershipModal: React.FC<LeadershipModalProps> = ({ member, onClose }) => {
  if (!member) return null;

  const photo =
    member.profileImage ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-left">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto border border-slate-200 z-10 flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Leadership Council Member
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Profile Intro */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-100 pb-6">
            <img
              src={photo}
              alt={member.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-purple-100 shadow-sm flex-shrink-0"
            />
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950">
                {member.name}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-purple-700">
                {member.designation}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{member.organization}</span>
              </div>

              {/* Social / Professional Links */}
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary / Detailed Bio */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Professional Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {member.detailedBio || member.shortBio}
            </p>
          </div>

          {/* Areas of Expertise */}
          {member.expertise && member.expertise.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Areas of Expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {member.expertise.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-purple-50 text-purple-800 text-xs font-semibold rounded-lg border border-purple-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Educational Qualifications (Only if provided) */}
          {member.qualification && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                <span>Educational Qualifications</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {member.qualification}
              </p>
            </div>
          )}

          {/* Professional Experience (Only if provided) */}
          {member.experience && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                <span>Professional Experience</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {member.experience}
              </p>
            </div>
          )}

          {/* Leadership Experience (Only if provided) */}
          {member.leadershipExperience && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Leadership Experience</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {member.leadershipExperience}
              </p>
            </div>
          )}

          {/* Industry Contributions & Achievements (Only if provided) */}
          {member.achievements && member.achievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>Industry Contributions &amp; Achievements</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {member.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Publications / Research (Only if provided) */}
          {member.publications && member.publications.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>Publications &amp; Research</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {member.publications.map((pub, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{pub}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
