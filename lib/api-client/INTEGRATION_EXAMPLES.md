# API Client Integration Examples

Complete examples for integrating the Screenshot API client into your application.

## 🎯 React Component Example

```tsx
'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client/api-client'
import type { ApiError } from '@/lib/api-client/types'

export default function ScreenshotCapture() {
  const [url, setUrl] = useState('https://example.com')
  const [loading, setLoading] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const captureScreenshot = async () => {
    setLoading(true)
    setError(null)
    setScreenshot(null)

    try {
      const result = await apiClient.takeScreenshot(url, {
        delay: 3000,
        fullPage: true,
        viewport: { width: 1920, height: 1080 }
      })

      if (result.desktopUrl) {
        setScreenshot(result.desktopUrl)
      } else {
        setError('No screenshot URL returned')
      }
    } catch (err) {
      const apiError = err as ApiError
      
      // Handle specific error codes
      switch (apiError.code) {
        case 'UNAUTHORIZED':
        case 'MISSING_API_KEY':
        case 'INVALID_API_KEY':
          setError('Authentication failed. Please check your API key.')
          break
        case 'TIMEOUT':
          setError('Request timed out. Please try again.')
          break
        case 'NETWORK_ERROR':
          setError('Network error. Please check your connection.')
          break
        default:
          setError(apiError.message || 'Failed to capture screenshot')
      }
      
      console.error('Screenshot error:', apiError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Screenshot Capture</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Website URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="https://example.com"
          />
        </div>

        <button
          onClick={captureScreenshot}
          disabled={loading || !url}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Capturing...' : 'Capture Screenshot'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {screenshot && (
          <div className="border rounded-lg overflow-hidden">
            <img src={screenshot} alt="Screenshot" className="w-full" />
          </div>
        )}
      </div>
    </div>
  )
}
```

## 🔄 With Database Storage

```tsx
'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client/api-client'

export default function ScreenshotWithStorage() {
  const [url, setUrl] = useState('')
  const [pageId, setPageId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const captureAndSave = async () => {
    setLoading(true)
    
    try {
      // Takes screenshot and saves to database
      const response = await apiClient.takeScreenshotWithPageId(
        url,
        pageId,
        {
          delay: 3000,
          fullPage: true
        }
      )
      
      setResult(response)
      console.log('Screenshot saved to database:', response)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Website URL"
        className="w-full px-4 py-2 border rounded"
      />
      
      <input
        type="text"
        value={pageId}
        onChange={(e) => setPageId(e.target.value)}
        placeholder="Page ID"
        className="w-full px-4 py-2 border rounded"
      />
      
      <button
        onClick={captureAndSave}
        disabled={loading || !url || !pageId}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Processing...' : 'Capture & Save'}
      </button>

      {result && (
        <div className="grid grid-cols-2 gap-4">
          {result.desktopUrl && (
            <div>
              <h3 className="font-medium mb-2">Desktop</h3>
              <img src={result.desktopUrl} alt="Desktop" />
            </div>
          )}
          {result.mobileUrl && (
            <div>
              <h3 className="font-medium mb-2">Mobile</h3>
              <img src={result.mobileUrl} alt="Mobile" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

## 📋 Batch Screenshot Processing

```typescript
import { apiClient } from '@/lib/api-client/api-client'

async function batchScreenshots(urls: string[]) {
  const results = []
  const errors = []

  for (const url of urls) {
    try {
      console.log(`Processing: ${url}`)
      
      const result = await apiClient.takeScreenshot(url, {
        delay: 2000,
        fullPage: true
      })
      
      results.push({
        url,
        success: true,
        screenshot: result.desktopUrl
      })
      
      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Failed: ${url}`, error)
      errors.push({
        url,
        success: false,
        error: error.message
      })
    }
  }

  return { results, errors }
}

// Usage
const urls = [
  'https://example.com',
  'https://google.com',
  'https://github.com'
]

const { results, errors } = await batchScreenshots(urls)
console.log(`Success: ${results.length}, Failed: ${errors.length}`)
```

## 🔍 Screenshot List with Pagination

```tsx
'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client/api-client'

export default function ScreenshotList() {
  const [screenshots, setScreenshots] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const loadScreenshots = async () => {
    setLoading(true)
    
    try {
      const result = await apiClient.getScreenshots({
        page,
        limit: 10
      })
      
      setScreenshots(result.data || [])
      setTotal(result.total || 0)
    } catch (error) {
      console.error('Failed to load screenshots:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScreenshots()
  }, [page])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Screenshots ({total})
      </h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {screenshots.map((screenshot: any) => (
            <div key={screenshot.id} className="border rounded-lg p-4">
              <img 
                src={screenshot.url} 
                alt={screenshot.pageUrl}
                className="w-full h-40 object-cover rounded"
              />
              <p className="mt-2 text-sm truncate">
                {screenshot.pageUrl}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={screenshots.length < 10}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

## 🎨 Custom Client Configuration

```typescript
import { ApiClient } from '@/lib/api-client/api-client'

// Create a custom client for a specific use case
const customClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_SCREENSHOT_API_BASE_URL!,
  apiKey: process.env.NEXT_PUBLIC_SCREENSHOT_API_KEY!,
  timeout: 600000,  // 10 minutes for large pages
  retries: 5,       // More retries for unreliable networks
  retryDelay: 2000  // 2 second initial delay
})

// Use custom client
export async function captureComplexPage(url: string) {
  return customClient.takeScreenshot(url, {
    delay: 5000,      // Wait longer for complex pages
    fullPage: true,
    viewport: {
      width: 1920,
      height: 1080
    }
  })
}
```

## 🧪 Testing API Key

```typescript
import { apiClient } from '@/lib/api-client/api-client'

export async function validateApiKey(): Promise<boolean> {
  try {
    const status = await apiClient.getStatus()
    console.log('✅ API key is valid', status)
    return true
  } catch (error) {
    if (error.code === 'UNAUTHORIZED') {
      console.error('❌ Invalid API key')
      console.error('Details:', error.details)
    } else if (error.code === 'MISSING_API_KEY') {
      console.error('❌ No API key configured')
      console.error('Add NEXT_PUBLIC_SCREENSHOT_API_KEY to .env.local')
    } else {
      console.error('❌ API validation failed:', error.message)
    }
    return false
  }
}

// Run on app startup
validateApiKey()
```

## 🔐 Environment Variable Validation

```typescript
// lib/config.ts
export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_SCREENSHOT_API_KEY',
    'SCREENSHOT_API_KEY'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(key => console.error(`  - ${key}`))
    throw new Error('Missing required environment variables')
  }

  // Validate keys match
  if (process.env.NEXT_PUBLIC_SCREENSHOT_API_KEY !== process.env.SCREENSHOT_API_KEY) {
    console.warn('⚠️ Client and server API keys do not match')
  }

  console.log('✅ Configuration validated')
}

// Call in app initialization
validateConfig()
```

## 📊 Progress Tracking

```tsx
'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client/api-client'

export default function ProgressTracker() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')

  const captureWithProgress = async (url: string) => {
    setProgress(0)
    setStatus('Starting...')

    try {
      setProgress(25)
      setStatus('Connecting to server...')

      const result = await apiClient.takeScreenshot(url, {
        delay: 3000,
        fullPage: true
      })

      setProgress(75)
      setStatus('Processing screenshot...')

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))

      setProgress(100)
      setStatus('Complete!')

      return result
    } catch (error) {
      setStatus('Failed: ' + error.message)
      throw error
    }
  }

  return (
    <div>
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{status}</p>
      </div>
    </div>
  )
}
```

## 🔄 Retry with Custom Logic

```typescript
import { apiClient } from '@/lib/api-client/api-client'
import type { ApiError } from '@/lib/api-client/types'

async function captureWithCustomRetry(
  url: string,
  maxAttempts = 3
): Promise<any> {
  let lastError: ApiError | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxAttempts}`)
      
      const result = await apiClient.takeScreenshot(url, {
        delay: 3000,
        fullPage: true
      })
      
      return result
    } catch (error) {
      lastError = error as ApiError
      
      // Don't retry on authentication errors
      if (error.code === 'UNAUTHORIZED' || error.code === 'INVALID_API_KEY') {
        throw error
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxAttempts) {
        const delay = 1000 * Math.pow(2, attempt - 1)
        console.log(`Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}
```
