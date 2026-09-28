import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Search,
  BookOpen
} from 'lucide-react';
import { blogPosts } from '../../data/blog';
import { SEO } from '../../components/common/SEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

// 1. Blog & Resources Index Page component (/blog and /resources)
export const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogPosts.map((p) => p.category)));
    return ['all', ...cats];
  }, []);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        (post.tags && post.tags.some((t: string) => t.toLowerCase().includes(term)));
      return matchesCat && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = filteredPosts.length > 0 ? filteredPosts.slice(1) : [];

  return (
    <div className="bg-slate-50 min-h-screen py-10 text-left">
      <SEO
        title="Educational Guides, Roadmaps & Tech Blog | Edqoo"
        description="Read comprehensive guides, career roadmaps, and tutorials on Data Science, Python, Artificial Intelligence, Machine Learning, Power BI, and Data Analytics with Edqoo."
        canonical="/blog"
        keywords="Data Science blog, Python tutorial, Machine Learning roadmap, Data Analytics guide, Power BI tutorial, Edqoo resources, AI skills"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog & Resources', url: '/blog' }
        ]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-purple-50/70 via-slate-50 to-white text-slate-950 py-12 sm:py-16 border-b border-slate-200 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="px-3.5 py-1.5 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            Edqoo Knowledge & Learning Hub
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950">
            Educational Guides, Roadmaps & Tech Insights
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            In-depth roadmaps, practical code examples, and career strategies covering Data Science, AI, Python, Machine Learning, and Data Analytics.
          </p>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <Breadcrumbs items={[{ name: 'Blog & Resources', url: '/blog' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'All Articles' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search articles & roadmaps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-purple-600 shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Featured Post Card */}
        {featuredPost && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 group">
            <div className="md:col-span-7 bg-slate-100 aspect-[16/10] md:aspect-auto overflow-hidden">
              <img
                src={featuredPost.image}
                alt={`${featuredPost.title} - Edqoo guide`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
            </div>
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-left space-y-6">
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-1 bg-purple-100 border border-purple-200 text-purple-800 text-[10px] font-bold rounded uppercase tracking-wider">
                  {featuredPost.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors leading-tight">
                  <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {featuredPost.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {featuredPost.readTime}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Articles list grid */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-purple-300 transition-all text-left group"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={`${post.title} - Edqoo article`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
                      {post.category}
                    </span>
                    <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
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
        )}

        {filteredPosts.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-base text-slate-900">No articles found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search query or selecting another category.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="btn-primary px-4 py-2 text-xs font-bold rounded-lg shadow-2xs"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

// 2. Resource Details Dynamic View component (/blog/:slug and /resources/:slug)
export const ResourceDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 font-display">Article Not Found</h2>
        <p className="text-xs text-slate-500">The requested article may have been moved or updated.</p>
        <Link to="/blog" className="btn-primary px-5 py-2.5 text-xs font-semibold rounded-lg shadow">
          Back to Blog & Resources
        </Link>
      </div>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t: string) => post.tags.includes(t))))
    .slice(0, 3);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 text-slate-900 text-left">
      <SEO
        title={post.seoTitle || `${post.title} | Edqoo`}
        description={post.seoDescription || post.excerpt}
        canonical={`/blog/${post.slug}`}
        type="article"
        ogImage={post.image}
        ogImageAlt={post.title}
        keywords={post.tags}
        breadcrumbs={breadcrumbs}
        article={post}
      />

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <Breadcrumbs items={[{ name: 'Blog', url: '/blog' }, { name: post.title, url: `/blog/${post.slug}` }]} />
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <span className="px-3 py-1 bg-purple-100 border border-purple-200 text-purple-800 text-[11px] font-bold rounded-md uppercase tracking-wider inline-block">
            {post.category}
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-slate-950 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium border-y border-slate-200 py-3.5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Published: {post.date}
            </span>
            {post.updatedDate && (
              <>
                <span>•</span>
                <span className="text-purple-700 font-semibold">
                  Updated: {post.updatedDate}
                </span>
              </>
            )}
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Hero image */}
        <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
          <img
            src={post.image}
            alt={`${post.title} - Edqoo educational guide`}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Content Body with Markdown Rendering */}
        <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-2xs">
          {post.content.split('\n\n').map((paragraph: string, index: number) => {
            const trimmed = paragraph.trim();
            if (trimmed.startsWith('# ')) {
              return null; // Top H1 already rendered
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={index} className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 pt-5 mb-2 border-b border-slate-100 pb-2">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={index} className="text-base sm:text-lg font-display font-bold text-slate-900 pt-3 mb-1.5">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('* ')) {
              return (
                <ul key={index} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 my-3">
                  {trimmed.split('\n').map((li: string, i: number) => {
                    const lineText = li.replace(/^\*\s*/, '');
                    return (
                      <li key={i} className="leading-relaxed">
                        {lineText}
                      </li>
                    );
                  })}
                </ul>
              );
            }
            if (trimmed.startsWith('`')) {
              return (
                <pre key={index} className="p-4 bg-slate-900 text-purple-300 rounded-xl font-mono text-xs overflow-x-auto my-4 border border-slate-800">
                  {trimmed.replace(/`/g, '')}
                </pre>
              );
            }
            return (
              <p key={index} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Contextual Course Upskill Banner */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-2.5 py-1 bg-purple-800 text-purple-200 text-[10px] font-bold rounded uppercase tracking-wider inline-block">
              Practical Learning
            </span>
            <h3 className="text-lg sm:text-xl font-display font-bold">
              Ready to build real skills in Data Science & AI?
            </h3>
            <p className="text-xs text-purple-200 max-w-lg">
              Enroll in Edqoo's accredited live programs with 1-on-1 mentorship, industry capstone projects, and placement assistance.
            </p>
          </div>
          <Link
            to="/programs/data-science-and-ai"
            className="px-5 py-2.5 bg-white hover:bg-purple-50 text-purple-900 font-bold text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
          >
            <span>Explore Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Author info block */}
        <div className="border border-slate-200 bg-white p-6 rounded-2xl shadow-2xs flex items-center gap-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-purple-200"
          />
          <div>
            <span className="text-sm font-bold text-slate-900 block font-display">{post.author.name}</span>
            <span className="text-xs text-purple-700 font-medium block">{post.author.role}</span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Edqoo Academic Editorial & Mentorship Board
            </span>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-xl font-display font-bold text-slate-900">
              Related Articles & Tutorials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-xs transition-all space-y-2 block group"
                >
                  <span className="text-[10px] font-bold text-purple-600 uppercase block">
                    {rel.category}
                  </span>
                  <h3 className="font-display font-bold text-xs text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {rel.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 block">{rel.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </article>
    </div>
  );
};

// 3. Unified Blog component for route rendering
export const Blog: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  return slug ? <ResourceDetails /> : <Resources />;
};

export default Blog;
