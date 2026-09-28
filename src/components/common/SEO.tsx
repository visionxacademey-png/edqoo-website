import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { Course, BlogPost, Instructor } from '../../types';
import {
  SITE_URL,
  BRAND_NAME,
  getOrganizationSchema,
  getWebSiteSchema,
  getBreadcrumbListSchema,
  getCourseSchema,
  getFAQSchema,
  getArticleSchema,
  type BreadcrumbItem,
  type FAQItem
} from './StructuredData';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'profile' | 'course' | string;
  ogImage?: string;
  ogImageAlt?: string;
  keywords?: string | string[];
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  course?: Course;
  instructor?: Instructor | null;
  faqs?: FAQItem[];
  article?: BlogPost;
  includeOrgSchema?: boolean;
  includeWebsiteSchema?: boolean;
  customSchema?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_GLOBAL_TITLE = 'Edqoo | Online Learning Platform for AI, Data Science & More';
const DEFAULT_GLOBAL_DESCRIPTION =
  'Edqoo is an online learning platform offering practical courses in Data Science, Artificial Intelligence, Machine Learning, Python, Data Analytics and professional upskilling.';
const DEFAULT_KEYWORDS =
  'Edqoo, edqoo, Edqoo online, Edqoo courses, Edqoo learning, Edqoo e-learning, Edqoo India, Edqoo Data Science, Edqoo Python, Edqoo AI, online learning platform, data science course, python course, artificial intelligence course, machine learning course, data analytics course, power BI course, professional upskilling';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_GLOBAL_DESCRIPTION,
  canonical,
  type = 'website',
  ogImage = 'https://edqoo.com/logo.jpg',
  ogImageAlt = 'Edqoo - Online Learning Platform',
  keywords = DEFAULT_KEYWORDS,
  noIndex = false,
  breadcrumbs,
  course,
  instructor,
  faqs,
  article,
  includeOrgSchema = true,
  includeWebsiteSchema = false,
  customSchema
}) => {
  // Format page title cleanly:
  // If title is not provided, use default global title.
  // If title already includes "Edqoo" (case-insensitive), keep it.
  // Otherwise append " | Edqoo"
  let pageTitle = DEFAULT_GLOBAL_TITLE;
  if (title) {
    const trimmedTitle = title.trim();
    if (trimmedTitle.toLowerCase().includes('edqoo')) {
      pageTitle = trimmedTitle;
    } else {
      pageTitle = `${trimmedTitle} | Edqoo`;
    }
  }

  // Canonical URL normalization (lowercased path, strip trailing slash except root)
  let canonicalUrl = SITE_URL;
  if (canonical) {
    if (canonical.startsWith('http://') || canonical.startsWith('https://')) {
      canonicalUrl = canonical;
    } else {
      const cleanPath = canonical.trim().toLowerCase().replace(/\/+$/, '');
      canonicalUrl = `${SITE_URL}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
    }
  }

  // Keywords string
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  // Aggregate JSON-LD Schemas
  const schemas: Array<Record<string, any>> = [];

  if (includeOrgSchema) {
    schemas.push(getOrganizationSchema());
  }

  if (includeWebsiteSchema) {
    schemas.push(getWebSiteSchema());
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    const bSchema = getBreadcrumbListSchema(breadcrumbs);
    if (bSchema) schemas.push(bSchema);
  }

  if (course) {
    const cSchema = getCourseSchema(course, instructor);
    if (cSchema) schemas.push(cSchema);
  }

  if (faqs && faqs.length > 0) {
    const fSchema = getFAQSchema(faqs);
    if (fSchema) schemas.push(fSchema);
  }

  if (article) {
    const aSchema = getArticleSchema(article);
    if (aSchema) schemas.push(aSchema);
  }

  if (customSchema) {
    if (Array.isArray(customSchema)) {
      schemas.push(...customSchema);
    } else {
      schemas.push(customSchema);
    }
  }

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots Directive */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Language & Regional Directives */}
      <meta httpEquiv="content-language" content="en-IN" />
      <meta name="geo.region" content="IN-KL" />
      <meta name="geo.placename" content="Kozhikode, Kerala, India" />
      <meta name="geo.position" content="11.2588;75.7804" />
      <meta name="ICBM" content="11.2588, 75.7804" />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={BRAND_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter / X Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Edqoo" />
      <meta name="twitter:creator" content="@Edqoo" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* JSON-LD Structured Data */}
      {schemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
};
