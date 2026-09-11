import type { Testimonial } from '../types';

export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sarah Jenkins',
    role: 'Associate AI Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    content: 'The Master Program in AI and Machine Learning at Edqoo completely transformed my career path. The practical labs simulating neural model training and LLM architectures taught me production techniques from Day 1. Within two months of finishing, I landed my first job as an AI engineer!',
    rating: 5,
    courseName: 'Master Program in AI and Machine Learning'
  },
  {
    id: 't-2',
    name: 'Marcus Chen',
    role: 'Data Scientist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    content: 'The Master Program in Data Science and AI modules are exceptional. The projects used actual enterprise datasets and covered full-lifecycle generative AI, RAG pipelines, and MLOps. Highly recommended for ambitious career pivots!',
    rating: 5,
    courseName: 'Master Program in Data Science and AI'
  },
  // {
  //   id: 't-3',
  //   name: 'Aisha Rahman',
  //   role: 'Senior Backend Developer',
  //   avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
  //   content: 'The Master Program in Python filled all gaps in my backend architecture workflow. AsyncIO, FastAPI, microservices, and design patterns made my code production-ready. The NIT faculty mentorship was second to none.',
  //   rating: 5,
  //   courseName: 'Master Program in Python'
  // },
  {
    id: 't-4',
    name: 'David Kojo',
    role: 'Lead Business Analyst',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    content: 'The Master Program in Data Analytics and AI unlocked massive business intelligence capabilities for me. Building end-to-end Power BI dashboards, SQL data warehouses, and AI-driven predictive models was a game changer.',
    rating: 5,
    courseName: 'Master Program in Data Analytics and AI'
  }
];
