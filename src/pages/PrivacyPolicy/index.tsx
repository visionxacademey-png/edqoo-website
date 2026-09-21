import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Eye,
  Lock,
  Cookie,
  Database,
  Share2,
  Server,
  UserCheck,
  AlertCircle,
  Clock,
  RefreshCw,
  Mail,
  Phone,
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

export const PrivacyPolicy: React.FC = () => {
  const { openEnquiryModal } = useEnquiry();
  const [activeSection, setActiveSection] = useState('info-collect');

  const sections = [
    { id: 'info-collect', label: '1. Information We Collect', icon: Database },
    { id: 'how-we-use', label: '2. How We Use Information', icon: Eye },
    { id: 'cookies', label: '3. Cookies & Tracking', icon: Cookie },
    { id: 'data-security', label: '4. Data Security & Storage', icon: Lock },
    { id: 'data-sharing', label: '5. Data Sharing & Disclosure', icon: Share2 },
    { id: 'third-party', label: '6. Third-Party Integrations', icon: Server },
    { id: 'data-retention', label: '7. Data Retention', icon: Clock },
    { id: 'user-rights', label: '8. Your Rights & Choices', icon: UserCheck },
    { id: 'children-privacy', label: '9. Children’s Privacy', icon: AlertCircle },
    { id: 'policy-updates', label: '10. Policy Updates', icon: RefreshCw },
    { id: 'contact', label: '11. Privacy Contact', icon: Mail }
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
        title="Privacy Policy"
        description="Learn how EDQOO collects, utilizes, safeguards, and respects your personal data and digital privacy across our educational platform."
        canonical="/privacy-policy"
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-purple-50/70 via-slate-50 to-white text-slate-950 py-14 sm:py-18 text-center relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(109,34,181,0.08),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Your privacy is of utmost importance to us. This policy clearly outlines the data we collect, how it is processed, and how you can exercise your rights.
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Last updated: September 2026 &bull; Effective upon access
          </p>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Privacy Policy</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar Table of Contents (Desktop Sticky) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                Policy Sections
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

            {/* Privacy Promise Callout */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-xs font-display">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Our Privacy Commitment</span>
              </div>
              <p className="text-xs text-purple-900/80 leading-relaxed">
                We never sell your personal data. We collect only what is necessary to deliver quality educational counseling, secure account access, and tailored learning materials.
              </p>
            </div>
          </aside>

          {/* Right Document Body (8 cols) */}
          <main className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-10">

            {/* Section 1: Information We Collect */}
            <section id="info-collect" className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>Section 1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                1. Information We Collect
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We collect information directly from you when you interact with our website, submit admission inquiries, request callbacks, or create an account. Depending on how you interact with our platform, the information collected may include:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Personal &amp; Contact Details
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Full Name</li>
                    <li>Email Address</li>
                    <li>Phone / WhatsApp Contact Number</li>
                    <li>City, State, and Country</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Academic &amp; Professional Info
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Course &amp; program preferences</li>
                    <li>Academic background or graduation status</li>
                    <li>Current organization or college (if provided)</li>
                    <li>Preferred mode &amp; callback schedule</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Account &amp; Authentication Data
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Account password hash (where registered)</li>
                    <li>Assigned role (Student / Administrator)</li>
                    <li>Profile avatar and login timestamps</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Technical &amp; Telemetry Data
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>IP address and approximate location</li>
                    <li>Device type (Desktop, Mobile, Tablet)</li>
                    <li>Operating system and browser version</li>
                    <li>Screen resolution, language, and timezone</li>
                  </ul>
                </div>
              </div>

              <p className="text-xs text-slate-500 italic">
                Note: We only collect information voluntarily submitted through enquiry and contact forms, or automatically captured for security and telemetry purposes as implemented on the website.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 2: How We Use Information */}
            <section id="how-we-use" className="space-y-4">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Eye className="w-4 h-4" />
                <span>Section 2</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                2. How We Use Your Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We use the information we collect strictly for legitimate educational, operational, and customer support purposes, including:
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600">
                {[
                  'Responding to program enquiries & counselling requests',
                  'Providing detailed curriculum outlines and fee schedules',
                  'Managing student accounts, batches, and credentials',
                  'Communicating important academic and schedule updates',
                  'Enhancing platform performance and user experience',
                  'Preventing fraud and securing user sessions',
                  'Analyzing website usage patterns and popular tracks',
                  'Complying with applicable legal and audit requirements'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Section 3: Cookies */}
            <section id="cookies" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Cookie className="w-4 h-4" />
                <span>Section 3</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                3. Cookies and Tracking Technologies
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our website utilizes cookies, local storage, and similar technologies to facilitate essential features, such as maintaining authentication sessions, storing user display preferences, analyzing site traffic, and ensuring site security.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You can manage or disable cookie preferences through your web browser settings. However, disabling essential cookies may impact certain interactive features, such as maintaining an active login session.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 4: Data Security */}
            <section id="data-security" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>Section 4</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                4. Data Security
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We implement robust technical and organizational security measures, including HTTPS encryption, parameterized database queries, password hashing (bcrypt), and role-based access control to safeguard your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                While we employ rigorous standards to protect your information, no transmission over the Internet or electronic storage method can guarantee absolute 100% security.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 5: Data Sharing */}
            <section id="data-sharing" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Share2 className="w-4 h-4" />
                <span>Section 5</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                5. Data Sharing &amp; Disclosure
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-900">We do not sell, rent, or trade your personal information to third parties for marketing purposes.</strong>
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Personal data may only be shared with trusted third-party service providers (such as cloud hosting providers, communication channels, or database infrastructure) solely to the extent necessary to operate the platform and deliver our educational services, under strict confidentiality obligations.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 6: Third-Party Services */}
            <section id="third-party" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Server className="w-4 h-4" />
                <span>Section 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                6. Third-Party Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The website utilizes third-party tools for specific operational functions, including cloud database hosting (Neon PostgreSQL), web hosting and CDN infrastructure, and analytics.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                These third-party platforms maintain their own independent privacy policies. We encourage users to review the privacy notices of external services they interact with.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 7: Data Retention */}
            <section id="data-retention" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Section 7</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                7. Data Retention
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We retain personal information only for as long as reasonably necessary to fulfill the educational purposes for which it was gathered, maintain accurate academic records, resolve support requests, prevent fraud, and comply with applicable legal or accounting obligations.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 8: User Rights */}
            <section id="user-rights" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <UserCheck className="w-4 h-4" />
                <span>Section 8</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                8. Your Rights and Choices
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Depending on your location and subject to applicable privacy laws, you may have the following rights regarding your personal information:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-4 list-disc">
                <li><strong className="text-slate-900">Access:</strong> The right to request copies of the personal data we hold about you.</li>
                <li><strong className="text-slate-900">Rectification:</strong> The right to request correction of inaccurate or incomplete details.</li>
                <li><strong className="text-slate-900">Erasure:</strong> The right to request deletion of your personal data under certain conditions.</li>
                <li><strong className="text-slate-900">Opt-out:</strong> The right to opt-out of promotional communications at any time.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To exercise any of these rights, please contact our support team at <a href="mailto:support@edqoo.com" className="text-purple-700 font-semibold hover:underline">support@edqoo.com</a>.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 9: Children's Privacy */}
            <section id="children-privacy" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Section 9</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                9. Children&rsquo;s Privacy
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our educational programs and services are intended for college students, working professionals, and adult learners. We do not knowingly collect personal information directly from children under the age of 16 without appropriate parental or institutional consent.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 10: Policy Updates */}
            <section id="policy-updates" className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <RefreshCw className="w-4 h-4" />
                <span>Section 10</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                10. Updates to this Privacy Policy
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We may periodically update this Privacy Policy to reflect modifications to our practices, operational needs, or legal requirements. When changes are made, the revised policy will be posted on this page with an updated revision date.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 11: Contact */}
            <section id="contact" className="space-y-4">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Mail className="w-4 h-4" />
                <span>Section 11</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
                11. Contact Us Regarding Privacy
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If you have questions, concerns, or requests regarding this Privacy Policy or how your personal information is managed, please contact our team:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>Privacy &amp; Support Email</span>
                  </div>
                  <a href="mailto:support@edqoo.com" className="text-xs text-purple-700 font-semibold hover:underline block">
                    support@edqoo.com
                  </a>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span>Admissions Helpline</span>
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
                  <span>Go to Support Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => openEnquiryModal()}
                  className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Request Information</span>
                </button>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};
