import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  User,
  Mail,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { enquiryService } from '../../services/enquiryService';
import { englishMirrorPrograms } from '../../data/englishMirror';

const englishMirrorSchema = zod.object({
  name: zod.string().min(2, { message: 'Please enter your full name (minimum 2 characters).' }),
  email: zod.string().email({ message: 'Please enter a valid email address.' }),
  phone: zod
    .string()
    .min(7, { message: 'Please enter a valid WhatsApp or contact phone number.' })
    .regex(/^[0-9+\s\-()]+$/, { message: 'Phone number format is invalid.' }),
  program: zod.string().min(1, { message: 'Please select an English Mirror program.' }),
  planOption: zod.string().optional(),
  durationMonths: zod.string().optional(),
  preferredTiming: zod.string().optional(),
  learningGoal: zod.string().optional(),
  message: zod.string().optional()
});

type EnglishMirrorFormData = zod.infer<typeof englishMirrorSchema>;

interface EnglishMirrorEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProgramId?: string;
  initialOptionId?: string;
  initialDuration?: number;
}

export const EnglishMirrorEnquiryModal: React.FC<EnglishMirrorEnquiryModalProps> = ({
  isOpen,
  onClose,
  initialProgramId,
  initialOptionId,
  initialDuration = 3
}) => {
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Combined list of programs prioritizing the 6 Spoken Tutorial subcategories
  const spokenPrograms = [
    '1:1 Communicative English Mastery',
    'Fluency Builder Plan',
    'Corporate English Fluency Builder',
    'Little Mirrors',
    'Executive Interview Preparation Track',
    'IELTS Intensive'
  ];

  // Find initial program or default to Fluency Builder Plan
  const defaultProg =
    englishMirrorPrograms.find((p) => p.id === initialProgramId || p.slug === initialProgramId || p.title === initialProgramId) ||
    englishMirrorPrograms[0];

  const initialProgramVal = initialProgramId || spokenPrograms[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EnglishMirrorFormData>({
    resolver: zodResolver(englishMirrorSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      program: initialProgramVal,
      planOption: initialOptionId || (defaultProg.options?.[0]?.headline || 'Standard'),
      durationMonths: initialDuration ? `${initialDuration} Months` : '3 Months (Recommended)',
      preferredTiming: 'Flexible / Evening',
      learningGoal: 'Eliminate spoken hesitation & improve career communication',
      message: ''
    }
  });

  const selectedProgramTitle = watch('program');
  const selectedPlanOption = watch('planOption');
  const activeProgObj =
    englishMirrorPrograms.find(
      (p) =>
        p.title === selectedProgramTitle ||
        p.title.toLowerCase().includes((selectedProgramTitle || '').toLowerCase()) ||
        (selectedProgramTitle || '').toLowerCase().includes(p.title.toLowerCase())
    ) || defaultProg;

  useEffect(() => {
    if (initialProgramId) {
      setValue('program', initialProgramId);
      const match = englishMirrorPrograms.find(
        (p) =>
          p.id === initialProgramId ||
          p.slug === initialProgramId ||
          p.title === initialProgramId ||
          p.title.toLowerCase().includes(initialProgramId.toLowerCase()) ||
          initialProgramId.toLowerCase().includes(p.title.toLowerCase())
      );
      if (match && match.options && match.options.length > 0) {
        setValue('planOption', match.options[0].headline);
      }
    }
    if (user) {
      if (user.name) setValue('name', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
    }
  }, [initialProgramId, user, setValue]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setApiError(null);
      reset({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        program: defaultProg.title,
        planOption: defaultProg.options?.[0]?.headline || 'Standard',
        durationMonths: '3 Months (Recommended)',
        preferredTiming: 'Flexible / Evening',
        learningGoal: 'Eliminate spoken hesitation & improve career communication',
        message: ''
      });
    }, 300);
  };

  const onSubmit = async (data: EnglishMirrorFormData) => {
    setApiError(null);
    try {
      const response = await enquiryService.submitEnquiry({
        userId: user?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        program: `${data.program}${data.planOption ? ` (${data.planOption})` : ''}`,
        preferredContactMethod: 'WhatsApp / Phone',
        preferredCallbackTime: data.preferredTiming,
        experienceLevel: data.learningGoal,
        message: data.message
          ? `${data.message} | Plan: ${data.planOption || 'Default'} | Duration: ${data.durationMonths}`
          : `English Mirror enquiry for ${data.program} [${data.durationMonths || '3 Months'}]`
      } as any);

      if (response.success) {
        setIsSuccess(true);
      } else {
        setApiError(response.message || 'Unable to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      setApiError(err?.message || 'An unexpected network error occurred. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Clean neutral backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Container: Clean Whitish / Light Theme */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white border border-[#E5E7EB] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.10)] overflow-hidden text-[#171717] my-auto z-10"
        >
          {/* Modal Header */}
          <div className="px-6 pt-6 pb-4 border-b border-[#E5E7EB] flex items-start justify-between bg-white">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#6D28D9] border border-purple-200 text-[10px] font-extrabold uppercase tracking-wider">
                  Official Partner Program
                </span>
                <span className="text-[11px] text-[#6B7280] font-medium">
                  Edqoo &times; English Mirror
                </span>
              </div>
              <div className="flex items-center gap-3.5 pt-0.5">
                <div className="h-10 px-2.5 py-1 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <img
                    src="/englishclass.png"
                    alt="English Mirror"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-display font-extrabold text-[#171717] tracking-tight">
                    Start Your Spoken English Journey
                  </h3>
                  <p className="text-xs text-[#6B7280] font-normal">
                    Book a free 1-to-1 consultation &amp; fluency roadmap
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#171717] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto text-left [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#F3F4F6] [&::-webkit-scrollbar-thumb]:bg-[#D1D5DB] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#9CA3AF]">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 px-4 text-center space-y-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xl font-display font-extrabold text-[#171717]">
                    Enquiry Received Successfully!
                  </h4>
                  <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
                    Thank you! An English Mirror communication advisor will reach out to you via WhatsApp / Phone to conduct your initial diagnostic assessment and share batch availability.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] max-w-md mx-auto text-left space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#171717]">
                    <span className="text-[#6B7280]">Selected Program:</span>
                    <span className="font-bold text-[#171717]">{watch('program')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#171717]">
                    <span className="text-[#6B7280]">Learning Track:</span>
                    <span className="font-bold text-[#171717]">{watch('planOption') || '1-to-1 Live'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#171717]">
                    <span className="text-[#6B7280]">Duration:</span>
                    <span className="font-bold text-[#171717]">{watch('durationMonths')}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                  <a
                    href="https://wa.me/919074450935?text=Hello%20English%20Mirror%20Team%2C%20I%20just%20submitted%20an%20enquiry%20for%20the%20English%20Mirror%20program%20on%20Edqoo."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Quick Chat on WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {apiError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                    <span>{apiError}</span>
                  </div>
                )}

                {/* Candidate Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#171717] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      {...register('name')}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs text-[#171717] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all ${
                        errors.name ? 'border-rose-400' : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[10px] text-rose-500 font-semibold">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#171717] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span>Phone / WhatsApp Number *</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register('phone')}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs text-[#171717] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all ${
                        errors.phone ? 'border-rose-400' : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-rose-500 font-semibold">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#171717] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs text-[#171717] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all ${
                      errors.email ? 'border-rose-400' : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-rose-500 font-semibold">{errors.email.message}</p>
                  )}
                </div>

                {/* Program Dropdown */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#171717] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>English Mirror Program *</span>
                  </label>
                  <select
                    {...register('program')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] text-xs text-[#171717] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all"
                  >
                    {spokenPrograms.map((title) => (
                      <option key={title} value={title} className="text-[#171717] bg-white">
                        {title}
                      </option>
                    ))}
                    {englishMirrorPrograms
                      .filter((p) => !spokenPrograms.includes(p.title))
                      .map((prog) => (
                        <option key={prog.id} value={prog.title} className="text-[#171717] bg-white">
                          {prog.title}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Specific Plan Option Cards */}
                {activeProgObj.options && activeProgObj.options.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#171717] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span>Plan Option / Daily Practice Format</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeProgObj.options.map((opt) => {
                        const isSelected = selectedPlanOption === opt.headline;
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#FAF5FF] border-[#7C3AED] shadow-2xs'
                                : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F8F9FC]'
                            }`}
                          >
                            <input
                              type="radio"
                              value={opt.headline}
                              {...register('planOption')}
                              className="mt-0.5 text-[#7C3AED] focus:ring-[#7C3AED] accent-[#7C3AED] cursor-pointer"
                            />
                            <div className="text-[11px] leading-tight space-y-0.5">
                              <span className="font-bold text-[#171717] block">{opt.optionName}</span>
                              <span className="text-[#6D28D9] font-semibold block">{opt.headline}</span>
                              <span className="text-[10px] text-[#6B7280] font-medium block">{opt.durationPerSession || '1-to-1 Live Coaching'}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Duration & Preferred Schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#171717] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span>Intended Duration</span>
                    </label>
                    <select
                      {...register('durationMonths')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] text-xs text-[#171717] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all"
                    >
                      <option value="1 Month">1 Month</option>
                      <option value="2 Months">2 Months</option>
                      <option value="3 Months (Recommended)">3 Months (Certificate Included)</option>
                      <option value="6 Months">6 Months (Save More)</option>
                      <option value="9 Months">9 Months</option>
                      <option value="12 Months">12 Months (Maximum Fluency)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#171717] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span>Preferred Schedule</span>
                    </label>
                    <select
                      {...register('preferredTiming')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] text-xs text-[#171717] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all"
                    >
                      <option value="Morning (7 AM - 11 AM)">Morning (7 AM - 11 AM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (5 PM - 9 PM)">Evening (5 PM - 9 PM)</option>
                      <option value="Flexible / Weekend Slots">Flexible / Any Slot</option>
                    </select>
                  </div>
                </div>

                {/* Goals & Note Textarea */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#171717] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>Your Primary Goal / Note (Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. I hesitate while speaking in meetings, want to prepare for an interview, or need IELTS Band 7.5..."
                    {...register('message')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] text-xs text-[#171717] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all resize-none"
                  />
                </div>

                {/* Privacy Assurance Box */}
                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-start sm:items-center gap-2.5 text-[11px] text-[#4B5563]">
                  <ShieldCheck className="w-4 h-4 text-[#6D28D9] flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>
                    Your contact information is strictly private and used solely for your 1:1 speaking trainer allocation.
                  </span>
                </div>

                {/* Submit CTA & Certificate Note */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-[#6B7280] flex items-center gap-1.5 font-medium">
                    <Award className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                    <span>3+ Months plans include Certificate</span>
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-xs shadow-xs transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Enquire Now</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
