import Link from 'next/link'
import { Database, CheckCircle, XCircle } from 'lucide-react'

async function checkDatabase() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/health`, {
      cache: 'no-store',
    })
    const data = await res.json()
    return data
  } catch {
    return { status: 'error', database: 'disconnected' }
  }
}

export default async function SetupPage() {
  const health = await checkDatabase()
  const isConnected = health.database === 'connected'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            VBMS
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isConnected ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isConnected ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isConnected ? 'Database Connected!' : 'Database Setup Required'}
          </h1>
          <p className="text-gray-600">
            {isConnected
              ? 'Your application is ready to use.'
              : 'Please complete the database setup to use the application.'}
          </p>
        </div>

        {isConnected ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Setup Complete</h2>
            <p className="text-gray-700 mb-6">
              Your database is connected and the application is ready to use.
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/bookings"
                className="block w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition text-center"
              >
                View Bookings
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-600" />
              Database Setup Instructions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 1: Create Azure SQL Database</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Go to Azure Portal (portal.azure.com)</li>
                  <li>Create a new SQL Database</li>
                  <li>Configure server and database settings</li>
                  <li>Enable "Allow Azure services" in firewall</li>
                  <li>Copy the connection string</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 2: Add to Vercel</h3>
                <p className="text-gray-700 mb-2">
                  Add your Azure SQL connection string to Vercel:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Go to Vercel Dashboard → Your Project</li>
                  <li>Settings → Environment Variables</li>
                  <li>Add <code className="bg-gray-100 px-2 py-1 rounded">DATABASE_URL</code></li>
                  <li>Paste your Azure SQL connection string</li>
                  <li>Save and redeploy</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 3: Run Migrations</h3>
                <p className="text-gray-700 mb-2">In your local terminal:</p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div># Set your Azure SQL connection string</div>
                  <div>export DATABASE_URL="your-azure-sql-connection-string"</div>
                  <div className="mt-2"># Run migrations</div>
                  <div>npx prisma db push</div>
                  <div className="mt-2"># Seed database (optional)</div>
                  <div>npx prisma db seed</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 4: Redeploy</h3>
                <p className="text-gray-700">
                  Push to GitHub or manually redeploy in Vercel dashboard.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-blue-900 mb-2">Detailed Guide</h4>
                <p className="text-sm text-blue-800">
                  Check the complete Azure SQL setup guide:
                  <code className="bg-blue-100 px-2 py-1 rounded ml-1">AZURE-SQL-SETUP.md</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Details */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">System Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span className={`font-medium ${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {health.database}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {health.status}
              </span>
            </div>
            {health.timestamp && (
              <div className="flex justify-between">
                <span className="text-gray-600">Last Check:</span>
                <span className="font-medium text-gray-900">
                  {new Date(health.timestamp).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
