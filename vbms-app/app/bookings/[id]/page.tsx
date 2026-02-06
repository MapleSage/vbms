import Link from 'next/link'
import { Calendar, Car, User, MapPin, Clock, DollarSign } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getBaseUrl } from '@/lib/api'
import Header from '@/components/Header'

async function getBooking(id: string) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/bookings`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const bookings = await res.json()
    return bookings.find((b: any) => b.id === id)
  } catch {
    return null
  }
}

export default async function BookingDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const booking = await getBooking(params.id)

  if (!booking) {
    notFound()
  }

  const startDate = new Date(booking.startDateTime)
  const endDate = new Date(booking.endDateTime)
  const duration = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton backHref="/bookings" currentPage="bookings" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/bookings"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Bookings
          </Link>
          <div className="flex justify-between items-start mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {booking.bookingId}
              </h1>
              <p className="text-gray-600 mt-1">Booking Details</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Van Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Van Information
              </h2>
              <div className="space-y-3">
                <InfoRow
                  label="Registration"
                  value={booking.van.registration}
                />
                <InfoRow
                  label="Make & Model"
                  value={`${booking.van.make} ${booking.van.model}`}
                />
                <InfoRow label="Van ID" value={booking.van.vanId} />
              </div>
            </div>

            {/* Driver Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Driver Information
              </h2>
              <div className="space-y-3">
                <InfoRow label="Name" value={booking.driverName} />
                <InfoRow label="Contact" value={booking.driverContact} />
              </div>
            </div>

            {/* Booking Period */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Booking Period
              </h2>
              <div className="space-y-3">
                <InfoRow
                  label="Start Date & Time"
                  value={startDate.toLocaleString()}
                />
                <InfoRow
                  label="End Date & Time"
                  value={endDate.toLocaleString()}
                />
                <InfoRow
                  label="Duration"
                  value={`${duration} day${duration !== 1 ? 's' : ''}`}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Project
              </h3>
              <div className="text-2xl font-bold text-blue-600">
                {booking.projectId}
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Metadata
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600">Created By</div>
                  <div className="font-medium text-gray-900">
                    {booking.createdBy}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Created At</div>
                  <div className="font-medium text-gray-900">
                    {new Date(booking.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Last Updated</div>
                  <div className="font-medium text-gray-900">
                    {new Date(booking.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Edit Booking
                </button>
                <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    REQUESTED: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
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
