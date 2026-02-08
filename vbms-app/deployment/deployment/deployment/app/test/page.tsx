'use client'

import { useState } from 'react'

export default function TestPage() {
  const [debugResult, setDebugResult] = useState<any>(null)
  const [vansResult, setVansResult] = useState<any>(null)
  const [bookingsResult, setBookingsResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDebug = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/debug')
      const data = await res.json()
      setDebugResult(data)
    } catch (error: any) {
      setDebugResult({ error: error.message })
    }
    setLoading(false)
  }

  const testVans = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/vans')
      const data = await res.json()
      setVansResult(data)
    } catch (error: any) {
      setVansResult({ error: error.message })
    }
    setLoading(false)
  }

  const testBookings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      setBookingsResult(data)
    } catch (error: any) {
      setBookingsResult({ error: error.message })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

        <div className="space-y-6">
          {/* Debug Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">1. Test Debug Endpoint</h2>
            <button
              onClick={testDebug}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Test /api/debug
            </button>
            {debugResult && (
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">
                {JSON.stringify(debugResult, null, 2)}
              </pre>
            )}
          </div>

          {/* Vans Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">2. Test Vans API</h2>
            <button
              onClick={testVans}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              Test /api/vans
            </button>
            {vansResult && (
              <div className="mt-4">
                <p className="font-medium mb-2">
                  Result: {Array.isArray(vansResult) ? `${vansResult.length} vans` : 'Error'}
                </p>
                <pre className="p-4 bg-gray-100 rounded overflow-auto text-sm max-h-96">
                  {JSON.stringify(vansResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Bookings Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">3. Test Bookings API</h2>
            <button
              onClick={testBookings}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              Test /api/bookings
            </button>
            {bookingsResult && (
              <div className="mt-4">
                <p className="font-medium mb-2">
                  Result: {Array.isArray(bookingsResult) ? `${bookingsResult.length} bookings` : 'Error'}
                </p>
                <pre className="p-4 bg-gray-100 rounded overflow-auto text-sm max-h-96">
                  {JSON.stringify(bookingsResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click each test button</li>
            <li>Check the results</li>
            <li>If debug shows database connected but vans/bookings are empty, database needs seeding</li>
            <li>If debug shows error, check DATABASE_URL in Vercel environment variables</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
