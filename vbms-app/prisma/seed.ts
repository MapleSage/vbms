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
    prisma.van.create({
      data: {
        vanId: 'VAN005',
        registration: 'JKL012',
        make: 'Chevrolet',
        model: 'Express',
        year: 2023,
        vin: '1GCWGBFG5K1234567',
        tier: 'STANDARD',
        type: 'CARGO',
        dailyRate: 90.00,
        mileageRate: 0.40,
        status: 'AVAILABLE',
        configuration: 'Standard cargo van',
        accessories: 'GPS, Bluetooth',
      },
    }),
    prisma.van.create({
      data: {
        vanId: 'VAN006',
        registration: 'MNO345',
        make: 'Ford',
        model: 'Transit Passenger',
        year: 2024,
        vin: '1FBZX2CM5GKA98765',
        tier: 'PREMIUM',
        type: 'PASSENGER',
        dailyRate: 140.00,
        mileageRate: 0.70,
        status: 'AVAILABLE',
        configuration: '15-passenger seating',
        accessories: 'GPS, Bluetooth, Backup camera, USB charging ports',
      },
    }),
    prisma.van.create({
      data: {
        vanId: 'VAN007',
        registration: 'PQR678',
        make: 'Mercedes',
        model: 'Sprinter Cargo',
        year: 2023,
        vin: 'WD3PF4CC5FP123456',
        tier: 'PREMIUM',
        type: 'CARGO',
        dailyRate: 130.00,
        mileageRate: 0.65,
        status: 'MAINTENANCE',
        configuration: 'Extended high roof cargo',
        accessories: 'GPS, Bluetooth, Backup camera, LED lighting',
      },
    }),
    prisma.van.create({
      data: {
        vanId: 'VAN008',
        registration: 'STU901',
        make: 'Ram',
        model: 'ProMaster City',
        year: 2024,
        vin: 'ZFBHRFAB5L6789012',
        tier: 'STANDARD',
        type: 'CARGO',
        dailyRate: 85.00,
        mileageRate: 0.35,
        status: 'AVAILABLE',
        configuration: 'Compact cargo van',
        accessories: 'GPS, Bluetooth',
      },
    }),
    prisma.van.create({
      data: {
        vanId: 'VAN009',
        registration: 'VWX234',
        make: 'Ford',
        model: 'Transit Box Truck',
        year: 2023,
        vin: '1FDUF5GT5GKA45678',
        tier: 'SPECIALIZED',
        type: 'BOX_TRUCK',
        dailyRate: 180.00,
        mileageRate: 0.90,
        status: 'AVAILABLE',
        configuration: '16ft box truck with lift gate',
        accessories: 'GPS, Bluetooth, Lift gate, Ramps',
      },
    }),
    prisma.van.create({
      data: {
        vanId: 'VAN010',
        registration: 'YZA567',
        make: 'Nissan',
        model: 'NV Cargo',
        year: 2023,
        vin: '1N6BF0KM5FN123456',
        tier: 'STANDARD',
        type: 'CARGO',
        dailyRate: 95.00,
        mileageRate: 0.45,
        status: 'AVAILABLE',
        configuration: 'Standard cargo configuration',
        accessories: 'GPS, Bluetooth, Backup camera',
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
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(now)
  lastWeek.setDate(lastWeek.getDate() - 7)

  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        bookingId: 'BK001',
        projectId: 'PRJ-2024-001',
        vanId: vans[0].id,
        driverName: 'John Smith',
        driverContact: 'john.smith@swire.com',
        startDateTime: tomorrow,
        endDateTime: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000),
        status: 'CONFIRMED',
        createdBy: 'admin@swire.com',
      },
    }),
    prisma.booking.create({
      data: {
        bookingId: 'BK002',
        projectId: 'PRJ-2024-002',
        vanId: vans[1].id,
        driverName: 'Jane Doe',
        driverContact: 'jane.doe@swire.com',
        startDateTime: nextWeek,
        endDateTime: new Date(nextWeek.getTime() + 4 * 60 * 60 * 1000),
        status: 'REQUESTED',
        createdBy: 'user@swire.com',
      },
    }),
    prisma.booking.create({
      data: {
        bookingId: 'BK003',
        projectId: 'PRJ-2024-003',
        vanId: vans[2].id,
        driverName: 'Mike Johnson',
        driverContact: 'mike.johnson@swire.com',
        startDateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        endDateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
        status: 'CONFIRMED',
        createdBy: 'admin@swire.com',
      },
    }),
    prisma.booking.create({
      data: {
        bookingId: 'BK004',
        projectId: 'PRJ-2024-004',
        vanId: vans[3].id,
        driverName: 'Sarah Williams',
        driverContact: 'sarah.williams@swire.com',
        startDateTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        endDateTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
        status: 'CONFIRMED',
        createdBy: 'user@swire.com',
      },
    }),
    prisma.booking.create({
      data: {
        bookingId: 'BK005',
        projectId: 'PRJ-2024-005',
        vanId: vans[4].id,
        driverName: 'David Brown',
        driverContact: 'david.brown@swire.com',
        startDateTime: yesterday,
        endDateTime: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000),
        status: 'COMPLETED',
        createdBy: 'admin@swire.com',
      },
    }),
    prisma.booking.create({
      data: {
        bookingId: 'BK006',
        projectId: 'PRJ-2024-006',
        vanId: vans[5].id,
        driverName: 'Emily Davis',
        driverContact: 'emily.davis@swire.com',
        startDateTime: lastWeek,
        endDateTime: new Date(lastWeek.getTime() + 5 * 60 * 60 * 1000),
        status: 'COMPLETED',
        createdBy: 'user@swire.com',
      },
    }),
    prisma.booking.create({
      data: {
        bookingId: 'BK007',
        projectId: 'PRJ-2024-007',
        vanId: vans[7].id,
        driverName: 'Robert Miller',
        driverContact: 'robert.miller@swire.com',
        startDateTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        endDateTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
        status: 'REQUESTED',
        createdBy: 'user@swire.com',
      },
    }),
    prisma.booking.create({
      data: {
        bookingId: 'BK008',
        projectId: 'PRJ-2024-008',
        vanId: vans[8].id,
        driverName: 'Lisa Anderson',
        driverContact: 'lisa.anderson@swire.com',
        startDateTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        endDateTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
        status: 'CONFIRMED',
        createdBy: 'admin@swire.com',
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
