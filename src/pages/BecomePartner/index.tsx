import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
  Handshake,
  Building2,
  GraduationCap,
  Briefcase,
  Cpu,
  Presentation,
  Landmark,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { partnerService } from '../../services/partnerService';
import type { PartnerEnquiry } from '../../types';

const partnerFormSchema = zod.object({
  organizationName: zod.string().min(2, { message: 'Organization name is required' }),
  contactPerson: zod.string().min(2, { message: 'Contact person is required' }),
  designation: zod.string().min(2, { message: 'Designation is required' }),
  email: zod.string().email({ message: 'Valid official email is required' }),
  phone: zod.string().min(7, { message: 'Valid phone number is required' }),
  organizationType: zod.enum(['Company', 'Educational Institution', 'Training Organization', 'Technology Company', 'Other'], {
    message: 'Please select an organization type'
  }),
  partnershipArea: zod.string().min(2, { message: 'Partnership area is required' }),
  website: zod.string().optional(),
  location: zod.string().min(2, { message: 'Location is required' }),
  proposal: zod.string().min(10, { message: 'Partnership proposal must be at least 10 characters' }),
  additionalInformation: zod.string().optional()
});

type PartnerFormData = zod.infer<typeof partnerFormSchema>;

export const BecomePartner: React.FC = () => {
  const [submittedEnquiry, setSubmittedEnquiry] = useState<PartnerEnquiry | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      organizationType: 'Company',
      partnershipArea: 'Academic & Skill Development'
    }
  });

  const onSubmit = async (data: PartnerFormData) => {
    try {
      const res = await partnerService.submitPartnerRequest({
        organizationName: data.organizationName,
        contactPerson: data.contactPerson,
        designation: data.designation,
        email: data.email,
        phone: data.phone,
        organizationType: data.organizationType,
        partnershipArea: data.partnershipArea,
        website: data.website,
        location: data.location,
        proposal: data.proposal,
        additionalInformation: data.additionalInformation
      });

      if (res.enquiry) {
        setSubmittedEnquiry(res.enquiry);
      }
      reset();
    } catch (err) {
      console.error('Failed to submit partnership request:', err);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('partner-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const partnershipOpportunities = [
    {
      icon: Building2,
      title: 'Industry Partnerships',
      description: 'Collaborate on industry-oriented learning, projects, workshops, and talent development.'
    },
    {
      icon: GraduationCap,
      title: 'Academic Partnerships',
      description: 'Work together on academic initiatives, student development, training, and technology programs.'
    },
    {
      icon: Briefcase,
      title: 'Hiring Partnerships',
      description: 'Connect with trained talent for relevant employment opportunities across emerging tech.'
    },
    {
      icon: Cpu,
      title: 'Technology Partnerships',
      description: 'Collaborate on technology platforms, tools, projects, and innovation initiatives.'
    },
    {
      icon: Presentation,
      title: 'Training Partnerships',
      description: 'Explore opportunities to jointly deliver technical training and professional development.'
    },
    {
      icon: Landmark,
      title: 'Institutional Partnerships',
      description: 'Build long-term collaborations around education, technology, innovation, and career development.'
    }
  ];

  const whyPartnerPillars = [
    { title: 'Access to Trained Talent', desc: 'Direct engagement with project-tested candidates in Data Science and AI.' },
    { title: 'Industry Engagement', desc: 'Bridge academic preparation with real-world enterprise technology standards.' },
    { title: 'Knowledge Sharing', desc: 'Faculty exchanges, guest lectures, masterclasses, and tech webinars.' },
    { title: 'Technology Collaboration', desc: 'Joint initiatives leveraging modern cloud, analytics, and AI frameworks.' },
    { title: 'Student Development', desc: 'Structured upskilling, capstone mentorship, and practical skill acceleration.' },
    { title: 'Innovation Opportunities', desc: 'Collaborative development of domain solutions and AI applied research.' },
    { title: 'Joint Initiatives', desc: 'Co-branded certificates, specialized workshops, and hackathons.' },
    { title: 'Professional Networking', desc: 'Engage with educators, engineering leaders, and technology practitioners.' }
  ];

  const partnershipSteps = [
    {
      step: '01',
      title: 'Submit Partnership Interest',
      description: 'Provide details about your organization and collaboration requirements through our form.'
    },
    {
      step: '02',
      title: 'Initial Discussion',
      description: 'Our strategic alliances team reviews the proposal and contacts your representatives.'
    },
    {
      step: '03',
      title: 'Explore Collaboration',
      description: 'We align on mutual objectives, program scope, delivery models, and joint initiatives.'
    },
    {
      step: '04',
      title: 'Partnership',
      description: 'Formalize agreement and proceed with mutually agreed terms, workshops, and activities.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 text-left">
      <SEO
        title="Become a Partner | Academic & Industry Collaboration"
        description="Collaborate with Edqoo to create meaningful opportunities in technology education, industry engagement, talent development, and innovation."
        canonical="/become-a-partner"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50/70 via-slate-50 to-white text-slate-950 py-16 sm:py-24 text-center relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(109,34,181,0.08),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <Handshake className="w-4 h-4 text-purple-600" />
            <span>Institutional & Enterprise Alliances</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
            Become a Partner
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Collaborate with us to create meaningful opportunities in technology education, industry engagement, talent development, and innovation.
          </p>

          <div className="pt-2">
            <button
              onClick={scrollToForm}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-purple-600/20 transition-all inline-flex items-center gap-2"
            >
              <span>Become a Partner</span>
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
          <span className="text-slate-900 font-semibold">Become a Partner</span>
        </div>
      </div>

      {/* Partnership Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Collaboration Tracks
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
            Partnership Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We collaborate with universities, corporate enterprises, training institutes, and technology organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnershipOpportunities.map((opp, idx) => {
            const Icon = opp.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-base">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opp.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
              Mutual Value
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
              Why Partner With Us?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore the core engagement avenues our partnership ecosystem enables.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyPartnerPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-50 border border-slate-200 rounded-xl hover:border-purple-300 transition-colors space-y-1.5"
              >
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm">
                    {pillar.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Alliance Roadmap
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
            Partnership Process
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A structured pathway from proposal review to operational alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnershipSteps.map((stepItem, idx) => (
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

      {/* Partner Enquiry Form */}
      <section id="partner-form" className="bg-slate-100/70 border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-8">
            <div className="text-center space-y-2 border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                <Handshake className="w-3.5 h-3.5 text-purple-600" />
                <span>Partnership Desk</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
                Partner Enquiry Form
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Submit details about your institution or organization. Our alliances team will review your proposal and initiate collaboration discussions.
              </p>
            </div>

            {submittedEnquiry ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-black text-emerald-950">
                  Partnership Proposal Received
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="font-bold">{submittedEnquiry.contactPerson}</strong>. We have registered the partnership interest from <strong className="font-bold">{submittedEnquiry.organizationName}</strong>. Our partnerships team will connect with you at <span className="underline">{submittedEnquiry.email}</span>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmittedEnquiry(null)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Organization Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Organization Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Institute of Engineering / Zenith Labs"
                      {...register('organizationName')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.organizationName ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.organizationName && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.organizationName.message}</span>
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
                      placeholder="e.g. Dr. Anand Verma"
                      {...register('contactPerson')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.contactPerson ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.contactPerson && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.contactPerson.message}</span>
                    )}
                  </div>

                  {/* Designation */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Designation</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dean of Academics, Director of Alliances, VP HR"
                      {...register('designation')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.designation ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.designation && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.designation.message}</span>
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
                      placeholder="partnerships@institution.edu"
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

                  {/* Organization Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Organization Type</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('organizationType')}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900"
                    >
                      <option value="Company">Company / Corporate Enterprise</option>
                      <option value="Educational Institution">Educational Institution / University</option>
                      <option value="Training Organization">Training Organization / Academy</option>
                      <option value="Technology Company">Technology Platform / SaaS</option>
                      <option value="Other">Other Organization</option>
                    </select>
                  </div>

                  {/* Partnership Area */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Partnership Area</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Student Upskilling, Hiring Pipeline, Joint Workshops"
                      {...register('partnershipArea')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.partnershipArea ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.partnershipArea && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.partnershipArea.message}</span>
                    )}
                  </div>

                  {/* Website */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Website URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://institution.edu or https://company.com"
                      {...register('website')}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>City / State / Country</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kozhikode, Kerala, India"
                      {...register('location')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.location ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.location && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.location.message}</span>
                    )}
                  </div>

                  {/* Proposal */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Partnership Proposal / Objectives</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your organization's goals, proposed scope of collaboration, number of target beneficiaries, and preferred timeline..."
                      {...register('proposal')}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white focus:border-purple-600 text-slate-900 transition-colors ${
                        errors.proposal ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.proposal && (
                      <span className="text-[11px] text-red-500 font-medium">{errors.proposal.message}</span>
                    )}
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800">
                      Additional Information
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any specific institutional requirements, accreditations, or timeline constraints..."
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
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Partnership Request</span>
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
