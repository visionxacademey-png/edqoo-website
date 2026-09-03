import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Mail, Phone, MapPin, Send, CheckCircle2, HelpCircle } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SEO } from '../../components/common/SEO';
import { enquiryService } from '../../services/enquiryService';

const contactSchema = zod.object({
  name: zod.string().min(2, { message: 'Name is required' }),
  email: zod.string().email({ message: 'Valid email is required' }),
  phone: zod.string().optional(),
  subject: zod.string().min(3, { message: 'Subject is required' }),
  message: zod.string().min(10, { message: 'Message must be at least 10 characters' })
});

type ContactFormData = zod.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    // Save as general enquiry
    await enquiryService.submitEnquiry({
      name: data.name,
      email: data.email,
      phone: data.phone || '+91 9999999999',
      program: `Contact Inquiry: ${data.subject}`,
      message: data.message
    });

    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 6000);
  };

  const faqItems = [
    {
      id: 'faq-c1',
      title: 'How does the course enquiry and admission process work?',
      content: 'Once you submit an enquiry on our website, a senior academic counselor reviews your background, contacts you to discuss track suitability, explains batch schedules, and shares the comprehensive curriculum outline.'
    },
    {
      id: 'faq-c2',
      title: 'How are course fees and installment plans arranged?',
      content: 'Course fees, early bird allowances, and flexible installment options are provided by our counseling team during your admission consultation.'
    },
    {
      id: 'faq-c3',
      title: 'Can I request a 1-on-1 counseling callback or syllabus walkthrough?',
      content: 'Yes. You can specify your preferred callback time (Morning, Afternoon, Evening) and mode (Phone Call, WhatsApp, Email) when submitting your enquiry.'
    },
    {
      id: 'faq-c4',
      title: 'How can I apply to become an instructor or industry mentor?',
      content: 'If you have over 5 years of production technology experience in cloud engineering, data systems, or cybersecurity operations and a passion for mentoring, email your profile to careers@edqoo.com.'
    }
  ].map((faq) => ({
    id: faq.id,
    title: faq.title,
    content: <p className="text-xs leading-relaxed text-slate-600">{faq.content}</p>
  }));

  return (
    <div className="bg-slate-50 min-h-screen text-left">
      <SEO 
        title="Contact Us & Admissions Support" 
        description="Get in touch with EDQOO admissions counselors, request course information, or read through our enquiry FAQ directory."
        canonical="/contact"
      />
      {/* Contact Hero */}
      <section className="bg-gradient-to-b from-purple-50/60 via-slate-50 to-white text-slate-950 py-16 text-center relative overflow-hidden border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 relative z-10">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block">
            Admissions & Support Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-950">
            How Can We Help You?
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Reach out for curriculum questions, course fee details, batch timings, or corporate training inquiries.
          </p>
        </div>
      </section>

      {/* Main Form & Contact Info layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Form Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-2xs space-y-6">
          <h2 className="text-lg font-display font-bold text-slate-950 border-b border-slate-200 pb-3">
            Send Us an Inquiry
          </h2>

          {submitted && (
            <div className="p-4 bg-purple-50 border border-purple-200 text-purple-900 text-xs rounded-xl flex items-start gap-2.5 font-medium animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <span className="font-bold block">Inquiry Received!</span>
                <span>Our team will review your request and get in touch with you shortly.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field: Name */}
              <div className="space-y-1">
                <label htmlFor="contact-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  placeholder="e.g. John Doe"
                  {...register('name')}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                    errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-purple-600'
                  }`}
                />
                {errors.name && <span className="text-[10px] text-red-500 font-medium">{errors.name.message}</span>}
              </div>

              {/* Field: Email */}
              <div className="space-y-1">
                <label htmlFor="contact-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  placeholder="e.g. john@example.com"
                  {...register('email')}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-purple-600'
                  }`}
                />
                {errors.email && <span className="text-[10px] text-red-500 font-medium">{errors.email.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field: Phone */}
              <div className="space-y-1">
                <label htmlFor="contact-phone" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  id="contact-phone"
                  placeholder="e.g. +91 9999999999"
                  {...register('phone')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                />
              </div>

              {/* Field: Subject */}
              <div className="space-y-1">
                <label htmlFor="contact-subject" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Subject / Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  placeholder="e.g. Cybersecurity Batch Schedule, Corporate Rates"
                  {...register('subject')}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                    errors.subject ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-purple-600'
                  }`}
                />
                {errors.subject && <span className="text-[10px] text-red-500 font-medium">{errors.subject.message}</span>}
              </div>
            </div>

            {/* Field: Message */}
            <div className="space-y-1">
              <label htmlFor="contact-message" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Message Body <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={5}
                placeholder="Describe your inquiry, background, or question in detail..."
                {...register('message')}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                  errors.message ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-purple-600'
                }`}
              />
              {errors.message && <span className="text-[10px] text-red-500 font-medium">{errors.message.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? 'Sending Inquiry...' : 'Send Message'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Info & FAQ Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Contacts details */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
            <h3 className="font-display font-bold text-base text-slate-950 border-b border-slate-200 pb-2">
              Admissions & Contact Office
            </h3>
            
            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="w-4.5 h-4.5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">General Admissions</span>
                  <a href="mailto:support@edqoo.com" className="text-purple-600 hover:underline">support@edqoo.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4.5 h-4.5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Phone Inquiries</span>
                  <span className="text-slate-600 font-semibold">+91 9999999999</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Corporate Office</span>
                  <span className="text-slate-500">Edqoo Technologies, 100 Pine St, San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQs */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-slate-950 flex items-center gap-1.5 px-1">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              Admissions FAQs
            </h3>
            <Accordion items={faqItems} allowMultiple={true} />
          </div>
        </div>

      </section>
    </div>
  );
};
