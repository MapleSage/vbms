import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vans - List all vans
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const vans = await prisma.van.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { vanId: 'asc' },
      include: {
        _count: {
          select: {
            bookings: true,
            maintenance: true,
          },
        },
      },
    })

    return NextResponse.json(vans)
  } catch (error) {
    console.error('Error fetching vans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vans' },
      { status: 500 }
    )
  }
}

// POST /api/vans - Create a new van
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ['vanId', 'registration', 'make', 'model', 'year', 'tier', 'type', 'dailyRate', 'mileageRate']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check for duplicate vanId or registration
    const existing = await prisma.van.findFirst({
      where: {
        OR: [
          { vanId: body.vanId },
          { registration: body.registration },
        ],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Van ID or Registration already exists' },
        { status: 409 }
      )
    }

    const van = await prisma.van.create({
      data: {
        vanId: body.vanId,
        registration: body.registration,
        make: body.make,
        model: body.model,
        year: parseInt(body.year),
        vin: body.vin || null,
        tier: body.tier,
        type: body.type,
        dailyRate: parseFloat(body.dailyRate),
        mileageRate: parseFloat(body.mileageRate),
        status: body.status || 'AVAILABLE',
        configuration: body.configuration || null,
        accessories: body.accessories || null,
      },
    })

    return NextResponse.json(van, { status: 201 })
  } catch (error) {
    console.error('Error creating van:', error)
    return NextResponse.json(
      { error: 'Failed to create van' },
      { status: 500 }
    )
  }
}
