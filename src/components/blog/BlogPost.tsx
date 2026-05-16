import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Tag, Share2 } from 'lucide-react';
import { BlogPost as BlogPostType, fetchPostBySlug, formatDate, getCategoryLabel } from '../../lib/blog';
import Header from '../Header';
import Footer from '../Footer';
import ContentRenderer from './ContentRenderer';

const BlogPostPage = () => {
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];
    if (slug) {
      fetchPostBySlug(slug).then((data) => {
        setPost(data);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="sticky top-0 z-50"><Header /></div>
        <div className="max-w-[680px] mx-auto px-5 py-24">
          <div className="animate-pulse space-y-8">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-px bg-gray-100" />
            <div className="aspect-[16/9] bg-gray-200 rounded-lg" />
            <div className="space-y-4 pt-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="sticky top-0 z-50"><Header /></div>
        <div className="max-w-[680px] mx-auto px-5 py-24 text-center">
          <h1 className="font-display text-3xl font-bold text-navy-900 mb-4">Article Not Found</h1>
          <p className="font-body text-gray-500 mb-8">The article you are looking for does not exist or has been removed.</p>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-full font-body font-medium text-sm hover:bg-navy-800 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="sticky top-0 z-50">
        <Header />
        <div className="h-[2px] bg-gray-100">
          <div
            className="h-full bg-crimson-500 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <article>
        <header className="pt-10 md:pt-16 pb-8 md:pb-10">
          <div className="max-w-[680px] mx-auto px-5">
            <a
              href="/blog"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-navy-800 text-[13px] font-body font-medium uppercase tracking-widest mb-8 transition-colors duration-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Articles
            </a>

            <div className="mb-5">
              <span className="font-body text-[11px] font-bold tracking-[0.15em] uppercase text-crimson-500">
                {getCategoryLabel(post.category)}
              </span>
            </div>

            <h1 className="font-display text-[2.25rem] md:text-[2.875rem] lg:text-[3.25rem] font-bold text-navy-900 leading-[1.1] tracking-[-0.02em] mb-5">
              {post.title}
            </h1>

            <p className="font-body text-lg md:text-xl text-gray-500 leading-[1.6] mb-8 max-w-[600px]">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between py-5 border-t border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white font-display font-bold text-sm">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-navy-900">{post.author_name}</p>
                  {post.author_role && (
                    <p className="font-body text-xs text-gray-400">{post.author_role}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-5 text-[13px] font-body text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.read_time_minutes} min read</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {post.cover_image && (
          <div className="max-w-[900px] mx-auto px-5 mb-10 md:mb-14">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full aspect-[16/9] object-cover rounded-lg"
            />
          </div>
        )}

        <div className="max-w-[680px] mx-auto px-5 pb-12 md:pb-20">
          <ContentRenderer content={post.content} />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-4 h-4 text-gray-300" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-[11px] font-body font-semibold tracking-wider uppercase bg-gray-100 text-gray-500 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-between">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 font-body text-sm font-medium text-navy-800 hover:text-crimson-600 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all articles
            </a>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 bg-white text-gray-600 text-sm font-body font-medium transition-all duration-300 hover:shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              {copied ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
