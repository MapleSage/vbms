'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface Booking {
  id: string
  bookingId: string
  projectId: string
  vanId: string
  driverName: string
  startDateTime: string
  endDateTime: string
  status: string
  van: {
    vanId: string
    registration: string
    make: string
    model: string
  }
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch bookings')
        return res.json()
      })
      .then((data) => {
        setBookings(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load bookings:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getBookingsForDay = (day: number) => {
    const { year, month } = getDaysInMonth(currentDate)
    const dayDate = new Date(year, month, day)
    
    return bookings.filter((booking) => {
      const start = new Date(booking.startDateTime)
      const end = new Date(booking.endDateTime)
      return dayDate >= new Date(start.toDateString()) && 
             dayDate <= new Date(end.toDateString())
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/swire-sticky-logo-1.png"
                alt="Swire"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-gray-900 border-l pl-3 border-gray-300">
                VBMS
              </span>
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/bookings" className="text-gray-600 hover:text-gray-900">
                Bookings
              </Link>
              <Link href="/vans" className="text-gray-600 hover:text-gray-900">
                Vans
              </Link>
              <Link href="/calendar" className="text-blue-600 font-semibold">
                Calendar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Calendar</h1>
          <p className="text-gray-600 mt-1">Visual overview of all bookings</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <span className="font-medium">Error loading bookings: {error}</span>
            </div>
            <p className="text-sm text-red-600 mt-2">
              The database may not be set up yet. Please check the deployment guide.
            </p>
          </div>
        )}

        {/* Calendar Controls */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-6 border-b flex justify-between items-center">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading calendar...</p>
              </div>
            ) : (
              <>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-gray-700 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg"></div>
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dayBookings = getBookingsForDay(day)
                    const isToday =
                      new Date().toDateString() ===
                      new Date(year, month, day).toDateString()

                    return (
                      <div
                        key={day}
                        className={`h-24 border rounded-lg p-2 overflow-hidden ${
                          isToday
                            ? 'bg-blue-50 border-blue-500 border-2'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div
                          className={`text-sm font-semibold mb-1 ${
                            isToday ? 'text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayBookings.slice(0, 2).map((booking) => (
                            <Link
                              key={booking.id}
                              href={`/bookings/${booking.id}`}
                              className="block"
                            >
                              <div
                                className={`text-xs px-1 py-0.5 rounded truncate ${
                                  booking.status === 'CONFIRMED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : booking.status === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {booking.van.registration}
                              </div>
                            </Link>
                          ))}
                          {dayBookings.length > 2 && (
                            <div className="text-xs text-gray-500 px-1">
                              +{dayBookings.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Status Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span className="text-sm text-gray-700">Requested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm text-gray-700">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-700">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border-2 border-blue-500 rounded"></div>
              <span className="text-sm text-gray-700">Today</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
