import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Helper to escape HTML characters in user input to prevent XSS in email clients
export function escapeHtml(str: any): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface SendEmailOptions {
  to?: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string | string[];
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

// Get Resend API Key and configuration from environment (Server-Side ONLY)
const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL?.trim() || 'Edqoo <onboarding@resend.dev>';
const DEFAULT_RECEIVER = process.env.CONTACT_RECEIVER_EMAIL?.trim() || 'admin@edqoo.com';

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY || RESEND_API_KEY === 'your_resend_api_key') {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Base template builder for all Edqoo notification emails
 */
function buildEmailTemplate({
  badge,
  title,
  subtitle,
  details,
  messageBoxTitle,
  messageBoxContent
}: {
  badge: string;
  title: string;
  subtitle?: string;
  details: Array<{ label: string; value: string | undefined | null }>;
  messageBoxTitle?: string;
  messageBoxContent?: string | null;
}): string {
  const filteredDetails = details.filter((d) => d.value !== undefined && d.value !== null && d.value !== '');

  const rowsHtml = filteredDetails
    .map(
      (d, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'}; border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 14px; font-size: 12px; font-weight: 700; color: #475569; width: 35%; vertical-align: top;">
          ${escapeHtml(d.label)}
        </td>
        <td style="padding: 10px 14px; font-size: 13px; font-weight: 500; color: #0f172a; width: 65%; vertical-align: top;">
          ${escapeHtml(d.value)}
        </td>
      </tr>`
    )
    .join('');

  const messageSection = messageBoxContent
    ? `
    <div style="margin-top: 24px; padding: 16px; background-color: #f1f5f9; border-left: 4px solid #7c3aed; border-radius: 8px;">
      <div style="font-size: 11px; font-weight: 800; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
        ${escapeHtml(messageBoxTitle || 'Message / Submission Details')}
      </div>
      <div style="font-size: 13px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">
        ${escapeHtml(messageBoxContent)}
      </div>
    </div>`
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #431407 0%, #4c1d95 100%); padding: 28px 32px; text-align: left;">
              <div style="display: inline-block; padding: 4px 10px; background-color: rgba(255, 255, 255, 0.15); border-radius: 6px; font-size: 10px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
                ${escapeHtml(badge)}
              </div>
              <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                ${escapeHtml(title)}
              </h1>
              ${
                subtitle
                  ? `<p style="margin: 0; font-size: 13px; color: #e9d5ff; line-height: 1.4;">${escapeHtml(subtitle)}</p>`
                  : ''
              }
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 32px;">
              
              <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 12px;">
                Submission Summary
              </div>

              <!-- Details Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>

              ${messageSection}

              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #64748b;">
                  💡 <strong>Tip:</strong> Click <strong>Reply</strong> in your email client to respond directly to this applicant.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                This automated notification was generated by the <strong>Edqoo Website</strong>.
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} Edqoo. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * User Confirmation Email Template
 */
function buildUserConfirmationTemplate({
  name,
  subject,
  message
}: {
  name: string;
  subject: string;
  message?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Thank you for contacting Edqoo</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%); padding: 28px 32px; text-align: left;">
              <div style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                EDQOO
              </div>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #e9d5ff;">
                Applied Technology Learning & Career Acceleration
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #0f172a;">
                Hello ${escapeHtml(name)},
              </h2>
              <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 1.6; color: #334155;">
                Thank you for reaching out to Edqoo regarding <strong>${escapeHtml(subject)}</strong>.
              </p>
              <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 1.6; color: #334155;">
                We have received your submission and our dedicated team is reviewing your details. An academic advisor or specialist will connect with you shortly via phone, email, or WhatsApp.
              </p>

              ${
                message
                  ? `<div style="margin: 20px 0; padding: 14px 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Summary of your message:</div>
                      <div style="font-size: 12px; color: #1e293b; line-height: 1.5;">${escapeHtml(message)}</div>
                    </div>`
                  : ''
              }

              <div style="margin-top: 24px; padding: 16px; background-color: #faf5ff; border-radius: 8px; border: 1px solid #f3e8ff;">
                <p style="margin: 0; font-size: 12px; color: #6b21a8; font-weight: 600;">
                  📞 Need immediate assistance?
                </p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #581c87;">
                  You can call or WhatsApp us directly at <strong>+91 90744 50935</strong> or email <strong>support@edqoo.com</strong>.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                Edqoo &bull; Online Learning Platform for AI, Data Science & Career Acceleration
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export const emailService = {
  /**
   * Generic low-level email sender using Resend
   */
  sendEmail: async ({
    to,
    subject,
    html,
    text,
    replyTo
  }: SendEmailOptions): Promise<EmailResult> => {
    const receiver = to || DEFAULT_RECEIVER;
    const client = getResendClient();

    console.log(`\n[EMAIL SERVICE] Preparing email transmission`);
    console.log(`[EMAIL SERVICE] Subject: "${subject}"`);
    console.log(`[EMAIL SERVICE] To: ${Array.isArray(receiver) ? receiver.join(', ') : receiver}`);
    console.log(`[EMAIL SERVICE] From: ${DEFAULT_FROM}`);
    console.log(`[EMAIL SERVICE] Reply-To: ${replyTo ? (Array.isArray(replyTo) ? replyTo.join(', ') : replyTo) : 'None'}`);

    if (!client) {
      console.warn(
        `[EMAIL SERVICE WARNING] RESEND_API_KEY is not configured or is set to default placeholder in environment.`
      );
      console.warn(`[EMAIL SERVICE WARNING] Email with subject "${subject}" was NOT sent to external inbox.`);
      return {
        success: false,
        error: 'RESEND_API_KEY is not configured on the server.'
      };
    }

    try {
      const response = await client.emails.send({
        from: DEFAULT_FROM,
        to: receiver,
        subject,
        html,
        text: text || undefined,
        replyTo: replyTo ? (Array.isArray(replyTo) ? replyTo : [replyTo]) : undefined
      });

      if (response.error) {
        console.error('[EMAIL SERVICE ERROR] Resend returned error:', response.error.message || response.error);
        return {
          success: false,
          error: response.error.message || 'Resend failed to send email.'
        };
      }

      console.log(`✅ [EMAIL SERVICE SUCCESS] Resend accepted email. ID: ${response.data?.id}\n`);
      return {
        success: true,
        id: response.data?.id
      };
    } catch (err: any) {
      console.error('[EMAIL SERVICE EXCEPTION] Unexpected error communicating with Resend:', err.message || err);
      return {
        success: false,
        error: err.message || 'Failed to dispatch email via Resend.'
      };
    }
  },

  /**
   * 1. Instructor Joining Form Notification
   */
  sendInstructorApplicationEmail: async (app: {
    name: string;
    email: string;
    phone: string;
    designation: string;
    organization: string;
    qualification: string;
    expertise: string;
    experience: string;
    teachingExperience?: string;
    courses: string;
    linkedin?: string;
    portfolio?: string;
    bio: string;
    resume?: string;
    additionalInformation?: string;
    submittedAt?: string;
  }): Promise<EmailResult> => {
    const subject = `New Instructor Joining Application - ${app.name}`;
    const submissionTime = app.submittedAt ? new Date(app.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const html = buildEmailTemplate({
      badge: 'Faculty Application',
      title: 'New Instructor Joining Application',
      subtitle: `${app.name} has applied to join Edqoo as an Instructor / Faculty Member.`,
      details: [
        { label: 'Applicant Name', value: app.name },
        { label: 'Email Address', value: app.email },
        { label: 'Phone Number', value: app.phone },
        { label: 'Current Designation', value: app.designation },
        { label: 'Current Organization', value: app.organization },
        { label: 'Highest Qualification', value: app.qualification },
        { label: 'Primary Expertise', value: app.expertise },
        { label: 'Total Industry Experience', value: app.experience },
        { label: 'Teaching Experience', value: app.teachingExperience || 'Not Specified' },
        { label: 'Proposed Courses / Subjects', value: app.courses },
        { label: 'LinkedIn Profile', value: app.linkedin || 'Not Provided' },
        { label: 'Portfolio / Website', value: app.portfolio || 'Not Provided' },
        { label: 'Resume / Document', value: app.resume || 'Not Provided' },
        { label: 'Submission Date (IST)', value: submissionTime }
      ],
      messageBoxTitle: 'Professional Bio & Teaching Vision',
      messageBoxContent: `${app.bio}${app.additionalInformation ? `\n\nAdditional Notes:\n${app.additionalInformation}` : ''}`
    });

    return emailService.sendEmail({
      to: DEFAULT_RECEIVER,
      replyTo: app.email.trim(),
      subject,
      html
    });
  },

  /**
   * 2. Partner Form Notification
   */
  sendPartnerEnquiryEmail: async (partner: {
    organizationName: string;
    contactPerson: string;
    designation: string;
    email: string;
    phone: string;
    organizationType: string;
    partnershipArea: string;
    website?: string;
    location?: string;
    proposal: string;
    additionalInformation?: string;
    submittedAt?: string;
  }): Promise<EmailResult> => {
    const subject = `New Partnership Enquiry - ${partner.organizationName}`;
    const submissionTime = partner.submittedAt ? new Date(partner.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const html = buildEmailTemplate({
      badge: 'Strategic Partnership',
      title: 'New Partnership Enquiry',
      subtitle: `${partner.contactPerson} from ${partner.organizationName} has submitted a collaboration proposal.`,
      details: [
        { label: 'Organization Name', value: partner.organizationName },
        { label: 'Contact Person', value: partner.contactPerson },
        { label: 'Designation', value: partner.designation },
        { label: 'Email Address', value: partner.email },
        { label: 'Phone Number', value: partner.phone },
        { label: 'Organization Type', value: partner.organizationType },
        { label: 'Partnership Area', value: partner.partnershipArea },
        { label: 'Official Website', value: partner.website || 'Not Provided' },
        { label: 'Location / City', value: partner.location || 'Not Provided' },
        { label: 'Submission Date (IST)', value: submissionTime }
      ],
      messageBoxTitle: 'Partnership Proposal & Scope',
      messageBoxContent: `${partner.proposal}${partner.additionalInformation ? `\n\nAdditional Notes:\n${partner.additionalInformation}` : ''}`
    });

    return emailService.sendEmail({
      to: DEFAULT_RECEIVER,
      replyTo: partner.email.trim(),
      subject,
      html
    });
  },

  /**
   * 3. Contact Us Form Notification
   */
  sendContactFormEmail: async (contact: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    submittedAt?: string;
  }): Promise<EmailResult> => {
    const subject = `New Contact Form Submission - ${contact.subject || 'General Inquiry'}`;
    const submissionTime = contact.submittedAt ? new Date(contact.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const html = buildEmailTemplate({
      badge: 'Contact Desk',
      title: 'New Contact Form Submission',
      subtitle: `${contact.name} has sent an inquiry via the Contact Us page.`,
      details: [
        { label: 'Full Name', value: contact.name },
        { label: 'Email Address', value: contact.email },
        { label: 'Phone Number', value: contact.phone || 'Not Provided' },
        { label: 'Subject / Topic', value: contact.subject },
        { label: 'Submission Date (IST)', value: submissionTime }
      ],
      messageBoxTitle: 'Inquiry Message',
      messageBoxContent: contact.message
    });

    return emailService.sendEmail({
      to: DEFAULT_RECEIVER,
      replyTo: contact.email.trim(),
      subject,
      html
    });
  },

  /**
   * 4. Course Enquiry Notification
   */
  sendCourseEnquiryEmail: async (enquiry: {
    name: string;
    email: string;
    phone: string;
    program: string;
    courseId?: string;
    category?: string;
    source?: string;
    experienceLevel?: string;
    learningMode?: string;
    location?: string;
    preferredContactMethod?: string;
    preferredCallbackTime?: string;
    message?: string;
    submittedAt?: string;
  }): Promise<EmailResult> => {
    const courseTitle = enquiry.program || 'Course Program';
    const subject = `New Course Enquiry - ${courseTitle}`;
    const submissionTime = enquiry.submittedAt ? new Date(enquiry.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const html = buildEmailTemplate({
      badge: 'Course Enquiry',
      title: 'New Student Course Enquiry',
      subtitle: `${enquiry.name} is interested in enrolling in ${courseTitle}.`,
      details: [
        { label: 'Student Name', value: enquiry.name },
        { label: 'Email Address', value: enquiry.email },
        { label: 'Phone Number', value: enquiry.phone },
        { label: 'Interested Program / Course', value: enquiry.program },
        { label: 'Track / Category', value: enquiry.category || 'Standard Track' },
        { label: 'Source / Form Location', value: enquiry.source || 'Website Modal' },
        { label: 'Experience Level', value: enquiry.experienceLevel || 'Not Specified' },
        { label: 'Learning Mode Preference', value: enquiry.learningMode || 'Online Live' },
        { label: 'Preferred Contact Method', value: enquiry.preferredContactMethod || 'WhatsApp / Phone' },
        { label: 'Preferred Callback Window', value: enquiry.preferredCallbackTime || 'Flexible' },
        { label: 'Candidate Location', value: enquiry.location || 'Not Specified' },
        { label: 'Submission Date (IST)', value: submissionTime }
      ],
      messageBoxTitle: 'Candidate Questions / Notes',
      messageBoxContent: enquiry.message || 'No additional message provided.'
    });

    return emailService.sendEmail({
      to: DEFAULT_RECEIVER,
      replyTo: enquiry.email.trim(),
      subject,
      html
    });
  },

  /**
   * 5. Tools & Upskills Detailed Multi-Step Enquiry Notification
   */
  sendToolsUpskillsEnquiryEmail: async (enquiry: {
    name: string;
    email: string;
    phone: string;
    program: string;
    category?: string;
    profession?: string;
    highestQualification?: string;
    yearOfGraduation?: string;
    apaarAbcStatus?: string;
    apaarId?: string;
    ktuId?: string;
    collegeState?: string;
    collegeName?: string;
    universityName?: string;
    rollNumber?: string;
    organization?: string;
    designation?: string;
    yearsOfExperience?: string;
    department?: string;
    location?: string;
    city?: string;
    state?: string;
    pincode?: string;
    submittedAt?: string;
  }): Promise<EmailResult> => {
    const courseTitle = enquiry.program || 'Tools & Upskills Program';
    const subject = `New Tools & Upskills Enquiry - ${courseTitle}`;
    const submissionTime = enquiry.submittedAt ? new Date(enquiry.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const isStudent = enquiry.profession === 'Student' || !!enquiry.collegeName || !!enquiry.universityName;

    const details = [
      { label: 'Applicant Name', value: enquiry.name },
      { label: 'Email Address', value: enquiry.email },
      { label: 'Phone Number', value: enquiry.phone },
      { label: 'Program / Course', value: enquiry.program },
      { label: 'Track Category', value: enquiry.category || 'Tools & Upskills' },
      { label: 'Profession', value: enquiry.profession || (isStudent ? 'Student' : 'Working Professional') },
      { label: 'Highest Qualification', value: enquiry.highestQualification },
      { label: 'Year of Graduation', value: enquiry.yearOfGraduation },
      { label: 'APAAR / ABC ID Status', value: enquiry.apaarAbcStatus },
      { label: 'KTU / Registration ID', value: enquiry.ktuId },
      { label: 'College / Institute Name', value: enquiry.collegeName },
      { label: 'University Name', value: enquiry.universityName },
      { label: 'College State', value: enquiry.collegeState },
      { label: 'Student Roll / Reg Number', value: enquiry.rollNumber },
      { label: 'Employer / Company', value: enquiry.organization },
      { label: 'Designation / Title', value: enquiry.designation },
      { label: 'Years of Experience', value: enquiry.yearsOfExperience },
      { label: 'Department', value: enquiry.department },
      { label: 'Location (City, State)', value: [enquiry.city, enquiry.state].filter(Boolean).join(', ') || enquiry.location },
      { label: 'Pincode', value: enquiry.pincode },
      { label: 'Completed At (IST)', value: submissionTime }
    ];

    const html = buildEmailTemplate({
      badge: 'Tools & Upskills Lead',
      title: 'Tools & Upskills Detailed Application',
      subtitle: `${enquiry.name} completed the multi-step registration for ${courseTitle}.`,
      details
    });

    return emailService.sendEmail({
      to: DEFAULT_RECEIVER,
      replyTo: enquiry.email.trim(),
      subject,
      html
    });
  },

  /**
   * 6. Corporate Hiring Request Notification
   */
  sendHiringEnquiryEmail: async (hiring: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    jobRole: string;
    openings?: string;
    requiredSkills?: string;
    experience?: string;
    location?: string;
    workMode?: string;
    additionalRequirements?: string;
    submittedAt?: string;
  }): Promise<EmailResult> => {
    const subject = `New Corporate Hiring Request - ${hiring.companyName}`;
    const submissionTime = hiring.submittedAt ? new Date(hiring.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const html = buildEmailTemplate({
      badge: 'Corporate Talent',
      title: 'New Corporate Hiring Request',
      subtitle: `${hiring.contactPerson} from ${hiring.companyName} is hiring for ${hiring.jobRole}.`,
      details: [
        { label: 'Company / Enterprise', value: hiring.companyName },
        { label: 'Contact Person', value: hiring.contactPerson },
        { label: 'Email Address', value: hiring.email },
        { label: 'Phone Number', value: hiring.phone },
        { label: 'Target Job Role', value: hiring.jobRole },
        { label: 'Number of Openings', value: hiring.openings || '1-5' },
        { label: 'Experience Level Required', value: hiring.experience || 'Fresher / Entry Level' },
        { label: 'Required Skills / Tech Stack', value: hiring.requiredSkills || 'Standard Curriculum' },
        { label: 'Location / Base', value: hiring.location || 'Not Specified' },
        { label: 'Work Mode', value: hiring.workMode || 'Hybrid' },
        { label: 'Submission Date (IST)', value: submissionTime }
      ],
      messageBoxTitle: 'Additional Role & Hiring Requirements',
      messageBoxContent: hiring.additionalRequirements || 'No additional requirements noted.'
    });

    return emailService.sendEmail({
      to: DEFAULT_RECEIVER,
      replyTo: hiring.email.trim(),
      subject,
      html
    });
  },

  /**
   * 7. Student Offer (60% Discount) Enquiry Notification
   */
  sendStudentOfferEmail: async (offer: {
    name: string;
    email: string;
    phone: string;
    collegeOrSchool: string;
    submittedAt?: string;
  }): Promise<EmailResult> => {
    const subject = `New 60% Student Offer Enquiry - ${offer.name}`;
    const submissionTime = offer.submittedAt ? new Date(offer.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const html = buildEmailTemplate({
      badge: 'Student Offer 60%',
      title: '60% Student Discount Enquiry',
      subtitle: `${offer.name} has claimed the special student discount offer.`,
      details: [
        { label: 'Student Name', value: offer.name },
        { label: 'Email Address', value: offer.email },
        { label: 'Phone Number', value: offer.phone },
        { label: 'College / School Name', value: offer.collegeOrSchool },
        { label: 'Offer Claimed', value: '60% Flat Student Discount' },
        { label: 'Submission Date (IST)', value: submissionTime }
      ]
    });

    return emailService.sendEmail({
      to: DEFAULT_RECEIVER,
      replyTo: offer.email.trim(),
      subject,
      html
    });
  },

  /**
   * 8. User Confirmation Email (Optional acknowledgment to user)
   */
  sendUserConfirmation: async (options: {
    to: string;
    name: string;
    subject: string;
    message?: string;
  }): Promise<EmailResult> => {
    const html = buildUserConfirmationTemplate(options);
    return emailService.sendEmail({
      to: options.to,
      subject: `Thank you for contacting Edqoo: ${options.subject}`,
      html
    });
  }
};
