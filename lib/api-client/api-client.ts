/**
 * Screenshot API Client
 * 
 * A production-ready TypeScript client for making authenticated requests to the Screenshot API.
 * 
 * ## Authentication Flow
 * 
 * This client implements API key authentication that aligns with the server-side implementation
 * in `/api/screenshot/route.ts`:
 * 
 * 1. **Client** → Sends request with `X-API-Key` header (default)
 * 2. **Server** (`/api/screenshot`) → Validates key matches `SCREENSHOT_API_KEY` env var
 * 3. **Server** → Forwards to external screenshot service with its own API key
 * 4. **Response** → Returns screenshot data to client
 * 
 * ## Security
 * 
 * - API keys are sent via headers (not query params) by default
 * - Server validates keys before processing any request
 * - Returns 401 for missing/invalid keys with detailed error messages
 * - Supports three authentication methods: header (default), bearer, query
 * 
 * ## Features
 * 
 * - ✅ Automatic retry with exponential backoff
 * - ✅ Configurable timeout (default: 5 minutes)
 * - ✅ Comprehensive error handling
 * - ✅ TypeScript type safety
 * - ✅ Detailed logging in development mode
 * - ✅ Multiple authentication methods
 * 
 * ## Usage
 * 
 * ```typescript
 * import { apiClient } from '@/lib/api-client/api-client'
 * 
 * // Take a screenshot
 * const result = await apiClient.takeScreenshot('https://example.com', {
 *   delay: 3000,
 *   fullPage: true
 * })
 * 
 * // With database storage
 * const result = await apiClient.takeScreenshotWithPageId(
 *   'https://example.com',
 *   'page-id-123',
 *   { delay: 3000 }
 * )
 * ```
 * 
 * @see README.md for complete documentation
 * @see INTEGRATION_EXAMPLES.md for usage examples
 */

import type {
  ApiClientConfig,
  ApiError,
  ApiKeyLocation,
  ScreenshotRequest,
  ScreenshotResponse,
  ScreenshotsListResponse,
  ServerStatusResponse,
} from './types'

/**
 * API Client for Screenshot Service
 * 
 * Handles authentication, retries, timeouts, and error handling for all API requests.
 */
export class ApiClient {
  private baseURL: string
  private apiKey: string
  private timeout: number
  private retries: number
  private retryDelay: number

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL.replace(/\/$/, '') // Remove trailing slash
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 300000 // 5 minutes default
    this.retries = config.retries || 3
    this.retryDelay = config.retryDelay || 1000 // 1 second default

    if (!this.apiKey) {
      console.warn('⚠️ API Client: No API key provided. Requests may fail.')
    }
  }

  /**
   * Create headers with API key authentication
   * 
   * Supports three authentication methods:
   * 
   * 1. **header** (default, recommended): Sends `X-API-Key: your-key`
   *    - Most secure and standard approach
   *    - Validated by `/api/screenshot/route.ts` lines 6-48
   * 
   * 2. **bearer**: Sends `Authorization: Bearer your-key`
   *    - OAuth-style authentication
   *    - Alternative if your server expects Bearer tokens
   * 
   * 3. **query**: Appends `?apiKey=your-key` to URL
   *    - Less secure (visible in logs, browser history)
   *    - Only use if header authentication is not possible
   * 
   * @param apiKeyLocation - Where to send the API key (default: 'header')
   * @returns Headers object with authentication and content-type
   */
  private createHeaders(apiKeyLocation: ApiKeyLocation = 'header'): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    switch (apiKeyLocation) {
      case 'header':
        headers['X-API-Key'] = this.apiKey
        break
      case 'bearer':
        headers['Authorization'] = `Bearer ${this.apiKey}`
        break
      // query parameter is handled in the request method
    }

    return headers
  }

  /**
   * Make an authenticated request with retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    apiKeyLocation: ApiKeyLocation = 'header'
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`
    
    // Handle query parameter API key location
    const finalUrl = apiKeyLocation === 'query' 
      ? `${url}${url.includes('?') ? '&' : '?'}apiKey=${encodeURIComponent(this.apiKey)}`
      : url

    const headers = this.createHeaders(apiKeyLocation === 'query' ? 'header' : apiKeyLocation)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    let lastError: ApiError | null = null

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(finalUrl, {
          ...options,
          headers: {
            ...headers,
            ...options.headers,
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // Handle 401 Unauthorized
        if (response.status === 401) {
          // Parse error response BEFORE logging (response can only be read once)
          const errorData = await this.parseErrorResponse(response)
          
          const error: ApiError = {
            message: errorData?.error || errorData?.message || 'Unauthorized: Invalid or missing API key',
            code: errorData?.code || 'UNAUTHORIZED',
            status: 401,
            details: errorData?.details || errorData?.error || 'Please check your API key configuration. Make sure NEXT_PUBLIC_SCREENSHOT_API_KEY is set in your .env.local file and matches SCREENSHOT_API_KEY on the server.',
          }
          
          // Log detailed error information
          console.error('❌ API Client: Authentication failed', {
            message: error.message,
            code: error.code,
            status: error.status,
            details: error.details,
            hasApiKey: !!this.apiKey,
            apiKeyLength: this.apiKey?.length || 0,
            apiKeyPrefix: this.apiKey?.substring(0, 8) + '...' || 'N/A',
            baseURL: this.baseURL,
            endpoint: url,
            serverResponse: errorData,
          })
          
          throw error
        }

        // Handle other error status codes
        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response)
          const error: ApiError = {
            message: errorData.message || `Request failed with status ${response.status}`,
            code: errorData.code || 'REQUEST_FAILED',
            status: response.status,
            details: errorData.details || errorData.error || response.statusText,
          }
          
          // Don't retry on client errors (4xx), except 429 (rate limit)
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw error
          }
          
          // Retry on server errors (5xx) and rate limits (429)
          lastError = error
          if (attempt < this.retries) {
            const delay = this.retryDelay * Math.pow(2, attempt) // Exponential backoff
            console.warn(`⚠️ API Client: Request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${this.retries})`)
            await this.sleep(delay)
            continue
          }
          throw error
        }

        // Parse successful response
        const data = await response.json()
        return data as T
      } catch (error: any) {
        clearTimeout(timeoutId)

        // Handle abort (timeout)
        if (error.name === 'AbortError' || controller.signal.aborted) {
          const timeoutError: ApiError = {
            message: 'Request timeout',
            code: 'TIMEOUT',
            status: 504,
            details: `Request exceeded ${this.timeout}ms timeout`,
            originalError: error,
          }
          throw timeoutError
        }

        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
          lastError = {
            message: 'Network error',
            code: 'NETWORK_ERROR',
            status: 0,
            details: 'Failed to connect to the API server. Please check your connection.',
            originalError: error,
          }
          
          if (attempt < this.retries) {
            const delay = this.retryDelay * Math.pow(2, attempt)
            console.warn(`⚠️ API Client: Network error, retrying in ${delay}ms (attempt ${attempt + 1}/${this.retries})`)
            await this.sleep(delay)
            continue
          }
          throw lastError
        }

        // Re-throw API errors
        if (error.code) {
          throw error
        }

        // Unknown error
        lastError = {
          message: error.message || 'Unknown error occurred',
          code: 'UNKNOWN_ERROR',
          status: 0,
          details: 'An unexpected error occurred',
          originalError: error,
        }

        if (attempt < this.retries) {
          const delay = this.retryDelay * Math.pow(2, attempt)
          console.warn(`⚠️ API Client: Error occurred, retrying in ${delay}ms (attempt ${attempt + 1}/${this.retries})`)
          await this.sleep(delay)
          continue
        }

        throw lastError
      }
    }

    throw lastError || {
      message: 'Request failed after all retries',
      code: 'MAX_RETRIES_EXCEEDED',
      status: 0,
    }
  }

  /**
   * Parse error response from API
   */
  private async parseErrorResponse(response: Response): Promise<any> {
    try {
      // Clone the response so we can read it multiple times
      const clonedResponse = response.clone()
      const text = await clonedResponse.text()
      
      if (!text || text.trim() === '') {
        return { 
          message: response.statusText || 'Unknown error', 
          status: response.status,
          error: response.statusText || 'Unknown error'
        }
      }
      
      try {
        const parsed = JSON.parse(text)
        return parsed
      } catch (parseError) {
        // If JSON parsing fails, return the text as the message
        return { 
          message: text, 
          status: response.status,
          error: text,
          details: text
        }
      }
    } catch (error) {
      console.error('Error parsing error response:', error)
      return { 
        message: response.statusText || 'Unknown error', 
        status: response.status,
        error: response.statusText || 'Unknown error'
      }
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Take a screenshot of a URL
   * 
   * Sends a POST request to `/api/screenshot` with the URL and options.
   * The server validates the API key and forwards the request to the external screenshot service.
   * 
   * @param url - The URL to capture (must be a valid HTTP/HTTPS URL)
   * @param options - Screenshot options (delay, fullPage, viewport, etc.)
   * @param apiKeyLocation - Authentication method (default: 'header')
   * 
   * @returns Promise resolving to screenshot data with desktop/mobile URLs
   * 
   * @throws {ApiError} With code 'UNAUTHORIZED' if API key is invalid
   * @throws {ApiError} With code 'TIMEOUT' if request exceeds timeout
   * @throws {ApiError} With code 'NETWORK_ERROR' if connection fails
   * 
   * @example
   * ```typescript
   * const result = await apiClient.takeScreenshot('https://example.com', {
   *   delay: 3000,
   *   fullPage: true,
   *   viewport: { width: 1920, height: 1080 }
   * })
   * console.log('Screenshot:', result.desktopUrl)
   * ```
   */
  async takeScreenshot(
    url: string,
    options?: ScreenshotRequest['options'],
    apiKeyLocation: ApiKeyLocation = 'header'
  ): Promise<ScreenshotResponse> {
    const requestBody: ScreenshotRequest = {
      url,
      options: options || { delay: 3000 },
      priority: 1,
    }

    return this.request<ScreenshotResponse>(
      '/api/screenshot',
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      },
      apiKeyLocation
    )
  }

  /**
   * Take a screenshot with pageId (for database storage)
   * 
   * Same as `takeScreenshot()` but includes a `pageId` to save the screenshot
   * to the database. The server will update the `scraped_pages` table with the
   * screenshot URLs and metadata.
   * 
   * @param url - The URL to capture
   * @param pageId - Database ID of the page (from scraped_pages table)
   * @param options - Screenshot options
   * @param apiKeyLocation - Authentication method (default: 'header')
   * 
   * @returns Promise resolving to screenshot data
   * 
   * @example
   * ```typescript
   * // Capture and save to database
   * const result = await apiClient.takeScreenshotWithPageId(
   *   'https://example.com',
   *   'page-uuid-123',
   *   { delay: 3000, fullPage: true }
   * )
   * // Screenshot is now saved in database under page_image column
   * ```
   */
  async takeScreenshotWithPageId(
    url: string,
    pageId: string,
    options?: ScreenshotRequest['options'],
    apiKeyLocation: ApiKeyLocation = 'header'
  ): Promise<ScreenshotResponse> {
    const requestBody: ScreenshotRequest & { pageId: string } = {
      url,
      pageId,
      options: options || { delay: 3000 },
      priority: 1,
    }

    return this.request<ScreenshotResponse>(
      '/api/screenshot',
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      },
      apiKeyLocation
    )
  }

  /**
   * Get list of screenshots
   */
  async getScreenshots(
    params?: { page?: number; limit?: number },
    apiKeyLocation: ApiKeyLocation = 'header'
  ): Promise<ScreenshotsListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const endpoint = `/screenshots${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return this.request<ScreenshotsListResponse>(
      endpoint,
      {
        method: 'GET',
      },
      apiKeyLocation
    )
  }

  /**
   * Get server status
   */
  async getStatus(apiKeyLocation: ApiKeyLocation = 'header'): Promise<ServerStatusResponse> {
    return this.request<ServerStatusResponse>(
      '/status',
      {
        method: 'GET',
      },
      apiKeyLocation
    )
  }
}

/**
 * Create a default API client instance
 * 
 * Automatically configures the client using environment variables:
 * 
 * - `NEXT_PUBLIC_SCREENSHOT_API_KEY` - API key for authentication (required)
 * - `NEXT_PUBLIC_SCREENSHOT_API_BASE_URL` - Base URL (defaults to current origin)
 * 
 * ## Setup
 * 
 * 1. Add to `.env.local`:
 *    ```env
 *    NEXT_PUBLIC_SCREENSHOT_API_KEY=your-secret-key
 *    SCREENSHOT_API_KEY=your-secret-key  # Must match client key
 *    ```
 * 
 * 2. Generate a secure key:
 *    ```bash
 *    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *    ```
 * 
 * 3. Restart dev server:
 *    ```bash
 *    npm run dev
 *    ```
 * 
 * @returns Configured ApiClient instance ready to use
 * 
 * @example
 * ```typescript
 * import { createApiClient } from '@/lib/api-client/api-client'
 * 
 * const client = createApiClient()
 * const result = await client.takeScreenshot('https://example.com')
 * ```
 */
export function createApiClient(): ApiClient {
  const baseURL = process.env.NEXT_PUBLIC_SCREENSHOT_API_BASE_URL || 
                  process.env.NEXT_PUBLIC_API_BASE_URL || 
                  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  
  const apiKey = process.env.NEXT_PUBLIC_SCREENSHOT_API_KEY || 
                 process.env.NEXT_PUBLIC_API_KEY || 
                 ''

  if (!apiKey) {
    console.warn('⚠️ API Client: NEXT_PUBLIC_SCREENSHOT_API_KEY not found in environment variables')
    console.warn('⚠️ API Client: Please add NEXT_PUBLIC_SCREENSHOT_API_KEY to your .env.local file')
  } else if (process.env.NODE_ENV === 'development') {
    console.log('✅ API Client: API key found', {
      hasApiKey: true,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 8) + '...',
      baseURL,
    })
  }

  return new ApiClient({
    baseURL,
    apiKey,
    timeout: 300000, // 5 minutes
    retries: 3,
    retryDelay: 1000, // 1 second
  })
}

/**
 * Default API client instance
 */
export const apiClient = createApiClient()

