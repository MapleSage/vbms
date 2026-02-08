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
    today.getDate() === new Date().getDate() &&
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
