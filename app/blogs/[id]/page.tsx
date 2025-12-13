import Link from 'next/link'
import { Metadata } from 'next'

interface BlogAuthor {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
}

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image_url: string | null
  author: BlogAuthor | null
  is_published: boolean
  published_at: string | null
  tags: string[] | null
  created_at: string
}

interface BlogResponse {
  blog: Blog
}

interface PageProps {
  params: Promise<{
  params: Promise<{
    id: string
  }>
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/blogs/${id}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return {
        title: 'Blog | auditly360',
      }
    }

    const data: BlogResponse = await res.json()
    const blog = data.blog

    return {
      title: blog.title || 'Blog | auditly360',
      description: blog.excerpt || undefined,
    }
  } catch {
    return {
      title: 'Blog | auditly360',
    }
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getAuthorName = (author: BlogAuthor | null) => {
  if (!author) return 'Team auditly360'
  if (author.first_name && author.last_name) {
    return `${author.first_name} ${author.last_name}`
  }
  if (author.first_name) {
    return author.first_name
  }
  return 'Team auditly360'
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/blogs/${id}`, {
    // Always get fresh data for now; can switch to revalidate if needed
    cache: 'no-store',
  })

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog not found</h1>
          <p className="text-gray-600 mb-4">
            The blog post you are looking for does not exist or may have been removed.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#ff4b01] text-white hover:bg-[#e64401] transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const data: BlogResponse = await res.json()
  const blog = data.blog

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm text-gray-500 mb-3">
            <Link href="/blogs" className="hover:text-[#ff4b01]">
            <Link href="/blogs" className="hover:text-[#ff4b01]">
              Blog
            </Link>{' '}
            </Link>{' '}
            / <span className="text-gray-700">Post</span>
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>By {getAuthorName(blog.author)}</span>
            {blog.published_at && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{formatDate(blog.published_at)}</span>
              </>
            )}
            {blog.tags && blog.tags.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex flex-wrap gap-1">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-[#ff4b01]/10 text-[#ff4b01] text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {blog.featured_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.featured_image_url}
            alt={blog.title}
            className="w-full max-h-96 object-cover rounded-lg border border-gray-200 mb-8"
          />
        )}

        <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#ff4b01]">
          {/* Blog content stored as HTML from the editor */}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
      </div>
    </div>
  )
}


