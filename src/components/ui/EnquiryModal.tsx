import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  Briefcase,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { useEnquiry } from '../../context/EnquiryContext';
import { enquiryService } from '../../services/enquiryService';
import { courses } from '../../data/courses';

const enquirySchema = zod.object({
  name: zod.string().min(2, { message: 'Full name is required (at least 2 characters).' }),
  email: zod.string().email({ message: 'Please provide a valid email address.' }),
  phone: zod.string().min(10, { message: 'Please provide a valid phone number (at least 10 digits).' }),
  program: zod.string().min(1, { message: 'Please select an interested program.' }),
  location: zod.string().optional(),
  experienceLevel: zod.string().optional(),
  learningMode: zod.string().optional(),
  message: zod.string().optional()
});

type EnquiryFormData = zod.infer<typeof enquirySchema>;

export const EnquiryModal: React.FC = () => {
  const { isEnquiryModalOpen, selectedProgram, closeEnquiryModal } = useEnquiry();
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      program: '',
      location: '',
      experienceLevel: '0-2 Years',
      learningMode: 'Online Interactive',
      message: ''
    }
  });

  useEffect(() => {
    if (selectedProgram) {
      setValue('program', selectedProgram);
    }
  }, [selectedProgram, setValue]);

  const handleClose = () => {
    setIsSuccess(false);
    setApiError(null);
    reset();
    closeEnquiryModal();
  };

  const onSubmit = async (data: EnquiryFormData) => {
    setApiError(null);
    try {
      const response = await enquiryService.submitEnquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        program: data.program,
        location: data.location,
        experienceLevel: data.experienceLevel,
        learningMode: data.learningMode,
        message: data.message
      });

      if (response.success) {
        setIsSuccess(true);
        reset();
      } else {
        setApiError('Unable to process enquiry. Please try again.');
      }
    } catch {
      setApiError('An unexpected network error occurred. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-deep-navy-950/70 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-deep-navy-200 overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-deep-navy-900 to-royal-blue-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-royal-blue-300 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Program Advisory</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white">
                  Request Information & Speak to an Expert
                </h3>
                <p className="text-xs text-slate-300">
                  Get program details, fee schedules, syllabus outlines, and career guidance.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-4 self-start"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {isSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2 max-w-sm mx-auto">
                    <h4 className="text-xl font-display font-bold text-deep-navy-900">
                      Enquiry Received!
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Thank you for your interest in Edqoo. A dedicated learning advisor will review your goals and reach out to you within 24 hours.
                    </p>
                  </div>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn-primary px-8 py-2.5 text-xs font-bold rounded-xl"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                  {apiError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-deep-navy-800 uppercase tracking-wider block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Alex Morgan"
                          {...register('name')}
                          className={`w-full pl-9 pr-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white transition-all ${
                            errors.name ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-600'
                          }`}
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.name && (
                        <span className="text-[10px] text-red-500 font-medium">{errors.name.message}</span>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-deep-navy-800 uppercase tracking-wider block">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="e.g. alex@example.com"
                          {...register('email')}
                          className={`w-full pl-9 pr-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white transition-all ${
                            errors.email ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-600'
                          }`}
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.email && (
                        <span className="text-[10px] text-red-500 font-medium">{errors.email.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Phone & Program Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-deep-navy-800 uppercase tracking-wider block">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="e.g. +1 555-0199"
                          {...register('phone')}
                          className={`w-full pl-9 pr-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white transition-all ${
                            errors.phone ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-600'
                          }`}
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.phone && (
                        <span className="text-[10px] text-red-500 font-medium">{errors.phone.message}</span>
                      )}
                    </div>

                    {/* Interested Program */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-deep-navy-800 uppercase tracking-wider block">
                        Interested Program <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          {...register('program')}
                          className={`w-full pl-9 pr-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white transition-all ${
                            errors.program ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-600'
                          }`}
                        >
                          <option value="">Select a Program</option>
                          {courses.map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title}
                            </option>
                          ))}
                          <option value="General Guidance / Multiple Programs">General Guidance / Multiple Programs</option>
                        </select>
                        <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.program && (
                        <span className="text-[10px] text-red-500 font-medium">{errors.program.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Experience Level & Learning Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Experience */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Experience Level (Optional)
                      </label>
                      <div className="relative">
                        <select
                          {...register('experienceLevel')}
                          className="w-full pl-9 pr-3 py-2 bg-deep-navy-50 border border-deep-navy-200 rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white focus:border-royal-blue-600"
                        >
                          <option value="College Student / Graduate">College Student / Recent Graduate</option>
                          <option value="0-2 Years">0–2 Years Professional Experience</option>
                          <option value="3-5 Years">3–5 Years Professional Experience</option>
                          <option value="5+ Years">5+ Years Professional / Leadership</option>
                        </select>
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Learning Mode */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Preferred Mode (Optional)
                      </label>
                      <div className="relative">
                        <select
                          {...register('learningMode')}
                          className="w-full pl-9 pr-3 py-2 bg-deep-navy-50 border border-deep-navy-200 rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white focus:border-royal-blue-600"
                        >
                          <option value="Online Interactive">Online Live / Interactive</option>
                          <option value="Self-Paced with Mentorship">Self-Paced with 1:1 Mentorship</option>
                          <option value="Weekend Executive Batch">Weekend Executive Batch</option>
                        </select>
                        <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Location & Optional Message */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Location / City (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. San Francisco, CA / London / Bangalore"
                          {...register('location')}
                          className="w-full pl-9 pr-3 py-2 bg-deep-navy-50 border border-deep-navy-200 rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white focus:border-royal-blue-600"
                        />
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Enquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Secondary WhatsApp option */}
              <div className="mt-5 pt-4 border-t border-deep-navy-100 flex items-center justify-between text-xs text-slate-500">
                <span>Prefer messaging directly?</span>
                <a
                  href="https://wa.me/placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
