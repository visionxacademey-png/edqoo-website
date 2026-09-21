import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
  Building2,
  Users,
  Briefcase,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Code2,
  BrainCircuit,
  Database,
  LineChart,
  ShieldCheck,
  Cloud,
  Send,
  Loader2,
  ChevronRight,
  PhoneCall,
  Layers,
  FileCheck2
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { hiringService } from '../../services/hiringService';
import { useEnquiry } from '../../context/EnquiryContext';
import type { HiringEnquiry } from '../../types';

const hiringFormSchema = zod.object({
  companyName: zod.string().min(2, { message: 'Company name is required' }),
  contactPerson: zod.string().min(2, { message: 'Contact person name is required' }),
  email: zod.string().email({ message: 'Valid official email is required' }),
  phone: zod.string().min(7, { message: 'Valid phone number is required' }),
  jobRole: zod.string().min(2, { message: 'Job role / position is required' }),
  openings: zod.string().min(1, { message: 'Please select number of openings' }),
  requiredSkills: zod.string().min(2, { message: 'Required skills are required' }),
  experience: zod.string().min(1, { message: 'Please select experience level' }),
  location: zod.string().min(2, { message: 'Location is required' }),
  workMode: zod.enum(['On-site', 'Hybrid', 'Remote'], { message: 'Please select a work mode' }),
  additionalRequirements: zod.string().optional()
});

type HiringFormData = zod.infer<typeof hiringFormSchema>;

export const HireFromUs: React.FC = () => {
  const [submittedEnquiry, setSubmittedEnquiry] = useState<HiringEnquiry | null>(null);
  const { openEnquiryModal } = useEnquiry();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<HiringFormData>({
    resolver: zodResolver(hiringFormSchema),
    defaultValues: {
      workMode: 'Hybrid',
      openings: '1-3 Openings',
      experience: 'Fresher / Entry Level (0-1 yr)'
    }
  });

  const onSubmit = async (data: HiringFormData) => {
    try {
      const res = await hiringService.submitHiringRequirement({
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,
        jobRole: data.jobRole,
        openings: data.openings,
        requiredSkills: data.requiredSkills,
        experience: data.experience,
        location: data.location,
        workMode: data.workMode,
        additionalRequirements: data.additionalRequirements
      });

      if (res.enquiry) {
        setSubmittedEnquiry(res.enquiry);
      }
      reset();
    } catch (err) {
      console.error('Failed to submit hiring enquiry:', err);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('hire-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whyHireReasons = [
    {
      icon: BrainCircuit,
      title: 'Industry-Oriented Skills',
      description: 'Candidates develop practical skills aligned with current industry requirements and modern corporate workflows.'
    },
    {
      icon: Code2,
      title: 'Hands-On Projects',
      description: 'Candidates gain practical experience through multi-domain capstones and real-world problem solving.'
    },
    {
      icon: Layers,
      title: 'Technology Skills',
      description: 'Candidates are thoroughly exposed to modern developer stacks, analytical tools, and production practices.'
    },
    {
      icon: FileCheck2,
      title: 'Job Readiness',
      description: 'Programs focus on developing technical, analytical, and professional capabilities required for employment.'
    },
    {
      icon: Users,
      title: 'Diverse Talent Pool',
      description: 'Provide access to candidates with different technical backgrounds, domain specializations, and career stages.'
    }
  ];

  const talentCategories = [
    {
      title: 'Data Science',
      icon: Database,
      skills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Statistical Modeling']
    },
    {
      title: 'Artificial Intelligence',
      icon: BrainCircuit,
      skills: ['Deep Learning', 'PyTorch', 'Computer Vision', 'Generative AI', 'LLMs']
    },
    {
      title: 'Machine Learning',
      icon: Cpu,
      skills: ['Supervised Learning', 'NLP', 'Transformers', 'Model Deployment']
    },
    {
      title: 'Data Analytics',
      icon: LineChart,
      skills: ['SQL', 'Power BI', 'Advanced Excel', 'Tableau', 'DAX & Modeling']
    },
    {
      title: 'Python Development',
      icon: Code2,
      skills: ['OOPs', 'APIs & Microservices', 'Data Structures', 'Automation Scripts']
    },
    {
      title: 'Software Development',
      icon: Building2,
      skills: ['Full Stack Architecture', 'REST APIs', 'Database Optimization', 'Git']
    },
    {
      title: 'Cybersecurity',
      icon: ShieldCheck,
      skills: ['Network Security', 'SOC Operations', 'Vulnerability Assessment', 'Threat Modeling']
    },
    {
      title: 'Cloud & DevOps',
      icon: Cloud,
      skills: ['AWS / Cloud Infrastructure', 'CI/CD Pipelines', 'Docker', 'Linux']
    }
  ];

  const hiringSteps = [
    {
      step: '01',
      title: 'Submit Hiring Requirement',
      description: 'Companies submit their hiring requirements and job criteria through our structured enquiry form.'
    },
    {
      step: '02',
      title: 'Requirement Review',
      description: 'The corporate talent team reviews the required skills, job role, experience level, and timeline.'
    },
    {
      step: '03',
      title: 'Candidate Matching',
      description: 'Suitable candidate profiles are identified and shortlisted based on the submitted requirements.'
    },
    {
      step: '04',
      title: 'Connect & Hire',
      description: 'The company coordinates interviews and proceeds with its own evaluation and onboarding process.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 text-left">
      <SEO
        title="Hire From Us | Hire Skilled Tech & AI Talent"
        description="Connect with trained, industry-ready talent equipped with practical skills in Data Science, Artificial Intelligence, Python, and Data Analytics."
        canonical="/hire-from-us"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50/70 via-slate-50 to-white text-slate-950 py-16 sm:py-24 text-center relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(109,34,181,0.08),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>Corporate Talent Partnerships</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
            Hire Skilled Talent From Us
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Connect with trained, industry-ready talent equipped with practical skills in Data Science, Artificial Intelligence, Software Development, Cybersecurity, Data Analytics, and emerging technologies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={scrollToForm}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-2"
            >
              <span>Hire From Us</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => openEnquiryModal('Corporate Talent Advisory')}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-purple-600" />
              <span>Talk to Our Team</span>
            </button>
          </div>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-slate-500 flex items-center gap-2">
          <span>Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Hire From Us</span>
        </div>
      </div>

      {/* Why Hire From Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Value for Employers
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
            Why Hire From Us?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our programs emphasize rigorous, real-world engineering and business problem solving so graduates can contribute effectively from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyHireReasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-base">
                    {reason.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Talent Areas Section */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
              Specialized Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
              Talent Areas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore candidates trained across current and emerging technology specializations supported by our curricula.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {talentCategories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-purple-600 shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display font-bold text-slate-900 text-sm">
                      {category.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {category.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-medium rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Hiring Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A transparent 4-step process to connect employers with suitable candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hiringSteps.map((stepItem, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs relative overflow-hidden flex flex-col justify-between"
            >
              <span className="text-3xl font-black font-display text-purple-600/30 mb-3 block">
                {stepItem.step}
              </span>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {stepItem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Employer Enquiry Form Section */}
      <section id="hire-form" className="bg-slate-100/70 border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-8">
            <div className="text-center space-y-2 border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                <span>Employer Hiring Desk</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
                Submit Hiring Requirement
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Fill in your candidate requirements. Our corporate partnerships team will review the details and connect with matching profiles.
              </p>
            </div>

            {submittedEnquiry ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-black text-emerald-950">
                  Hiring Requirement Received
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="font-bold">{submittedEnquiry.contactPerson}</strong>. We have registered your hiring requirement for <strong className="font-bold">{submittedEnquiry.jobRole}</strong> at <strong className="font-bold">{submittedEnquiry.companyName}</strong>. Our team will review the skill profile and contact you at <span className="underline">{submittedEnquiry.email}</span>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmittedEnquiry(null)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs"
                  >
                    Submit Another Requirement
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Company Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Innovations Pvt Ltd"
                      {...register('companyName')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.companyName ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.companyName && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.companyName.message}</span>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Contact Person</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Nair (HR Lead)"
                      {...register('contactPerson')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.contactPerson ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.contactPerson && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.contactPerson.message}</span>
                    )}
                  </div>

                  {/* Official Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Official Email</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="hr@company.com"
                      {...register('email')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.email ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.email.message}</span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Phone Number</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register('phone')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.phone ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.phone.message}</span>
                    )}
                  </div>

                  {/* Job Role / Position */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Job Role / Position</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Junior Data Scientist, AI Engineer, BI Analyst"
                      {...register('jobRole')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.jobRole ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.jobRole && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.jobRole.message}</span>
                    )}
                  </div>

                  {/* Number of Openings */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Number of Openings</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('openings')}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900"
                    >
                      <option value="1-3 Openings">1–3 Openings</option>
                      <option value="4-10 Openings">4–10 Openings</option>
                      <option value="10+ Openings">10+ Openings (Bulk Hiring)</option>
                    </select>
                  </div>

                  {/* Required Skills */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Required Skills</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Python, SQL, Machine Learning, Power BI, REST APIs, Git"
                      {...register('requiredSkills')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.requiredSkills ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.requiredSkills && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.requiredSkills.message}</span>
                    )}
                  </div>

                  {/* Experience Required */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Experience Required</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('experience')}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900"
                    >
                      <option value="Fresher / Entry Level (0-1 yr)">Fresher / Entry Level (0–1 yr)</option>
                      <option value="Junior (1-3 yrs)">Junior (1–3 yrs)</option>
                      <option value="Mid-Senior (3-5 yrs)">Mid-Senior (3–5 yrs)</option>
                      <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Job Location</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore, Kochi, Hyderabad, Remote"
                      {...register('location')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.location ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.location && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.location.message}</span>
                    )}
                  </div>

                  {/* Work Mode */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Work Mode <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-700">
                      {(['On-site', 'Hybrid', 'Remote'] as const).map((mode) => (
                        <label key={mode} className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value={mode}
                            {...register('workMode')}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span>{mode}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800">
                      Additional Requirements / Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share any specific requirements (e.g. preferred joining timeline, interview format, compensation band, domain expectations)..."
                      {...register('additionalRequirements')}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Requirement...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Hiring Requirement</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
