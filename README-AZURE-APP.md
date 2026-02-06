# Van Booking & Fleet Management System

## 🎉 Status: MVP Ready!

A complete Next.js web application for managing van fleet bookings, built with modern technologies and ready for Azure deployment.

## ✅ What's Built

### Core Application
- **Next.js 14** with App Router and TypeScript
- **Prisma ORM** with SQLite (dev) / PostgreSQL / Azure SQL support
- **Tailwind CSS** for styling
- **API Routes** with full CRUD operations
- **Conflict Detection** for booking overlaps
- **Sample Data** seeded and ready

### Features Implemented
1. **Van Management**
   - List all vans with availability status
   - Track van details (make, model, tier, rates)
   - View booking counts per van

2. **Booking System**
   - Create bookings with driver and project info
   - Automatic conflict detection (prevents double-booking)
   - List bookings with van details
   - Status tracking (REQUESTED, CONFIRMED, ACTIVE, COMPLETED, CANCELLED)

3. **Dashboard**
   - Fleet overview with key metrics
   - Recent bookings display
   - Quick stats (total vans, active bookings, available vans)

## 🚀 Quick Start

```bash
# Navigate to app directory
cd vbms-app

# Server is already running at:
http://localhost:3000

# View database
npx prisma studio
```

## 📊 Current Data

The system is pre-loaded with:
- **4 Vans**: Ford Transit, Mercedes Sprinter, Ram ProMaster, Nissan NV
- **2 Bookings**: Sample bookings with different statuses
- **1 User**: Admin user for testing

## 🔗 API Endpoints

All endpoints are live and tested:

### Vans
- `GET /api/vans` - List all vans ✅
- `POST /api/vans` - Create new van ✅

### Bookings
- `GET /api/bookings` - List all bookings ✅
- `POST /api/bookings` - Create booking with conflict check ✅

## 📁 Project Structure

```
vbms-app/
├── app/
│   ├── api/
│   │   ├── vans/route.ts       ✅ Working
│   │   └── bookings/route.ts   ✅ Working
│   ├── layout.tsx              ✅ Working
│   └── page.tsx                ✅ Working (Dashboard)
├── prisma/
│   ├── schema.prisma           ✅ Complete (11 models)
│   ├── seed.ts                 ✅ Working
│   └── dev.db                  ✅ Created & seeded
└── lib/
    └── prisma.ts               ✅ Working
```

## 🎯 Next Development Phase

### Pages to Build
1. **Bookings Pages**
   - `/bookings` - Full booking list with filters
   - `/bookings/new` - Booking creation form
   - `/bookings/[id]` - Booking details/edit

2. **Fleet Pages**
   - `/vans` - Van list with status
   - `/vans/[id]` - Van details and history

3. **Calendar**
   - `/calendar` - Visual booking calendar

### Additional Features
- User authentication (Azure AD)
- Maintenance tracking
- Incident reporting
- Cost tracking
- Document management
- Audit trail

## 🚀 Deployment Ready

### Vercel (Fastest)
```bash
npm i -g vercel
cd vbms-app
vercel
```

### Azure (Full Control)
```bash
cd vbms-app
chmod +x DEPLOY.sh
./DEPLOY.sh
```

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL / Azure SQL
- **Deployment**: Vercel or Azure App Service
- **Authentication**: Ready for Azure AD integration

## 📖 Documentation

- `vbms-app/START-HERE.md` - Detailed setup and usage guide
- `vbms-app/DEPLOY.sh` - Azure deployment script
- `.kiro/specs/van-booking-fleet-management/` - Full requirements and design docs

## 🎓 Key Features

### Booking Conflict Detection
The system automatically prevents double-booking by checking for overlapping time periods on the same van.

### Database Schema
Complete schema with 11 models:
- Van, Booking, Maintenance, Incident, Cost, Document, AuditTrail, User

### API Design
RESTful API with proper error handling, validation, and response formatting.

## 🔐 Environment Setup

Current configuration uses SQLite for local development. For production:

```env
# PostgreSQL (Vercel)
DATABASE_URL="postgresql://..."

# Azure SQL
DATABASE_URL="sqlserver://..."
```

## 📈 Performance

- Fast local development with SQLite
- Optimized Prisma queries with proper indexes
- Efficient API routes with Next.js 14

## 🤝 Contributing

The foundation is solid. Pick a feature from "Next Development Phase" and start building!

---

**Built with ❤️ using Next.js, Prisma, and TypeScript**
