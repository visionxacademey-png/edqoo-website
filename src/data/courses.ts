import type { Course } from '../types';

export const courses: Course[] = [
  // =========================================================================
  // CATEGORY 1: MASTER PROGRAMS (4 Courses)
  // =========================================================================
  {
    id: 'master-program-data-science-ai',
    slug: 'master-program-data-science-ai',
    title: 'Master Program in Data Science and AI',
    category: 'Master Programs',
    description: 'An exhaustive, industry-vetted master track covering Python foundations, mathematical statistics, machine learning, deep neural networks, computer vision, natural language processing, generative AI, LLM application architecture, and production MLOps.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    price: 34999,
    originalPrice: 69999,
    duration: '12 Months',
    lessons: 120,
    level: 'Beginner to Advanced',
    rating: 4.9,
    students: 1420,
    status: 'available',
    featured: true,
    skills: [
      'Python Programming',
      'Mathematical Statistics',
      'Supervised & Unsupervised ML',
      'Deep Learning & PyTorch',
      'Computer Vision & NLP',
      'Generative AI & LLMs',
      'RAG & Vector Databases',
      'MLOps & Cloud Deployment'
    ],
    requirements: [
      'Basic mathematical familiarity with high school algebra and statistics.',
      'No prior coding background is mandatory; fundamental Python scripting is covered comprehensively from scratch.',
      'A laptop or desktop with internet access capable of running modern IDEs and Jupyter notebooks.'
    ],
    whoIsItFor: [
      'Aspiring Data Scientists, Machine Learning Engineers, and AI Specialists.',
      'Software engineers transitioning into AI development and predictive intelligence.',
      'Data Analysts aiming to scale into deep learning and production generative AI workflows.',
      'Fresh graduates and STEM professionals seeking industry-ready AI portfolios.'
    ],
    modules: [
      {
        id: 'ds-ai-mod-1',
        title: 'Module 1 — Python for Data Science & Numerical Computing',
        description: 'Core Python syntax, functional programming, OOP, NumPy multidimensional arrays, and Pandas DataFrames.',
        lessons: [
          { id: 'ds-l-1', title: 'Python Fundamentals & Data Structures', duration: '90 mins', isPreview: true },
          { id: 'ds-l-2', title: 'Vectorized Operations with NumPy', duration: '90 mins' },
          { id: 'ds-l-3', title: 'Data Wrangling, Cleaning & Transformation with Pandas', duration: '120 mins' },
          { id: 'ds-l-4', title: 'Exploratory Data Analysis (EDA) & Data Visualization with Matplotlib/Seaborn', duration: '120 mins' }
        ]
      },
      {
        id: 'ds-ai-mod-2',
        title: 'Module 2 — Applied Statistics, Probability & Data Modeling',
        description: 'Probability distributions, hypothesis testing, inferential statistics, regression analysis, and variance estimation.',
        lessons: [
          { id: 'ds-l-5', title: 'Descriptive Statistics & Probability Distributions', duration: '90 mins' },
          { id: 'ds-l-6', title: 'Hypothesis Testing, Z-Tests, T-Tests & ANOVA', duration: '120 mins' },
          { id: 'ds-l-7', title: 'Linear Algebra & Matrix Decompositions for ML', duration: '90 mins' }
        ]
      },
      {
        id: 'ds-ai-mod-3',
        title: 'Module 3 — Classical Machine Learning & Feature Engineering',
        description: 'Supervised and unsupervised algorithms, hyperparameter tuning, model evaluation, and ensemble methods.',
        lessons: [
          { id: 'ds-l-8', title: 'Linear & Logistic Regression with Regularization (Lasso/Ridge)', duration: '120 mins' },
          { id: 'ds-l-9', title: 'Tree-Based Models: Decision Trees, Random Forests & XGBoost', duration: '120 mins' },
          { id: 'ds-l-10', title: 'Unsupervised Learning: K-Means, Hierarchical Clustering & PCA', duration: '90 mins' },
          { id: 'ds-l-11', title: 'Model Evaluation Metrics, Cross-Validation & Pipeline Construction', duration: '90 mins' }
        ]
      },
      {
        id: 'ds-ai-mod-4',
        title: 'Module 4 — Deep Learning, Computer Vision & NLP',
        description: 'Multi-layer perceptrons, convolutional neural networks (CNNs), sequence models, and Transformer architectures.',
        lessons: [
          { id: 'ds-l-12', title: 'Neural Networks Architecture & Backpropagation with PyTorch', duration: '120 mins' },
          { id: 'ds-l-13', title: 'Convolutional Neural Networks (CNN) for Image Recognition', duration: '120 mins' },
          { id: 'ds-l-14', title: 'Natural Language Processing: Embeddings, Transformers & BERT', duration: '120 mins' }
        ]
      },
      {
        id: 'ds-ai-mod-5',
        title: 'Module 5 — Generative AI, Large Language Models & MLOps',
        description: 'Prompt engineering, Retrieval-Augmented Generation (RAG), vector stores (Chroma/Pinecone), LangChain, and Dockerized deployment.',
        lessons: [
          { id: 'ds-l-15', title: 'Generative AI Concepts, LLM Architectures & API Integration', duration: '90 mins' },
          { id: 'ds-l-16', title: 'Building Production RAG Systems with LangChain & Vector Databases', duration: '150 mins' },
          { id: 'ds-l-17', title: 'Fine-Tuning Techniques (LoRA, QLoRA) & Open Source Models', duration: '120 mins' },
          { id: 'ds-l-18', title: 'MLOps: Model Deployment with FastAPI, Docker & CI/CD Pipelines', duration: '120 mins' }
        ]
      }
    ]
  },
  {
    id: 'master-program-python',
    slug: 'master-program-python',
    title: 'Master Program in Python',
    category: 'Master Programs',
    description: 'Comprehensive software engineering master track focused on professional Python architecture, advanced object-oriented design, asynchronous IO, backend APIs (FastAPI/Django), database integration, and cloud automation.',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=800&auto=format&fit=crop',
    price: 29999,
    originalPrice: 59999,
    duration: '10 Months',
    lessons: 95,
    level: 'Beginner to Advanced',
    rating: 4.85,
    students: 1180,
    status: 'available',
    featured: true,
    skills: [
      'Advanced Python 3.12+',
      'Object-Oriented Architecture',
      'AsyncIO & Concurrency',
      'FastAPI & Django REST',
      'PostgreSQL & SQLAlchemy ORM',
      'Automated PyTest & TDD',
      'Docker & Cloud Packaging',
      'Microservices Design'
    ],
    requirements: [
      'Willingness to learn systematic problem-solving and software development principles.',
      'No prior programming experience required; syllabus starts with fundamentals and advances to system architecture.',
      'Computer with Windows, macOS, or Linux suitable for standard coding environments.'
    ],
    whoIsItFor: [
      'Software developers looking to master enterprise-grade backend engineering in Python.',
      'Automation engineers and DevOps professionals building scalable infrastructure tools.',
      'Graduates wanting a solid, career-defining software development foundation.'
    ],
    modules: [
      {
        id: 'py-mod-1',
        title: 'Module 1 — Core Python, Data Structures & Algorithmic Thinking',
        description: 'Variables, memory management, built-in collections, recursion, generators, decorators, and functional tools.',
        lessons: [
          { id: 'py-l-1', title: 'Python Execution Model & Deep Dive into Built-in Types', duration: '90 mins', isPreview: true },
          { id: 'py-l-2', title: 'Functions, Closures, Decorators & Scope Resolution', duration: '120 mins' },
          { id: 'py-l-3', title: 'Iterators, Generators & Context Managers', duration: '90 mins' },
          { id: 'py-l-4', title: 'Algorithmic Complexity & Custom Data Structure Implementation', duration: '120 mins' }
        ]
      },
      {
        id: 'py-mod-2',
        title: 'Module 2 — Advanced OOP, Design Patterns & Metaprogramming',
        description: 'Polymorphism, dunder methods, metaclasses, descriptors, SOLID design principles, and creational/structural patterns.',
        lessons: [
          { id: 'py-l-5', title: 'Classes, Dunder Methods & Inheritance Models', duration: '90 mins' },
          { id: 'py-l-6', title: 'Metaclasses, Abstract Base Classes (ABCs) & Descriptors', duration: '120 mins' },
          { id: 'py-l-7', title: 'Enterprise Design Patterns in Modern Python', duration: '120 mins' }
        ]
      },
      {
        id: 'py-mod-3',
        title: 'Module 3 — Asynchronous Programming & High-Performance Concurrency',
        description: 'Threading, Multiprocessing, AsyncIO event loops, coroutines, tasks, and non-blocking I/O operations.',
        lessons: [
          { id: 'py-l-8', title: 'The Global Interpreter Lock (GIL), Threading vs Multiprocessing', duration: '90 mins' },
          { id: 'py-l-9', title: 'AsyncIO Foundations, Coroutines, Tasks & Event Loops', duration: '120 mins' },
          { id: 'py-l-10', title: 'Building High-Throughput Concurrent Scrapers and Data Workers', duration: '120 mins' }
        ]
      },
      {
        id: 'py-mod-4',
        title: 'Module 4 — Enterprise Web Backends, Databases & Microservices',
        description: 'FastAPI REST architectures, Pydantic validation, SQLAlchemy 2.0 ORM, PostgreSQL, PyTest, and Docker.',
        lessons: [
          { id: 'py-l-11', title: 'High-Performance REST APIs with FastAPI & Pydantic V2', duration: '120 mins' },
          { id: 'py-l-12', title: 'Relational Database Integration with SQLAlchemy & Alembic Migrations', duration: '120 mins' },
          { id: 'py-l-13', title: 'Testing with PyTest, Mocking & CI/CD GitHub Actions', duration: '90 mins' },
          { id: 'py-l-14', title: 'Containerizing Python Applications with Multi-Stage Docker', duration: '90 mins' }
        ]
      }
    ]
  },
  {
    id: 'master-program-ai-machine-learning',
    slug: 'master-program-ai-machine-learning',
    title: 'Master Program in AI and Machine Learning',
    category: 'Master Programs',
    description: 'An advanced, research-and-engineering blended program focusing on artificial intelligence architectures, machine learning algorithms, deep neural network optimization, computer vision, natural language transformers, and intelligent agents.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop',
    price: 36999,
    originalPrice: 74999,
    duration: '12 Months',
    lessons: 130,
    level: 'Intermediate to Advanced',
    rating: 4.92,
    students: 1290,
    status: 'available',
    featured: true,
    skills: [
      'Machine Learning Theory & Code',
      'Deep Learning & PyTorch',
      'Computer Vision & Object Detection',
      'NLP & Transformer Architectures',
      'Reinforcement Learning Fundamentals',
      'LLM Fine-Tuning & Quantization',
      'Autonomous AI Agents & Tool Calling',
      'Scalable AI Serving (vLLM, TensorRT)'
    ],
    requirements: [
      'Familiarity with programming concepts and foundational algebra/calculus.',
      'Enthusiasm for mathematics, statistical reasoning, and neural networks.',
      'A personal workstation suitable for running local machine learning simulations or cloud notebooks (Google Colab / Kaggle).'
    ],
    whoIsItFor: [
      'Software engineers and developers aiming to specialize purely in Artificial Intelligence and Machine Learning.',
      'Research students and tech professionals wishing to build and deploy complex neural models.',
      'Data practitioners upgrading their skills to the cutting-edge AI and LLM paradigm.'
    ],
    modules: [
      {
        id: 'aiml-mod-1',
        title: 'Module 1 — Mathematical Foundations for Artificial Intelligence',
        description: 'Vector calculus, linear transformations, eigen-decomposition, probability spaces, and loss optimization landscapes.',
        lessons: [
          { id: 'aiml-l-1', title: 'Linear Algebra for High-Dimensional AI Embeddings', duration: '90 mins', isPreview: true },
          { id: 'aiml-l-2', title: 'Multivariate Calculus, Gradients & Computational Graphs', duration: '90 mins' },
          { id: 'aiml-l-3', title: 'Bayesian Inference & Information Theory in AI', duration: '90 mins' }
        ]
      },
      {
        id: 'aiml-mod-2',
        title: 'Module 2 — Advanced Machine Learning Algorithms & Optimization',
        description: 'Convex optimization, gradient descent variants, kernel methods, ensemble frameworks, and dimensional reduction.',
        lessons: [
          { id: 'aiml-l-4', title: 'Support Vector Machines & Kernel Tricks', duration: '90 mins' },
          { id: 'aiml-l-5', title: 'Ensemble Learning: Gradient Boosted Decision Trees (XGBoost/LightGBM/CatBoost)', duration: '120 mins' },
          { id: 'aiml-l-6', title: 'Dimensionality Reduction (t-SNE, UMAP, Autoencoders)', duration: '90 mins' }
        ]
      },
      {
        id: 'aiml-mod-3',
        title: 'Module 3 — Deep Neural Networks, CNNs & Computer Vision',
        description: 'Custom PyTorch layers, ResNet, EfficientNet, YOLO object detection, segmentation, and vision transformers.',
        lessons: [
          { id: 'aiml-l-7', title: 'Deep Neural Architectures, Normalization & Optimization Dynamics', duration: '120 mins' },
          { id: 'aiml-l-8', title: 'Modern Computer Vision: ResNet, Vision Transformers (ViT)', duration: '120 mins' },
          { id: 'aiml-l-9', title: 'Object Detection & Segmentation with YOLO and Mask R-CNN', duration: '120 mins' }
        ]
      },
      {
        id: 'aiml-mod-4',
        title: 'Module 4 — Transformers, Natural Language Processing & Autonomous AI Agents',
        description: 'Multi-head self-attention, BERT/GPT architectures, instruction tuning, autonomous agent design, and enterprise LLM inference.',
        lessons: [
          { id: 'aiml-l-10', title: 'The Attention Mechanism & Transformer Deep Dive', duration: '150 mins' },
          { id: 'aiml-l-11', title: 'LLM Fine-Tuning with PEFT, LoRA, and RLHF concepts', duration: '120 mins' },
          { id: 'aiml-l-12', title: 'Autonomous Multi-Agent Systems & Tool Orchestration', duration: '120 mins' },
          { id: 'aiml-l-13', title: 'High-Throughput Model Serving with vLLM, TensorRT & Triton', duration: '120 mins' }
        ]
      }
    ]
  },
  {
    id: 'master-program-data-analytics-ai',
    slug: 'master-program-data-analytics-ai',
    title: 'Master Program in Data Analytics and AI',
    category: 'Master Programs',
    description: 'Master business intelligence, relational database warehousing, predictive modeling, interactive dashboards, advanced analytical reporting, and AI-accelerated decision intelligence systems.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    price: 31999,
    originalPrice: 63999,
    duration: '11 Months',
    lessons: 105,
    level: 'Beginner to Advanced',
    rating: 4.88,
    students: 1340,
    status: 'available',
    featured: true,
    skills: [
      'Data Analytics & BI Strategy',
      'Advanced SQL & Data Warehousing',
      'Interactive Power BI & Tableau',
      'Python for Analytics (Pandas/Seaborn)',
      'Predictive Business Modeling',
      'Statistical Hypothesis Testing',
      'AI-Powered Analytics & Copilot',
      'Executive Storytelling with Data'
    ],
    requirements: [
      'Basic logical and numerical reasoning skills.',
      'No prior programming background necessary.',
      'A computer with spreadsheet software and internet connectivity for BI and data lab exercises.'
    ],
    whoIsItFor: [
      'Business analysts, financial analysts, and marketing specialists scaling into AI-driven intelligence.',
      'Aspiring data analysts seeking mastery across SQL, Power BI, Python, and predictive analytics.',
      'Managers and executives looking to drive data-informed decision strategies.'
    ],
    modules: [
      {
        id: 'da-ai-mod-1',
        title: 'Module 1 — Business Analytics Foundations & Advanced SQL',
        description: 'Relational data modeling, complex joins, subqueries, Common Table Expressions (CTEs), window functions, and analytics queries.',
        lessons: [
          { id: 'da-l-1', title: 'Database Design & Relational Schema Fundamentals', duration: '90 mins', isPreview: true },
          { id: 'da-l-2', title: 'Complex Aggregations, Grouping & Multi-Table Joins', duration: '90 mins' },
          { id: 'da-l-3', title: 'Window Functions (RANK, DENSE_RANK, LEAD, LAG) & CTEs', duration: '120 mins' },
          { id: 'da-l-4', title: 'Building Real-World Analytical Data Warehouses', duration: '120 mins' }
        ]
      },
      {
        id: 'da-ai-mod-2',
        title: 'Module 2 — Modern BI Dashboards & Visual Storytelling (Power BI & Tableau)',
        description: 'Power Query ETL transformations, DAX calculations, relationship modeling, visual storytelling, and executive dashboard delivery.',
        lessons: [
          { id: 'da-l-5', title: 'Data Ingestion & Transformation with Power Query', duration: '90 mins' },
          { id: 'da-l-6', title: 'DAX Calculations, Time Intelligence & Measures', duration: '120 mins' },
          { id: 'da-l-7', title: 'Designing High-Impact Executive Dashboards & KPI Trackers', duration: '120 mins' }
        ]
      },
      {
        id: 'da-ai-mod-3',
        title: 'Module 3 — Python for Data Analysis & Statistical Modeling',
        description: 'Automated data cleaning, time series analysis, cohort retention modeling, and inferential testing.',
        lessons: [
          { id: 'da-l-8', title: 'Automating Data Analysis Pipelines with Python & Pandas', duration: '120 mins' },
          { id: 'da-l-9', title: 'Statistical Testing & A/B Experimentation in Business', duration: '90 mins' },
          { id: 'da-l-10', title: 'Time Series Forecasting & Trend Analysis', duration: '120 mins' }
        ]
      },
      {
        id: 'da-ai-mod-4',
        title: 'Module 4 — AI-Augmented Analytics & Predictive Insights',
        description: 'Integrating LLMs into BI pipelines, automated anomaly detection, customer churn forecasting, and AI Copilot integration.',
        lessons: [
          { id: 'da-l-11', title: 'Predictive Modeling for Customer Lifetime Value & Churn', duration: '120 mins' },
          { id: 'da-l-12', title: 'Leveraging Generative AI & Natural Language SQL Queries', duration: '90 mins' },
          { id: 'da-l-13', title: 'Capstone: End-to-End Enterprise Business Intelligence Solution', duration: '150 mins' }
        ]
      }
    ]
  },

  // =========================================================================
  // CATEGORY 2: TOOLS AND UPSKILLS (6 Courses — 24–36 Hours Duration)
  // =========================================================================
  {
    id: 'advance-executive-python',
    slug: 'advance-executive-python',
    title: 'Advance Executive in Python',
    category: 'Tools And Upskills',
    description: 'An intensive executive masterclass in Python focused on rapid automation scripting, OOP design patterns, data extraction, API integrations, and code efficiency for busy professionals.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop',
    price: 8999,
    originalPrice: 17999,
    duration: '24–36 Hours',
    lessons: 28,
    level: 'Intermediate',
    rating: 4.88,
    students: 860,
    status: 'available',
    featured: false,
    skills: [
      'Advanced Python Scripting',
      'Automation & Workflow Optimization',
      'Object-Oriented Design',
      'REST API Integration',
      'Error Handling & Logging',
      'Pandas & CSV Processing'
    ],
    requirements: [
      'Basic familiarity with computer operating systems and spreadsheets.',
      'Laptop or desktop computer with Python 3.10+ installed (setup guidance provided).'
    ],
    whoIsItFor: [
      'Working professionals seeking to automate repetitive daily tasks with Python.',
      'Analysts and developers looking to level up their scripting and modular architecture.',
      'Team leads and managers who want practical code fluency.'
    ],
    modules: [
      {
        id: 'exec-py-1',
        title: 'Part 1 — Executive Python Foundations & Idiomatic Code',
        description: 'Fast-paced review of core types, list comprehensions, functional lambda tools, and error resilience.',
        lessons: [
          { id: 'ep-l-1', title: 'Writing Pythonic Code & Data Structures', duration: '3 Hours', isPreview: true },
          { id: 'ep-l-2', title: 'Advanced File Handling, JSON & CSV Automation', duration: '3 Hours' }
        ]
      },
      {
        id: 'exec-py-2',
        title: 'Part 2 — Modular Design, OOP & Automation Libraries',
        description: 'Building robust classes, connecting to third-party web APIs, and scheduling automated background scripts.',
        lessons: [
          { id: 'ep-l-3', title: 'Clean OOP Design Patterns in Python', duration: '4 Hours' },
          { id: 'ep-l-4', title: 'REST API Integrations & Web Requests', duration: '4 Hours' },
          { id: 'ep-l-5', title: 'Hands-on Executive Automation Project', duration: '4 Hours' }
        ]
      }
    ]
  },
  {
    id: 'advance-executive-sql',
    slug: 'advance-executive-sql',
    title: 'Advance Executive in SQL',
    category: 'Tools And Upskills',
    description: 'Master advanced database queries, analytical window functions, complex CTEs, database indexing, query optimization, and enterprise relational data manipulation.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    price: 7999,
    originalPrice: 15999,
    duration: '24–36 Hours',
    lessons: 24,
    level: 'Intermediate',
    rating: 4.86,
    students: 920,
    status: 'available',
    featured: false,
    skills: [
      'Advanced SQL Querying',
      'Window Functions (RANK, NTILE, LAG)',
      'Recursive CTEs & Subqueries',
      'Query Plan Optimization & Indexing',
      'Database Modeling & Normalization',
      'PostgreSQL & MySQL Operations'
    ],
    requirements: [
      'Basic conceptual understanding of tables, rows, and columns.',
      'A computer with ability to install PostgreSQL or access cloud SQL sandboxes.'
    ],
    whoIsItFor: [
      'Data analysts, BI professionals, and engineers seeking query performance mastery.',
      'Product managers and business specialists wanting direct database querying authority.'
    ],
    modules: [
      {
        id: 'exec-sql-1',
        title: 'Part 1 — Complex Querying, Multi-Table Joins & CTEs',
        description: 'Advanced relational joins, conditional aggregation, subquery mastery, and Common Table Expressions.',
        lessons: [
          { id: 'es-l-1', title: 'Advanced Joins & Hierarchical Data Querying', duration: '3 Hours', isPreview: true },
          { id: 'es-l-2', title: 'Mastering CTEs and Recursive Data Queries', duration: '3 Hours' }
        ]
      },
      {
        id: 'exec-sql-2',
        title: 'Part 2 — Analytical Window Functions & Query Optimization',
        description: 'Ranking, running totals, lead/lag comparisons, index profiling, and execution plan tuning.',
        lessons: [
          { id: 'es-l-3', title: 'Window Functions: Partitioning, Ordering & Aggregation', duration: '4 Hours' },
          { id: 'es-l-4', title: 'Query Optimization, Index Strategies & EXPLAIN Analysis', duration: '4 Hours' },
          { id: 'es-l-5', title: 'Real-World Business Intelligence SQL Project', duration: '4 Hours' }
        ]
      }
    ]
  },
  {
    id: 'advance-executive-excel',
    slug: 'advance-executive-excel',
    title: 'Advance Executive in Excel',
    category: 'Tools And Upskills',
    description: 'Transform spreadsheet workflows with modern Dynamic Arrays (XLOOKUP, FILTER, UNIQUE), Power Query automated ETL transformations, PivotTables, and executive business modeling.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
    price: 6999,
    originalPrice: 13999,
    duration: '24–36 Hours',
    lessons: 22,
    level: 'Beginner to Intermediate',
    rating: 4.87,
    students: 1100,
    status: 'available',
    featured: false,
    skills: [
      'Modern Excel Formulas (XLOOKUP, LET, LAMBDA)',
      'Dynamic Array Functions (FILTER, SORT, UNIQUE)',
      'Power Query Automated Data Transformations',
      'Advanced PivotTables & Slicers',
      'Financial & Scenario Modeling',
      'Executive Dashboards & Visual Design'
    ],
    requirements: [
      'Microsoft Excel (2019, 2021, or Microsoft 365 recommended) installed on desktop or laptop.'
    ],
    whoIsItFor: [
      'Business analysts, finance professionals, accountants, and marketing specialists.',
      'Managers seeking to automate routine reporting and design dynamic executive dashboards.'
    ],
    modules: [
      {
        id: 'exec-xl-1',
        title: 'Part 1 — Modern Formula Engine & Dynamic Arrays',
        description: 'Mastering XLOOKUP, INDEX/MATCH, Dynamic Arrays (FILTER, UNIQUE, SORT), LET, and custom LAMBDA formulas.',
        lessons: [
          { id: 'exl-l-1', title: 'Modern Formulas: XLOOKUP, XMATCH & Advanced Logic', duration: '3 Hours', isPreview: true },
          { id: 'exl-l-2', title: 'Dynamic Arrays & Calculated Spilled Ranges', duration: '3 Hours' }
        ]
      },
      {
        id: 'exec-xl-2',
        title: 'Part 2 — Power Query & Interactive Executive Dashboards',
        description: 'Connecting external data, automated unpivoting, building relational data models, and designing C-Suite dashboards.',
        lessons: [
          { id: 'exl-l-3', title: 'Power Query: Zero-Code Automated Data Cleaning & Merging', duration: '4 Hours' },
          { id: 'exl-l-4', title: 'Advanced PivotTables, Custom Measures & Slicers', duration: '4 Hours' },
          { id: 'exl-l-5', title: 'Executive Financial / Operational Dashboard Project', duration: '4 Hours' }
        ]
      }
    ]
  },
  {
    id: 'advance-executive-power-bi',
    slug: 'advance-executive-power-bi',
    title: 'Advance Executive in Power BI',
    category: 'Tools And Upskills',
    description: 'Build enterprise-grade business intelligence solutions, master DAX computations, design dimensional data models (Star Schema), and deploy executive interactive reporting.',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop',
    price: 8499,
    originalPrice: 16999,
    duration: '24–36 Hours',
    lessons: 25,
    level: 'Intermediate',
    rating: 4.89,
    students: 990,
    status: 'available',
    featured: false,
    skills: [
      'Power BI Desktop & Service',
      'Power Query ETL & Data Shaping',
      'Star Schema & Dimensional Modeling',
      'DAX Measures & Time Intelligence',
      'Custom Visuals & Drill-Throughs',
      'Executive KPI Dashboards'
    ],
    requirements: [
      'A computer running Windows 10/11 capable of running Power BI Desktop (free download).'
    ],
    whoIsItFor: [
      'Professionals aiming to transition from spreadsheets to robust Business Intelligence reporting.',
      'Data analysts, team leads, and consultants building visual analytics solutions.'
    ],
    modules: [
      {
        id: 'exec-pbi-1',
        title: 'Part 1 — Data Ingestion, Shaping & Dimensional Modeling',
        description: 'Connecting diverse data sources, Power Query data transformation, and Star Schema relationship management.',
        lessons: [
          { id: 'pbi-l-1', title: 'Data Extraction & Transformation in Power Query', duration: '3 Hours', isPreview: true },
          { id: 'pbi-l-2', title: 'Relational Data Modeling: 1-to-Many, Star Schemas & Filter Flow', duration: '3 Hours' }
        ]
      },
      {
        id: 'exec-pbi-2',
        title: 'Part 2 — DAX Calculations & Interactive Dashboards',
        description: 'Calculated columns vs measures, CALCULATE context transition, Time Intelligence functions, and publishing to Power BI Service.',
        lessons: [
          { id: 'pbi-l-3', title: 'DAX Essentials: CALCULATE, FILTER & Evaluation Context', duration: '4 Hours' },
          { id: 'pbi-l-4', title: 'Time Intelligence: Year-over-Year, MTD, QTD & Rolling Averages', duration: '4 Hours' },
          { id: 'pbi-l-5', title: 'Building & Publishing a Live Executive BI Dashboard', duration: '4 Hours' }
        ]
      }
    ]
  },
  {
    id: 'advance-executive-ms-office',
    slug: 'advance-executive-ms-office',
    title: 'Advance Executive in MS Office',
    category: 'Tools And Upskills',
    description: 'Comprehensive executive suite mastery across Microsoft Word, Excel, PowerPoint, Outlook, and collaborative Microsoft 365 cloud workflows to maximize workplace productivity.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    price: 6499,
    originalPrice: 12999,
    duration: '24–36 Hours',
    lessons: 20,
    level: 'Beginner to Intermediate',
    rating: 4.82,
    students: 780,
    status: 'available',
    featured: false,
    skills: [
      'Microsoft 365 Cloud Ecosystem',
      'Advanced Excel Data Analysis',
      'Executive Word Document Design',
      'High-Impact PowerPoint Presentations',
      'Outlook Workflow & Calendar Automation',
      'Teams & OneDrive Collaboration'
    ],
    requirements: [
      'Access to Microsoft Office suite or Microsoft 365 subscription on a desktop or laptop.'
    ],
    whoIsItFor: [
      'Executive assistants, office managers, administrative leads, and corporate professionals.',
      'Anyone seeking end-to-end fluency and productivity across the entire Microsoft productivity suite.'
    ],
    modules: [
      {
        id: 'exec-mso-1',
        title: 'Part 1 — Executive Word & High-Impact PowerPoint',
        description: 'Advanced typography, styles, master slides, visual hierarchy, animations, and professional corporate presentations.',
        lessons: [
          { id: 'mso-l-1', title: 'Professional Word: Document Formatting, Styles & Templates', duration: '3 Hours', isPreview: true },
          { id: 'mso-l-2', title: 'C-Suite PowerPoint: Slide Masters, Visual Storytelling & Clean Animations', duration: '3 Hours' }
        ]
      },
      {
        id: 'exec-mso-2',
        title: 'Part 2 — Excel Essentials, Outlook Efficiency & M365 Collaboration',
        description: 'Spreadsheet formulas, email management, calendar rules, OneDrive cloud syncing, and Microsoft Teams integration.',
        lessons: [
          { id: 'mso-l-3', title: 'Productivity Excel: Key Formulas, Formatting & Tables', duration: '3 Hours' },
          { id: 'mso-l-4', title: 'Outlook & Teams: Inbox Zero, Calendar Scheduling & Collaboration', duration: '3 Hours' },
          { id: 'mso-l-5', title: 'Integrated Corporate Productivity Suite Project', duration: '3 Hours' }
        ]
      }
    ]
  },
  {
    id: 'advance-executive-prompt-engineering',
    slug: 'advance-executive-prompt-engineering',
    title: 'Advance Executive in Prompt Engineering',
    category: 'Tools And Upskills',
    description: 'Master practical generative AI prompting techniques, Chain-of-Thought, few-shot prompting, structured JSON/XML outputs, automated workflow integrations, and enterprise AI tooling.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    price: 9499,
    originalPrice: 18999,
    duration: '24–36 Hours',
    lessons: 26,
    level: 'Beginner to Advanced',
    rating: 4.93,
    students: 1250,
    status: 'available',
    featured: true,
    skills: [
      'Prompt Engineering Frameworks',
      'Few-Shot & Zero-Shot Prompting',
      'Chain-of-Thought (CoT) & Tree-of-Thought',
      'Structured Outputs (JSON, YAML, XML)',
      'System Prompt Design & Guardrails',
      'AI Workflow Automation & Tool Calling'
    ],
    requirements: [
      'A web browser with internet access to interact with modern AI models (ChatGPT, Claude, Gemini).',
      'No prior programming knowledge required.'
    ],
    whoIsItFor: [
      'Executives, product managers, software engineers, content strategists, and consultants.',
      'Professionals eager to multiply their day-to-day productivity using cutting-edge Generative AI.'
    ],
    modules: [
      {
        id: 'exec-pe-1',
        title: 'Part 1 — Prompt Engineering Foundations & Mental Models',
        description: 'LLM token mechanics, temperature and top-p parameters, role prompting, context window management, and structured framing.',
        lessons: [
          { id: 'pe-l-1', title: 'How LLMs Process Context: Tokens, Attention & Temperature', duration: '3 Hours', isPreview: true },
          { id: 'pe-l-2', title: 'Role, Task, Context & Constraint (RTCC) Prompt Frameworks', duration: '3 Hours' }
        ]
      },
      {
        id: 'exec-pe-2',
        title: 'Part 2 — Advanced Reasoning, Structured Outputs & Workflow Automation',
        description: 'Chain-of-Thought, Few-Shot exemplars, JSON schema generation, hallucination prevention, and automated multi-step workflows.',
        lessons: [
          { id: 'pe-l-3', title: 'Chain-of-Thought, ReAct & Decomposition Prompting', duration: '4 Hours' },
          { id: 'pe-l-4', title: 'Enforcing Deterministic Structured Data (JSON/XML/Markdown)', duration: '4 Hours' },
          { id: 'pe-l-5', title: 'Capstone: Building an Automated Executive AI Assistant System', duration: '4 Hours' }
        ]
      }
    ]
  }
];
