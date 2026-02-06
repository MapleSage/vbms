# Van Booking & Fleet Management System (VBMS)

A modern, full-stack web application for managing van fleet bookings built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## 🚀 Live Demo

[View Live Application](https://your-app.vercel.app) _(will be available after deployment)_

## ✨ Features

- **Fleet Management** - Track all vans with detailed information and status
- **Booking System** - Create and manage bookings with automatic conflict detection
- **Calendar View** - Visual monthly calendar showing all bookings
- **Real-time Updates** - Server-side rendering for fast, up-to-date data
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Clean, professional interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (production)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📦 Project Structure

```
VBSM/
├── vbms-app/              # Main Next.js application
│   ├── app/               # Next.js 14 App Router
│   │   ├── api/          # API routes
│   │   ├── bookings/     # Booking pages
│   │   ├── vans/         # Van management pages
│   │   └── calendar/     # Calendar view
│   ├── prisma/           # Database schema and migrations
│   └── lib/              # Utility functions
├── docs/                 # Documentation
└── .kiro/               # Spec files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Local Development

```bash
# Navigate to app directory
cd vbms-app

# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push
npm run db:seed

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the application.

## 📊 Database

The application uses Prisma ORM with:
- **Development**: SQLite (zero configuration)
- **Production**: PostgreSQL (recommended for Vercel)

### Database Models

- Van - Fleet vehicle registry
- Booking - Van reservations
- Maintenance - Service records
- Incident - Fines and incidents
- Cost - Running costs tracking
- Document - Vehicle documents
- AuditTrail - System audit log
- User - Application users

## 🌐 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd vbms-app
vercel
```

### Option 2: Deploy via GitHub

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/vbms.git
git push -u origin main
```

2. Import project in Vercel:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory**: `vbms-app`
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. Set up environment variables in Vercel:
```env
DATABASE_URL=your_postgresql_connection_string
```

4. Deploy!

### Setting up PostgreSQL for Production

Vercel offers free PostgreSQL:

1. In your Vercel project, go to "Storage"
2. Create a new Postgres database
3. Copy the connection string
4. Add it to your environment variables as `DATABASE_URL`
5. Redeploy

## 📝 Environment Variables

Create a `.env` file in `vbms-app/`:

```env
# Database
DATABASE_URL="file:./dev.db"  # For local development

# For production (PostgreSQL)
# DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# NextAuth (optional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

## 🎯 Key Features

### Booking Conflict Detection
The system automatically prevents double-booking by checking for overlapping time periods on the same van.

### Calendar View
Visual monthly calendar showing all bookings with color-coded status indicators.

### Responsive Design
Fully responsive interface that works on all devices.

## 📖 Documentation

- [Quick Start Guide](vbms-app/START-HERE.md)
- [Current Status](vbms-app/STATUS.md)
- [Requirements](. kiro/specs/van-booking-fleet-management/requirements.md)
- [Design Document](.kiro/specs/van-booking-fleet-management/design.md)

## 🤝 Contributing

This is a private project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Private - All rights reserved

## 🆘 Support

For issues or questions:
- Check the documentation in `/docs`
- Review the requirements in `.kiro/specs/`
- Contact the development team

---

**Built with ❤️ using Next.js, Prisma, and TypeScript**
