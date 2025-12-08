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

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [creatingBucket, setCreatingBucket] = useState(false)
  const [bucketStatus, setBucketStatus] = useState<'unknown' | 'exists' | 'missing'>('unknown')

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
    setSelectedFile(null)
    setImagePreview(null)
    setUploadError(null)
    setUploadSuccess(false)
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
    setSelectedFile(null)
    setImagePreview(blog.featured_image_url || null)
    setUploadError(null)
    setUploadSuccess(false)
    setShowForm(true)
  }

  const checkBucketExists = async () => {
    try {
      const { data, error } = await supabase.storage.from('blog-images').list('', {
        limit: 1,
      })
      
      if (error) {
        if (error.message.includes('Bucket not found') || error.message.includes('not found')) {
          setBucketStatus('missing')
        } else {
          setBucketStatus('unknown')
        }
      } else {
        setBucketStatus('exists')
      }
    } catch (err) {
      setBucketStatus('missing')
    }
  }

  const handleCreateBucket = async () => {
    try {
      setCreatingBucket(true)
      setUploadError(null)

      const response = await fetch('/api/storage/setup-blog-images', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to create bucket')
      }

      setBucketStatus('exists')
      alert('✅ Storage bucket "blog-images" created successfully! You can now upload images.')
    } catch (err) {
      console.error('Error creating bucket:', err)
      setUploadError(
        `❌ Failed to create storage bucket.\n\n` +
        `Error: ${err instanceof Error ? err.message : 'Unknown error'}\n\n` +
        `Please create it manually:\n` +
        `1. Go to Supabase Dashboard → Storage → Buckets\n` +
        `2. Click "New bucket"\n` +
        `3. Name: blog-images\n` +
        `4. Make it Public (checked)\n` +
        `5. File size limit: 5242880 (5MB)\n` +
        `6. Allowed MIME types: image/jpeg, image/png, image/gif, image/webp\n` +
        `7. Click "Create bucket"\n\n` +
        `Then run the SQL script: database/setup_blog_images_storage.sql`
      )
    } finally {
      setCreatingBucket(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setUploadError('No file selected')
      return
    }

    // Reset previous states
    setUploadError(null)
    setUploadSuccess(false)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']

    if (!file.type.startsWith('image/')) {
      setUploadError(`Invalid file type. Selected: "${file.type}". Please select an image file (JPG, PNG, GIF, or WebP).`)
      return
    }

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      setUploadError(`File type "${file.type}" is not supported. Please use JPG, PNG, GIF, or WebP format.`)
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      setUploadError(`Image size (${fileSizeMB}MB) exceeds the maximum limit of 5MB. Please compress or resize the image.`)
      return
    }

    // Validate minimum file size (at least 1KB)
    if (file.size < 1024) {
      setUploadError('Image file is too small. Please select a valid image file.')
      return
    }

    setSelectedFile(file)
    setUploadError(null)

    // Create preview
    const reader = new FileReader()
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try selecting a different image.')
      setSelectedFile(null)
    }
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setUploadError('No file selected for upload')
      return
    }

    try {
      setUploadingImage(true)
      setUploadError(null)
      setUploadSuccess(false)

      // Get current session for authentication
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setUploadError('❌ You must be logged in to upload images. Please refresh the page and try again.')
        return
      }

      // Use server-side upload API for better authentication handling
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/storage/upload-blog-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Upload failed')
      }

      // Upload successful - verify we got a URL
      if (!result.url) {
        throw new Error('Upload succeeded but no URL returned from server')
      }

      // Verify the file actually exists in storage by checking the URL
      try {
        const verifyResponse = await fetch(result.url, { method: 'HEAD' })
        
        if (!verifyResponse.ok && verifyResponse.status !== 200) {
          console.error('File verification failed:', {
            status: verifyResponse.status,
            statusText: verifyResponse.statusText,
            url: result.url,
          })
          
          // Try to check if file exists in storage directly
          const { data: fileList, error: listError } = await supabase.storage
            .from('blog-images')
            .list('', {
              limit: 1000,
              search: result.path,
            })

          if (listError || !fileList?.some((f) => f.name === result.path)) {
            throw new Error(
              `File upload verification failed. The file may not have been saved correctly. ` +
              `Status: ${verifyResponse.status}, Path: ${result.path}`
            )
          }
        }
      } catch (verifyError) {
        console.error('File verification error:', verifyError)
        
        // If verification fails, still try to use the URL but warn the user
        if (verifyError instanceof Error && verifyError.message.includes('verification failed')) {
          setUploadError(
            `⚠️ Upload completed but file verification failed.\n\n` +
            `The file may not be accessible. Please check:\n` +
            `• The bucket is public\n` +
            `• Storage policies are configured\n` +
            `• The file URL: ${result.url}\n\n` +
            `You can try uploading again or use a direct image URL instead.`
          )
          return
        }
        // For other errors, continue - the file might still be there
      }

      // Double-check: Verify file exists in storage using Supabase client
      // Note: There may be a slight delay in storage propagation, so we'll retry
      let fileVerified = false
      let verificationAttempts = 0
      const maxAttempts = 3
      
      while (!fileVerified && verificationAttempts < maxAttempts) {
        try {
          // Add a small delay for subsequent attempts (storage propagation delay)
          if (verificationAttempts > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * verificationAttempts))
          }

          const { data: storageFiles, error: storageError } = await supabase.storage
            .from('blog-images')
            .list('', {
              limit: 1000,
            })

          if (storageError) {
            console.warn(`Storage list error (attempt ${verificationAttempts + 1}):`, storageError)
            // If it's a permission error, the file might still be there but we can't list it
            if (storageError.message?.includes('permission') || storageError.message?.includes('policy')) {
              console.log('Permission error listing files - file may still exist, using URL verification instead')
              fileVerified = true // Assume file exists if we can't list due to permissions
              break
            }
          } else if (storageFiles) {
            const fileExists = storageFiles.some((f) => f.name === result.path)
            if (fileExists) {
              fileVerified = true
              console.log('File verified in storage:', result.path)
              break
            } else {
              console.warn(`File not found in storage list (attempt ${verificationAttempts + 1}/${maxAttempts}):`, result.path)
            }
          }
        } catch (storageCheckError) {
          console.warn(`Storage check error (attempt ${verificationAttempts + 1}):`, storageCheckError)
        }
        
        verificationAttempts++
      }

      // If file still not verified, try to access it directly via URL
      if (!fileVerified) {
        console.warn('File not found in storage list after retries, attempting direct URL verification')
        try {
          // Try to fetch the image URL to verify it's accessible
          const urlCheck = await fetch(result.url, { method: 'HEAD' })
          if (urlCheck.ok || urlCheck.status === 200) {
            console.log('File is accessible via URL even though not in list - this is OK')
            fileVerified = true
          } else {
            console.warn('File URL not accessible:', urlCheck.status, urlCheck.statusText)
          }
        } catch (urlError) {
          console.warn('Could not verify file URL:', urlError)
        }
      }

      // If still not verified, show a warning but don't block the upload
      if (!fileVerified) {
        console.warn('⚠️ File verification incomplete, but proceeding with upload result')
        // Show a warning to the user but don't block
        setUploadError(
          `⚠️ Warning: Could not verify file was saved to storage.\n\n` +
          `The upload appeared successful, but we couldn't confirm the file exists.\n\n` +
          `File path: ${result.path}\n` +
          `File URL: ${result.url}\n\n` +
          `This might be due to:\n` +
          `• Storage propagation delay\n` +
          `• Permission issues with file listing\n` +
          `• Network issues\n\n` +
          `The image URL has been saved. Please verify the image displays correctly ` +
          `when you view the blog post. If the image doesn't appear, try uploading again.`
        )
        // Still update the form with the URL - it might work
        setForm((prev) => ({
          ...prev,
          featuredImageUrl: result.url,
        }))
        setSelectedFile(null)
        setBucketStatus('exists')
        return
      }

      // All checks passed - update form with the URL
      setForm((prev) => ({
        ...prev,
        featuredImageUrl: result.url,
      }))
      setSelectedFile(null)
      setUploadSuccess(true)
      setUploadError(null)
      setBucketStatus('exists') // Update bucket status
      
      console.log('Image uploaded successfully:', {
        url: result.url,
        path: result.path,
        fileName: result.fileName,
        size: result.size,
        verified: result.verified || false,
      })
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000)
      return
    } catch (err) {
      console.error('Error uploading image:', err)
      
      // Handle specific error cases
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      
      if (errorMessage.includes('Authentication') || errorMessage.includes('logged in')) {
        setUploadError(
          `❌ Authentication error.\n\n` +
          `Error: ${errorMessage}\n\n` +
          `Please refresh the page and try again.`
        )
      } else if (errorMessage.includes('Admin access required') || errorMessage.includes('FORBIDDEN')) {
        setUploadError(
          `❌ Permission denied.\n\n` +
          `Error: ${errorMessage}\n\n` +
          `Only admin users can upload images. Please ensure you are logged in as an admin.`
        )
      } else if (errorMessage.includes('Invalid file type') || errorMessage.includes('INVALID_TYPE')) {
        setUploadError(
          `❌ Invalid file type.\n\n` +
          `Error: ${errorMessage}\n\n` +
          `Please use JPG, PNG, GIF, or WebP format.`
        )
      } else if (errorMessage.includes('File too large') || errorMessage.includes('FILE_TOO_LARGE')) {
        setUploadError(
          `❌ File too large.\n\n` +
          `Error: ${errorMessage}\n\n` +
          `Maximum file size is 5MB. Please compress or resize your image.`
        )
      } else if (errorMessage.includes('Bucket not found') || errorMessage.includes('not found')) {
        setUploadError(
          `❌ Storage bucket "blog-images" not found.\n\n` +
          `Please create the bucket in your Supabase dashboard:\n` +
          `1. Go to Storage → Buckets → New Bucket\n` +
          `2. Name: blog-images\n` +
          `3. Make it Public\n` +
          `4. Set file size limit to 5MB\n` +
          `5. Add allowed MIME types: image/jpeg, image/png, image/gif, image/webp\n\n` +
          `Then run the SQL script: database/setup_blog_images_storage.sql`
        )
      } else if (
        errorMessage.includes('verification failed') ||
        errorMessage.includes('not found in storage') ||
        errorMessage.includes('FILE_NOT_FOUND') ||
        errorMessage.includes('UPLOAD_NO_DATA')
      ) {
        setUploadError(
          `❌ File upload verification failed.\n\n` +
          `Error: ${errorMessage}\n\n` +
          `The file may not have been saved correctly to storage.\n\n` +
          `Possible causes:\n` +
          `• Storage bucket permissions issue\n` +
          `• Network interruption during upload\n` +
          `• Storage quota exceeded\n` +
          `• Bucket configuration issue\n\n` +
          `Please try:\n` +
          `1. Check if the bucket exists and is public\n` +
          `2. Verify storage policies are set up\n` +
          `3. Try uploading again\n` +
          `4. Check Supabase dashboard for storage errors`
        )
      } else {
        setUploadError(
          `❌ Upload failed.\n\n` +
          `Error: ${errorMessage}\n\n` +
          `Please check:\n` +
          `• You are logged in as an admin\n` +
          `• The bucket exists and is public\n` +
          `• Storage policies are configured\n` +
          `• Your internet connection is working`
        )
      }
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveBlog = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert('Title and content are required')
      return
    }

    // Validate featured image URL if provided (non-blocking)
    if (form.featuredImageUrl.trim()) {
      const imageUrl = form.featuredImageUrl.trim()
      try {
        // Basic URL validation
        // eslint-disable-next-line no-new
        new URL(imageUrl)

        // Optional: lightweight HEAD check (non-blocking)
        fetch(imageUrl, { method: 'HEAD', mode: 'no-cors' }).catch((fetchError) => {
          console.warn('Could not verify image accessibility (non-blocking):', fetchError)
        })
      } catch (urlError) {
        console.warn('Image URL appears invalid (non-blocking):', urlError)
        // Do not block save; allow user to fix later
      }
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
        const { data: updateData, error } = await supabase
          .from('blogs')
          .update(payload)
          .eq('id', editingBlog.id)
          .select()

        if (error) {
          console.error('Error updating blog:', {
            error,
            fullError: JSON.stringify(error, null, 2),
            payload,
            blogId: editingBlog.id,
          })
          
          const errorMessage = getErrorMessage(error, 'Failed to update blog')
          
          // Check for specific error types
          let detailedMessage = `❌ Failed to update blog post.\n\n`
          
          if (error.code === '23505') {
            detailedMessage += `Duplicate entry error: A blog with this slug already exists.\n\n`
            detailedMessage += `Please change the slug and try again.`
          } else if (error.code === '23503') {
            detailedMessage += `Foreign key constraint error: Invalid reference.\n\n`
            detailedMessage += `Error: ${errorMessage}`
          } else if (error.code === '42501') {
            detailedMessage += `Permission denied: You don't have permission to update blogs.\n\n`
            detailedMessage += `Please ensure you are logged in as an admin user.`
          } else {
            detailedMessage += `Error: ${errorMessage}\n\n`
            if (error.code) {
              detailedMessage += `Error Code: ${error.code}\n`
            }
            if (error.details) {
              detailedMessage += `Details: ${error.details}\n`
            }
            if (error.hint) {
              detailedMessage += `Hint: ${error.hint}`
            }
          }
          
          alert(detailedMessage)
          setError(errorMessage)
          return
        }

        if (!updateData || updateData.length === 0) {
          console.error('Update returned no data:', { updateData, payload })
          alert('❌ Blog update completed but no data was returned. Please refresh and check if the update was successful.')
          return
        }
      } else {
        const { data: insertData, error } = await supabase
          .from('blogs')
          .insert(payload)
          .select()

        if (error) {
          console.error('Error creating blog:', {
            error,
            fullError: JSON.stringify(error, null, 2),
            payload,
          })
          
          const errorMessage = getErrorMessage(error, 'Failed to create blog')
          
          // Check for specific error types
          let detailedMessage = `❌ Failed to create blog post.\n\n`
          
          if (error.code === '23505') {
            detailedMessage += `Duplicate entry error: A blog with this slug already exists.\n\n`
            detailedMessage += `Slug: "${slug}"\n\n`
            detailedMessage += `Please change the title or slug and try again.`
          } else if (error.code === '23503') {
            detailedMessage += `Foreign key constraint error: Invalid reference.\n\n`
            detailedMessage += `Error: ${errorMessage}`
          } else if (error.code === '42501') {
            detailedMessage += `Permission denied: You don't have permission to create blogs.\n\n`
            detailedMessage += `Please ensure you are logged in as an admin user.\n\n`
            detailedMessage += `If you are an admin, check:\n`
            detailedMessage += `• RLS policies are configured correctly\n`
            detailedMessage += `• Your user role is set to 'admin' in the database`
          } else if (error.code === 'PGRST116') {
            detailedMessage += `No rows returned: The insert operation didn't return any data.\n\n`
            detailedMessage += `This might be a database configuration issue.`
          } else {
            detailedMessage += `Error: ${errorMessage}\n\n`
            if (error.code) {
              detailedMessage += `Error Code: ${error.code}\n`
            }
            if (error.details) {
              detailedMessage += `Details: ${error.details}\n`
            }
            if (error.hint) {
              detailedMessage += `Hint: ${error.hint}\n`
            }
            if (!error.message && !error.details && !error.hint) {
              detailedMessage += `\nFull error object: ${JSON.stringify(error, null, 2)}`
            }
          }
          
          alert(detailedMessage)
          setError(errorMessage)
          return
        }

        if (!insertData || insertData.length === 0) {
          console.error('Insert returned no data:', { insertData, payload })
          alert('❌ Blog creation completed but no data was returned. Please check if the blog was created successfully.')
          return
        }
      }

      setShowForm(false)
      resetForm()
      await loadBlogs()
    } catch (err) {
      console.error('Unexpected error saving blog:', {
        error: err,
        fullError: JSON.stringify(err, null, 2),
        formData: {
          title: form.title,
          slug: form.slug,
          hasContent: !!form.content,
          hasExcerpt: !!form.excerpt,
          hasImage: !!form.featuredImageUrl,
          tags: form.tagsText,
          isPublished: form.is_published,
        },
      })
      
      const errorMessage = getErrorMessage(err, 'Failed to save blog')
      const detailedMessage = `❌ Unexpected error occurred while saving blog.\n\n` +
        `Error: ${errorMessage}\n\n` +
        `Please try again. If the problem persists:\n` +
        `• Check your internet connection\n` +
        `• Verify your Supabase configuration\n` +
        `• Check the browser console for more details`
      
      alert(detailedMessage)
      setError(errorMessage)
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

  const getErrorMessage = (error: any, defaultMessage: string): string => {
    if (!error) return defaultMessage

    // Supabase error structure
    if (error.message) return error.message
    if (error.error) return error.error
    if (error.details) return error.details
    if (error.hint) return error.hint

    // Check for common error patterns
    if (typeof error === 'string') return error

    // Try to extract from error object
    const errorString = JSON.stringify(error)
    if (errorString !== '{}') {
      return `Error: ${errorString}`
    }

    return defaultMessage
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Featured Image (optional)
                    </label>
                    {bucketStatus === 'missing' && (
                      <button
                        type="button"
                        onClick={handleCreateBucket}
                        disabled={creatingBucket}
                        className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50"
                      >
                        {creatingBucket ? 'Creating...' : 'Create Bucket'}
                      </button>
                    )}
                    {bucketStatus === 'exists' && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        ✓ Bucket Ready
                      </span>
                    )}
                  </div>
                  
                  {/* File Upload Section */}
                  <div className="mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`block w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer text-center text-sm ${
                        uploadingImage
                          ? 'bg-gray-100 cursor-not-allowed'
                          : 'bg-white hover:bg-gray-50'
                      } transition-colors`}
                    >
                      {selectedFile ? selectedFile.name : 'Choose Image File'}
                    </label>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploadingImage}
                        className="mt-2 w-full px-3 py-2 bg-[#ff4b01] text-white rounded-md hover:bg-[#e64401] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {uploadingImage ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </span>
                        ) : form.featuredImageUrl ? (
                          'Replace Image'
                        ) : (
                          'Upload Image'
                        )}
                      </button>
                    )}
                    {uploadSuccess && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">Image uploaded successfully!</p>
                            <p className="text-xs text-green-700 mt-1">The image URL has been automatically added to the form.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {uploadError && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-800 mb-1">Upload Failed</p>
                            <div className="text-xs text-red-700 whitespace-pre-line">{uploadError}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* URL Input Section */}
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Or enter image URL:</p>
                    <input
                      type="text"
                      value={form.featuredImageUrl}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          featuredImageUrl: e.target.value,
                        }))
                        setImagePreview(e.target.value || null)
                      }}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4b01]"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Used as the hero image on the blog listing and detail pages.
                  </p>

                  {/* Image Preview */}
                  {(imagePreview || form.featuredImageUrl.trim()) && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Preview:</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview || form.featuredImageUrl.trim()}
                        alt="Featured preview"
                        className="w-full max-h-40 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
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


