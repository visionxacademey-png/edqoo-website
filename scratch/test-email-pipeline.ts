import dotenv from 'dotenv';
import { emailService } from '../server/services/emailService.js';

dotenv.config();

const API_BASE = 'http://127.0.0.1:5001/api';

async function runTests() {
  console.log('========================================================');
  console.log('   RESEND CENTRALIZED EMAIL INTEGRATION TEST SUITE      ');
  console.log('========================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  // TEST 1: Instructor Joining Application Form
  totalTests++;
  console.log('▶ [TEST 1] Submitting Instructor Joining Application...');
  try {
    const res = await fetch(`${API_BASE}/instructor-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Anita Desai',
        email: 'anita.desai@example.com',
        phone: '+91 98765 43210',
        designation: 'Lead AI Scientist',
        organization: 'DeepTech Innovations',
        qualification: 'Ph.D. in Computer Science (NLP & AI)',
        expertise: 'Deep Learning & Natural Language Processing',
        experience: '8-10 Years',
        teachingExperience: '3-5 Years',
        courses: 'Master Program in Data Science & Artificial Intelligence',
        linkedin: 'https://linkedin.com/in/anitadesai-ai',
        portfolio: 'https://anitadesai.dev',
        bio: 'Over 9 years experience building transformer models, multi-agent systems, and publishing at top AI conferences. Passionate about hands-on mentor-led learning.'
      })
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Response:`, data);
    if (res.status === 201 && data.success) {
      console.log('✅ TEST 1 PASSED: Instructor application handled and email triggered.\n');
      passedTests++;
    } else {
      console.error('❌ TEST 1 FAILED');
    }
  } catch (err: any) {
    console.error('❌ TEST 1 ERROR:', err.message);
  }

  // TEST 2: Partner / Institutional Form
  totalTests++;
  console.log('▶ [TEST 2] Submitting Partner Collaboration Proposal...');
  try {
    const res = await fetch(`${API_BASE}/partner-enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationName: 'Global Institute of Technology',
        contactPerson: 'Prof. Ramesh Kulkarni',
        designation: 'Dean of Academics & Innovation',
        email: 'ramesh.k@git-edu.org',
        phone: '+91 98123 45678',
        organizationType: 'Educational Institution',
        partnershipArea: 'AI & Data Science Co-branded Tracks',
        website: 'https://git-edu.org',
        location: 'Bangalore, Karnataka',
        proposal: 'We would like to integrate Edqoo AI & Machine Learning curriculum for our 4th year computer science cohort (300 students).'
      })
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Response:`, data);
    if (res.status === 201 && data.success) {
      console.log('✅ TEST 2 PASSED: Partner application handled and email triggered.\n');
      passedTests++;
    } else {
      console.error('❌ TEST 2 FAILED');
    }
  } catch (err: any) {
    console.error('❌ TEST 2 ERROR:', err.message);
  }

  // TEST 3: Contact Us Form
  totalTests++;
  console.log('▶ [TEST 3] Submitting Contact Us Form...');
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rahul Varma',
        email: 'rahul.varma@example.com',
        phone: '+91 90744 50935',
        program: 'Contact Inquiry: Weekend Batch Schedules for Working Executives',
        category: 'Contact Desk',
        enquiryType: 'CONTACT',
        message: 'Hello, I want to know if weekend live batches are available for the Data Analytics and Power BI program with 1-on-1 mentorship.'
      })
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Response:`, data);
    if (res.status === 201 && data.success) {
      console.log('✅ TEST 3 PASSED: Contact form handled and email triggered.\n');
      passedTests++;
    } else {
      console.error('❌ TEST 3 FAILED');
    }
  } catch (err: any) {
    console.error('❌ TEST 3 ERROR:', err.message);
  }

  // TEST 4: Course Enquiry Form (Enquiry Modal)
  totalTests++;
  console.log('▶ [TEST 4] Submitting Standard Course Enquiry...');
  try {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Pooja Nair',
        email: 'pooja.nair@example.com',
        phone: '+91 98450 12345',
        program: 'Advanced Executive Program in Data Science & Artificial Intelligence',
        category: 'Data Science and AI',
        source: 'Course Details Page',
        leadStatus: 'Completed',
        experienceLevel: '1-3 Years Software Developer',
        learningMode: 'Online Live',
        location: 'Kochi, Kerala',
        preferredContactMethod: 'WhatsApp',
        preferredCallbackTime: 'Evening (5 PM - 8 PM)',
        message: 'Requesting syllabus details, installment options, and career assistance information.'
      })
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Response:`, data);
    if (res.status === 201 && data.success) {
      console.log('✅ TEST 4 PASSED: Course enquiry handled and email triggered.\n');
      passedTests++;
    } else {
      console.error('❌ TEST 4 FAILED');
    }
  } catch (err: any) {
    console.error('❌ TEST 4 ERROR:', err.message);
  }

  // TEST 5: Tools & Upskills Multi-Step Enquiry (Step 1 -> Step 2)
  totalTests++;
  console.log('▶ [TEST 5] Submitting Tools & Upskills Multi-Step Form...');
  try {
    // Step 1: Create incomplete lead
    const step1Res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Kiran Joseph',
        email: 'kiran.joseph@example.com',
        phone: '+91 94471 23456',
        program: 'Power BI Executive Mastery',
        category: 'Tools & Upskills',
        source: 'Tools & Upskills Enquire Now',
        leadStatus: 'Incomplete',
        status: 'Incomplete'
      })
    });
    const step1Data = await step1Res.json();
    const leadId = step1Data.enquiry?.id;
    console.log(`Step 1 Status: ${step1Res.status}, Lead ID: ${leadId}`);

    // Step 2: Finalize full details and trigger complete email
    const step2Res = await fetch(`${API_BASE}/enquiries/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Kiran Joseph',
        email: 'kiran.joseph@example.com',
        phone: '+91 94471 23456',
        program: 'Power BI Executive Mastery',
        category: 'Tools & Upskills',
        profession: 'Working Professional',
        highestQualification: 'B.Tech Mechanical',
        yearOfGraduation: '2023',
        organization: 'Apex Logistics',
        designation: 'Operations Analyst',
        yearsOfExperience: '1-2 Years',
        department: 'Business Intelligence',
        city: 'Trivandrum',
        state: 'Kerala',
        pincode: '695001',
        leadStatus: 'Completed',
        status: 'Submitted'
      })
    });
    const step2Data = await step2Res.json();
    console.log(`Step 2 Status: ${step2Res.status}`);
    console.log(`Response:`, step2Data);

    if (step2Res.status === 200 && step2Data.success) {
      console.log('✅ TEST 5 PASSED: Tools & Upskills multi-step submission finalized and complete email triggered.\n');
      passedTests++;
    } else {
      console.error('❌ TEST 5 FAILED');
    }
  } catch (err: any) {
    console.error('❌ TEST 5 ERROR:', err.message);
  }

  // TEST 6: Corporate Hiring Requirement
  totalTests++;
  console.log('▶ [TEST 6] Submitting Corporate Hiring Requirement...');
  try {
    const res = await fetch(`${API_BASE}/hiring-enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'CloudScale Technologies',
        contactPerson: 'Meera Menon',
        email: 'meera.m@cloudscale.io',
        phone: '+91 98470 99887',
        jobRole: 'Junior AI/ML Engineer',
        openings: '3-5 Openings',
        requiredSkills: 'Python, PyTorch, SQL, REST APIs',
        experience: 'Fresher / Entry Level (0-1 yr)',
        location: 'Kochi Infopark',
        workMode: 'Hybrid',
        additionalRequirements: 'Candidates with hands-on computer vision or LLM fine-tuning project experience preferred.'
      })
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Response:`, data);
    if (res.status === 201 && data.success) {
      console.log('✅ TEST 6 PASSED: Corporate hiring enquiry handled and email triggered.\n');
      passedTests++;
    } else {
      console.error('❌ TEST 6 FAILED');
    }
  } catch (err: any) {
    console.error('❌ TEST 6 ERROR:', err.message);
  }

  // TEST 7: 60% Student Offer Enquiry
  totalTests++;
  console.log('▶ [TEST 7] Submitting 60% Student Offer Enquiry...');
  try {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Arjun S',
        email: 'arjun.s@college.edu',
        phone: '+91 97451 11223',
        collegeOrSchool: 'Model Engineering College, Thrikkakara',
        program: '60% Student Offer',
        category: 'Student Offer',
        enquiryType: 'STUDENT_OFFER',
        leadStatus: 'Completed',
        status: 'Submitted'
      })
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Response:`, data);
    if (res.status === 201 && data.success) {
      console.log('✅ TEST 7 PASSED: Student offer enquiry handled and email triggered.\n');
      passedTests++;
    } else {
      console.error('❌ TEST 7 FAILED');
    }
  } catch (err: any) {
    console.error('❌ TEST 7 ERROR:', err.message);
  }

  console.log('========================================================');
  console.log(`   TEST RESULTS: ${passedTests} / ${totalTests} PASSED   `);
  console.log('========================================================');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
