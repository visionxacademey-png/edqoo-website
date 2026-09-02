import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SEO } from '../../components/common/SEO';
import { enquiryService } from '../../services/enquiryService';

// Form validation schema using Zod
const contactSchema = zod.object({
  name: zod.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: zod.string().email({ message: 'Please enter a valid email address.' }),
  phone: zod.string().optional(),
  subject: zod.string().min(4, { message: 'Subject must be at least 4 characters.' }),
  message: zod.string().min(10, { message: 'Message must be at least 10 characters.' })
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
    try {
      await enquiryService.submitEnquiry({
        name: data.name,
        email: data.email,
        phone: data.phone || 'N/A',
        program: `Contact Form: ${data.subject}`,
        message: data.message
      });
      setSubmitted(true);
      reset();
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch {
      console.error('Failed to submit contact enquiry');
    }
  };

  const faqItems = [
    {
      id: 'faq-c1',
      title: 'Can I request corporate team training?',
      content: 'Yes! Edqoo offers group registration rates and custom labs configurations for corporate technology teams. Please mention "Corporate Training" in the Subject field to route your request to our enterprise accounts department.'
    },
    {
      id: 'faq-c2',
      title: 'How do I request a refund?',
      content: 'We offer a 14-day refund window on all core tracks, provided you have completed less than 20% of the lessons and have not downloaded multiple course lab folders. Email support@Edqoo.com directly to initiate a request.'
    },
    {
      id: 'faq-c3',
      title: 'How can I apply to become an instructor?',
      content: 'If you have over 5 years of production technology experience in cloud engineering, DevOps, data systems, or cybersecurity operations and a passion for project-based learning, email your resume to careers@Edqoo.com.'
    }
  ].map((faq) => ({
    id: faq.id,
    title: faq.title,
    content: <p className="text-xs leading-relaxed text-slate-500">{faq.content}</p>
  }));

  return (
    <div className="bg-deep-navy-50 min-h-screen">
      <SEO 
        title="Contact Support" 
        description="Get in touch with Edqoo support, request enterprise training packages, or read through our enrollment FAQ directory."
        canonical="/contact"
      />
      {/* Contact Hero */}
      <section className="bg-deep-navy-950 text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-semibold text-royal-blue-300 uppercase tracking-widest block">
            Support Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            How Can We Help You?
          </h1>
          <p className="text-slate-350 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Reach out for technical questions, enrollment help, or corporate training inquiries.
          </p>
        </div>
      </section>

      {/* Main Form & Contact Info layout (Grid: Form (7) vs Details (5)) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Form Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-deep-navy-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <h2 className="text-lg font-display font-bold text-deep-navy-900 border-b border-deep-navy-200 pb-3">
            Send Us a Message
          </h2>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5 font-medium animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-bold block">Support Request Received!</span>
                <span>We have cataloged your ticket and will follow up via email within 24 hours.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field: Name */}
              <div className="space-y-1">
                <label htmlFor="contact-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Full Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  placeholder="e.g. John Doe"
                  {...register('name')}
                  className={`w-full px-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none ${
                    errors.name ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-500'
                  }`}
                />
                {errors.name && <span className="text-[10px] text-red-500 font-medium">{errors.name.message}</span>}
              </div>

              {/* Field: Email */}
              <div className="space-y-1">
                <label htmlFor="contact-email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Email Address
                </label>
                <input
                  type="email"
                  id="contact-email"
                  placeholder="e.g. john@example.com"
                  {...register('email')}
                  className={`w-full px-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-500'
                  }`}
                />
                {errors.email && <span className="text-[10px] text-red-500 font-medium">{errors.email.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field: Phone */}
              <div className="space-y-1">
                <label htmlFor="contact-phone" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  id="contact-phone"
                  placeholder="e.g. +1 555-0100"
                  {...register('phone')}
                  className="w-full px-3 py-2 bg-deep-navy-50 border border-deep-navy-200 rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:border-royal-blue-500"
                />
              </div>

              {/* Field: Subject */}
              <div className="space-y-1">
                <label htmlFor="contact-subject" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Subject
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  placeholder="e.g. Corporate Rates, Login Issues"
                  {...register('subject')}
                  className={`w-full px-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none ${
                    errors.subject ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-500'
                  }`}
                />
                {errors.subject && <span className="text-[10px] text-red-500 font-medium">{errors.subject.message}</span>}
              </div>
            </div>

            {/* Field: Message */}
            <div className="space-y-1">
              <label htmlFor="contact-message" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Message Body
              </label>
              <textarea
                id="contact-message"
                rows={5}
                placeholder="Describe your request in detail..."
                {...register('message')}
                className={`w-full px-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none ${
                  errors.message ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-500'
                }`}
              />
              {errors.message && <span className="text-[10px] text-red-500 font-medium">{errors.message.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm animate-pulse"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Info & FAQ Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Contacts details */}
          <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-deep-navy-900 border-b border-deep-navy-200 pb-2">
              Contact Information
            </h3>
            
            <div className="space-y-4 text-xs text-slate-650">
              <div className="flex items-start gap-3">
                <Mail className="w-4.5 h-4.5 text-royal-blue-600 mt-0.5" />
                <div>
                  <span className="font-bold text-deep-navy-900 block">General Support</span>
                  <a href="mailto:support@Edqoo.com" className="text-royal-blue-600 hover:underline">support@Edqoo.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4.5 h-4.5 text-royal-blue-600 mt-0.5" />
                <div>
                  <span className="font-bold text-deep-navy-900 block">Phone Queries</span>
                  <span className="text-slate-500">+1 (555) 019-2844</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-royal-blue-600 mt-0.5" />
                <div>
                  <span className="font-bold text-deep-navy-900 block">Corporate HQ</span>
                  <span className="text-slate-500">Edqoo Technologies, 100 Pine St, San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQs */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-deep-navy-900 flex items-center gap-1.5 px-1">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              Support FAQs
            </h3>
            <Accordion items={faqItems} allowMultiple={true} />
          </div>
        </div>

      </section>
    </div>
  );
};
