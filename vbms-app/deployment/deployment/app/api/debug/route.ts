import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const vanCount = await prisma.van.count()
    const bookingCount = await prisma.booking.count()
    
    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        vans: vanCount,
        bookings: bookingCount,
      },
      environment: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasBlob: !!process.env.BLOB_READ_WRITE_TOKEN,
        nodeEnv: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL,
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      environment: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasBlob: !!process.env.BLOB_READ_WRITE_TOKEN,
        nodeEnv: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL,
      },
    }, { status: 500 })
  }
}
