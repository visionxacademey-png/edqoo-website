import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Calendar,
  Award,
  ShieldAlert,
  ArrowRight,
  Users
} from 'lucide-react';
import type { EnglishMirrorProgram } from '../../data/englishMirror';

interface EnglishMirrorProgramModalProps {
  program: EnglishMirrorProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire: (programId: string, optionHeadline?: string) => void;
}

export const EnglishMirrorProgramModal: React.FC<EnglishMirrorProgramModalProps> = ({
  program,
  isOpen,
  onClose,
  onEnquire
}) => {
  if (!isOpen || !program) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-auto z-10"
        >
          {/* Header */}
          <div className="relative z-10 px-6 pt-6 pb-4 border-b border-slate-200 flex items-start justify-between">
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#F1E8FA] text-[#6D22B5] border border-[#E0CEF5] text-[10px] font-extrabold uppercase tracking-wider">
                  {program.badge}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Partner Program &bull; English Mirror
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-950 tracking-tight">
                {program.title}
              </h3>
              <p className="text-xs text-[#6D22B5] font-semibold">
                {program.tagline}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="relative z-10 p-6 max-h-[72vh] overflow-y-auto scrollbar-thin text-left space-y-6">
            
            {/* Quick Overview Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Learning Mode</span>
                <span className="font-extrabold text-[#6D22B5] text-xs">1-to-1 Live / Voice</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Format</span>
                <span className="font-bold text-slate-900 text-xs">{program.format}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Duration</span>
                <span className="font-bold text-slate-900 text-xs">{program.duration}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Certificate</span>
                <span className="font-bold text-[#6D22B5] text-xs">{program.certificateIncluded ? 'Included (3+ Mos)' : 'Digital Access'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#6D22B5] uppercase tracking-wider">
                Program Overview
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {program.fullDescription}
              </p>
            </div>

            {/* Who is it for */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
              <Users className="w-4 h-4 text-[#6D22B5] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Target Audience:</span>
                <span className="text-slate-600 text-xs">{program.targetAudience}</span>
              </div>
            </div>

            {/* Schedule if present */}
            {program.schedule && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
                <Calendar className="w-4 h-4 text-[#6D22B5] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Batch Schedule &amp; Slots:</span>
                  <span className="text-slate-600 text-xs">{program.schedule}</span>
                </div>
              </div>
            )}

            {/* Plan Options if available */}
            {program.options && program.options.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#6D22B5] uppercase tracking-wider">
                  Available Program Options &amp; Formats
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {program.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#6D22B5] shadow-2xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#F1E8FA] text-[#6D22B5] border border-[#E0CEF5]">
                            {opt.optionName}
                          </span>
                          <span className="text-xs font-bold text-[#6D22B5]">
                            {opt.monthlyPriceFormatted}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900">
                          {opt.headline}
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          {opt.durationPerSession} &bull; {opt.sessionCount}
                        </p>

                        {/* Discrepancy Note if applicable */}
                        {opt.discrepancyNote && (
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800 flex items-start gap-2">
                            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-600" />
                            <span>{opt.discrepancyNote}</span>
                          </div>
                        )}

                        <ul className="space-y-1.5 pt-1 text-[11px] text-slate-600">
                          {opt.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-[#6D22B5] flex-shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Option specific CTA */}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEnquire(program.id, opt.headline);
                        }}
                        className="w-full mt-3 py-2 rounded-xl bg-[#6D22B5] hover:bg-[#5C1C9A] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <span>Select {opt.optionName}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Benefits List */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#6D22B5] uppercase tracking-wider">
                Full Benefits &amp; Materials Included
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {program.benefits.map((ben, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-purple-50/50 border border-purple-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6D22B5] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-[11px] leading-snug">{ben}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certification Details */}
            {program.certificateIncluded && (
              <div className="p-4 rounded-2xl bg-[#F8F4FC] border border-[#E0CEF5] flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F1E8FA] text-[#6D22B5] flex items-center justify-center flex-shrink-0 border border-[#E0CEF5]">
                  <Award className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-900 block">Professional Certification</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {program.certificateCriteria || 'Course completion credential provided for subscriptions of 3 months and above.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer CTA */}
          <div className="relative z-10 px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Admissions Status</span>
              <span className="text-sm font-extrabold text-slate-900">Enrollment Open</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors w-1/2 sm:w-auto text-center cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnquire(program.id);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#6D22B5] hover:bg-[#5C1C9A] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 w-1/2 sm:w-auto cursor-pointer"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
