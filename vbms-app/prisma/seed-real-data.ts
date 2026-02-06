import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with real data...')

  // Create vans from Van MASTER.csv
  console.log('Creating vans from Van MASTER.csv...')
  
  const vanData = [
    { vanId: 'VAN-5', type: 'Caddy', registration: 'DT18061' },
    { vanId: 'VAN-6', type: 'Caddy', registration: 'DT18062' },
    { vanId: 'VAN-7', type: 'Caddy', registration: 'DT18063' },
    { vanId: 'VAN-22', type: 'Transporter', registration: 'DN87171' },
    { vanId: 'VAN-23', type: 'Transporter', registration: 'DN22056' },
    { vanId: 'VAN-28', type: 'Caddy', registration: 'DD53351' },
    { vanId: 'VAN-30', type: 'Caddy', registration: 'DD53352' },
    { vanId: 'VAN-35', type: 'Caddy', registration: 'DD53353' },
    { vanId: 'VAN-36', type: 'Yaris Hybrid', registration: 'CZ94436' },
    { vanId: 'VAN-37', type: 'Caddy', registration: 'DJ88829' },
    { vanId: 'VAN-52', type: 'Yaris', registration: 'CX43859' },
    { vanId: 'VAN-53', type: 'Caddy', registration: 'CZ42892' },
    { vanId: 'VAN-54', type: 'Caddy', registration: 'CZ42893' },
    { vanId: 'VAN-55', type: 'Caddy', registration: 'CZ42894' },
    { vanId: 'VAN-56', type: 'Caddy', registration: 'CZ42895' },
    { vanId: 'VAN-59', type: 'Crafter', registration: 'DB90144' },
    { vanId: 'VAN-61', type: 'Crafter', registration: 'DE81382' },
    { vanId: 'VAN-62', type: 'Crafter', registration: 'DE81380' },
    { vanId: 'VAN-63', type: 'Crafter', registration: 'DE81381' },
    { vanId: 'VAN-64', type: 'Crafter', registration: 'DE81379' },
    { vanId: 'VAN-65', type: 'Crafter', registration: 'DM93832' },
    { vanId: 'VAN-66', type: 'Crafter', registration: 'DM93833' },
    { vanId: 'VAN-67', type: 'Crafter', registration: 'DM93834' },
  ]

  // Map van types to our schema types and set pricing
  const getVanDetails = (type: string) => {
    const typeUpper = type.toUpperCase()
    if (typeUpper.includes('CADDY')) {
      return { 
        make: 'Volkswagen', 
        model: 'Caddy', 
        type: 'CARGO', 
        tier: 'STANDARD',
        dailyRate: 85.00,
        mileageRate: 0.40
      }
    } else if (typeUpper.includes('TRANSPORTER')) {
      return { 
        make: 'Volkswagen', 
        model: 'Transporter', 
        type: 'CARGO', 
        tier: 'STANDARD',
        dailyRate: 95.00,
        mileageRate: 0.45
      }
    } else if (typeUpper.includes('YARIS')) {
      return { 
        make: 'Toyota', 
        model: 'Yaris', 
        type: 'PASSENGER', 
        tier: 'STANDARD',
        dailyRate: 70.00,
        mileageRate: 0.35
      }
    } else if (typeUpper.includes('CRAFTER')) {
      return { 
        make: 'Volkswagen', 
        model: 'Crafter', 
        type: 'CARGO', 
        tier: 'PREMIUM',
        dailyRate: 120.00,
        mileageRate: 0.60
      }
    }
    return { 
      make: 'Unknown', 
      model: type, 
      type: 'CARGO', 
      tier: 'STANDARD',
      dailyRate: 90.00,
      mileageRate: 0.45
    }
  }

  const vans = await Promise.all(
    vanData.map(async (van) => {
      const details = getVanDetails(van.type)
      return prisma.van.create({
        data: {
          vanId: van.vanId,
          registration: van.registration,
          make: details.make,
          model: details.model,
          year: 2023,
          tier: details.tier,
          type: details.type,
          dailyRate: details.dailyRate,
          mileageRate: details.mileageRate,
          status: 'AVAILABLE',
          configuration: `Standard ${details.model} configuration`,
          accessories: 'GPS, Bluetooth',
        },
      })
    })
  )

  console.log(`✅ Created ${vans.length} vans`)

  // Create bookings from Booking Log.csv
  console.log('Creating bookings from Booking Log.csv...')
  
  const bookingData = [
    {
      bookingId: 'BK-001',
      bookedBy: 'Test Booker',
      vanId: 'VAN-5',
      startDate: '2026-01-28 00:00:00',
      endDate: '2026-01-28 00:00:00',
      department: 'Service & Maintenance',
      projectId: 'Test Project',
      driver: 'Test Driver',
      status: 'CONFIRMED'
    },
    {
      bookingId: 'BK-002',
      bookedBy: 'Rep 1',
      vanId: 'VAN-5',
      startDate: '2026-02-01 09:00:00',
      endDate: '2026-02-03 09:00:00',
      department: 'Field Ops',
      projectId: '10452',
      driver: 'Ravi Kumar',
      status: 'CONFIRMED'
    },
    {
      bookingId: 'BK-003',
      bookedBy: 'Rep 2',
      vanId: 'VAN-6',
      startDate: '2026-02-02 09:00:00',
      endDate: '2026-02-05 09:00:00',
      department: 'Projects',
      projectId: '20819',
      driver: 'Asha Patel',
      status: 'CONFIRMED'
    },
    {
      bookingId: 'BK-004',
      bookedBy: 'Rep 3',
      vanId: 'VAN-12',
      startDate: '2026-02-04 09:00:00',
      endDate: '2026-02-07 09:00:00',
      department: 'Field Ops',
      projectId: '33007',
      driver: 'Neha Singh',
      status: 'REQUESTED'
    },
    {
      bookingId: 'BK-005',
      bookedBy: 'Rep 4',
      vanId: 'VAN-20',
      startDate: '2026-02-01 13:00:00',
      endDate: '2026-02-01 21:00:00',
      department: 'Delivery',
      projectId: '45110',
      driver: 'Vikram Rao',
      status: 'CONFIRMED'
    },
    {
      bookingId: 'BK-006',
      bookedBy: 'Rep 5',
      vanId: 'VAN-33',
      startDate: '2026-02-07 09:00:00',
      endDate: '2026-02-09 09:00:00',
      department: 'Projects',
      projectId: '59231',
      driver: 'Sanjay Iyer',
      status: 'CONFIRMED'
    },
    {
      bookingId: 'BK-007',
      bookedBy: 'Rep 6',
      vanId: 'VAN-41',
      startDate: '2026-02-11 09:00:00',
      endDate: '2026-02-14 09:00:00',
      department: 'Field Ops',
      projectId: '77590',
      driver: 'Priya Nair',
      status: 'CONFIRMED'
    },
  ]

  const bookings = []
  for (const booking of bookingData) {
    // Find the van by vanId
    const van = vans.find(v => v.vanId === booking.vanId)
    
    // Only create booking if van exists
    if (van) {
      const created = await prisma.booking.create({
        data: {
          bookingId: booking.bookingId,
          projectId: booking.projectId,
          vanId: van.id,
          driverName: booking.driver,
          driverContact: `${booking.driver.toLowerCase().replace(' ', '.')}@swire.com`,
          startDateTime: new Date(booking.startDate),
          endDateTime: new Date(booking.endDate),
          status: booking.status,
          createdBy: `${booking.bookedBy.toLowerCase().replace(' ', '.')}@swire.com`,
        },
      })
      bookings.push(created)
    } else {
      console.log(`⚠️  Skipping booking ${booking.bookingId} - van ${booking.vanId} not found`)
    }
  }

  console.log(`✅ Created ${bookings.length} bookings`)

  // Create audit trail entries
  console.log('Creating audit trail...')
  await Promise.all(
    bookings.map((booking) =>
      prisma.auditTrail.create({
        data: {
          entityType: 'BOOKING',
          entityId: booking.bookingId,
          action: 'CREATE',
          user: booking.createdBy,
          newValues: JSON.stringify(booking),
        },
      })
    )
  )

  console.log('✅ Created audit trail entries')

  // Create sample user
  console.log('Creating users...')
  await prisma.user.create({
    data: {
      email: 'admin@swire.com',
      name: 'Admin User',
      role: 'FLEET_ADMIN',
    },
  })

  console.log('✅ Created users')

  console.log('')
  console.log('🎉 Database seeded successfully with real data!')
  console.log('')
  console.log('Sample data created:')
  console.log(`- ${vans.length} vans`)
  console.log(`- ${bookings.length} bookings`)
  console.log('- 1 user')
  console.log('')
  console.log('You can now:')
  console.log('1. Run: npm run dev')
  console.log('2. Visit: http://localhost:3000')
  console.log('3. View database: npx prisma studio')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
