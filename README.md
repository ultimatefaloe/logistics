# Global Ultra Logistics - MVP Platform

A modern, production-ready logistics platform connecting Nigerian businesses to global markets with seamless shipment creation and public tracking capabilities.

## 🚀 Features

### Public Features
- **Landing Page**: Platform overview and value proposition
- **Track Shipment**: Public tracking without authentication using unique tracking ID
- **Tracking Timeline**: Visual status progression with timestamps and notes

### User Features  
- **Authentication**: Secure register/login with JWT and HTTP-only cookies
- **Create Shipment**: Submit sender/receiver details and package information
- **View Shipments**: List and filter own shipments with pagination
- **Shipment Details**: View full tracking history and package information
- **Dashboard**: Quick stats and recent activity

### Admin Features
- **Admin Dashboard**: Overview statistics and activity monitoring
- **Manage All Shipments**: View all platform shipments with filtering by status
- **Update Status**: Manually update shipment status with audit trail
- **Status History**: Immutable append-only tracking history

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS 4 + Custom CSS
- **Backend**: Next.js API Routes (BFF Pattern)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma v5
- **Authentication**: JWT + HTTP-only Secure Cookies
- **Validation**: Zod schemas
- **Utilities**: bcryptjs, nanoid, react-hook-form

### Architecture Pattern

**Backend-for-Frontend (BFF) Pattern**
```
┌─────────────────────────┐
│    UI Layer (Next.js)   │
└────────────┬────────────┘
             │
┌────────────▼─────────────┐
│   API Routes (BFF)       │
│   - Auth                 │
│   - Shipments            │
│   - Admin                │
└────────────┬─────────────┘
             │
┌────────────▼──────────────┐
│   Service Layer           │
│   - AuthService           │
│   - ShipmentService       │
│   - TrackingService       │
│   - StatusService         │
└────────────┬──────────────┘
             │
┌────────────▼──────────────┐
│   Prisma (Data Access)    │
└────────────┬──────────────┘
             │
┌────────────▼──────────────┐
│   SQLite / PostgreSQL      │
└───────────────────────────┘
```

## 📋 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
POST   /api/auth/logout       - Logout user
GET    /api/auth/me           - Get current user info
```

### Shipments (Protected - USER)
```
POST   /api/shipments         - Create new shipment
GET    /api/shipments         - List user's shipments (paginated)
GET    /api/shipments/:id     - Get shipment details
```

### Public Tracking (No Auth)
```
GET    /api/track/:trackingId - Public tracking by ID
```

### Admin (Protected - ADMIN only)
```
GET    /api/admin/shipments            - List all shipments
PATCH  /api/admin/shipments/:id/status - Update shipment status
```

## 🔐 Security Features

### Authentication & Authorization
- JWT tokens (7-day expiry)
- HTTP-only secure cookies (SameSite=strict)
- Bcrypt password hashing (12 salt rounds)
- Role-based access control (USER, ADMIN)
- Protected routes with JWT validation

### Data Privacy
- Public tracking exposes only: trackingId, status, cities, timeline
- Sender/receiver contact details hidden from public
- Users can only view own shipments
- Admin has full visibility

### Input Validation
- Zod schema validation on all endpoints
- Email format validation
- Phone number regex validation
- Tracking ID format validation
- Password strength requirements

## 📁 Project Structure

```
logistics/
├── app/
│   ├── api/                          # API routes (BFF)
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── shipments/
│   │   │   ├── route.ts              # POST (create), GET (list)
│   │   │   └── [id]/route.ts         # GET (detail)
│   │   ├── track/
│   │   │   └── [trackingId]/route.ts # GET (public tracking)
│   │   └── admin/
│   │       ├── shipments/
│   │       │   ├── route.ts          # GET (all shipments)
│   │       │   └── [id]/status/route.ts  # PATCH (update status)
│   ├── (auth)/                       # Route group: Auth pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (public)/                     # Route group: Public pages
│   │   ├── track/page.tsx
│   │   ├── track/[trackingId]/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/                  # Route group: Protected user pages
│   │   ├── dashboard/page.tsx
│   │   ├── shipments/
│   │   │   ├── page.tsx              # List
│   │   │   ├── new/page.tsx          # Create
│   │   │   └── [id]/page.tsx         # Detail
│   │   └── layout.tsx
│   ├── admin/                        # Protected admin pages
│   │   ├── page.tsx                  # Dashboard
│   │   ├── shipments/
│   │   │   ├── page.tsx              # All shipments
│   │   │   └── [id]/page.tsx         # Manage shipment
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Landing page
│
├── lib/                              # Utilities & helpers
│   ├── auth.ts                       # JWT, password hashing
│   ├── db.ts                         # Prisma singleton
│   ├── tracking-id.ts                # Tracking ID generation
│   ├── validators.ts                 # Zod schemas
│   └── middleware.ts                 # Auth middleware
│
├── services/                         # Business logic layer
│   ├── auth.service.ts               # Auth operations
│   ├── shipment.service.ts           # Shipment CRUD
│   ├── tracking.service.ts           # Public tracking
│   └── status.service.ts             # Status management
│
├── components/                       # Reusable UI components
│   ├── navbar.tsx                    # Navigation
│   ├── status-badge.tsx              # Status badge
│   └── tracking-timeline.tsx         # Timeline view
│
├── types/                            # TypeScript types
│   ├── user.ts
│   ├── shipment.ts
│   ├── auth.ts
│   └── api.ts
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Migration history
│
├── public/                           # Static assets
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── README.md
```

## 📊 Database Schema

### User
- `id` (cuid, primary)
- `email` (unique, indexed)
- `password` (bcrypt hashed)
- `firstName`, `lastName`
- `company` (optional)
- `phone` (optional)
- `role` (USER | ADMIN)
- `createdAt`, `updatedAt`

### Shipment
- `id` (cuid, primary)
- `trackingId` (unique, indexed) - GUL-XXXX-XXXX format
- `userId` (FK to User)
- Sender: name, email, phone, address, city
- Receiver: name, email, phone, address, city
- Package: description, weight, dimensions
- `currentStatus` (denormalized for performance)
- `createdAt`, `updatedAt`
- **Indexes**: trackingId, userId, createdAt

### ShipmentStatusHistory
- `id` (cuid, primary)
- `shipmentId` (FK to Shipment)
- `status` (PENDING | IN_TRANSIT | OUT_FOR_DELIVERY | DELIVERED | FAILED)
- `notes` (optional)
- `updatedAt` (append-only, never modified)
- **Indexes**: shipmentId, updatedAt

## 🎯 Tracking ID Strategy

- **Format**: `GUL-XXXX-XXXX` (12 characters, memorable)
- **Character Set**: A-Z, 2-9 (excludes confusing chars: 0, O, I, L, 1)
- **Uniqueness**: 32⁸ ≈ 1 trillion combinations
- **Collision Handling**: Automatic retry (extremely rare)
- **Database Constraint**: Unique enforced at DB level

### Examples
```
GUL-A7K2-9M5N
GUL-B3R8-2C4Q
GUL-X9P1-6L2W
```

## 🎨 Design System

### Color Palette
- **Primary**: #0D1F3C (Dark Navy) - Headers, main buttons
- **Secondary**: #FF7A00 (Orange) - CTAs, accents
- **Accent**: #F3F4F6 (Light Gray) - Backgrounds
- **Success**: #10B981 (Green) - Delivered status
- **Warning**: #FBBF24 (Yellow) - Pending status
- **Info**: #3B82F6 (Blue) - In-transit status
- **Error**: #EF4444 (Red) - Failed status

### Typography
- **Display**: Space Grotesk (600, 700 weight) - Headings
- **Body**: Inter (400, 500, 600, 700 weight) - Content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 10+

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Initialize database
DATABASE_URL="file:./dev.db" pnpm exec prisma migrate dev --name init

# Start development server
DATABASE_URL="file:./dev.db" pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite for dev

# JWT & Session
JWT_SECRET="dev-secret-change-in-prod"
COOKIE_NAME="auth_token"
COOKIE_MAX_AGE=604800  # 7 days in seconds

# Environment
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## 🧪 Testing the Application

### Test User Scenarios

**Scenario 1: Register & Create Shipment**
```
1. Visit http://localhost:3000/register
2. Fill form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Company: ABC Logistics
   - Password: SecurePass123!
3. Click Register → Auto-login
4. Click "New Shipment"
5. Fill shipment details → Submit
6. Get tracking ID (e.g., GUL-A7K2-9M5N)
```

**Scenario 2: Public Tracking**
```
1. Visit http://localhost:3000/track
2. Enter tracking ID from above
3. Click "Search Shipment"
4. See status timeline (no login required)
```

**Scenario 3: Admin Status Update**
```
1. Register with admin account (set role=ADMIN manually in DB)
2. Visit http://localhost:3000/admin
3. Go to "All Shipments"
4. Click "Manage" on a shipment
5. Click "Update Status"
6. Select new status (e.g., IN_TRANSIT)
7. Add notes: "Picked up from sender"
8. Submit → Status updated
```

## 🏗️ Build & Deploy

### Development
```bash
DATABASE_URL="file:./dev.db" pnpm dev
```

### Production Build
```bash
pnpm build
pnpm start
```

### Database Tools

**Prisma Studio** (visual database editor)
```bash
DATABASE_URL="file:./dev.db" pnpm exec prisma studio
```

**Database Reset** (development only!)
```bash
DATABASE_URL="file:./dev.db" pnpm exec prisma migrate reset --force
```

**Create New Migration**
```bash
DATABASE_URL="file:./dev.db" pnpm exec prisma migrate dev --name <description>
```

## 📈 Performance Considerations

✅ **Database**
- Indexes on frequently queried fields (trackingId, userId)
- Denormalized currentStatus for O(1) reads
- Connection pooling ready

✅ **API**
- Stateless design for horizontal scaling
- Pagination on list endpoints (limit 10)
- No N+1 queries with Prisma eager loading

✅ **Frontend**
- Code-splitting via Next.js
- Server-side rendering for SEO
- Client-side hydration

## 🔄 Data Flow Examples

### Creating a Shipment

```
User fills form
    ↓
Frontend validates with Zod
    ↓
POST /api/shipments
    ↓
Server validates again
    ↓
Generate unique trackingId
    ↓
Create Shipment + StatusHistory record
    ↓
Return trackingId
    ↓
Frontend shows confirmation modal
```

### Public Tracking

```
User enters tracking ID
    ↓
Validate format (GUL-XXXX-XXXX)
    ↓
GET /api/track/:trackingId
    ↓
Query Shipment by trackingId (indexed)
    ↓
Fetch StatusHistory (ordered by date)
    ↓
Return public info only
    ↓
Frontend renders timeline
```

### Admin Status Update

```
Admin selects new status
    ↓
PATCH /api/admin/shipments/:id/status
    ↓
Verify admin role
    ↓
Validate status enum
    ↓
Transaction:
  - Update Shipment.currentStatus
  - Create StatusHistory record
    ↓
Return updated Shipment
    ↓
Frontend refreshes timeline
```

## 🛠️ Development Workflow

### Creating a New Page

```bash
# Create directory
mkdir -p app/(section)/page-name

# Create page file
touch app/(section)/page-name/page.tsx

# Use client component if needed
echo "'use client';" > app/(section)/page-name/page.tsx
```

### Adding an API Endpoint

```bash
# Create route file
mkdir -p app/api/resource
touch app/api/resource/route.ts

# Add GET/POST handlers
# Use verifyToken() for auth
# Use <Service>.method() for logic
```

### Adding a Service Method

```typescript
// In services/xyz.service.ts
static async newMethod(params) {
  const result = await prisma.model.action(...);
  return result;
}
```

## 📝 Best Practices Implemented

✅ **Code Quality**
- TypeScript strict mode
- ESLint configured
- Consistent error handling
- Modular component structure
- Service layer abstraction

✅ **Security**
- Input validation on all endpoints
- SQL injection prevention (Prisma)
- XSS protection (React escaping)
- CSRF protection (SameSite cookies)
- Secure password hashing

✅ **Performance**
- Database indexes on key fields
- Efficient pagination
- Singleton Prisma client
- Optimized queries

✅ **Maintainability**
- Clear folder structure
- Separation of concerns
- Reusable components
- Comprehensive types

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/xyz`
2. Make changes
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/xyz`
5. Create pull request

## 📄 License

MIT License - See LICENSE for details

## 🌟 Next Steps for Production

- [ ] Setup PostgreSQL
- [ ] Add email notifications
- [ ] Implement rate limiting
- [ ] Add payment integration
- [ ] Setup CI/CD pipeline
- [ ] Add analytics
- [ ] Setup monitoring/logging
- [ ] Add SMS notifications
- [ ] Implement real-time updates (WebSocket)
- [ ] Add advanced filtering/search

---

**Global Ultra Logistics** - Connecting Nigerian Businesses to Global Markets 🌍This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# logistics
