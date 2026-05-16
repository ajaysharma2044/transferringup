import { useState, useEffect } from 'react'
import { Plus, CreditCard as Edit2, Trash2, ExternalLink, Eye, EyeOff, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { BlogPost, formatDate, getCategoryLabel } from '../../lib/blog'
import BlogEditor from './BlogEditor'

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<string | null>(null)

  const loadPosts = async () => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!supabase) return
    setDeleting(id)
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (!error) {
      setPosts(prev => prev.filter(p => p.id !== id))
    }
    setDeleting(null)
  }

  const togglePublished = async (post: BlogPost) => {
    if (!supabase) return
    const { error } = await supabase
      .from('blog_posts')
      .update({ published: !post.published, updated_at: new Date().toISOString() })
      .eq('id', post.id)
    if (!error) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p))
    }
  }

  const toggleFeatured = async (post: BlogPost) => {
    if (!supabase) return
    const { error } = await supabase
      .from('blog_posts')
      .update({ featured: !post.featured, updated_at: new Date().toISOString() })
      .eq('id', post.id)
    if (!error) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, featured: !p.featured } : p))
    }
  }

  if (editingId !== undefined) {
    return (
      <BlogEditor
        postId={editingId}
        onBack={() => setEditingId(undefined)}
        onSaved={loadPosts}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blog Articles</h2>
          <p className="text-sm text-gray-500 mt-1">{posts.length} article{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setEditingId(null)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-16 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No articles yet</p>
          <button
            onClick={() => setEditingId(null)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create your first article
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-24 h-16 object-cover rounded-lg shrink-0 border border-gray-100"
                  />
                ) : (
                  <div className="w-24 h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                    <EyeOff className="w-5 h-5 text-gray-300" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {getCategoryLabel(post.category)}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                        {post.featured && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                            Featured
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => togglePublished(post)}
                        title={post.published ? 'Unpublish' : 'Publish'}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => toggleFeatured(post)}
                        title={post.featured ? 'Remove featured' : 'Set featured'}
                        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${post.featured ? 'text-amber-500' : 'text-gray-400 hover:text-gray-700'}`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      {post.published && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                          title="View live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => setEditingId(post.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this article? This cannot be undone.')) {
                            handleDelete(post.id)
                          }
                        }}
                        disabled={deleting === post.id}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogAdmin
