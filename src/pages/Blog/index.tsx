import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../../data/blog';
import { SEO } from '../../components/common/SEO';

// 1. Resources Index Page component (/resources)
export const Resources: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <SEO 
        title="Resources & Blog" 
        description="Access Edqoo's directory of roadmap resources, engineering articles, and career pivot templates."
        canonical="/resources"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-left space-y-2">
          <h1 className="text-3xl font-display font-extrabold text-deep-navy-900">Edqoo Resources</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Read roadmaps, technical cheat sheets, library reviews, and career pivot strategies.
          </p>
        </div>

        {/* Featured Post Card */}
        {blogPosts.length > 0 && (
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-7 bg-slate-100 aspect-[16/10] md:aspect-auto">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-left space-y-6">
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-1 bg-royal-blue-900 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  Featured Article
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 hover:text-royal-blue-900 transition-colors leading-tight">
                  <Link to={`/resources/${blogPosts[0].slug}`}>{blogPosts[0].title}</Link>
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-4">
                  {blogPosts[0].excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {blogPosts[0].date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {blogPosts[0].readTime}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Articles list grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <div
              key={post.id}
              className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-royal-blue-900 uppercase">
                    {post.category}
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 hover:text-royal-blue-900 transition-colors line-clamp-2">
                    <Link to={`/resources/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// 2. Resource Details Dynamic View component (/resources/:slug)
export const ResourceDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 font-display">Article Not Found</h2>
        <Link to="/resources" className="btn-primary px-5 py-2.5 text-xs font-semibold rounded-lg shadow">
          Back to Resources
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <SEO 
        title={post.title} 
        description={post.excerpt} 
        canonical={`/resources/${post.slug}`} 
        ogImage={post.image}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* Navigation & breadcrumb */}
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resources
        </Link>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <span className="px-2.5 py-1 bg-royal-blue-900 text-white text-[10px] font-bold rounded uppercase tracking-wider">
            {post.category}
          </span>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-deep-navy-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-455 font-medium border-y border-slate-200/80 py-3.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Hero image */}
        <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
          {/* Simple mock renderer parsing headings and bullets manually to keep component simple */}
          {post.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (trimmed.startsWith('# ')) {
              return (
                <h2 key={index} className="text-xl sm:text-2xl font-display font-bold text-deep-navy-900 pt-4 mb-2">
                  {trimmed.replace('# ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h3 key={index} className="text-lg font-display font-semibold text-slate-900 pt-3 mb-2">
                  {trimmed.replace('## ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('* ')) {
              return (
                <ul key={index} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 my-3">
                  {trimmed.split('\n').map((li, i) => (
                    <li key={i}>{li.replace('* ', '')}</li>
                  ))}
                </ul>
              );
            }
            if (trimmed.startsWith('`')) {
              return (
                <pre key={index} className="p-4 bg-slate-900 text-white rounded-xl font-mono text-xs overflow-x-auto my-4 border">
                  {trimmed.replace(/`/g, '')}
                </pre>
              );
            }
            return (
              <p key={index} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Author info block */}
        <div className="border-t border-slate-200 pt-8 flex items-center gap-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover border border-slate-250"
          />
          <div>
            <span className="text-xs font-bold text-slate-900 block">{post.author.name}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{post.author.role}</span>
          </div>
        </div>

      </article>
    </div>
  );
};
