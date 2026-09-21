import type { Instructor } from '../types/index.js';

export const instructors: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Dr. Evelyn Vance',
    role: 'Lead AI & Machine Learning Faculty',
    designation: 'Lead AI & Machine Learning Faculty',
    organization: 'Edqoo & Tech Research Institute',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    shortBio: 'Former Enterprise AI Architect with 12+ years of experience developing predictive systems and deep learning algorithms. Passionate about project-driven learning.',
    detailedBio: 'Dr. Evelyn Vance is a senior AI researcher and technology educator with over 12 years of hands-on industry and academic experience. She has spearheaded machine learning initiatives for enterprise platforms, authored peer-reviewed publications on neural network architectures, and mentored hundreds of data scientists. At Edqoo, she leads advanced curriculum design and live masterclasses focusing on practical AI deployment, LLMs, and scalable inference pipelines.',
    qualifications: 'Ph.D. in Computer Science & Artificial Intelligence, M.S. in Data Engineering',
    experience: '12+ Years',
    expertise: ['Data Science', 'Artificial Intelligence', 'Python', 'Machine Learning', 'Deep Learning', 'PyTorch'],
    certifications: ['AWS Certified Machine Learning - Specialty', 'TensorFlow Developer Certificate', 'NVIDIA Deep Learning Institute Certified'],
    courses: [
      'Advance Executive in Data Science and AI',
      'Advance Executive in AI and Machine Learning',
      'Advance Executive with Python'
    ],
    projects: [
      'Automated Multi-Modal Medical Imaging Diagnostic Pipeline',
      'High-Throughput NLP Sentiment Engine for Financial Markets',
      'Large-Scale Distributed Training Architecture on AWS EC2 Clusters'
    ],
    teachingExperience: '7+ years leading post-graduate executive programs and enterprise corporate upskilling sessions.',
    industryExperience: '5+ years as Principal AI Architect at enterprise software laboratories.',
    linkedin: 'https://linkedin.com',
    email: 'evelyn.vance@edqoo.com'
  },
  {
    id: 'inst-2',
    name: 'Michael Kovac',
    role: 'Principal Data Scientist & Analytics Lead',
    designation: 'Principal Data Scientist & Analytics Lead',
    organization: 'Applied Analytics Partners',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
    shortBio: 'Data Science consultant with 10+ years specializing in statistical modeling, business intelligence, SQL optimization, and end-to-end data pipelines.',
    detailedBio: 'Michael Kovac has spent a decade consulting for Fortune 500 financial institutions, retail giants, and fintech innovators. His core strength lies in translating complex algorithmic concepts into practical business solutions. Michael specializes in statistical analysis, predictive modelling, Python scientific computing, and enterprise dashboard architecture.',
    qualifications: 'M.Tech in Computational Data Science, B.Tech in Computer Engineering',
    experience: '10+ Years',
    expertise: ['Python', 'SQL', 'Data Analytics', 'Statistical Analysis', 'Predictive Modeling', 'Tableau'],
    certifications: ['Microsoft Certified: Data Analyst Associate', 'Google Cloud Certified Professional Data Engineer', 'PostgreSQL Certified Professional'],
    courses: [
      'Advance Executive in Python',
      'Advance Executive in SQL',
      'Executive Professional Certificate in Data Science and AI'
    ],
    projects: [
      'Real-Time Customer Churn Prediction Engine for Global Telco',
      'Scalable ETL Warehouse Pipeline processing 50M+ daily records',
      'Automated Financial Fraud Detection Platform'
    ],
    teachingExperience: '6+ years conducting hands-on engineering bootcamps and executive data science cohorts.',
    industryExperience: '10+ years directing analytics infrastructure and quantitative risk engines.',
    linkedin: 'https://linkedin.com',
    email: 'michael.kovac@edqoo.com'
  },
  {
    id: 'inst-3',
    name: 'Dr. Priya Sundaram',
    role: 'Senior Faculty & Business Intelligence Specialist',
    designation: 'Senior Faculty & Business Intelligence Specialist',
    organization: 'Edqoo Institute of Analytics',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    shortBio: 'Specialist in Power BI, Advanced Excel, and corporate data storytelling with over 9 years of teaching and industrial consulting experience.',
    detailedBio: 'Dr. Priya Sundaram bridges the critical gap between raw database metrics and strategic executive decision-making. With extensive experience advising corporate leadership teams, Priya brings real-world case studies into every classroom, training learners in dynamic Power BI dashboards, advanced DAX calculations, and financial modelling.',
    qualifications: 'Ph.D. in Information Systems & Decision Analytics, MBA in Business Analytics',
    experience: '9+ Years',
    expertise: ['Power BI', 'Advanced Excel', 'DAX', 'Business Intelligence', 'Data Storytelling', 'Financial Modeling'],
    certifications: ['Microsoft Certified: Power BI Data Analyst (PL-300)', 'Microsoft Office Specialist (MOS) Expert'],
    courses: [
      'Advance Executive in Power BI',
      'Advance Executive in Excel',
      'Advance Executive in MS Office'
    ],
    projects: [
      'Enterprise Executive KPI Command Center for Supply Chain Monitoring',
      'Automated Dynamic Financial Budgeting & Forecasting Workbook System',
      'Hospital Patient Admission & Bed Allocation Real-time Power BI Suite'
    ],
    teachingExperience: '8+ years mentoring over 3,000 students and corporate executives.',
    industryExperience: '5+ years as Senior BI Consultant for multinational advisory firms.',
    linkedin: 'https://linkedin.com',
    email: 'priya.sundaram@edqoo.com'
  },
  {
    id: 'inst-4',
    name: 'Arun Kumar',
    role: 'Generative AI & Prompt Engineering Specialist',
    designation: 'Generative AI & Prompt Engineering Specialist',
    organization: 'Cognitive Cloud Labs',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    shortBio: 'Pioneer in Generative AI workflows, LLM orchestration, LangChain architectures, and AI-assisted workplace productivity.',
    detailedBio: 'Arun Kumar is an applied Generative AI researcher and practitioner helping organizations integrate modern LLMs, vector search, and agentic workflows into their day-to-day operations. He focuses on practical prompt engineering strategies, contextual retrieval architectures (RAG), and automation of workplace productivity tools.',
    qualifications: 'M.S. in Computer Science (Artificial Intelligence), B.Tech in Information Technology',
    experience: '8+ Years',
    expertise: ['Prompt Engineering', 'Generative AI', 'Large Language Models (LLMs)', 'LangChain', 'Python', 'OpenAI APIs'],
    certifications: ['DeepLearning.AI LangChain Certified Developer', 'AWS Certified Solutions Architect'],
    courses: [
      'Advance Executive in Prompt Engineering',
      'Advance Executive in AI and Machine Learning'
    ],
    projects: [
      'Enterprise Internal Knowledge Base RAG Assistant with Vector Search',
      'Autonomous Code Review and Test Generation Agent',
      'Multi-agent Customer Support Workflow Automation'
    ],
    teachingExperience: '5+ years delivering modern GenAI and Python programming workshops.',
    industryExperience: '8+ years leading software engineering and applied AI initiatives.',
    linkedin: 'https://linkedin.com',
    email: 'arun.kumar@edqoo.com'
  }
];
