import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowLeft,
  FileText,
  AlertCircle,
  PhoneCall
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { englishMirrorPoliciesConfig } from '../../data/englishMirror';
import { useEnquiry } from '../../context/EnquiryContext';

export const EnglishMirrorPolicies: React.FC = () => {
  const { openEnquiryModal } = useEnquiry();

  const breadcrumbItems = [
    { name: 'Programs', url: '/programs' },
    { name: 'English Mirror', url: '/english-mirror' },
    { name: 'Policies & Terms', url: '/english-mirror/policies' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 text-left">
      <SEO
        title="English Mirror Policies & Terms | Partner Learning Experience | Edqoo"
        description="Official terms and conditions, scheduling rules, refund policy, code of conduct, and privacy policy for English Mirror programs delivered in partnership with Edqoo."
        canonical="/english-mirror/policies"
        breadcrumbs={[{ name: 'Home', url: '/' }, ...breadcrumbItems]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-purple-50/80 via-slate-50 to-white text-slate-950 py-12 sm:py-16 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-purple-700" />
            <span>Partner Governance & Policies</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <img
              src="/englishclass.png"
              alt="English Mirror Logo"
              className="h-10 w-auto object-contain"
            />
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                ENGLISH MIRROR
              </span>
              <span className="text-sm text-purple-700 font-bold block">
                Partner Learning Policies
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-slate-950 tracking-tight">
            English Mirror Policies, Terms &amp; Student Privacy
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
            English Mirror programs are delivered in partner collaboration on Edqoo. Below are the official guidelines governing enrolment, 1-to-1 session attendance, subscription payments, code of conduct, refunds, and learner data privacy.
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
            <span>Version {englishMirrorPoliciesConfig.version} &bull; Last updated {englishMirrorPoliciesConfig.lastUpdated}</span>
            <Link to="/english-mirror" className="text-purple-700 font-bold hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to English Mirror Track</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Highlight Alert Box */}
        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-xs text-purple-900 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-purple-950 text-sm">
            <AlertCircle className="w-4 h-4 text-purple-700" />
            <span>Key Terms Summary</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-xs leading-relaxed pt-1">
            <li>
              <strong>Refund Eligibility:</strong> Refund requests may be submitted <em>only prior to the learner’s first scheduled live or telephonic session</em>. Once the first session has commenced, subscriptions become non-refundable.
            </li>
            <li>
              <strong>Session Rescheduling:</strong> At least 6 hours advance notice is required to reschedule an individual 1-to-1 session.
            </li>
            <li>
              <strong>Student Privacy:</strong> Student personal details and learning data are strictly protected and never sold or shared with external third parties.
            </li>
          </ul>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {englishMirrorPoliciesConfig.sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 text-left"
            >
              <h2 className="text-base sm:text-lg font-display font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>{sec.title}</span>
              </h2>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                {sec.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Support Card */}
        <div className="p-6 rounded-2xl bg-white border border-purple-200 text-slate-900 shadow-2xs space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-slate-950">
              Have Questions About English Mirror Policies?
            </h3>
            <p className="text-slate-600 text-xs max-w-lg">
              Our academic advisory team is available to assist with batch timing, subscription terms, and trainer allocation.
            </p>
          </div>
          <button
            onClick={() => openEnquiryModal('English Mirror Policy Query')}
            className="btn-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-2xs inline-flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 text-white" />
            <span>Enquire with Support</span>
          </button>
        </div>

      </main>
    </div>
  );
};
