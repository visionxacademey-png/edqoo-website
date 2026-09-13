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
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  ArrowRight,
  GraduationCap,
  IdCard
} from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { useAuth } from '../../context/AuthContext';
import type { Enquiry } from '../../types';

// Step 1 Validation Schema: Name, Email, Phone
const step1Schema = zod.object({
  name: zod.string().min(2, { message: 'Please enter your full name (minimum 2 characters).' }),
  email: zod.string().email({ message: 'Please enter a valid email address.' }),
  phone: zod
    .string()
    .min(7, { message: 'Please enter a valid phone number.' })
    .regex(/^[0-9+\s\-()]+$/, { message: 'Phone number format is invalid.' })
});

type Step1FormData = zod.infer<typeof step1Schema>;

// Step 2 Validation Schema
const step2Schema = zod.object({
  name: zod.string().min(2, { message: 'Full name is required.' }),
  email: zod.string().email({ message: 'Valid email is required.' }),
  phone: zod.string().min(7, { message: 'Phone number is required.' }),
  pincode: zod.string().min(3, { message: 'Please enter a valid pincode / postal code.' }),
  state: zod.string().min(1, { message: 'Please select or enter your state.' }),
  city: zod.string().min(1, { message: 'Please enter your city or district.' }),
  
  // Professional & Educational
  profession: zod.string().min(1, { message: 'Please select your profession.' }),
  highestQualification: zod.string().optional(),
  yearOfGraduation: zod.string().optional(),
  apaarAbcStatus: zod.string().optional(),
  ktuId: zod.string().optional(),
  collegeState: zod.string().optional(),
  collegeName: zod.string().optional(),
  universityName: zod.string().optional(),
  rollNumber: zod.string().optional(),
  highestAcademicLevel: zod.string().optional(),
  academicArea: zod.string().optional(),
  studyYear: zod.string().optional(),

  // Working / Faculty specific
  organization: zod.string().optional(),
  designation: zod.string().optional(),
  yearsOfExperience: zod.string().optional(),
  department: zod.string().optional(),
  otherProfessionDetails: zod.string().optional()
}).superRefine((data, ctx) => {
  if (data.profession === 'Student') {
    if (!data.highestQualification || data.highestQualification === 'Select') {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['highestQualification'],
        message: 'Please select your highest qualification.'
      });
    }
    if (!data.yearOfGraduation || data.yearOfGraduation === 'Select') {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['yearOfGraduation'],
        message: 'Please select your graduation year.'
      });
    }
    if (!data.apaarAbcStatus || data.apaarAbcStatus === 'Select') {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['apaarAbcStatus'],
        message: 'Please select Academic Bank of Credits / KTU status.'
      });
    }
    if (data.apaarAbcStatus === 'I have KTU ID' && (!data.ktuId || data.ktuId.trim().length === 0)) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['ktuId'],
        message: 'Please enter your KTU ID.'
      });
    }
    if (!data.collegeState || data.collegeState === 'Select') {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['collegeState'],
        message: 'Please select college state.'
      });
    }
    if (!data.collegeName || data.collegeName.trim().length === 0) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['collegeName'],
        message: 'Please enter your college name.'
      });
    }
    if (!data.universityName || data.universityName.trim().length === 0) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['universityName'],
        message: 'Please enter university name.'
      });
    }
    if (!data.highestAcademicLevel || data.highestAcademicLevel === 'Select') {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['highestAcademicLevel'],
        message: 'Please select highest academic level.'
      });
    }
    if (!data.academicArea || data.academicArea === 'Select') {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['academicArea'],
        message: 'Please select your academic area.'
      });
    }
    if (!data.studyYear || data.studyYear === 'Select') {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['studyYear'],
        message: 'Please select your study year.'
      });
    }
  } else if (data.profession === 'Working Professional') {
    if (!data.organization || data.organization.trim().length === 0) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['organization'],
        message: 'Please enter company/organization name.'
      });
    }
    if (!data.designation || data.designation.trim().length === 0) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['designation'],
        message: 'Please enter current designation.'
      });
    }
  } else if (data.profession === 'Faculty') {
    if (!data.organization || data.organization.trim().length === 0) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['organization'],
        message: 'Please enter institution name.'
      });
    }
  }
});

type Step2FormData = zod.infer<typeof step2Schema>;

interface ToolsUpskillsEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
  courseId?: string;
  category?: string;
}

const INDIAN_STATES = [
  'Kerala',
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Andhra Pradesh',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Bihar',
  'Odisha',
  'Assam',
  'Goa',
  'Other'
];

const POPULAR_UNIVERSITIES = [
  'APJ Abdul Kalam Technological University (KTU)',
  'University of Calicut',
  'Mahatma Gandhi University (MGU)',
  'University of Kerala',
  'Cochin University of Science and Technology (CUSAT)',
  'Anna University',
  'Visvesvaraya Technological University (VTU)',
  'University of Mumbai',
  'University of Delhi',
  'Jawaharlal Nehru Technological University (JNTU)',
  'Kannur University',
  'Other University / Autonomous'
];

export const ToolsUpskillsEnquiryModal: React.FC<ToolsUpskillsEnquiryModalProps> = ({
  isOpen,
  onClose,
  programTitle,
  courseId,
  category = 'Tools & Upskills'
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Step 1 Form
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    setValue: setValueStep1,
    reset: resetStep1,
    formState: { errors: errorsStep1, isSubmitting: isSubmittingStep1 }
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  // Step 2 Form
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    setValue: setValueStep2,
    watch: watchStep2,
    reset: resetStep2,
    formState: { errors: errorsStep2, isSubmitting: isSubmittingStep2 }
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      pincode: '',
      state: 'Kerala',
      city: '',
      profession: 'Student',
      highestQualification: 'Engineering B.Tech',
      yearOfGraduation: '2026',
      apaarAbcStatus: 'I have KTU ID',
      ktuId: '',
      collegeState: 'Kerala',
      collegeName: '',
      universityName: 'APJ Abdul Kalam Technological University (KTU)',
      rollNumber: '',
      highestAcademicLevel: 'Undergraduate',
      academicArea: 'Computer Science & IT',
      studyYear: '3rd Year',
      organization: '',
      designation: '',
      yearsOfExperience: '1-3 Years',
      department: ''
    }
  });

  const selectedProfession = watchStep2('profession');
  const selectedApaarStatus = watchStep2('apaarAbcStatus');

  // Sync auth user details when available
  useEffect(() => {
    if (user) {
      if (user.name) {
        setValueStep1('name', user.name);
        setValueStep2('name', user.name);
      }
      if (user.email) {
        setValueStep1('email', user.email);
        setValueStep2('email', user.email);
      }
      if (user.phone) {
        setValueStep1('phone', user.phone);
        setValueStep2('phone', user.phone);
      }
    }
  }, [user, setValueStep1, setValueStep2]);

  const handleModalClose = () => {
    onClose();
    setTimeout(() => {
      setCurrentStep(1);
      setIsSuccess(false);
      setApiError(null);
      setCreatedLeadId(null);
      resetStep1({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
      });
      resetStep2();
    }, 300);
  };

  // STEP 1 SUBMISSION: Instantly creates lead in Admin Panel with status = 'Incomplete'
  const onStep1Submit = async (data: Step1FormData) => {
    setApiError(null);
    try {
      const res = await enquiryService.submitStep1Lead({
        userId: user?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        program: programTitle || 'Tools and Upskills Track',
        courseId: courseId || '',
        category: category || 'Tools & Upskills',
        source: 'Tools & Upskills Enquire Now'
      });

      if (res.success && res.enquiry) {
        setCreatedLeadId(res.enquiry.id);
        // Pre-populate Step 2 with verified Step 1 values
        setValueStep2('name', data.name);
        setValueStep2('email', data.email);
        setValueStep2('phone', data.phone);
        // Move to Step 2 smoothly
        setCurrentStep(2);
      } else {
        setApiError('Unable to save contact details. Please try again.');
      }
    } catch {
      setApiError('A network error occurred while connecting to the server. Please try again.');
    }
  };

  // STEP 2 SUBMISSION: Updates the SAME lead record with status = 'Completed'
  const onStep2Submit = async (data: Step2FormData) => {
    if (!createdLeadId) {
      setApiError('Lead session expired. Please start from Step 1.');
      setCurrentStep(1);
      return;
    }

    setApiError(null);
    try {
      const updatePayload: Partial<Enquiry> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        program: programTitle || 'Tools and Upskills Track',
        courseId: courseId || '',
        category: category || 'Tools & Upskills',
        pincode: data.pincode,
        state: data.state,
        city: data.city,
        profession: data.profession,
        highestQualification: data.highestQualification,
        yearOfGraduation: data.yearOfGraduation,
        apaarAbcStatus: data.apaarAbcStatus,
        ktuId: data.apaarAbcStatus === 'I have KTU ID' ? data.ktuId : '',
        collegeState: data.collegeState,
        collegeName: data.collegeName,
        universityName: data.universityName,
        rollNumber: data.rollNumber,
        highestAcademicLevel: data.highestAcademicLevel,
        academicArea: data.academicArea,
        studyYear: data.studyYear,
        organization: data.organization,
        designation: data.designation,
        yearsOfExperience: data.yearsOfExperience,
        department: data.department
      };

      const res = await enquiryService.completeStep2Lead(createdLeadId, updatePayload);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setApiError('Unable to finalize your enquiry. Please review the details and retry.');
      }
    } catch {
      setApiError('A network error occurred while submitting your enquiry.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleModalClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`relative w-full ${
              currentStep === 1 ? 'max-w-md' : 'max-w-3xl'
            } bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-6 max-h-[92vh] flex flex-col transition-all duration-300`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 text-white px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between flex-shrink-0 border-b border-purple-900/40">
              <div className="space-y-1 text-left flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1 bg-purple-900/60 px-2 py-0.5 rounded-md border border-purple-500/30 text-[10px]">
                    <Sparkles className="w-3 h-3 text-purple-300" />
                    Tools & Upskills Track
                  </span>
                  <span className="text-[11px] text-purple-200 font-semibold hidden sm:inline">
                    {currentStep === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-display font-bold text-white truncate">
                  Enquire Now: {programTitle || 'Tools & Upskills Program'}
                </h3>

                <p className="text-xs text-purple-100/90 leading-snug">
                  {currentStep === 1
                    ? "Step 1: Let's get your contact details"
                    : 'Step 2: Tell us a little more about yourself'}
                </p>
              </div>

              <button
                onClick={handleModalClose}
                className="p-1.5 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar Indicator */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 sm:px-6 py-2 flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    currentStep === 1
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {currentStep === 2 ? '✓' : '1'}
                </span>
                <span className={currentStep === 1 ? 'text-purple-900 font-bold' : 'text-slate-600'}>
                  Contact Details
                </span>
              </div>

              <div className="w-8 sm:w-16 h-0.5 bg-slate-300 rounded-full mx-2" />

              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    currentStep === 2
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  2
                </span>
                <span className={currentStep === 2 ? 'text-purple-900 font-bold' : 'text-slate-500'}>
                  Educational & Professional
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
              {isSuccess ? (
                /* Success View */
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-display font-bold text-slate-900">
                      Enquiry Submitted Successfully!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for submitting your detailed enquiry for <strong className="text-purple-800">{programTitle}</strong>. Our academic team has recorded your details and an advisor will contact you shortly.
                    </p>
                  </div>
                  <div className="pt-3">
                    <button
                      onClick={handleModalClose}
                      className="btn-primary px-6 py-2.5 text-xs font-bold rounded-xl shadow-md"
                    >
                      Close & Return to Program
                    </button>
                  </div>
                </div>
              ) : currentStep === 1 ? (
                /* STEP 1: Simple Contact Info Form */
                <form onSubmit={handleSubmitStep1(onStep1Submit)} className="space-y-4 text-left">
                  {apiError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Course Badge */}
                  <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-100 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-600 text-white">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                        Selected Program
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {programTitle || 'Tools and Upskills Master Track'}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        {...registerStep1('name')}
                        className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                          errorsStep1.name ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                        }`}
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errorsStep1.name && (
                      <span className="text-[10px] text-red-500 font-medium">{errorsStep1.name.message}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your active email address"
                        {...registerStep1('email')}
                        className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                          errorsStep1.email ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                        }`}
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errorsStep1.email && (
                      <span className="text-[10px] text-red-500 font-medium">{errorsStep1.email.message}</span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="e.g. +91 90744 50935"
                        {...registerStep1('phone')}
                        className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                          errorsStep1.phone ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                        }`}
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errorsStep1.phone && (
                      <span className="text-[10px] text-red-500 font-medium">{errorsStep1.phone.message}</span>
                    )}
                  </div>

                  {/* Next Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmittingStep1}
                      className="btn-primary w-full py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      {isSubmittingStep1 ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving your details...</span>
                        </>
                      ) : (
                        <>
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Direct messaging */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Quick question?</span>
                    <a
                      href="https://wa.me/placeholder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Support</span>
                    </a>
                  </div>
                </form>
              ) : (
                /* STEP 2: Comprehensive Detailed Form */
                <form onSubmit={handleSubmitStep2(onStep2Submit)} className="space-y-6 text-left">
                  {apiError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* SECTION 1 — PERSONAL DETAILS */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                      <User className="w-4 h-4 text-purple-700" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Section 1 — Personal Details
                      </h4>
                    </div>

                    {/* Pre-populated Row: Name, Mobile, Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...registerStep2('name')}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                        />
                        {errorsStep2.name && (
                          <span className="text-[10px] text-red-500 font-medium">{errorsStep2.name.message}</span>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          {...registerStep2('phone')}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                        />
                        {errorsStep2.phone && (
                          <span className="text-[10px] text-red-500 font-medium">{errorsStep2.phone.message}</span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          {...registerStep2('email')}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                        />
                        {errorsStep2.email && (
                          <span className="text-[10px] text-red-500 font-medium">{errorsStep2.email.message}</span>
                        )}
                      </div>
                    </div>

                    {/* Pincode, State, City/District */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Pincode */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 682001"
                          {...registerStep2('pincode')}
                          className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                            errorsStep2.pincode ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                          }`}
                        />
                        {errorsStep2.pincode && (
                          <span className="text-[10px] text-red-500 font-medium">{errorsStep2.pincode.message}</span>
                        )}
                      </div>

                      {/* State */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...registerStep2('state')}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        {errorsStep2.state && (
                          <span className="text-[10px] text-red-500 font-medium">{errorsStep2.state.message}</span>
                        )}
                      </div>

                      {/* City / District */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          City / District <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Kochi / Trivandrum"
                          {...registerStep2('city')}
                          className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                            errorsStep2.city ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                          }`}
                        />
                        {errorsStep2.city && (
                          <span className="text-[10px] text-red-500 font-medium">{errorsStep2.city.message}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2 — PROFESSIONAL / EDUCATIONAL STATUS */}
                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                      <GraduationCap className="w-4 h-4 text-purple-700" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Section 2 — Professional / Educational Status
                      </h4>
                    </div>

                    {/* Profession Selector */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Profession <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...registerStep2('profession')}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-purple-600"
                      >
                        <option value="Student">Student</option>
                        <option value="Working Professional">Working Professional</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Other">Other</option>
                      </select>
                      {errorsStep2.profession && (
                        <span className="text-[10px] text-red-500 font-medium">{errorsStep2.profession.message}</span>
                      )}
                    </div>

                    {/* STUDENT SPECIFIC FIELDS */}
                    {selectedProfession === 'Student' && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                        {/* Highest Qualification & Graduation Year */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Highest Qualification */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Highest Qualification Pursuing / Pursued <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...registerStep2('highestQualification')}
                              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none transition-all ${
                                errorsStep2.highestQualification ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                              }`}
                            >
                              <option value="Select">Select Qualification</option>
                              <option value="High School">High School</option>
                              <option value="Pre University (XII)">Pre University (XII)</option>
                              <option value="Diploma">Diploma</option>
                              <option value="3 Year - Bachelor's degree">3 Year - Bachelor's degree</option>
                              <option value="4 Year - Bachelor's degree">4 Year - Bachelor's degree</option>
                              <option value="5 Year - Bachelor's degree">5 Year - Bachelor's degree</option>
                              <option value="Engineering B.Tech">Engineering B.Tech</option>
                              <option value="Master's degree">Master's degree</option>
                              <option value="Doctoral degree">Doctoral degree</option>
                              <option value="MBBS">MBBS</option>
                            </select>
                            {errorsStep2.highestQualification && (
                              <span className="text-[10px] text-red-500 font-medium">{errorsStep2.highestQualification.message}</span>
                            )}
                          </div>

                          {/* Year of Graduation */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Year of Graduation <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...registerStep2('yearOfGraduation')}
                              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none transition-all ${
                                errorsStep2.yearOfGraduation ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                              }`}
                            >
                              <option value="Select">Select Year</option>
                              <option value="2030">2030</option>
                              <option value="2029">2029</option>
                              <option value="2028">2028</option>
                              <option value="2027">2027</option>
                              <option value="2026">2026</option>
                              <option value="2025">2025</option>
                              <option value="2024">2024</option>
                              <option value="2023">2023</option>
                              <option value="2022">2022</option>
                              <option value="2021">2021</option>
                              <option value="2020">2020</option>
                              <option value="Before 2020">Before 2020</option>
                            </select>
                            {errorsStep2.yearOfGraduation && (
                              <span className="text-[10px] text-red-500 font-medium">{errorsStep2.yearOfGraduation.message}</span>
                            )}
                          </div>
                        </div>

                        {/* APAAR/ABC/KTU Selection & Conditional KTU ID */}
                        <div className={`grid grid-cols-1 ${selectedApaarStatus === 'I have KTU ID' ? 'sm:grid-cols-2' : ''} gap-3`}>
                          {/* Academic Bank of Credits Dropdown */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Academic Bank of Credits (APAAR/ABC/ID) <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...registerStep2('apaarAbcStatus')}
                              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none transition-all ${
                                errorsStep2.apaarAbcStatus ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                              }`}
                            >
                              <option value="Select">Select APAAR / Credit ID Status</option>
                              <option value="I have APAAR/ABC ID">I have APAAR/ABC ID</option>
                              <option value="I don't have APAAR/ABC ID">I don't have APAAR/ABC ID</option>
                              <option value="Do not need APAAR/ABC ID">Do not need APAAR/ABC ID</option>
                              <option value="I have KTU ID">I have KTU ID</option>
                            </select>
                            {errorsStep2.apaarAbcStatus && (
                              <span className="text-[10px] text-red-500 font-medium">{errorsStep2.apaarAbcStatus.message}</span>
                            )}
                          </div>

                          {/* Conditional KTU ID field */}
                          {selectedApaarStatus === 'I have KTU ID' && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="space-y-1"
                            >
                              <label className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block flex items-center gap-1">
                                <IdCard className="w-3.5 h-3.5 text-purple-700" />
                                <span>KTU ID <span className="text-red-500">*</span></span>
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. TKM21CS045 / KTU Reg No."
                                {...registerStep2('ktuId')}
                                className={`w-full px-3 py-2 bg-purple-50/50 border rounded-lg text-xs text-slate-900 font-medium focus:outline-none transition-all ${
                                  errorsStep2.ktuId ? 'border-red-400 focus:border-red-500' : 'border-purple-300 focus:border-purple-600'
                                }`}
                              />
                              {errorsStep2.ktuId && (
                                <span className="text-[10px] text-red-500 font-medium">{errorsStep2.ktuId.message}</span>
                              )}
                            </motion.div>
                          )}
                        </div>

                        {/* College State & College Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              College State <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...registerStep2('collegeState')}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                            >
                              {INDIAN_STATES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              College Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. TKM College of Engineering / Model Engg College"
                              {...registerStep2('collegeName')}
                              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none transition-all ${
                                errorsStep2.collegeName ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                              }`}
                            />
                            {errorsStep2.collegeName && (
                              <span className="text-[10px] text-red-500 font-medium">{errorsStep2.collegeName.message}</span>
                            )}
                          </div>
                        </div>

                        {/* University Name & Roll Number */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              University Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              list="university-list"
                              placeholder="Select or enter University"
                              {...registerStep2('universityName')}
                              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none transition-all ${
                                errorsStep2.universityName ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                              }`}
                            />
                            <datalist id="university-list">
                              {POPULAR_UNIVERSITIES.map((u) => (
                                <option key={u} value={u} />
                              ))}
                            </datalist>
                            {errorsStep2.universityName && (
                              <span className="text-[10px] text-red-500 font-medium">{errorsStep2.universityName.message}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              College/School Roll Number
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 21CS045 (Optional)"
                              {...registerStep2('rollNumber')}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                            />
                          </div>
                        </div>

                        {/* Academic Level, Academic Area, Study Year */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Academic Level <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...registerStep2('highestAcademicLevel')}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                            >
                              <option value="High School">High School</option>
                              <option value="Undergraduate">Undergraduate</option>
                              <option value="Postgraduate">Postgraduate</option>
                              <option value="Doctorate">Doctorate</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Academic Area <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...registerStep2('academicArea')}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                            >
                              <option value="Computer Science & IT">Computer Science & IT</option>
                              <option value="Electronics & Communication">Electronics & Communication</option>
                              <option value="Electrical & Electronics">Electrical & Electronics</option>
                              <option value="Mechanical Engineering">Mechanical Engineering</option>
                              <option value="Civil Engineering">Civil Engineering</option>
                              <option value="Commerce / Management">Commerce / Management</option>
                              <option value="Science & Mathematics">Science & Mathematics</option>
                              <option value="Arts & Humanities">Arts & Humanities</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Study Year <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...registerStep2('studyYear')}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                            >
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                              <option value="5th Year">5th Year</option>
                              <option value="Graduated">Graduated</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WORKING PROFESSIONAL SPECIFIC FIELDS */}
                    {selectedProfession === 'Working Professional' && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Organization / Company <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Infosys / TCS / Freelance"
                              {...registerStep2('organization')}
                              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none transition-all ${
                                errorsStep2.organization ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                              }`}
                            />
                            {errorsStep2.organization && (
                              <span className="text-[10px] text-red-500 font-medium">{errorsStep2.organization.message}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Designation / Job Role <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Software Engineer / Data Analyst"
                              {...registerStep2('designation')}
                              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none transition-all ${
                                errorsStep2.designation ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                              }`}
                            />
                            {errorsStep2.designation && (
                              <span className="text-[10px] text-red-500 font-medium">{errorsStep2.designation.message}</span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Years of Experience
                            </label>
                            <select
                              {...registerStep2('yearsOfExperience')}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                            >
                              <option value="< 1 Year">&lt; 1 Year</option>
                              <option value="1-3 Years">1–3 Years</option>
                              <option value="3-5 Years">3–5 Years</option>
                              <option value="5-8 Years">5–8 Years</option>
                              <option value="8+ Years">8+ Years</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Highest Qualification
                            </label>
                            <select
                              {...registerStep2('highestQualification')}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                            >
                              <option value="Engineering B.Tech">Engineering B.Tech</option>
                              <option value="Bachelor's degree">Bachelor's degree</option>
                              <option value="Master's degree">Master's degree</option>
                              <option value="Diploma">Diploma</option>
                              <option value="Doctoral degree">Doctoral degree</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FACULTY SPECIFIC FIELDS */}
                    {selectedProfession === 'Faculty' && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Institution / College <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Government Engineering College"
                              {...registerStep2('organization')}
                              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none transition-all ${
                                errorsStep2.organization ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-600'
                              }`}
                            />
                            {errorsStep2.organization && (
                              <span className="text-[10px] text-red-500 font-medium">{errorsStep2.organization.message}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Department / Specialization
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Computer Science / AI & Data Science"
                              {...registerStep2('department')}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OTHER PROFESSION */}
                    {selectedProfession === 'Other' && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Current Occupation / Details
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Freelancer / Entrepreneur / Career Break"
                            {...registerStep2('otherProfessionDetails')}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submission Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      ← Back to Step 1
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmittingStep2}
                      className="btn-primary flex-1 sm:flex-initial px-6 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      {isSubmittingStep2 ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Finalizing Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit / Complete Enquiry</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
