import { Clock, ArrowRight } from 'lucide-react';
import { BlogPost, formatDate, getCategoryLabel } from '../../lib/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  if (featured) {
    return (
      <a
        href={`/blog/${post.slug}`}
        className="group block relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-crimson-50 text-crimson-600 rounded-full">
                {getCategoryLabel(post.category)}
              </span>
              <span className="text-xs text-gray-400 font-medium">Featured</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-navy-900 mb-3 leading-tight group-hover:text-crimson-600 transition-colors duration-300">
              {post.title}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-600 font-bold text-sm">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-800">{post.author_name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatDate(post.created_at)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <Clock className="w-3 h-3" />
                    <span>{post.read_time_minutes} min</span>
                  </div>
                </div>
              </div>
              <span className="flex items-center gap-1 text-crimson-500 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Read <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-navy-800 rounded-full shadow-sm">
            {getCategoryLabel(post.category)}
          </span>
        </div>
      </div>
      <div className="p-5 md:p-6">
        <h3 className="text-lg font-bold text-navy-900 mb-2 leading-snug group-hover:text-crimson-600 transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs">
              {post.author_name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-800">{post.author_name}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>{formatDate(post.created_at)}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <Clock className="w-3 h-3" />
                <span>{post.read_time_minutes} min</span>
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-crimson-500 transition-colors duration-300 group-hover:translate-x-1 transform" />
        </div>
      </div>
    </a>
  );
};

export default BlogCard;
