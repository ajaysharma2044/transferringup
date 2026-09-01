import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Save, Eye, Image, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { BlogPost, BLOG_CATEGORIES } from '../../lib/blog'
import EditorToolbar from './EditorToolbar'
import ContentRenderer from '../blog/ContentRenderer'

interface BlogEditorProps {
  postId?: string | null
  onBack: () => void
  onSaved: () => void
}

const EMPTY_POST = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: 'general',
  tags: [] as string[],
  author_name: 'Transferring Up',
  author_image: '',
  author_role: '',
  published: false,
  featured: false,
  read_time_minutes: 5,
  meta_title: '',
  meta_description: '',
}

const BlogEditor = ({ postId, onBack, onSaved }: BlogEditorProps) => {
  const [form, setForm] = useState(EMPTY_POST)
  const [tagInput, setTagInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (postId) {
      loadPost(postId)
    }
  }, [postId])

  const loadPost = async (id: string) => {
    if (!supabase) return
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) {
      setError('Failed to load article')
    } else if (data) {
      setForm({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        cover_image: data.cover_image || '',
        category: data.category || 'general',
        tags: data.tags || [],
        author_name: data.author_name || 'Transferring Up',
        author_image: data.author_image || '',
        author_role: data.author_role || '',
        published: data.published || false,
        featured: data.featured || false,
        read_time_minutes: data.read_time_minutes || 5,
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
      })
    }
    setLoading(false)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: !postId ? generateSlug(title) : prev.slug,
    }))
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const estimateReadTime = (content: string) => {
    const words = content.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
  }

  const handleContentChange = (content: string) => {
    setForm(prev => ({
      ...prev,
      content,
      read_time_minutes: estimateReadTime(content),
    }))
  }

  const handleSave = async () => {
    if (!supabase) {
      setError('Database not connected')
      return
    }
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    if (!form.slug.trim()) {
      setError('Slug is required')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    }

    let result
    if (postId) {
      result = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', postId)
    } else {
      result = await supabase
        .from('blog_posts')
        .insert(payload)
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      setSuccess(postId ? 'Article updated' : 'Article created')
      setTimeout(() => {
        onSaved()
        onBack()
      }, 800)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    )
  }

  const categories = Object.entries(BLOG_CATEGORIES).filter(([key]) => key !== 'all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to articles
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          {success}
        </div>
      )}

      {showPreview ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {form.cover_image && (
            <img
              src={form.cover_image}
              alt={form.title}
              className="w-full aspect-[2/1] object-cover rounded-xl mb-6"
            />
          )}
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-gray-100 text-gray-700 rounded-full mb-4">
            {BLOG_CATEGORIES[form.category] || form.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{form.title || 'Untitled'}</h1>
          <p className="text-gray-500 text-lg mb-6">{form.excerpt}</p>
          <ContentRenderer content={form.content} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Article title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-lg transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">/blog/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="article-url-slug"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief summary shown on cards and in search results..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
                <EditorToolbar
                  textareaRef={textareaRef}
                  content={form.content}
                  onInsert={handleContentChange}
                />
                <textarea
                  ref={textareaRef}
                  value={form.content}
                  onChange={e => handleContentChange(e.target.value)}
                  placeholder="Write your article content here. Use the toolbar above to format text and insert images..."
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-t-none rounded-b-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm leading-relaxed transition-all font-mono border-t-0"
                />
                <p className="text-xs text-gray-400 mt-1">
                  ~{form.read_time_minutes} min read ({form.content.split(/\s+/).filter(Boolean).length} words)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h3 className="font-semibold text-gray-900">Settings</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                >
                  {categories.map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Published</label>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, published: !prev.published }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Featured</label>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, featured: !prev.featured }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h3 className="font-semibold text-gray-900">Cover Image</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="url"
                    value={form.cover_image}
                    onChange={e => setForm(prev => ({ ...prev, cover_image: e.target.value }))}
                    placeholder="https://images.pexels.com/..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Paste any image URL (Pexels, Unsplash, etc.)
                </p>
              </div>
              {form.cover_image && (
                <img
                  src={form.cover_image}
                  alt="Cover preview"
                  className="w-full aspect-video object-cover rounded-lg border border-gray-200"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h3 className="font-semibold text-gray-900">Author</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.author_name}
                  onChange={e => setForm(prev => ({ ...prev, author_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <input
                  type="text"
                  value={form.author_role}
                  onChange={e => setForm(prev => ({ ...prev, author_role: e.target.value }))}
                  placeholder="e.g., Transfer Consultant"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h3 className="font-semibold text-gray-900">Tags</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h3 className="font-semibold text-gray-900">SEO</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
                <input
                  type="text"
                  value={form.meta_title}
                  onChange={e => setForm(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder={form.title || 'Page title for search engines'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
                <textarea
                  value={form.meta_description}
                  onChange={e => setForm(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder={form.excerpt || 'Description for search engines'}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogEditor
