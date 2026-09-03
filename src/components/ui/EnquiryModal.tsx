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
  Briefcase,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Send,
  Clock,
  Radio
} from 'lucide-react';
import { courses } from '../../data/courses';
import { enquiryService } from '../../services/enquiryService';
import { useEnquiry } from '../../context/EnquiryContext';
import { useAuth } from '../../context/AuthContext';

const enquirySchema = zod.object({
  name: zod.string().min(2, { message: 'Please enter your full name (minimum 2 characters).' }),
  email: zod.string().email({ message: 'Please enter a valid email address.' }),
  phone: zod
    .string()
    .min(7, { message: 'Please enter a valid contact phone number.' })
    .regex(/^[0-9+\s\-()]+$/, { message: 'Phone number format is invalid.' }),
  program: zod.string().min(1, { message: 'Please select an interested program.' }),
  message: zod.string().min(5, { message: 'Please enter a brief note or your learning requirement (min 5 characters).' }),
  preferredContactMethod: zod.string().optional(),
  preferredCallbackTime: zod.string().optional(),
  experienceLevel: zod.string().optional(),
  location: zod.string().optional()
});

type EnquiryFormData = zod.infer<typeof enquirySchema>;

export const EnquiryModal: React.FC = () => {
  const { isEnquiryModalOpen, selectedProgram, closeEnquiryModal } = useEnquiry();
  const { user } = useAuth();
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
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      experienceLevel: 'College Student / Recent Graduate',
      preferredContactMethod: 'Phone Call',
      preferredCallbackTime: 'Afternoon (1 PM - 5 PM)',
      program: selectedProgram || '',
      message: ''
    }
  });

  // Sync selected program and user details
  useEffect(() => {
    if (selectedProgram) {
      setValue('program', selectedProgram);
    }
    if (user) {
      if (user.name) setValue('name', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
    }
  }, [selectedProgram, user, setValue]);

  const handleClose = () => {
    closeEnquiryModal();
    setTimeout(() => {
      setIsSuccess(false);
      setApiError(null);
      reset({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        experienceLevel: 'College Student / Recent Graduate',
        preferredContactMethod: 'Phone Call',
        preferredCallbackTime: 'Afternoon (1 PM - 5 PM)',
        program: '',
        message: ''
      });
    }, 300);
  };

  const onSubmit = async (data: EnquiryFormData) => {
    setApiError(null);
    try {
      const response = await enquiryService.submitEnquiry({
        userId: user?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        program: data.program,
        message: data.message,
        preferredContactMethod: data.preferredContactMethod,
        preferredCallbackTime: data.preferredCallbackTime,
        experienceLevel: data.experienceLevel,
        location: data.location
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 text-white px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-purple-100 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  <span>Course Enquiry & Advisory</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white">
                  Request Course Details & Callback
                </h3>
                <p className="text-xs text-purple-100">
                  Connect with our academic advisors for batch schedules, fee structure, and syllabus information.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors ml-4 self-start"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {isSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-display font-bold text-slate-900">
                      Thank you for your enquiry!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Our team will review your request and get in touch with you shortly with detailed course information, schedule options, and counseling guidance.
                    </p>
                  </div>
                  <div className="pt-3">
                    <button
                      onClick={handleClose}
                      className="btn-primary px-6 py-2.5 text-xs font-bold rounded-xl shadow-md"
                    >
                      Close & Return to Website
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                  {apiError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Name & Email Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Alex Morgan"
                          {...register('name')}
                          className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                            errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                          }`}
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.name && (
                        <span className="text-[10px] text-red-500 font-medium">{errors.name.message}</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="e.g. alex@example.com"
                          {...register('email')}
                          className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                            errors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                          }`}
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.email && (
                        <span className="text-[10px] text-red-500 font-medium">{errors.email.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Phone & Program Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="e.g. +91 9999999999"
                          {...register('phone')}
                          className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                            errors.phone ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
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
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Interested Program <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          {...register('program')}
                          className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                            errors.program ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                          }`}
                        >
                          <option value="">Select a Program</option>
                          {courses.map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title} ({c.category})
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

                  {/* Preferred Contact Method & Preferred Callback Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Preferred Contact Method
                      </label>
                      <div className="relative">
                        <select
                          {...register('preferredContactMethod')}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                        >
                          <option value="Phone Call">Phone Call</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Email">Email</option>
                        </select>
                        <Radio className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Preferred Callback Time
                      </label>
                      <div className="relative">
                        <select
                          {...register('preferredCallbackTime')}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                        >
                          <option value="Morning (9 AM - 1 PM)">Morning (9 AM – 1 PM)</option>
                          <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM – 5 PM)</option>
                          <option value="Evening (5 PM - 8 PM)">Evening (5 PM – 8 PM)</option>
                          <option value="Anytime">Anytime during business hours</option>
                        </select>
                        <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Experience Level & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Background / Experience (Optional)
                      </label>
                      <div className="relative">
                        <select
                          {...register('experienceLevel')}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                        >
                          <option value="College Student / Recent Graduate">College Student / Recent Graduate</option>
                          <option value="0-2 Years IT/Tech Experience">0–2 Years IT / Tech Experience</option>
                          <option value="3-5 Years Professional Experience">3–5 Years Professional Experience</option>
                          <option value="5+ Years Senior / Leadership">5+ Years Senior / Leadership</option>
                          <option value="Non-Tech Career Switcher">Non-Tech / Career Switcher</option>
                        </select>
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Location / City (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. San Francisco / London / Delhi"
                          {...register('location')}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                        />
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Message / Requirement */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Message / Specific Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us what you are looking for (e.g. batch timings, syllabus questions, group training, corporate fee schedule)..."
                      {...register('message')}
                      className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                        errors.message ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                      }`}
                    />
                    {errors.message && (
                      <span className="text-[10px] text-red-500 font-medium">{errors.message.message}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Request...</span>
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

              {/* Direct messaging option */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Prefer immediate messaging?</span>
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
