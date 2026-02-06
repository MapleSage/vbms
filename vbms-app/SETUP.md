# VBMS Application Setup Guide

## Quick Start

This is a production-ready Next.js application for Van Booking & Fleet Management.

### Prerequisites
- Node.js 18+ installed
- Azure subscription with SQL Database
- Azure AD app registration (for authentication)

### Step 1: Install Dependencies

```bash
cd vbms-app
npm install
```

### Step 2: Setup Azure SQL Database

1. **Create Azure SQL Database**:
```bash
az sql server create \
  --name vbms-sql-server \
  --resource-group your-rg \
  --location eastus \
  --admin-user vbmsadmin \
  --admin-password YourSecurePassword123!

az sql db create \
  --resource-group your-rg \
  --server vbms-sql-server \
  --name vbms-db \
  --service-objective S0
```

2. **Configure Firewall**:
```bash
az sql server firewall-rule create \
  --resource-group your-rg \
  --server vbms-sql-server \
  --name AllowAll \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255
```

### Step 3: Setup Azure AD Authentication

1. Go to Azure Portal → Azure Active Directory → App registrations
2. Click "New registration"
3. Name: "VBMS Application"
4. Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
5. Copy Client ID, Client Secret, Tenant ID

### Step 4: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
DATABASE_URL="sqlserver://vbms-sql-server.database.windows.net:1433;database=vbms-db;user=vbmsadmin;password=YourSecurePassword123!;encrypt=true"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"
```

### Step 5: Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

### Step 6: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Connect to Vercel**:
- Go to vercel.com
- Import your GitHub repository
- Add environment variables
- Deploy

3. **Update Azure AD Redirect URI**:
- Add: `https://your-app.vercel.app/api/auth/callback/azure-ad`

### Deploy to Azure App Service

```bash
# Create App Service
az webapp create \
  --resource-group your-rg \
  --plan your-plan \
  --name vbms-app \
  --runtime "NODE:18-lts"

# Configure environment variables
az webapp config appsettings set \
  --resource-group your-rg \
  --name vbms-app \
  --settings DATABASE_URL="..." NEXTAUTH_URL="..." ...

# Deploy
npm run build
az webapp deployment source config-zip \
  --resource-group your-rg \
  --name vbms-app \
  --src ./build.zip
```

## Project Structure

```
vbms-app/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main application
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth configuration
│   └── utils.ts          # Helper functions
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── public/               # Static assets
```

## Features Implemented

✅ **Authentication**
- Azure AD SSO
- Role-based access control
- Session management

✅ **Van Management**
- CRUD operations
- Status tracking
- Document management

✅ **Booking System**
- Create/edit/cancel bookings
- Conflict detection
- Status transitions
- Calendar view

✅ **Maintenance**
- Schedule maintenance
- Track completion
- Cost recording

✅ **Incidents**
- Log incidents
- Auto-assignment
- Status tracking

✅ **Reporting**
- Utilization reports
- Cost reports
- Export to Excel

✅ **Audit Trail**
- Complete audit log
- User tracking
- Change history

## API Endpoints

### Authentication
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Vans
- `GET /api/vans` - List vans
- `POST /api/vans` - Create van
- `GET /api/vans/[id]` - Get van
- `PUT /api/vans/[id]` - Update van
- `DELETE /api/vans/[id]` - Delete van

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `POST /api/bookings/check-conflict` - Check conflicts
- `GET /api/bookings/[id]` - Get booking
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Calendar
- `GET /api/calendar` - Get calendar data
- `GET /api/calendar/availability` - Check availability

Full API documentation available at `/api/docs` when running.

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Troubleshooting

### Database Connection Issues
- Check firewall rules
- Verify connection string
- Ensure database exists

### Authentication Issues
- Verify Azure AD configuration
- Check redirect URIs
- Confirm client secret is valid

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Regenerate Prisma client: `npm run db:generate`

## Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@example.com

## Next Steps

1. ✅ Setup complete
2. 🚀 Deploy to Vercel/Azure
3. 👥 Add users
4. 📊 Start using the system

---

**Status**: Ready for Production
**Version**: 1.0.0
**Last Updated**: 2024
