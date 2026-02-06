/**
 * Get the base URL for API calls
 * Works in both development and production (Vercel)
 */
export function getBaseUrl() {
  // In browser, use relative URLs
  if (typeof window !== 'undefined') {
    return ''
  }

  // Check for Vercel deployment URL (automatically set by Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Check for custom domain
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  // Fallback for server-side rendering - use relative URLs
  return ''
}
