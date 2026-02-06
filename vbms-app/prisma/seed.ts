import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample vans
  console.log('Creating vans...')
  const vans = await Promise.all([
    prisma.van.create({
      data: {
        vanId: 'VAN001',
        registration: 'ABC123',
        make: 'Ford',
        model: 'Transit',
        year: 2023,
        vin: '1FTFW1ET5DFC10312',
        tier: 'STANDARD',
        type: 'CARGO',
        dailyRate: 100.00,
        mileageRate: 0.50,
        status: 'AVAILABLE',
        configuration: 'Standard cargo configuration with shelving',
        accessories: 'GPS, Bluetooth, Backup camera',
      },
    }),
    prisma.van.create({
      data: {
        vanId: 'VAN002',
        registration: 'XYZ789',
        make: 'Mercedes',
        model: 'Sprinter',
        year: 2024,
        vin: 'WD3PE8CC5E5123456',
        tier: 'PREMIUM',
        type: 'PASSENGER',
        dailyRate: 150.00,
        mileageRate: 0.75,
        status: 'AVAILABLE',
        configuration: '12-passenger seating',
        accessories: 'GPS, Bluetooth, Backup camera, Climate control',
      },
    }),
    prisma.van.create({
      data: {
        vanId: 'VAN003',
        registration: 'DEF456',
        make: 'Ram',
        model: 'ProMaster',
        year: 2023,
        vin: '3C6TRVBG5JE123789',
        tier: 'STANDARD',
        type: 'CARGO',
        dailyRate: 95.00,
        mileageRate: 0.45,
        status: 'AVAILABLE',
        configuration: 'High roof cargo van',
        accessories: 'GPS, Bluetooth',
      },
    }),
    prisma.van.create({
      data: {
        vanId: 'VAN004',
        registration: 'GHI789',
        make: 'Ford',
        model: 'Transit Refrigerated',
        year: 2024,
        vin: '1FTBW2XM5GKA12345',
        tier: 'SPECIALIZED',
        type: 'REFRIGERATED',
        dailyRate: 200.00,
        mileageRate: 1.00,
        status: 'AVAILABLE',
        configuration: 'Temperature controlled -20°C to +20°C',
        accessories: 'GPS, Bluetooth, Temperature monitoring system',
      },
    }),
  ])

  console.log(`✅ Created ${vans.length} vans`)

  // Create sample bookings
  console.log('Creating bookings...')
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        bookingId: 'BK001',
        projectId: '12345',
        vanId: vans[0].id,
        driverName: 'John Smith',
        driverContact: 'john.smith@example.com',
        startDateTime: tomorrow,
        endDateTime: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000), // 8 hours later
        status: 'CONFIRMED',
        createdBy: 'admin@example.com',
      },
    }),
    prisma.booking.create({
      data: {
        bookingId: 'BK002',
        projectId: '67890',
        vanId: vans[1].id,
        driverName: 'Jane Doe',
        driverContact: 'jane.doe@example.com',
        startDateTime: nextWeek,
        endDateTime: new Date(nextWeek.getTime() + 4 * 60 * 60 * 1000), // 4 hours later
        status: 'REQUESTED',
        createdBy: 'user@example.com',
      },
    }),
  ])

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
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'FLEET_ADMIN',
    },
  })

  console.log('✅ Created users')

  console.log('')
  console.log('🎉 Database seeded successfully!')
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
