import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Cpu,
  UserCheck,
  Globe,
  AlertTriangle,
  Lock,
  Layers,
  Server,
  HelpCircle,
  Clock,
  ArrowRight,
  Mail,
  Phone,
  ChevronRight
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

export const TermsAndConditions: React.FC = () => {
  const { openEnquiryModal } = useEnquiry();
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', label: '1. Introduction', icon: FileText },
    { id: 'course-info', label: '2. Course & Program Information', icon: Layers },
    { id: 'tech-advancement', label: '3. Technology Advancement', icon: Cpu },
    { id: 'instructor-changes', label: '4. Instructor Changes', icon: UserCheck },
    { id: 'website-content', label: '5. Website Content', icon: Globe },
    { id: 'user-responsibilities', label: '6. User Responsibilities', icon: Lock },
    { id: 'intellectual-property', label: '7. Intellectual Property', icon: ShieldCheck },
    { id: 'third-party', label: '8. Third-Party Services', icon: Server },
    { id: 'availability', label: '9. Availability & Maintenance', icon: Clock },
    { id: 'liability', label: '10. Limitation of Liability', icon: AlertTriangle },
    { id: 'changes-to-terms', label: '11. Changes to Terms', icon: HelpCircle },
    { id: 'contact', label: '12. Contact Information', icon: Mail }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 text-left">
      <SEO
        title="Terms & Conditions"
        description="Review the terms and conditions governing the use of EDQOO's website, courses, materials, and educational services."
        canonical="/terms-and-conditions"
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-purple-50/70 via-slate-50 to-white text-slate-950 py-14 sm:py-18 text-center relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(109,34,181,0.08),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before accessing or using our website, educational programs, and learning resources.
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Last updated: September 2026 &bull; Effective immediately upon access
          </p>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Terms & Conditions</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Table of Contents (Desktop Sticky) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 font-bold border-l-2 border-purple-600 pl-2.5'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span className="truncate">{sec.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Advisory Contact Card */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <h4 className="text-sm font-bold font-display">Have Questions About Our Terms?</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Our support and advisory teams are ready to help with any curriculum or program inquiry.
              </p>
              <button
                onClick={() => openEnquiryModal()}
                className="w-full py-2 bg-white text-purple-950 hover:bg-purple-50 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Request Advisory Callback</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>

          {/* Right Document Body (8 cols) */}
          <main className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-10">

            {/* Section 1: Introduction */}
            <section id="introduction" className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Section 1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                1. Introduction
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Welcome to <strong className="text-slate-900">Edqoo</strong>. By accessing, browsing, registering for, or using our website, educational platforms, learning portals, course materials, or associated services (collectively, the &ldquo;Services&rdquo;), you acknowledge that you have read, understood, and agree to be legally bound by the terms and conditions set forth on this page.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If you do not agree with any part of these Terms &amp; Conditions, you must immediately discontinue your access to and use of this website and our learning materials.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 2: Course & Program Information */}
            <section id="course-info" className="space-y-4">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Section 2</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                2. Course &amp; Program Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All course information, program outlines, curriculums, modules, learning materials, capstone projects, tools, technologies, program duration, live session schedules, and other educational components displayed on the website are provided for instructional and informative purposes and may be updated from time to time.
              </p>

              {/* Crucial Mandatory Clause Box */}
              <div className="p-5 sm:p-6 bg-purple-50/70 border-l-4 border-purple-600 rounded-r-xl space-y-2">
                <h3 className="text-sm font-bold text-purple-950 font-display flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-purple-600" />
                  Course and Project Updates
                </h3>
                <blockquote className="text-xs sm:text-sm text-purple-900 leading-relaxed italic">
                  &ldquo;The courses, curriculum, projects, tools, technologies, learning materials, session structure, and other program components may be modified, updated, replaced, or discontinued at any time based on technological advancements, industry requirements, market trends, instructor expertise, or other educational and operational considerations. Such changes may be made without prior notice when necessary to ensure that the learning content remains relevant and up to date.&rdquo;
                </blockquote>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We make continuous efforts to reflect industry developments and modern software releases in our teaching tracks so that students gain contemporary and applicable skills.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 3: Technology Advancement */}
            <section id="tech-advancement" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Section 3</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                3. Technology Advancement
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Technology domains, cloud architectures, artificial intelligence toolchains, machine learning frameworks, programming languages, and industry practices continuously evolve at a rapid pace. Consequently, the website and program providers reserve the right to revise, update, deprecate, or modernize technical modules, tool selections, code repositories, and laboratory environments to maintain alignment with emerging industry standards.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 4: Instructor Changes */}
            <section id="instructor-changes" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <UserCheck className="w-4 h-4" />
                <span>Section 4</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                4. Instructor &amp; Mentor Changes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Instructors, mentors, industry practitioners, guest trainers, or faculty members assigned to a particular course or live session batch may be substituted or changed based on availability, specialized technical expertise, scheduling needs, or organizational requirements.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Edqoo guarantees that any replacement instructor or mentor will possess the qualified technical background and domain proficiency required to deliver the educational track effectively.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 5: Website Content */}
            <section id="website-content" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Section 5</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                5. Website Content &amp; Accuracy
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Website content, graphical illustrations, course descriptions, fee schedules, batch dates, brochures, and related descriptive information are provided in good faith and may be updated, corrected, amended, or supplemented from time to time without advance notice.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 6: User Responsibilities */}
            <section id="user-responsibilities" className="space-y-4">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>Section 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                6. User Responsibilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                As a user, learner, or visitor of our website, you agree to uphold standard ethical conduct and agree that you are solely responsible for:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 pl-1">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                  <span><strong className="text-slate-900">Providing Accurate Information:</strong> Submitting truthful, current, and complete details when submitting enquiry forms, admission applications, or creating account credentials.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                  <span><strong className="text-slate-900">Credential Confidentiality:</strong> Maintaining the strict secrecy and confidentiality of any login credentials, access tokens, or account passwords.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                  <span><strong className="text-slate-900">Lawful Purpose:</strong> Accessing and utilizing the website and its resources strictly for legitimate educational, professional, and lawful purposes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                  <span><strong className="text-slate-900">Non-Redistribution:</strong> Not copying, recording, downloading without authorization, redistributing, reselling, or commercially misusing course materials, recorded lectures, or proprietary code repositories.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                  <span><strong className="text-slate-900">Access Protection:</strong> Not sharing protected learning materials, login tokens, or account access with unauthorized third parties or public forums.</span>
                </li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Section 7: Intellectual Property */}
            <section id="intellectual-property" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Section 7</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                7. Intellectual Property
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All website content, trademarks, branding, logos, graphics, user interface designs, curriculum outlines, instructional videos, lecture notes, assignments, software code snippets, and documentation belong exclusively to <strong className="text-slate-900">Edqoo</strong> or its content licensors, protected by applicable copyright, trademark, and intellectual property laws.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Users are granted a limited, personal, non-exclusive, non-transferable, revocable license to access the learning materials solely for their individual educational development. Users must not reproduce, republish, distribute, modify, reverse-engineer, sell, or commercially exploit protected content without explicit written permission.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 8: Third-Party Services */}
            <section id="third-party" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Server className="w-4 h-4" />
                <span>Section 8</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                8. Third-Party Services &amp; Integrations
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our platform may interface with or utilize third-party services, including payment gateways, video streaming platforms, web analytics, cloud database hosting (such as Neon PostgreSQL and cloud infrastructure), and communication providers.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We are not responsible for the availability, policies, or practices of external third-party platforms. Your interaction with third-party tools is subject to their respective terms of service and privacy practices.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 9: Availability & Maintenance */}
            <section id="availability" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Section 9</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                9. Service Availability &amp; Maintenance
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                While we strive for 24/7 uptime, the website, learning portals, or specific digital services may occasionally become unavailable due to scheduled server maintenance, security upgrades, technical faults, telecommunication failures, third-party hosting interruptions, or unforeseen operational circumstances.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 10: Limitation of Liability */}
            <section id="liability" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Section 10</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                10. Limitation of Liability
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Edqoo makes reasonable efforts to ensure the accuracy, usefulness, and reliability of the information and training provided. However, all services, programs, and materials are provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis without warranties of any kind, whether express or implied.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To the fullest extent permitted by applicable law, Edqoo and its officers, educators, partners, and affiliates shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from the use of, or inability to use, our website, courses, or third-party integrations.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 11: Changes to Terms */}
            <section id="changes-to-terms" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Section 11</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                11. Changes to Terms &amp; Conditions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We reserve the right to revise, modify, or update these Terms &amp; Conditions periodically to reflect evolving legal frameworks, technological enhancements, or organizational policies. Any revisions will become effective immediately upon posting to this page.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Users are encouraged to review this page periodically to remain informed about our applicable terms.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 12: Contact Information */}
            <section id="contact" className="space-y-4">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Mail className="w-4 h-4" />
                <span>Section 12</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                12. Contact &amp; Enquiry Channels
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If you have questions, feedback, or concerns regarding these Terms &amp; Conditions, please get in touch with our team through our official support channels:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>Email Support</span>
                  </div>
                  <a href="mailto:support@edqoo.com" className="text-xs text-purple-700 font-semibold hover:underline block">
                    support@edqoo.com
                  </a>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span>Admissions Helpdesk</span>
                  </div>
                  <span className="text-xs text-slate-700 font-semibold block">
                    +91 90744 50935
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Visit Contact Support Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => openEnquiryModal()}
                  className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Submit an Enquiry</span>
                </button>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};
