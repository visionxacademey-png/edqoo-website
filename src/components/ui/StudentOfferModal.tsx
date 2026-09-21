import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  User,
  Mail,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Gift,
  CheckCircle
} from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';

// Validation Schema for Student Offer Form
const studentOfferSchema = zod.object({
  name: zod
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(100, { message: 'Name is too long.' })
    .transform((val) => val.trim()),
  email: zod
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .transform((val) => val.trim().toLowerCase()),
  phone: zod
    .string()
    .min(7, { message: 'Please enter a valid mobile number.' })
    .max(16, { message: 'Phone number is too long.' })
    .regex(/^[+]?[\d\s-]{7,16}$/, { message: 'Please enter a valid phone number format.' })
    .transform((val) => val.trim()),
  collegeOrSchool: zod
    .string()
    .min(2, { message: 'College / School name is required.' })
    .max(150, { message: 'College / School name is too long.' })
    .transform((val) => val.trim())
});

type StudentOfferFormData = zod.infer<typeof studentOfferSchema>;

export const StudentOfferModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasTriggeredRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<StudentOfferFormData>({
    resolver: zodResolver(studentOfferSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      collegeOrSchool: ''
    }
  });

  // 10-Second Timer Trigger on website entry
  useEffect(() => {
    if (hasTriggeredRef.current) return;

    // Clean up any stale localStorage blocking
    try {
      localStorage.removeItem('edqoo_student_offer_submitted');
      sessionStorage.removeItem('edqoo_student_offer_dismissed');
    } catch {}

    const timer = setTimeout(() => {
      hasTriggeredRef.current = true;
      setIsOpen(true);
    }, 10000); // Exactly 10 seconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Lock body scroll when popup is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: StudentOfferFormData) => {
    setSubmitError(null);
    try {
      const res = await enquiryService.submitStudentOfferEnquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        collegeOrSchool: data.collegeOrSchool
      });

      if (res.success) {
        setIsSubmitted(true);
        reset();
      } else {
        setSubmitError(res.message || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      setSubmitError('Something went wrong. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-6 max-h-[92vh] flex flex-col text-left"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              /* Success State */
              <div className="p-8 sm:p-12 text-center space-y-5 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider inline-block">
                    Enquiry Received
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-slate-950">
                    Thank You!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Your enquiry has been submitted successfully. Our team will contact you soon with your 60% student offer details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              /* Main Offer + Form Grid Layout */
              <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
                
                {/* Left Promo Banner (Desktop) */}
                <div className="md:col-span-5 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -top-12 -left-12 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-purple-200 text-[10px] font-extrabold uppercase tracking-widest">
                      <Gift className="w-3.5 h-3.5 text-amber-300" />
                      <span>Limited Student Access</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                        60% OFF
                      </div>
                      <h2 className="text-lg sm:text-xl font-display font-extrabold text-purple-100 leading-snug">
                        Get 60% Student Offer
                      </h2>
                      <p className="text-xs text-purple-200/90 leading-relaxed">
                        Unlock exclusive benefits available for students.
                      </p>
                    </div>
                  </div>

                  {/* Student Pillars */}
                  <div className="pt-6 border-t border-white/10 space-y-2.5 text-xs text-purple-200 relative z-10">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>NIT Faculty Mentorship</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Real-World Industry Capstones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Placement Interview Support</span>
                    </div>
                  </div>
                </div>

                {/* Right Form Section */}
                <div className="md:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-center">
                  <div className="space-y-1 mb-5">
                    <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-widest block">
                      STUDENT ADVISORY
                    </span>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-slate-950">
                      Enquire Now
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fill out your details to check your student scholarship eligibility.
                    </p>
                  </div>

                  {submitError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          {...register('name')}
                          className={`w-full bg-slate-50 border ${
                            errors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                          } rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors`}
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.name && (
                        <p className="text-[10px] font-medium text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="e.g. rahul@example.com"
                          {...register('email')}
                          className={`w-full bg-slate-50 border ${
                            errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                          } rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors`}
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.email && (
                        <p className="text-[10px] font-medium text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          {...register('phone')}
                          className={`w-full bg-slate-50 border ${
                            errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                          } rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors`}
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.phone && (
                        <p className="text-[10px] font-medium text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* College / School */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        College / School <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. National Institute of Technology"
                          {...register('collegeOrSchool')}
                          className={`w-full bg-slate-50 border ${
                            errors.collegeOrSchool ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                          } rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors`}
                        />
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.collegeOrSchool && (
                        <p className="text-[10px] font-medium text-red-600">{errors.collegeOrSchool.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Enquiry</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>

              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
