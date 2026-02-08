import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/bookings - List all bookings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const vanId = searchParams.get('vanId')

    const bookings = await prisma.booking.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(vanId && { vanId }),
      },
      include: {
        van: {
          select: {
            vanId: true,
            registration: true,
            make: true,
            model: true,
          },
        },
      },
      orderBy: { startDateTime: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ['projectId', 'vanId', 'driverName', 'driverContact', 'startDateTime', 'endDateTime']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate Project ID format (5 digits)
    if (!/^\d{5}$/.test(body.projectId)) {
      return NextResponse.json(
        { error: 'Project ID must be exactly 5 digits' },
        { status: 400 }
      )
    }

    // Validate date range
    const start = new Date(body.startDateTime)
    const end = new Date(body.endDateTime)
    if (end <= start) {
      return NextResponse.json(
        { error: 'End date/time must be after start date/time' },
        { status: 400 }
      )
    }

    // Check for conflicts
    const conflicts = await prisma.booking.findMany({
      where: {
        vanId: body.vanId,
        status: {
          in: ['REQUESTED', 'CONFIRMED', 'ACTIVE'],
        },
        OR: [
          {
            AND: [
              { startDateTime: { lte: end } },
              { endDateTime: { gte: start } },
            ],
          },
        ],
      },
    })

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error: 'Booking conflict detected',
          conflicts: conflicts.map(c => ({
            id: c.id,
            start: c.startDateTime,
            end: c.endDateTime,
            driver: c.driverName,
          })),
        },
        { status: 409 }
      )
    }

    // Generate booking ID
    const bookingId = `BK${Date.now()}`

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingId,
        projectId: body.projectId,
        vanId: body.vanId,
        driverName: body.driverName,
        driverContact: body.driverContact,
        startDateTime: new Date(body.startDateTime),
        endDateTime: new Date(body.endDateTime),
        status: 'REQUESTED',
        createdBy: body.createdBy || 'system',
      },
      include: {
        van: true,
      },
    })

    // Create audit trail
    await prisma.auditTrail.create({
      data: {
        entityType: 'BOOKING',
        entityId: booking.bookingId,
        action: 'CREATE',
        user: body.createdBy || 'system',
        newValues: JSON.stringify(booking),
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
