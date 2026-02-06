import Link from 'next/link'
import { Car, Calendar, DollarSign, Wrench, AlertCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getBaseUrl } from '@/lib/api'

async function getVan(id: string) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/vans`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const vans = await res.json()
    return vans.find((v: any) => v.id === id)
  } catch {
    return null
  }
}

export default async function VanDetailsPage({ params }: { params: { id: string } }) {
  const van = await getVan(params.id)

  if (!van) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              VBMS
            </Link>
            <nav className="flex gap-4">
              <Link href="/bookings" className="text-gray-600 hover:text-gray-900">
                Bookings
              </Link>
              <Link href="/vans" className="text-blue-600 font-semibold">
                Vans
              </Link>
              <Link href="/calendar" className="text-gray-600 hover:text-gray-900">
                Calendar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/vans"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Vans
          </Link>
          <div className="flex justify-between items-start mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {van.registration}
              </h1>
              <p className="text-gray-600 mt-1">
                {van.make} {van.model} ({van.year})
              </p>
            </div>
            <StatusBadge status={van.status} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Vehicle Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Vehicle Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <InfoItem label="Van ID" value={van.vanId} />
                <InfoItem label="Registration" value={van.registration} />
                <InfoItem label="Make" value={van.make} />
                <InfoItem label="Model" value={van.model} />
                <InfoItem label="Year" value={van.year.toString()} />
                <InfoItem label="VIN" value={van.vin || 'N/A'} />
                <InfoItem label="Type" value={van.type} />
                <InfoItem label="Tier" value={van.tier} />
              </div>
            </div>

            {/* Configuration */}
            {van.configuration && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Configuration
                </h2>
                <p className="text-gray-700">{van.configuration}</p>
              </div>
            )}

            {/* Accessories */}
            {van.accessories && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Accessories
                </h2>
                <p className="text-gray-700">{van.accessories}</p>
              </div>
            )}

            {/* Booking History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Booking History
              </h2>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  {van._count.bookings} total booking{van._count.bookings !== 1 ? 's' : ''}
                </p>
                <Link
                  href="/bookings"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Bookings →
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Pricing
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-gray-600 text-sm">Daily Rate</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${van.dailyRate}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Mileage Rate</div>
                  <div className="text-xl font-bold text-gray-900">
                    ${van.mileageRate}/mi
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <StatItem
                  label="Total Bookings"
                  value={van._count.bookings.toString()}
                />
                <StatItem label="Maintenance Records" value="0" />
                <StatItem label="Incidents" value="0" />
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Metadata</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600">Added</div>
                  <div className="font-medium text-gray-900">
                    {new Date(van.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Last Updated</div>
                  <div className="font-medium text-gray-900">
                    {new Date(van.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/bookings/new"
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                >
                  Create Booking
                </Link>
                <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition">
                  Edit Van
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    AVAILABLE: 'bg-green-100 text-green-800',
    BOOKED: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-blue-100 text-blue-800',
    UNAVAILABLE: 'bg-red-100 text-red-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
  }

  return (
    <span
      className={`px-4 py-2 text-sm font-semibold rounded-full ${
        colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  )
}
