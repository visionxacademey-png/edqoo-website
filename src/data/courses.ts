import type { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'cybersecurity',
    slug: 'cybersecurity',
    title: 'Professional Cybersecurity & Ethical Hacking Program',
    category: 'Cybersecurity',
    description: 'A 24-week professional cybersecurity and ethical hacking program covering fundamentals, networking, penetration testing, vulnerability assessment, malware analysis, web and API security, Active Directory, enterprise security, cloud, Kubernetes, threat detection, DevSecOps, and a final enterprise capstone.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop',
    price: 2000,
    originalPrice: 4000,
    duration: '24 Weeks',
    lessons: 140,
    level: 'Beginner to Advanced',
    rating: 4.8,
    students: 1250,
    status: 'available',
    featured: true,
    skills: [
      'Cybersecurity Fundamentals',
      'Linux & Windows Security',
      'Networking',
      'OSINT & Reconnaissance',
      'Vulnerability Assessment',
      'Penetration Testing',
      'Web & API Security',
      'Malware Analysis',
      'Active Directory Security',
      'SIEM & Threat Detection',
      'Cloud & Kubernetes Security',
      'DevSecOps & Zero Trust'
    ],
    requirements: [
      'Basic computer literacy and willingness to learn technical concepts.',
      'A computer capable of running virtual machines and the recommended security lab environment.',
      'All offensive-security exercises should be performed only in authorized, isolated lab environments.'
    ],
    whoIsItFor: [
      'Aspiring cybersecurity professionals and SOC analysts.',
      'Students preparing for penetration testing and security engineering roles.',
      'IT professionals transitioning into cybersecurity.',
      'Learners seeking hands-on enterprise security, cloud, and defensive security skills.'
    ],
    modules: [
      {
        id: 'cybersec-week-1',
        title: 'Week 1 — Introduction to Cybersecurity',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 1 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 1 — Introduction to Cybersecurity', duration: 'Not specified in syllabus', isPreview: true },
          { id: 'cs-l-2', title: 'Day 2 — Cyber Threats & Types of Hackers', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 3 — Cyber Attacks & Social Engineering', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 4 — Cybersecurity Domains & Career Paths', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 5 — Cyber Laws & Ethics', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 6 — Setting Up the Ethical Hacking Lab', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 7 — Week 1 Assessment & Hands-on Lab', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-2',
        title: 'Week 2 — Linux & Windows Operating System Fundamentals',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 2 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 8 — Introduction to Linux & Installing Kali Linux', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 9 — Linux File System & Directory Structure', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 10 — Linux Command Line Basics', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 11 — Advanced Linux Commands', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 12 — Linux Users, Permissions & Processes', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 13 — Windows Administration Basics', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 14 — Linux Practical Assessment & Weekly Review', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-3',
        title: 'Week 3 — Networking Fundamentals for Cybersecurity',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 3 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 15 — Introduction to Computer Networking', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 16 — OSI Model', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 17 — TCP/IP Model & Common Protocols', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 18 — IP Addressing & Subnetting', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 19 — DNS, DHCP , NAT & Routing', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 20 — Packet Analysis with Wireshark & tcpdump', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 21 — Weekly Assessment & Networking Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-4',
        title: 'Week 4 — Virtual Lab Setup & Introduction to Penetration Testing',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 4 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 22 — Building the Ethical Hacking Lab', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 23 — Introduction to Penetration Testing', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 24 — Information Gathering & Reconnaissance', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 25 — Vulnerability Basics & Risk Assessment', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 26 — Introduction to Penetration Testing Tools', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 27 — First Hands-on Penetration Testing Lab', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 28 — Week 4 Assessment & Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-5',
        title: 'Week 5 — Footprinting & Reconnaissance (OSINT)',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 5 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 29 — Introduction to Footprinting & Reconnaissance', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 30 — Domain Intelligence & WHOIS Enumeration', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 31 — Google Dorking & Search Engine Intelligence', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 32 — Email Footprinting & Metadata Analysis', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 33 — Technology Fingerprinting', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 34 — Introduction to OSINT Frameworks', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 35 — Weekly Assessment & Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-6',
        title: 'Week 6 — Scanning & Enumeration',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 6 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 36 — Introduction to Network Scanning', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 37 — Advanced Nmap Scanning', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 38 — Service Enumeration', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 39 — SMB & FTP Enumeration', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 40 — DNS & SNMP Enumeration', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 41 — Scan Analysis & Documentation', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 42 — Weekly Assessment & Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-7',
        title: 'Week 7 — Vulnerability Assessment',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 7 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 43 — Introduction to Vulnerability Assessment', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 44 — CVE, CVSS & Vulnerability Databases', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 45 — Nessus Essentials', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 46 — OpenVAS / Greenbone Community Edition', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 47 — Manual Vulnerability Assessment', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 48 — Risk Assessment & Professional Reporting', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 49 — Weekly Assessment & Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-8',
        title: 'Week 8 — System Hacking Basics',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 8 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 50 — Introduction to System Hacking & Authentication', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 51 — Password Hashes & Hash Security', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 52 — Password Auditing Concepts', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 53 — Windows Privilege Management', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 54 — Linux Users, Groups & Privilege Management', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 55 — Introduction to Security Monitoring & Logging', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 56 — Weekly Assessment & Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-9',
        title: 'Week 9 — Metasploit Framework',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 9 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 57 — Introduction to Metasploit Framework', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 58 — Navigating MSFConsole', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 59 — Understanding Payloads', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 60 — Exploit Modules & Lab Validation', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 61 — Post-Exploitation Concepts', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 62 — Reporting & Documentation', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 63 — Weekly Assessment & Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-10',
        title: 'Week 10 — Malware Analysis & Remote Access Tools (RATs)',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 10 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 64 — Introduction to Malware', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 65 — Malware Analysis Fundamentals (Static Analysis)', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 66 — Dynamic Malware Analysis', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 67 — Remote Access Tools (RATs) & Command-and-Control', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 68 — Malware Detection & Incident Response', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 69 — Malware Investigation & Reporting', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 70 — Weekly Assessment & Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-11',
        title: 'Week 11 — Web Application Security & OWASP Top 10',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 11 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 71 — Introduction to Web Application Security', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 72 — Web Technologies & Burp Suite', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 73 — Authentication & Session Management', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 74 — OWASP Top 10 Overview', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 75 — Secure Headers, Cookies & Input Validation', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 76 — Web Application Assessment Methodology', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 77 — Weekly Assessment & Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-12',
        title: 'Week 12 — OWASP Top 10 – SQL Injection, XSS & Web Vulnerability Testing',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 12 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 78 — SQL Injection Fundamentals', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 79 — Cross-Site Scripting (XSS)', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 80 — Cross-Site Request Forgery (CSRF) & Authentication', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 81 — File Upload Security & Directory Traversal', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 82 — Security Misconfiguration & Access Control', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 83 — Web Security Assessment Methodology', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 84 — Weekly Assessment & Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-17',
        title: 'Week 17 — Active Directory Security Fundamentals',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 17 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 113 — Introduction to Active Directory', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 114 — Active Directory Installation & Domain Management', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 115 — Users, Groups & Organizational Units', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 116 — Group Policy (GPO)', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 117 — Active Directory Security & Hardening', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 118 — Active Directory Monitoring & Logging', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 119 — Weekly Assessment & Mini Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-18',
        title: 'Week 18 — Enterprise Active Directory Security & Identity Protection',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 18 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 120 — Active Directory Authentication', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 121 — PowerShell for Active Directory Administration', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 122 — Advanced Group Policy Security', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 123 — Active Directory Auditing & Monitoring', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 124 — Identity Protection & Zero Trust', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 125 — Microsoft Defender for Identity & Enterprise Detection', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 126 — Weekly Assessment & Enterprise Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-19',
        title: 'Week 19 — Enterprise Network Security – Firewalls, VPNs, IDS/IPS & Network Access Control (NAC)',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 19 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 127 — Enterprise Network Architecture & Segmentation', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 128 — Firewalls & Next-Generation Firewalls (NGFW)', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 129 — VPN Technologies & Secure Remote Access', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 130 — Intrusion Detection & Prevention Systems (IDS/IPS)', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 131 — Network Access Control (NAC) & Network Security', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 132 — Enterprise Network Hardening & Security Assessment', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 133 — Weekly Assessment & Enterprise Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-20',
        title: 'Week 20 — DevSecOps, CI/CD Security & Infrastructure as Code (IaC)',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 20 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 134 — Introduction to DevSecOps & Secure SDLC', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 135 — Git, GitHub & Secure Version Control', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 136 — CI/CD Pipelines & Automated Security Testing', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 137 — Infrastructure as Code (IaC)', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 138 — Container Security & Software Supply Chain', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 139 — Secrets Management & DevSecOps Best Practices', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 140 — Weekly Assessment & Enterprise DevSecOps Project', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-21',
        title: 'Week 21 — Malware Analysis & Reverse Engineering Fundamentals',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 21 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 141 — Introduction to Malware & Safe Analysis Labs', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 142 — Static Malware Analysis', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 143 — Dynamic Malware Analysis Fundamentals', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 144 — Windows Internals for Malware Analysts', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 145 — Reverse Engineering Fundamentals', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 146 — Malware Reporting & Threat Intelligence', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 147 — Weekly Assessment & Enterprise Malware', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-22',
        title: 'Week 22 — Advanced Threat Detection, Endpoint Detection & Response (EDR), Threat Hunting & Purple Team Operations',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 22 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 148 — Endpoint Detection & Response (EDR)', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 149 — Extended Detection & Response (XDR)', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 150 — Threat Hunting Methodology', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 151 — Threat Intelligence Platforms (TIP) & IOC Management', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 152 — Purple Team Operations', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 153 — Enterprise Detection Engineering', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 154 — Weekly Assessment & Enterprise', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-23',
        title: 'Week 23 — Advanced Cloud Security, Kubernetes Security, API Security & Zero Trust Architecture',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 23 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 155 — Advanced Cloud Security Architecture', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 156 — Kubernetes Security Fundamentals', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 157 — Kubernetes Hardening & Runtime Security', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 158 — API Security', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 159 — Zero Trust Architecture (Enterprise)', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 160 — Cloud Detection & Response (CDR) and Security', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 161 — Weekly Assessment & Enterprise Cloud Security', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'cybersec-week-24',
        title: 'Week 24 — Enterprise Capstone – Professional Cybersecurity Assessment & Career Readiness',
        description: 'Curriculum topics, practical work, assignments, assessments, and outcomes from Week 24 of the supplied cybersecurity syllabus.',
        lessons: [
          { id: 'cs-l-1', title: 'Day 162 — Enterprise Security Assessment Planning', duration: 'Not specified in syllabus' },
          { id: 'cs-l-2', title: 'Day 163 — Infrastructure & Network Security Review', duration: 'Not specified in syllabus' },
          { id: 'cs-l-3', title: 'Day 164 — Application, Cloud & Container Security Assessment', duration: 'Not specified in syllabus' },
          { id: 'cs-l-4', title: 'Day 165 — SOC Investigation & Digital Forensics', duration: 'Not specified in syllabus' },
          { id: 'cs-l-5', title: 'Day 166 — Risk Assessment & Executive Reporting', duration: 'Not specified in syllabus' },
          { id: 'cs-l-6', title: 'Day 167 — Professional Portfolio & Interview Preparation', duration: 'Not specified in syllabus' },
          { id: 'cs-l-7', title: 'Day 168 — Final Capstone Assessment', duration: 'Not specified in syllabus' }
        ]
      }
    ]
  },
  {
    id: 'data-science',
    slug: 'data-science',
    title: 'Data Science Certificate Program',
    category: 'Data Science',
    description: 'A comprehensive data science program covering Python, SQL, data analysis, visualization, mathematics and statistics, machine learning, deep learning, computer vision, NLP, generative AI, LLM application development, deployment, MLOps, cloud, and web data collection.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    price: 2000,
    originalPrice: 4000,
    duration: '17 Modules',
    lessons: 110,
    level: 'Beginner to Advanced',
    rating: 4.7,
    students: 980,
    status: 'available',
    featured: true,
    skills: [
      'Python Programming',
      'SQL & Databases',
      'NumPy & Pandas',
      'Data Analysis & Visualization',
      'Mathematics & Statistics',
      'Machine Learning',
      'Deep Learning',
      'Computer Vision',
      'NLP & Transformers',
      'Generative AI & LLMs',
      'RAG & LLM Applications',
      'Hugging Face & Fine-Tuning',
      'MLOps, Cloud & Deployment',
      'Web Scraping & Data Collection'
    ],
    requirements: [
      'Basic mathematical foundations are helpful; the syllabus covers the required mathematics and statistics.',
      'No prior programming background is required for the Python foundation.',
      'A PC or laptop with an internet connection and the ability to install the required development tools.'
    ],
    whoIsItFor: [
      'Aspiring data analysts and data scientists.',
      'Developers and engineers building data-driven or AI applications.',
      'Students wanting practical machine learning, deep learning, and generative AI skills.',
      'Learners interested in end-to-end data, ML, and LLM application development.'
    ],
    modules: [
      {
        id: 'ds-mod-1',
        title: 'Module 1 — Python Programming',
        description: 'Topics and project work grouped from Module 1 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Python installation and environment setup; Python syntax and indentation; variables and data types; type casting; input/output; operators', duration: 'Not specified in syllabus', isPreview: true },
          { id: 'ds-l-2', title: 'Conditional statements; for and while loops; break, continue, pass', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Functions; lambda functions; recursion', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Lists, tuples, sets, dictionaries; list/dictionary comprehensions; strings and string manipulation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'File handling; exception handling; modules and packages; math, random, datetime, os; virtual environments and pip', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'OOP: classes and objects; __init__; instance/class variables; inheritance; polymorphism; encapsulation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-7', title: 'Git and GitHub basics', duration: 'Not specified in syllabus' },
          { id: 'ds-l-8', title: 'Project: Python-based Data Processing Application', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-2',
        title: 'Module 2 — SQL & Databases',
        description: 'Topics and project work grouped from Module 2 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Database fundamentals; relational databases; tables, rows and columns', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Primary and foreign keys; SQL syntax; SELECT, WHERE, ORDER BY', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'GROUP BY, HAVING; aggregate functions; CASE WHEN', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'JOIN: INNER, LEFT, RIGHT, FULL; subqueries; CTEs; views', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Window functions: ROW_NUMBER, RANK, LAG, LEAD; date and string functions; NULL handling; query optimization basics; PostgreSQL/MySQL', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'Project: Sales/Customer Analytics using SQL', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-3',
        title: 'Module 3 — NumPy, Pandas & Data Analysis',
        description: 'Topics and project work grouped from Module 3 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'NumPy arrays; dimensions and shapes; indexing and slicing; broadcasting; array operations; statistical functions; random module', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Pandas Series and DataFrames; indexing; loc and iloc; boolean filtering', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Adding/updating/deleting data; sorting; GroupBy; aggregation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Merge/join/concat; pivot tables; missing values; duplicate handling; data type conversion', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Exploratory Data Analysis: data ingestion, read_csv, head, tail, shape, columns, info, dtypes, describe, value_counts', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'Univariate, bivariate and multivariate analysis; outlier detection; correlation analysis', duration: 'Not specified in syllabus' },
          { id: 'ds-l-7', title: 'Project: Complete EDA on a real-world dataset', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-4',
        title: 'Module 4 — Data Visualization',
        description: 'Topics and project work grouped from Module 4 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Matplotlib: line charts, bar charts, scatter plots, histograms, pie charts, box plots, subplots', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Matplotlib customization', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Seaborn: count plots, bar plots, scatter plots, line plots, box plots, violin plots, swarm plots', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Heatmaps, pair plots and distribution plots', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Data storytelling; choosing the right visualization; dashboard principles; communicating insights; avoiding misleading visualizations', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-5',
        title: 'Module 5 — Mathematics & Statistics',
        description: 'Topics and project work grouped from Module 5 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Basic linear algebra: vectors, matrices, matrix operations, determinants, eigenvalues/eigenvectors', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Functions, logarithms and basic calculus: derivatives and gradients', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Probability fundamentals; conditional probability; Bayes theorem; random variables; probability distributions', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Normal, binomial and Poisson distributions; mean, median, mode, range, variance, standard deviation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Percentiles, quartiles, IQR, skewness, kurtosis, covariance, Pearson and Spearman correlation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'Inferential statistics: sampling, Central Limit Theorem, confidence intervals, point estimation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-7', title: 'Hypothesis testing: p-value, Type I/II errors, z-test, t-test, Chi-square, ANOVA, A/B testing, bootstrapping', duration: 'Not specified in syllabus' },
          { id: 'ds-l-8', title: 'Project: Statistical Analysis of a Real Dataset', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-6',
        title: 'Module 6 — Machine Learning Foundations',
        description: 'Topics and project work grouped from Module 6 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'AI vs ML vs Deep Learning; types of ML: supervised, unsupervised, semi-supervised, reinforcement learning', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'ML workflow and problem formulation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Data preprocessing: missing values, duplicates and outliers', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Encoding; feature engineering; feature selection', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Train/validation/test split; scaling, normalization and standardization; data leakage', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-7',
        title: 'Module 7 — Supervised Machine Learning',
        description: 'Topics and project work grouped from Module 7 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Regression: linear regression, multiple linear regression, polynomial regression', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Ridge regression, Lasso regression, Elastic Net', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Regression evaluation: MAE, MSE, RMSE, R², adjusted R²', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Classification: logistic regression, KNN, Naive Bayes, decision trees, random forest', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'SVM, gradient boosting, XGBoost; introduction to LightGBM/CatBoost', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'Classification evaluation: confusion matrix, accuracy, precision, recall, F1-score, ROC-AUC, PR-AUC', duration: 'Not specified in syllabus' },
          { id: 'ds-l-7', title: 'Project: End-to-End Customer Churn Prediction', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-8',
        title: 'Module 8 — Advanced Machine Learning',
        description: 'Topics and project work grouped from Module 8 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Bias-variance tradeoff; overfitting; underfitting; regularization', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Cross-validation; hyperparameter tuning; GridSearchCV; RandomizedSearchCV', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Feature importance; model comparison; ensemble learning', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Bagging; boosting; stacking; calibration', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Imbalanced datasets; SMOTE', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'Unsupervised learning: K-Means; elbow method; silhouette score', duration: 'Not specified in syllabus' },
          { id: 'ds-l-7', title: 'Hierarchical clustering; dendrograms; DBSCAN', duration: 'Not specified in syllabus' },
          { id: 'ds-l-8', title: 'Dimensionality reduction: PCA, t-SNE, UMAP introduction', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-9',
        title: 'Module 9 — Time Series & Recommendation Systems',
        description: 'Topics and project work grouped from Module 9 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Time series components: trend, seasonality and noise', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Stationarity; moving averages; ACF/PACF; ARIMA; SARIMA', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Forecast evaluation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Content-based recommendation; collaborative filtering; user-item matrix', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Similarity measures; matrix factorization; hybrid recommendation systems', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'Project: Sales Forecasting + Recommendation Engine', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-10',
        title: 'Module 10 — Deep Learning',
        description: 'Topics and project work grouped from Module 10 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Deep learning fundamentals; neural network architecture; perceptron; MLP', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Activation functions: sigmoid, tanh, ReLU, softmax', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Forward propagation; backpropagation; loss functions', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Gradient descent; SGD; Adam; learning rate; batch size; epochs', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Dropout; batch normalization; early stopping', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'Frameworks: TensorFlow, Keras, PyTorch; tensors; autograd', duration: 'Not specified in syllabus' },
          { id: 'ds-l-7', title: 'Project: Neural Network Classification', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-11',
        title: 'Module 11 — Computer Vision',
        description: 'Topics and project work grouped from Module 11 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Image representation and image preprocessing', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'CNN architecture; convolution; filters/kernels; padding; stride; pooling; fully connected layers', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Image classification; data augmentation; transfer learning', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'VGG; ResNet; EfficientNet introduction', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Project: Image Classification System', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-12',
        title: 'Module 12 — NLP & Transformers',
        description: 'Topics and project work grouped from Module 12 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Traditional NLP: text preprocessing, tokenization, stopwords, stemming, lemmatization', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Bag of Words, TF-IDF and N-grams', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'NLP machine learning: text classification, sentiment analysis, Naive Bayes for text, Logistic Regression for text', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Deep learning NLP: RNN, vanishing gradients, LSTM, GRU, sequence modelling', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Transformers: attention mechanism, self-attention, encoder, decoder, transformer architecture', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'BERT, GPT, tokens, embeddings, context length', duration: 'Not specified in syllabus' },
          { id: 'ds-l-7', title: 'Project: Sentiment Analysis / Text Classification', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-13',
        title: 'Module 13 — Generative AI & LLMs Expanded',
        description: 'Topics and project work grouped from Module 13 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Generative AI fundamentals; generative vs predictive AI', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'GPT, Claude, Gemini and open-source LLMs', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Tokens, embeddings and context windows', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Temperature, top-p, inference and latent space', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Generative models: GANs, VAEs, diffusion models, multimodal models', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'Prompt engineering: zero-shot, few-shot, role, structured prompting, prompt templates and output formatting', duration: 'Not specified in syllabus' },
          { id: 'ds-l-7', title: 'Prompt evaluation', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-14',
        title: 'Module 14 — LLM Application Development Major Addition',
        description: 'Topics and project work grouped from Module 14 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'LLM APIs: OpenAI API, Gemini API, Anthropic API, Hugging Face APIs', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Embeddings: text embeddings, similarity search and semantic search', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'RAG: Retrieval-Augmented Generation; document loading; chunking; embedding; vector search; retrieval; context injection; RAG evaluation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Vector databases: FAISS, Chroma, Pinecone introduction, Weaviate introduction', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'LLM frameworks: LangChain and LlamaIndex', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'Advanced LLM applications: document Q&A, chatbots, summarization, information extraction, function/tool calling, structured output', duration: 'Not specified in syllabus' },
          { id: 'ds-l-7', title: 'AI agents and multi-step workflows', duration: 'Not specified in syllabus' },
          { id: 'ds-l-8', title: 'Major Project: Build a RAG-based AI chatbot over custom documents.', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-15',
        title: 'Module 15 — Generative AI: Hugging Face & Fine-Tuning',
        description: 'Topics and project work grouped from Module 15 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'Hugging Face ecosystem; Transformers library; pipelines; Model Hub; tokenizers', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Pre-trained models; text generation; summarization; classification; image generation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Fine-tuning concepts; transfer learning; LoRA; PEFT', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Quantization and model evaluation', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Project: Fine-tune/use a pretrained model for a specific application', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-16',
        title: 'Module 16 — Deployment, MLOps & Cloud',
        description: 'Topics and project work grouped from Module 16 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'APIs with Flask and FastAPI; REST APIs; JSON; API authentication basics', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Deployment; model serialization; Docker; Dockerfiles; containers; Docker Compose basics', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'MLOps: experiment tracking, MLflow, model versioning, data versioning, model monitoring and logging', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'CI/CD basics', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Cloud: AWS/Azure/GCP fundamentals; cloud storage; compute; basic model deployment', duration: 'Not specified in syllabus' },
          { id: 'ds-l-6', title: 'Project: Deploy an ML/AI model as a REST API using Docker.', duration: 'Not specified in syllabus' }
        ]
      },
      {
        id: 'ds-mod-17',
        title: 'Module 17 — Web Scraping & Data Collection',
        description: 'Topics and project work grouped from Module 17 of the supplied Data Science syllabus.',
        lessons: [
          { id: 'ds-l-1', title: 'HTML basics and HTTP fundamentals', duration: 'Not specified in syllabus' },
          { id: 'ds-l-2', title: 'Requests; BeautifulSoup; HTML parsing; CSS selectors', duration: 'Not specified in syllabus' },
          { id: 'ds-l-3', title: 'Selenium; dynamic websites; data extraction', duration: 'Not specified in syllabus' },
          { id: 'ds-l-4', title: 'Cleaning scraped data; ethical/legal considerations; robots.txt and rate limiting', duration: 'Not specified in syllabus' },
          { id: 'ds-l-5', title: 'Project: Build an automated data collection pipeline.', duration: 'Not specified in syllabus' }
        ]
      }
    ]
  }
 ];

