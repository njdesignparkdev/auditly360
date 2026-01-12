# Screenshot API Client

A TypeScript client for making authenticated requests to the Screenshot API with built-in retry logic, timeout handling, and comprehensive error management.

## 🔒 Authentication

The API uses **API Key authentication** via the `X-API-Key` header. This matches the server-side implementation in `/api/screenshot/route.ts`.

### Environment Setup

Create a `.env.local` file with:

```env
# Client-side API key (exposed to browser, must match server-side)
NEXT_PUBLIC_SCREENSHOT_API_KEY=your-secret-api-key-here

# Server-side API key (for route validation, NOT exposed to browser)
SCREENSHOT_API_KEY=your-secret-api-key-here

# Optional: Custom base URL (defaults to current origin)
NEXT_PUBLIC_SCREENSHOT_API_BASE_URL=http://localhost:3000
```

> **Security Note**: Both keys should match. The `NEXT_PUBLIC_*` prefix exposes the key to the browser, which is acceptable for this use case since the server validates it.

## 🚀 Quick Start

### Using the Default Client

```typescript
import { apiClient } from '@/lib/api-client/api-client'

// Take a screenshot
const result = await apiClient.takeScreenshot('https://example.com', {
  delay: 3000,
  fullPage: true,
  viewport: { width: 1920, height: 1080 }
})

console.log('Screenshot URL:', result.desktopUrl)
```

### Creating a Custom Client

```typescript
import { ApiClient } from '@/lib/api-client/api-client'

const client = new ApiClient({
  baseURL: 'http://localhost:3000',
  apiKey: 'your-api-key',
  timeout: 300000,  // 5 minutes
  retries: 3,
  retryDelay: 1000  // 1 second
})
```

## 📖 API Methods

### `takeScreenshot(url, options?, apiKeyLocation?)`

Take a screenshot of a URL.

```typescript
const result = await apiClient.takeScreenshot(
  'https://example.com',
  {
    delay: 3000,
    fullPage: true,
    viewport: { width: 1920, height: 1080 }
  },
  'header' // 'header' | 'bearer' | 'query'
)
```

**Response:**
```typescript
{
  success: true,
  url: "https://...",
  desktopUrl: "https://...",
  mobileUrl: "https://...",
  desktop: { screenshotUrl: "...", ... },
  mobile: { screenshotUrl: "...", ... }
}
```

### `takeScreenshotWithPageId(url, pageId, options?, apiKeyLocation?)`

Take a screenshot and save it to the database with a page ID.

```typescript
const result = await apiClient.takeScreenshotWithPageId(
  'https://example.com',
  'page-123',
  { delay: 3000 }
)
```

### `getScreenshots(params?, apiKeyLocation?)`

Get a list of screenshots with pagination.

```typescript
const result = await apiClient.getScreenshots({
  page: 1,
  limit: 10
})
```

### `getStatus(apiKeyLocation?)`

Check the server status.

```typescript
const status = await apiClient.getStatus()
```

## 🔑 Authentication Methods

The client supports three authentication methods:

### 1. Header (Default - Recommended)
```typescript
// Sends: X-API-Key: your-api-key
await apiClient.takeScreenshot(url, options, 'header')
```

### 2. Bearer Token
```typescript
// Sends: Authorization: Bearer your-api-key
await apiClient.takeScreenshot(url, options, 'bearer')
```

### 3. Query Parameter
```typescript
// Sends: ?apiKey=your-api-key
await apiClient.takeScreenshot(url, options, 'query')
```

## 🛡️ Error Handling

The client provides detailed error information:

```typescript
try {
  const result = await apiClient.takeScreenshot('https://example.com')
} catch (error) {
  console.error('Error:', error.message)
  console.error('Code:', error.code)
  console.error('Status:', error.status)
  console.error('Details:', error.details)
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `MISSING_API_KEY` | 401 | No API key provided |
| `INVALID_API_KEY` | 401 | API key doesn't match server |
| `REQUEST_FAILED` | 4xx/5xx | General request failure |
| `TIMEOUT` | 504 | Request exceeded timeout |
| `NETWORK_ERROR` | 0 | Failed to connect to server |
| `MAX_RETRIES_EXCEEDED` | 0 | All retry attempts failed |

## ⚙️ Configuration

### Timeout

Default: 5 minutes (300000ms)

```typescript
const client = new ApiClient({
  baseURL: 'http://localhost:3000',
  apiKey: 'your-api-key',
  timeout: 600000 // 10 minutes
})
```

### Retries

Default: 3 retries with exponential backoff

```typescript
const client = new ApiClient({
  baseURL: 'http://localhost:3000',
  apiKey: 'your-api-key',
  retries: 5,
  retryDelay: 2000 // Initial delay: 2 seconds
})
```

**Retry Logic:**
- Retries on: 5xx errors, 429 (rate limit), network errors
- No retry on: 4xx errors (except 429)
- Exponential backoff: delay × 2^attempt

## 🔍 Debugging

The client logs detailed information in development mode:

```typescript
// On initialization
✅ API Client: API key found {
  hasApiKey: true,
  apiKeyLength: 32,
  apiKeyPrefix: "sk_test_...",
  baseURL: "http://localhost:3000"
}

// On authentication failure
❌ API Client: Authentication failed {
  message: "Unauthorized: Invalid or missing API key",
  code: "UNAUTHORIZED",
  status: 401,
  hasApiKey: true,
  apiKeyLength: 32,
  apiKeyPrefix: "sk_test_...",
  baseURL: "http://localhost:3000",
  endpoint: "/api/screenshot"
}
```

## 🔗 Server-Side Integration

The client is designed to work with the Next.js API route at `/api/screenshot/route.ts`:

**Server validates:**
1. `X-API-Key` header is present
2. Key matches `SCREENSHOT_API_KEY` environment variable
3. Returns 401 if validation fails

**Flow:**
```
Client → [X-API-Key: key] → /api/screenshot → Validates → External Service
```

## 📝 TypeScript Types

All types are exported from `./types`:

```typescript
import type {
  ApiClientConfig,
  ApiError,
  ApiKeyLocation,
  ScreenshotRequest,
  ScreenshotResponse,
  ScreenshotsListResponse,
  ServerStatusResponse
} from '@/lib/api-client/types'
```

## 🎯 Best Practices

1. **Use environment variables** for API keys
2. **Use header authentication** (most secure)
3. **Handle errors gracefully** with try-catch
4. **Set appropriate timeouts** for your use case
5. **Monitor retry attempts** in production
6. **Never commit API keys** to version control

## 🧪 Testing

Test your API key configuration:

```typescript
import { apiClient } from '@/lib/api-client/api-client'

async function testApiKey() {
  try {
    const status = await apiClient.getStatus()
    console.log('✅ API key is valid')
    return true
  } catch (error) {
    if (error.code === 'UNAUTHORIZED') {
      console.error('❌ API key is invalid')
    }
    return false
  }
}
```

## 📚 Related Documentation

- Server-side authentication: See `/api/screenshot/route.ts`
- Environment setup: See `.env.example`
- Type definitions: See `./types.ts`
