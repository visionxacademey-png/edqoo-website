import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  ChevronRight,
  Upload,
  BrainCircuit,
  Code2,
  Presentation,
  FileText
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { instructorApplicationService } from '../../services/instructorApplicationService';
import type { InstructorApplication } from '../../types';

const instructorFormSchema = zod.object({
  name: zod.string().min(2, { message: 'Full name is required' }),
  email: zod.string().email({ message: 'Valid email address is required' }),
  phone: zod.string().min(7, { message: 'Valid phone number is required' }),
  designation: zod.string().min(2, { message: 'Current designation is required' }),
  organization: zod.string().min(2, { message: 'Current organization is required' }),
  qualification: zod.string().min(2, { message: 'Highest qualification is required' }),
  expertise: zod.string().min(2, { message: 'Area of expertise is required' }),
  experience: zod.string().min(1, { message: 'Please select years of experience' }),
  linkedin: zod.string().optional(),
  portfolio: zod.string().optional(),
  courses: zod.string().min(2, { message: 'Please mention courses you can teach' }),
  teachingExperience: zod.string().min(1, { message: 'Please select your teaching experience' }),
  bio: zod.string().min(10, { message: 'Short professional bio must be at least 10 characters' }),
  resumeLink: zod.string().optional(),
  additionalInformation: zod.string().optional()
});

type InstructorFormData = zod.infer<typeof instructorFormSchema>;

export const BecomeInstructor: React.FC = () => {
  const [submittedApp, setSubmittedApp] = useState<InstructorApplication | null>(null);
  const [resumeFile, setResumeFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<InstructorFormData>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: {
      experience: '5-8 Years',
      teachingExperience: '1-3 Years'
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit. Please upload a smaller PDF or document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setResumeFile({
        name: file.name,
        dataUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: InstructorFormData) => {
    try {
      const resumeValue = resumeFile ? `${resumeFile.name} [Attached Document]` : (data.resumeLink || undefined);

      const res = await instructorApplicationService.submitApplication({
        name: data.name,
        email: data.email,
        phone: data.phone,
        designation: data.designation,
        organization: data.organization,
        qualification: data.qualification,
        expertise: data.expertise,
        experience: data.experience,
        linkedin: data.linkedin,
        portfolio: data.portfolio,
        courses: data.courses,
        teachingExperience: data.teachingExperience,
        bio: data.bio,
        resume: resumeValue,
        additionalInformation: data.additionalInformation
      });

      if (res.application) {
        setSubmittedApp(res.application);
      }
      reset();
      setResumeFile(null);
    } catch (err) {
      console.error('Failed to submit application:', err);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('instructor-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const applicantProfiles = [
    {
      icon: Briefcase,
      title: 'Industry Professionals',
      description: 'Professionals with practical experience in relevant technology domains and real-world engineering workflows.'
    },
    {
      icon: GraduationCap,
      title: 'Academic Faculty',
      description: 'Faculty members, researchers, and educators with structured curriculum delivery and academic expertise.'
    },
    {
      icon: BrainCircuit,
      title: 'Technology Experts',
      description: 'Specialists in AI, Machine Learning, Data Analytics, Cloud Systems, and modern development practices.'
    },
    {
      icon: Presentation,
      title: 'Experienced Trainers',
      description: 'Seasoned technical trainers interested in mentoring ambitious learners through hands-on project guidance.'
    }
  ];

  const focusDomains = [
    'Data Science',
    'Artificial Intelligence',
    'Machine Learning',
    'Data Analytics',
    'Python Programming',
    'Web Development',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps & CI/CD',
    'Generative AI & LLMs',
    'SQL & Database Engineering',
    'Power BI & Business Intelligence'
  ];

  const instructorExpectations = [
    'Strong subject-matter expertise in your core technical area',
    'Ability to explain complex technical concepts with simplicity and clarity',
    'Practical / industry experience with real-world tooling and workflows',
    'Ability to conduct structured live interactive sessions where required',
    'Ability to guide and mentor students through hands-on capstone projects',
    'Commitment to quality learning, student engagement, and ethical practices',
    'Professional, courteous, and timely communication with learners'
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 text-left">
      <SEO
        title="Become an Instructor | Teach Tech & AI"
        description="Share your knowledge, industry experience, and expertise with the next generation of technology professionals at Edqoo."
        canonical="/become-an-instructor"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50/70 via-slate-50 to-white text-slate-950 py-16 sm:py-24 text-center relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(109,34,181,0.08),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>Join Our Faculty Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
            Become an Instructor
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Share your knowledge, industry experience, and expertise with the next generation of technology professionals.
          </p>

          <div className="pt-2">
            <button
              onClick={scrollToForm}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-purple-600/20 transition-all inline-flex items-center gap-2"
            >
              <span>Apply as an Instructor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-slate-500 flex items-center gap-2">
          <span>Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Become an Instructor</span>
        </div>
      </div>

      {/* Who Can Apply Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Eligibility & Background
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
            Who Can Apply?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We welcome educators and practitioners from diverse technology backgrounds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {applicantProfiles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Areas We Are Looking For */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
              Teaching Domains
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
              Areas We Are Looking For
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We regularly expand our instructor pool across our active master programs and tools & upskills tracks.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {focusDomains.map((domain, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <Code2 className="w-3.5 h-3.5 text-purple-600" />
                <span>{domain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Expectations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
              Faculty Standards
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950">
              Instructor Expectations
            </h2>
            <p className="text-xs text-slate-600">
              Our learners value clarity, practical depth, and mentor support. We uphold the following standards across our faculty network:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {instructorExpectations.map((exp, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-700 leading-relaxed font-medium">{exp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="instructor-form" className="bg-slate-100/70 border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-8">
            <div className="text-center space-y-2 border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>Faculty Application</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
                Instructor Application Form
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Submit your professional credentials. Our academic review committee will examine your background and reach out for an introductory discussion.
              </p>
            </div>

            {submittedApp ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-black text-emerald-950">
                  Application Submitted Successfully
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="font-bold">{submittedApp.name}</strong>. Your instructor application has been submitted for review. Our academic coordinator will contact you at <span className="underline">{submittedApp.email}</span>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmittedApp(null)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Full Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Rajesh Sharma"
                      {...register('name')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.name ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.name && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.name.message}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Email Address</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="rajesh.sharma@example.com"
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
                      placeholder="+91 90744 50935"
                      {...register('phone')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.phone ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.phone.message}</span>
                    )}
                  </div>

                  {/* Current Designation */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Current Designation</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Data Scientist, Professor, Principal Engineer"
                      {...register('designation')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.designation ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.designation && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.designation.message}</span>
                    )}
                  </div>

                  {/* Organization */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Current Organization / Institution</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tech Corp / National Institute of Technology"
                      {...register('organization')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.organization ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.organization && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.organization.message}</span>
                    )}
                  </div>

                  {/* Highest Qualification */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Highest Qualification</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ph.D. in Computer Science, M.Tech, M.S. Data Science"
                      {...register('qualification')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.qualification ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.qualification && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.qualification.message}</span>
                    )}
                  </div>

                  {/* Area of Expertise */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Area of Expertise</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Machine Learning, LLMs, Power BI, Python"
                      {...register('expertise')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.expertise ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.expertise && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.expertise.message}</span>
                    )}
                  </div>

                  {/* Years of Experience */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Total Industry / Academic Experience</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('experience')}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900"
                    >
                      <option value="2-4 Years">2–4 Years</option>
                      <option value="5-8 Years">5–8 Years</option>
                      <option value="9-12 Years">9–12 Years</option>
                      <option value="12+ Years">12+ Years</option>
                    </select>
                  </div>

                  {/* LinkedIn Profile */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      {...register('linkedin')}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900"
                    />
                  </div>

                  {/* Portfolio / Website */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Portfolio / Personal Website / GitHub
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourportfolio.com or github.com/username"
                      {...register('portfolio')}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900"
                    />
                  </div>

                  {/* Courses You Can Teach */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Courses / Modules You Can Teach</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Data Science with Python, Deep Learning, Power BI, SQL, Prompt Engineering"
                      {...register('courses')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.courses ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.courses && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.courses.message}</span>
                    )}
                  </div>

                  {/* Teaching Experience */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Prior Teaching / Mentoring Experience</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('teachingExperience')}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900"
                    >
                      <option value="None (Interested to start)">No formal teaching (Interested in mentoring)</option>
                      <option value="1-3 Years">1–3 Years (College / Bootcamps / Corporate)</option>
                      <option value="4-7 Years">4–7 Years (Experienced educator / Trainer)</option>
                      <option value="8+ Years">8+ Years (Senior Professor / Principal Faculty)</option>
                    </select>
                  </div>

                  {/* Short Professional Bio */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Short Professional Biography</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Summarize your professional experience, domain specializations, and teaching philosophy..."
                      {...register('bio')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.bio ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.bio && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.bio.message}</span>
                    )}
                  </div>

                  {/* Resume Upload / Link */}
                  <div className="space-y-2 sm:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>Resume Upload (PDF / Word) or Public Resume Link</span>
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="text-xs text-slate-600 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                        {resumeFile && (
                          <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Attached: {resumeFile.name}</span>
                          </div>
                        )}
                        {fileError && (
                          <span className="text-[11px] text-red-500 font-medium block mt-1">{fileError}</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <input
                          type="url"
                          placeholder="Or paste Google Drive / Dropbox link..."
                          {...register('resumeLink')}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-purple-600 text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800">
                      Additional Information
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Availability (Weekend/Weekday batches), preferred mode of delivery, or research achievements..."
                      {...register('additionalInformation')}
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
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Instructor Application</span>
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
