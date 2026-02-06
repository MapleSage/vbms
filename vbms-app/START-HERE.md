# Van Booking & Fleet Management System - Quick Start

## ✅ Current Status: FULLY FUNCTIONAL

The application is now **fully operational** with:
- ✅ Database schema created (SQLite for local dev)
- ✅ Sample data seeded (4 vans, 2 bookings, 1 user)
- ✅ API endpoints working (vans, bookings)
- ✅ Development server running on http://localhost:3000

## 🚀 What's Working Right Now

### API Endpoints
- `GET /api/vans` - List all vans with booking counts
- `POST /api/vans` - Create a new van
- `GET /api/bookings` - List all bookings with van details
- `POST /api/bookings` - Create a new booking (with conflict detection)

### Database
- SQLite database at `prisma/dev.db`
- All tables created and seeded with sample data
- Prisma Client generated and ready to use

### Frontend
- Homepage dashboard at http://localhost:3000
- Shows fleet overview, recent bookings, and quick stats

## 📋 Next Steps

### 1. View the Application
```bash
# Server is already running at:
http://localhost:3000
```

### 2. Explore the Database
```bash
cd vbms-app
npx prisma studio
# Opens at http://localhost:5555
```

### 3. Test API Endpoints
```bash
# List all vans
curl http://localhost:3000/api/vans

# List all bookings
curl http://localhost:3000/api/bookings

# Create a new booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "12345",
    "vanId": "VAN001",
    "driverName": "John Smith",
    "driverContact": "john@example.com",
    "startDateTime": "2026-02-10T09:00:00Z",
    "endDateTime": "2026-02-10T17:00:00Z"
  }'
```

## 🔧 Development Commands

```bash
cd vbms-app

# Start dev server (already running)
npm run dev

# Reset and reseed database
npx prisma db push --force-reset
npm run db:seed

# View database in browser
npx prisma studio

# Generate Prisma Client after schema changes
npx prisma generate
```

## 📁 Project Structure

```
vbms-app/
├── app/
│   ├── api/
│   │   ├── vans/route.ts       # Van CRUD operations
│   │   └── bookings/route.ts   # Booking CRUD + conflict detection
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage dashboard
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Sample data
│   └── dev.db                  # SQLite database
├── lib/
│   └── prisma.ts               # Prisma client singleton
└── .env                        # Environment variables
```

## 🎯 What to Build Next

### High Priority Pages
1. **Bookings Management**
   - `/app/bookings/page.tsx` - List all bookings with filters
   - `/app/bookings/new/page.tsx` - Create booking form with conflict checking
   - `/app/bookings/[id]/page.tsx` - View/edit booking details

2. **Fleet Management**
   - `/app/vans/page.tsx` - List all vans with status
   - `/app/vans/[id]/page.tsx` - Van details and history

3. **Calendar View**
   - `/app/calendar/page.tsx` - Visual booking calendar

### Additional API Routes
- `/app/api/vans/[id]/route.ts` - Individual van operations
- `/app/api/bookings/[id]/route.ts` - Individual booking operations
- `/app/api/calendar/route.ts` - Calendar data aggregation

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Quick Deploy)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd vbms-app
vercel

# Note: You'll need to set up a PostgreSQL database for production
# Vercel offers free PostgreSQL through their Postgres service
```

### Option 2: Azure (Full Control)
See `DEPLOY.sh` for Azure deployment with:
- Azure App Service
- Azure SQL Database
- Azure AD authentication

## 🔐 Environment Variables

Current `.env` is configured for local SQLite development.

For production, update:
```env
# PostgreSQL (Vercel)
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Or Azure SQL Server
DATABASE_URL="sqlserver://server.database.windows.net:1433;database=vbms;user=admin;password=pass;encrypt=true"
```

## 📊 Sample Data

The database is seeded with:
- **4 Vans**: Ford Transit, Mercedes Sprinter, Ram ProMaster, Nissan NV
- **2 Bookings**: One active, one requested
- **1 User**: admin@example.com (Fleet Admin)

## 🐛 Troubleshooting

### Server not responding?
```bash
# Check if server is running
curl http://localhost:3000/api/vans

# Restart if needed
cd vbms-app
npm run dev
```

### Database issues?
```bash
# Reset database
cd vbms-app
npx prisma db push --force-reset
npm run db:seed
```

### Prisma Client errors?
```bash
# Regenerate client
cd vbms-app
npx prisma generate
```

---

**Ready to continue building?** The foundation is solid - pick a page from the "What to Build Next" section and start coding!
