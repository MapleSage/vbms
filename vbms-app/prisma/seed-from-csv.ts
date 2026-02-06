import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with real CSV data...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.cost.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.maintenance.deleteMany()
  await prisma.incident.deleteMany()
  await prisma.document.deleteMany()
  await prisma.van.deleteMany()
  await prisma.auditTrail.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('Creating users...')
  await prisma.user.createMany({
    data: [
      { email: 'rep1@swire.com', name: 'Rep 1', role: 'PROJECT_REP' },
      { email: 'rep2@swire.com', name: 'Rep 2', role: 'PROJECT_REP' },
      { email: 'rep3@swire.com', name: 'Rep 3', role: 'PROJECT_REP' },
      { email: 'rep4@swire.com', name: 'Rep 4', role: 'PROJECT_REP' },
      { email: 'rep5@swire.com', name: 'Rep 5', role: 'PROJECT_REP' },
      { email: 'rep6@swire.com', name: 'Rep 6', role: 'PROJECT_REP' },
      { email: 'admin@swire.com', name: 'Fleet Admin', role: 'FLEET_ADMIN' },
      { email: 'finance@swire.com', name: 'Finance Manager', role: 'FINANCE_MANAGER' },
    ],
  })

  // Create vans from Van MASTER.csv
  console.log('Creating vans...')
  const vansData = [
    { vanId: 'VAN-5', type: 'Caddy', registration: 'DT18061', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-6', type: 'Caddy', registration: 'DT18062', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-7', type: 'Caddy', registration: 'DT18063', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-22', type: 'Transporter', registration: 'DN87171', make: 'Volkswagen', model: 'Transporter' },
    { vanId: 'VAN-23', type: 'Transporter', registration: 'DN22056', make: 'Volkswagen', model: 'Transporter' },
    { vanId: 'VAN-28', type: 'Caddy', registration: 'DD53351', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-30', type: 'Caddy', registration: 'DD53352', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-35', type: 'Caddy', registration: 'DD53353', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-36', type: 'Yaris Hybrid', registration: 'CZ94436', make: 'Toyota', model: 'Yaris Hybrid' },
    { vanId: 'VAN-37', type: 'Caddy', registration: 'DJ88829', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-52', type: 'Yaris', registration: 'CX43859', make: 'Toyota', model: 'Yaris' },
    { vanId: 'VAN-53', type: 'Caddy', registration: 'CZ42892', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-54', type: 'Caddy', registration: 'CZ42893', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-55', type: 'Caddy', registration: 'CZ42894', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-56', type: 'Caddy', registration: 'CZ42895', make: 'Volkswagen', model: 'Caddy' },
    { vanId: 'VAN-59', type: 'Crafter', registration: 'DB90144', make: 'Volkswagen', model: 'Crafter' },
    { vanId: 'VAN-61', type: 'Crafter', registration: 'DE81382', make: 'Volkswagen', model: 'Crafter' },
    { vanId: 'VAN-62', type: 'Crafter', registration: 'DE81380', make: 'Volkswagen', model: 'Crafter' },
    { vanId: 'VAN-63', type: 'Crafter', registration: 'DE81381', make: 'Volkswagen', model: 'Crafter' },
    { vanId: 'VAN-64', type: 'Crafter', registration: 'DE81379', make: 'Volkswagen', model: 'Crafter' },
    { vanId: 'VAN-65', type: 'Crafter', registration: 'DM93832', make: 'Volkswagen', model: 'Crafter' },
    { vanId: 'VAN-66', type: 'Crafter', registration: 'DM93833', make: 'Volkswagen', model: 'Crafter' },
    { vanId: 'VAN-67', type: 'Crafter', registration: 'DM93834', make: 'Volkswagen', model: 'Crafter' },
  ]

  for (const vanData of vansData) {
    // Determine tier and type based on vehicle model
    let tier = 'STANDARD'
    let type = 'CARGO'
    let dailyRate = 80
    let mileageRate = 0.45

    if (vanData.type.includes('Crafter')) {
      tier = 'PREMIUM'
      dailyRate = 120
      mileageRate = 0.55
    } else if (vanData.type.includes('Yaris')) {
      tier = 'STANDARD'
      type = 'PASSENGER'
      dailyRate = 60
      mileageRate = 0.35
    }

    await prisma.van.create({
      data: {
        vanId: vanData.vanId,
        registration: vanData.registration,
        make: vanData.make,
        model: vanData.model,
        year: 2020,
        tier,
        type,
        dailyRate,
        mileageRate,
        status: 'AVAILABLE',
        configuration: `Standard ${vanData.type} configuration`,
        accessories: 'GPS, Bluetooth, Backup camera',
      },
    })
  }

  console.log(`✅ Created ${vansData.length} vans`)

  // Create bookings from Booking Log.csv
  console.log('Creating bookings...')
  const bookingsData = [
    {
      bookingId: 'BK-001',
      vanId: 'VAN-5',
      projectId: 'TEST-PROJECT',
      driverName: 'Test Driver',
      driverContact: '+45 12345678',
      startDateTime: new Date('2026-01-28T08:00:00'),
      endDateTime: new Date('2026-01-28T18:00:00'),
      status: 'CONFIRMED',
      createdBy: 'Test Booker',
    },
    {
      bookingId: 'BK-002',
      vanId: 'VAN-5',
      projectId: '10452',
      driverName: 'Ravi Kumar',
      driverContact: '+45 23456789',
      startDateTime: new Date('2026-02-01T09:00:00'),
      endDateTime: new Date('2026-02-03T09:00:00'),
      status: 'CONFIRMED',
      createdBy: 'Rep 1',
    },
    {
      bookingId: 'BK-003',
      vanId: 'VAN-6',
      projectId: '20819',
      driverName: 'Asha Patel',
      driverContact: '+45 34567890',
      startDateTime: new Date('2026-02-02T09:00:00'),
      endDateTime: new Date('2026-02-05T09:00:00'),
      status: 'CONFIRMED',
      createdBy: 'Rep 2',
    },
    {
      bookingId: 'BK-004',
      vanId: 'VAN-12',
      projectId: '33007',
      driverName: 'Neha Singh',
      driverContact: '+45 45678901',
      startDateTime: new Date('2026-02-04T09:00:00'),
      endDateTime: new Date('2026-02-07T09:00:00'),
      status: 'REQUESTED',
      createdBy: 'Rep 3',
    },
    {
      bookingId: 'BK-005',
      vanId: 'VAN-20',
      projectId: '45110',
      driverName: 'Vikram Rao',
      driverContact: '+45 56789012',
      startDateTime: new Date('2026-02-01T13:00:00'),
      endDateTime: new Date('2026-02-01T21:00:00'),
      status: 'CONFIRMED',
      createdBy: 'Rep 4',
    },
    {
      bookingId: 'BK-006',
      vanId: 'VAN-33',
      projectId: '59231',
      driverName: 'Sanjay Iyer',
      driverContact: '+45 67890123',
      startDateTime: new Date('2026-02-07T09:00:00'),
      endDateTime: new Date('2026-02-09T09:00:00'),
      status: 'CONFIRMED',
      createdBy: 'Rep 5',
    },
    {
      bookingId: 'BK-007',
      vanId: 'VAN-41',
      projectId: '77590',
      driverName: 'Priya Nair',
      driverContact: '+45 78901234',
      startDateTime: new Date('2026-02-11T09:00:00'),
      endDateTime: new Date('2026-02-14T09:00:00'),
      status: 'CONFIRMED',
      createdBy: 'Rep 6',
    },
  ]

  // Only create bookings for vans that exist
  const existingVans = await prisma.van.findMany({ select: { vanId: true } })
  const existingVanIds = new Set(existingVans.map(v => v.vanId))

  for (const bookingData of bookingsData) {
    if (existingVanIds.has(bookingData.vanId)) {
      const van = await prisma.van.findUnique({
        where: { vanId: bookingData.vanId },
      })

      if (van) {
        await prisma.booking.create({
          data: {
            ...bookingData,
            vanId: van.id,
          },
        })
      }
    }
  }

  const bookingCount = await prisma.booking.count()
  console.log(`✅ Created ${bookingCount} bookings`)

  // Create maintenance record from Booking Log
  console.log('Creating maintenance records...')
  const van12 = await prisma.van.findUnique({ where: { vanId: 'VAN-12' } })
  if (van12) {
    await prisma.maintenance.create({
      data: {
        maintenanceId: 'MAINT-001',
        vanId: van12.id,
        scheduledDate: new Date('2026-02-18T08:00:00'),
        completedDate: null,
        description: 'Scheduled maintenance',
        maintenanceType: 'DATE_BASED',
        cost: 500,
        vendor: 'Service Center',
      },
    })
    console.log('✅ Created 1 maintenance record')
  }

  console.log('✅ Database seeded successfully with real CSV data!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
