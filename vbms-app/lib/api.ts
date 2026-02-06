/**
 * Get the base URL for API calls
 * Works in both development and production (Vercel)
 */
export function getBaseUrl() {
  // In browser, use relative URLs
  if (typeof window !== 'undefined') {
    return ''
  }

  // In production on Vercel, use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // In development, use localhost
  return 'http://localhost:3000'
}
