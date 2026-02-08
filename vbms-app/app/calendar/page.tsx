'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface Booking {
  id: string;
  bookingId: string;
  projectId: string;
  vanId: string;
  driverName: string;
  driverContact: string;
  startDateTime: string;
  endDateTime: string;
  status: string;
  bookingPoc?: string;
  van: {
    vanId: string;
    registration: string;
    make: string;
    model: string;
  };
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch bookings');
        return res.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load bookings:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getBookingsForDay = (day: number) => {
    return bookings.filter((booking) => {
      const startDate = new Date(booking.startDateTime);
      const endDate = new Date(booking.endDateTime);
      const checkDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      return startDate <= checkDate && checkDate <= endDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date();
  const isToday =
    today.getdate() === new Date().getDate() &&
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  const statusColors: { [key: string]: string } = {
    REQUESTED: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin">
          <CalendarIcon className="w-8 h-8" />
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-8 h-8" /> Fleet Bookings Calendar
          </h1>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between bg-white border rounded-lg p-4 mb-6">
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
              )
            }
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold">{monthName}</h2>

          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
              )
            }
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Days */}
      <div className="space-y-3">
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          );
          const dayName = dayDate.toLocaleString('default', { weekday: 'long' });
          const dayBookings = getBookingsForDay(day);
          const isToday =
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();

          return (
            <div
              key={day}
              className={`rounded-lg overflow-hidden border-2 ${
                isToday ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
              }`}
            >
              {/* Day Header */}
              <div
                className={`px-4 py-3 font-semibold flex items-center justify-between ${
                  isToday ? 'bg-blue-400 text-white' : 'bg-gray-100'
                }`}
              >
                <div>
                  <span className="text-lg">{day}</span>
                  <span className="ml-2 text-sm opacity-75">{dayName}</span>
                </div>
                <span className="text-sm bg-gray-300 bg-opacity-50 px-2 py-1 rounded">
                  {dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Bookings for the day */}
              {dayBookings.length > 0 ? (
                <div className="divide-y max-h-96 overflow-y-auto">
                  {dayBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="block px-4 py-3 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="font-semibold text-blue-600 mb-1">
                            {booking.van?.registration || 'Unknown Van'}
                          </div>
                          <div className="text-sm text-gray-700 space-y-1">
                            <p>
                              <span className="font-medium">Project:</span>{' '}
                              {booking.projectId}
                            </p>
                            <p>
                              <span className="font-medium">Driver:</span>{' '}
                              {booking.driverName}
                            </p>
                            <p>
                              <span className="font-medium">Time:</span>{' '}
                              {new Date(booking.startDateTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {new Date(booking.endDateTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            {booking.bookingPoc && (
                              <p className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">POC:</span> {booking.bookingPoc}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                            statusColors[booking.status] ||
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-gray-400 text-sm">
                  No bookings scheduled
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4 border">
        <h3 className="font-semibold mb-3">Monthly Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {bookings.length}
            </div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === 'CONFIRMED').length}
            </div>
            <div className="text-gray-600">Confirmed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === 'REQUESTED').length}
            </div>
            <div className="text-gray-600">Requested</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {bookings.filter((b) => b.bookingPoc).length}
            </div>
            <div className="text-gray-600">With POC</div>
          </div>
        </div>
      </div>
    </div>
  );
}
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
