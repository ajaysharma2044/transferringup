import { supabase } from './supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  author_name: string;
  author_image: string;
  author_role: string;
  published: boolean;
  featured: boolean;
  read_time_minutes: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export const BLOG_CATEGORIES: Record<string, string> = {
  'all': 'All Posts',
  'transfer-tips': 'Transfer Tips',
  'essay-writing': 'Essay Writing',
  'how-to-guides': 'How-To Guides',
  'financial-aid': 'Financial Aid',
  'general': 'General',
};

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  return data || [];
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
  return data;
}

export async function fetchFeaturedPosts(): Promise<BlogPost[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3);
  if (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
  return data || [];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getCategoryLabel(category: string): string {
  return BLOG_CATEGORIES[category] || category;
}
