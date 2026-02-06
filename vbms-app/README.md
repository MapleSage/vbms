# Van Booking & Fleet Management System (VBMS)

Modern web application for managing van bookings and fleet operations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Azure credentials

# Initialize database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit http://localhost:3000

## 📦 What's Included

This is a **complete, production-ready application** with:

- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Prisma ORM with Azure SQL
- ✅ NextAuth.js with Azure AD
- ✅ Tailwind CSS for styling
- ✅ Radix UI components
- ✅ React Hook Form for forms
- ✅ Zod for validation
- ✅ Full CRUD operations
- ✅ Conflict detection
- ✅ Audit logging
- ✅ Role-based access
- ✅ Responsive design
- ✅ Van photo uploads (Vercel Blob)

## 🏗️ Architecture

```
Next.js Application (Vercel/Azure)
    ↓
API Routes (Serverless Functions)
    ↓
Prisma ORM
    ↓
Azure SQL Database
```

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [API Documentation](docs/API.md) - API endpoints
- [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to production
- [User Guide](docs/USER_GUIDE.md) - How to use the system

## 🔑 Key Features

### For Project Representatives
- Create and manage bookings
- View availability calendar
- Track booking status
- Cancel bookings

### For Fleet Administrators
- Manage van fleet
- Schedule maintenance
- Log incidents
- View all bookings
- Access reports

### For Finance Managers
- View cost reports
- Export data to Excel
- Track utilization
- Monitor expenses

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Azure SQL Database
- **ORM**: Prisma
- **Auth**: NextAuth.js with Azure AD
- **Deployment**: Vercel or Azure App Service

## 📊 Database Schema

- **Vans**: Vehicle registry
- **Bookings**: Reservation records
- **Maintenance**: Service schedules
- **Incidents**: Fines and incidents
- **Costs**: Running costs
- **Documents**: Compliance documents
- **Audit Trail**: Complete audit log
- **Users**: Application users

## 🚢 Deployment Options

### Option 1: Vercel (Recommended)
```bash
vercel deploy
```

### Option 2: Azure App Service
```bash
az webapp up --name vbms-app
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

## 💰 Cost Estimate

### Vercel + Azure SQL
- Vercel Pro: $20/month
- Azure SQL (S0): $15/month
- **Total: ~$35/month**

### Azure App Service + Azure SQL
- App Service (B1): $13/month
- Azure SQL (S0): $15/month
- **Total: ~$28/month**

## 🔒 Security

- Azure AD authentication
- Role-based access control
- SQL injection prevention
- XSS protection
- CSRF protection
- Audit logging
- HTTPS only

## 📈 Performance

- Server-side rendering
- API route caching
- Database indexing
- Optimized queries
- Image optimization
- Code splitting

## 🧪 Testing

```bash
npm test
```

## 📝 License

Proprietary - All rights reserved

## 🤝 Support

For support, email support@example.com or open an issue.

---

**Ready to deploy!** Follow [SETUP.md](SETUP.md) to get started.
