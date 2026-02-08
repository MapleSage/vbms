import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkData() {
  const vans = await prisma.van.count()
  const bookings = await prisma.booking.count()
  const users = await prisma.user.count()
  const maintenance = await prisma.maintenance.count()

  console.log('📊 Database Status:')
  console.log(`  Vans: ${vans}`)
  console.log(`  Bookings: ${bookings}`)
  console.log(`  Users: ${users}`)
  console.log(`  Maintenance: ${maintenance}`)

  if (vans > 0) {
    console.log('\n✅ Database has data!')
    const sampleVans = await prisma.van.findMany({ take: 3 })
    console.log('\nSample vans:')
    sampleVans.forEach(v => console.log(`  - ${v.vanId}: ${v.make} ${v.model} (${v.registration})`))
  } else {
    console.log('\n⚠️  Database is empty. Run: npx tsx prisma/seed-from-csv.ts')
  }

  await prisma.$disconnect()
}

checkData()
