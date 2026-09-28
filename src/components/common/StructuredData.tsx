import React from 'react';
import type { Course, BlogPost, Instructor } from '../../types';

export interface BreadcrumbItem {
  name?: string;
  label?: string;
  url?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const SITE_URL = 'https://edqoo.com';
export const BRAND_NAME = 'Edqoo';
export const LOGO_URL = 'https://edqoo.com/logo.jpg';
export const BRAND_DESCRIPTION =
  'Edqoo is an online learning platform focused on practical, industry-oriented education in Data Science, Artificial Intelligence, Python, Data Analytics and professional upskilling.';

/**
 * Standard Organization Schema for Edqoo
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    alternateName: 'EDQOO',
    url: `${SITE_URL}/`,
    logo: LOGO_URL,
    image: LOGO_URL,
    description: BRAND_DESCRIPTION,
    telephone: '+91-90744-50935',
    email: 'support@edqoo.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Indus Avenue, Chalappuram',
      addressLocality: 'Kozhikode',
      addressRegion: 'Kerala',
      postalCode: '673002',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://www.linkedin.com/company/edqoo',
      'https://www.youtube.com/@edqoo',
      'https://www.facebook.com/edqoo'
    ]
  };
}

/**
 * WebSite Schema (for root homepage site name identification)
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: BRAND_NAME,
    alternateName: ['EDQOO', 'edqoo'],
    url: `${SITE_URL}/`,
    description: BRAND_DESCRIPTION,
    publisher: {
      '@id': `${SITE_URL}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/courses?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-IN'
  };
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbListSchema(items: BreadcrumbItem[]) {
  if (!items || items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const name = item.name || item.label || '';
      const rawUrl = item.url || '';
      return {
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: rawUrl.startsWith('http') ? rawUrl : `${SITE_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`
      };
    })
  };
}

/**
 * Course Schema for dynamic Course Pages
 */
export function getCourseSchema(course: Course, instructor?: Instructor | null) {
  if (!course) return null;
  const canonicalUrl = `${SITE_URL}/courses/${course.slug}`;

  const instructorData = instructor
    ? {
        '@type': 'Person',
        name: instructor.name,
        jobTitle: instructor.designation,
        worksFor: {
          '@type': 'Organization',
          name: instructor.organization || BRAND_NAME
        }
      }
    : {
        '@type': 'Organization',
        name: BRAND_NAME,
        url: `${SITE_URL}/`
      };

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${canonicalUrl}#course`,
    name: course.title,
    description:
      course.description ||
      course.shortDescription ||
      `Learn ${course.title} with practical projects and expert mentorship on Edqoo.`,
    provider: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: BRAND_NAME,
      sameAs: `${SITE_URL}/`
    },
    instructor: instructorData,
    url: canonicalUrl,
    image: course.image || LOGO_URL,
    timeRequired: course.duration ? `P${course.duration.replace(/\s+/g, '')}` : undefined,
    educationalLevel: course.level || 'Beginner to Advanced',
    inLanguage: 'en',
    isAccessibleForFree: course.price === 0,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: course.duration || 'Flexible',
      instructor: instructorData
    },
    offers: {
      '@type': 'Offer',
      price: course.price || 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: canonicalUrl,
      validFrom: '2026-01-01',
      category: course.category
    }
  };
}

/**
 * FAQPage Schema
 */
export function getFAQSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Article Schema for Blog & Resource Posts
 */
export function getArticleSchema(post: BlogPost) {
  if (!post) return null;
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [post.image] : [LOGO_URL],
    datePublished: new Date(post.date).toISOString().split('T')[0] || '2026-08-15',
    dateModified: post.updatedDate
      ? new Date(post.updatedDate).toISOString().split('T')[0]
      : (new Date(post.date).toISOString().split('T')[0] || '2026-08-15'),
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Edqoo Academic Editorial Team',
      jobTitle: post.author?.role || 'Senior Tech Educator',
      worksFor: {
        '@type': 'Organization',
        name: BRAND_NAME
      }
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: BRAND_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL
      }
    },
    keywords: post.tags ? post.tags.join(', ') : 'Data Science, Python, AI, Machine Learning, Upskilling',
    articleSection: post.category || 'Education'
  };
}

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>> | null;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

