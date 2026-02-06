import Link from 'next/link'
import { Car, Calendar } from 'lucide-react'
import { getBaseUrl } from '@/lib/api'
import Header from '@/components/Header'

// Revalidate every 10 seconds
export const revalidate = 10

async function getVans() {
  const res = await fetch(`${getBaseUrl()}/api/vans`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export default async function VansPage() {
  const vans = await getVans()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="vans" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
            <p className="text-gray-600 mt-1">View and manage all vans</p>
          </div>
          <Link
            href="/vans/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Car className="w-5 h-5" />
            Add Van
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Vans"
            value={vans.length.toString()}
            color="blue"
          />
          <StatCard
            label="Available"
            value={vans.filter((v: any) => v.status === 'AVAILABLE').length.toString()}
            color="green"
          />
          <StatCard
            label="Booked"
            value={vans.filter((v: any) => v.status === 'BOOKED').length.toString()}
            color="yellow"
          />
          <StatCard
            label="Active"
            value={vans.filter((v: any) => v.status === 'ACTIVE').length.toString()}
            color="purple"
          />
        </div>

        {/* Vans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vans.map((van: any) => (
            <VanCard key={van.id} van={van} />
          ))}
        </div>
      </main>
    </div>
  )
}

function VanCard({ van }: { van: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {van.registration}
              </h3>
              <p className="text-sm text-gray-600">{van.vanId}</p>
            </div>
          </div>
          <StatusBadge status={van.status} />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Make & Model:</span>
            <span className="font-medium text-gray-900">
              {van.make} {van.model}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Year:</span>
            <span className="font-medium text-gray-900">{van.year}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium text-gray-900">{van.type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tier:</span>
            <span className="font-medium text-gray-900">{van.tier}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Daily Rate:</span>
            <span className="text-lg font-bold text-blue-600">
              ${van.dailyRate}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Mileage Rate:</span>
            <span className="text-sm font-medium text-gray-900">
              ${van.mileageRate}/mi
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{van._count.bookings} bookings</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Link
            href={`/vans/${van.id}`}
            className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
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
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`text-3xl font-bold ${colors[color as keyof typeof colors]} mb-1`}>
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}
