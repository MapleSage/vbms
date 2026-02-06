import Link from 'next/link'
import { Calendar, Car, FileText, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentPage="home" />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Van Booking & Fleet Management System
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your fleet operations with modern booking management
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/bookings/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Booking
            </Link>
            <Link
              href="/bookings"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              View Bookings
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <FeatureCard
            icon={<Calendar className="w-8 h-8 text-blue-600" />}
            title="Easy Booking"
            description="Create and manage van bookings with conflict detection"
            href="/bookings/new"
          />
          <FeatureCard
            icon={<Car className="w-8 h-8 text-green-600" />}
            title="Fleet Management"
            description="Track all your vans, maintenance, and availability"
            href="/vans"
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-purple-600" />}
            title="Audit Trail"
            description="Complete history of all bookings and changes"
            href="/audit"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-orange-600" />}
            title="Reports"
            description="Utilization and cost reports for better insights"
            href="/reports"
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard label="Total Vans" value="12" />
            <StatCard label="Active Bookings" value="8" />
            <StatCard label="Available Vans" value="4" />
            <StatCard label="This Month" value="45" />
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-blue-600 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}
