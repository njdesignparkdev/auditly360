'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase-client'

interface AdminBlogEditorProps {
  userProfile: {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    role: 'user' | 'admin'
    email_confirmed: boolean
    created_at: string
  }
}

interface BlogRow {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image_url: string | null
  tags: string[] | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export default function AdminBlogEditor({}: AdminBlogEditorProps) {
  const [blogs, setBlogs] = useState<BlogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogRow | null>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    tagsText: '',
    featuredImageUrl: '',
    is_published: false,
  })

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, content, excerpt, featured_image_url, tags, is_published, published_at, created_at, updated_at')
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading blogs:', error)
        setError(error.message || 'Failed to load blogs')
        setBlogs([])
        return
      }

      setBlogs(data || [])
    } catch (err) {
      console.error('Unexpected error loading blogs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load blogs')
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBlogs()
  }, [loadBlogs])

  const resetForm = () => {
    setEditingBlog(null)
    setForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      tagsText: '',
      featuredImageUrl: '',
      is_published: false,
    })
  }

  const handleNewBlog = () => {
    resetForm()
    setShowForm(true)
  }

  const handleEditBlog = (blog: BlogRow) => {
    setEditingBlog(blog)
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || '',
      tagsText: (blog.tags || []).join(', '),
      featuredImageUrl: blog.featured_image_url || '',
      is_published: blog.is_published,
    })
    setShowForm(true)
  }

  const handleSaveBlog = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert('Title and content are required')
      return
    }

    const slug = form.slug.trim() || generateSlug(form.title)
    const tags =
      form.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean) || []

    try {
      setSaving(true)
      setError(null)

      const payload = {
        title: form.title.trim(),
        slug,
        content: form.content,
        excerpt: form.excerpt.trim() || null,
        featured_image_url: form.featuredImageUrl.trim() || null,
        tags,
        is_published: form.is_published,
        published_at: form.is_published ? new Date().toISOString() : null,
      }

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(payload)
          .eq('id', editingBlog.id)

        if (error) {
          console.error('Error updating blog:', error)
          alert(error.message || 'Failed to update blog')
          return
        }
      } else {
        const { error } = await supabase.from('blogs').insert(payload)

        if (error) {
          console.error('Error creating blog:', error)
          alert(error.message || 'Failed to create blog')
          return
        }
      }

      setShowForm(false)
      resetForm()
      await loadBlogs()
    } catch (err) {
      console.error('Unexpected error saving blog:', err)
      alert(err instanceof Error ? err.message : 'Failed to save blog')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black mb-1">Blog Editor</h1>
            <p className="text-gray-600">
              Create and manage blog posts for the auditly360 blog.
            </p>
          </div>
          <button
            onClick={handleNewBlog}
            className="bg-[#ff4b01] text-white px-4 py-2 rounded-lg hover:bg-[#e64401] transition-colors"
          >
            + New Blog Post
          </button>
        </div>
      </div>

      {/* Blog List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">Existing Posts</h3>
          {loading && (
            <span className="text-sm text-gray-500">Loading blogs...</span>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && blogs.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            No blog posts found. Click &quot;New Blog Post&quot; to create one.
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-[#ff4b01]/40 hover:bg-[#ff4b01]/5 transition-colors cursor-pointer flex items-center justify-between"
                onClick={() => handleEditBlog(blog)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-black line-clamp-1">
                      {blog.title}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        blog.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {blog.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    slug: <span className="font-mono">{blog.slug}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {formatDate(blog.created_at)}
                    {blog.published_at && ` • Published: ${formatDate(blog.published_at)}`}
                  </p>
                </div>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 max-w-xs justify-end">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-[#ff4b01]/10 text-[#ff4b01]"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{blog.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Editor Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-black mb-4">
              {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                        slug: prev.slug || generateSlug(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4b01]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (HTML or Markdown)
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={16}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4b01]"
                    placeholder="Write your blog content here. You can use HTML for formatting."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt (optional)
                  </label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4b01]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Short summary used on listing pages and for SEO descriptions.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        slug: e.target.value.toLowerCase(),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4b01]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly identifier, e.g. <code>website-audit-guide</code>.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={form.tagsText}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        tagsText: e.target.value,
                      }))
                    }
                    placeholder="seo, audit, performance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4b01]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma-separated list of tags.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image URL (optional)
                  </label>
                  <input
                    type="text"
                    value={form.featuredImageUrl}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        featuredImageUrl: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4b01]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used as the hero image on the blog listing and detail pages.
                  </p>
                  {form.featuredImageUrl.trim() && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Preview:</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.featuredImageUrl.trim()}
                        alt="Featured preview"
                        className="w-full max-h-40 object-cover rounded border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          is_published: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-[#ff4b01] border-gray-300 rounded"
                    />
                    Mark as published
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                disabled={saving}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlog}
                disabled={saving}
                className="px-4 py-2 bg-[#ff4b01] text-white rounded-md hover:bg-[#e64401] disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingBlog ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}


