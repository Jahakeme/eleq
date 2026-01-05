# EleQ Workflow Documentation

## Overview

EleQ is an electronics-only marketplace where:

- **Anyone** can browse the product dashboard (no auth required)
- **Purchasing** requires user authentication
- **After login**, users are redirected to checkout for their selected product
- **Product images** are matched via product ID on the frontend (placeholder approach)

---

## User Flow

```bash
┌─────────────────────────────────────────────────────────────────────────┐
│                           GUEST USER FLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   [Landing Page] ──► [Product Dashboard] ──► [Product Details]          │
│         │                    │                      │                    │
│         │                    │                      ▼                    │
│         │                    │              [Click "Buy Now"]            │
│         │                    │                      │                    │
│         ▼                    ▼                      ▼                    │
│   [Sign Up/Login]     (Browse freely)      [Redirect to Login]          │
│                                                     │                    │
│                                                     ▼                    │
│                                            [Store product ID            │
│                                             in session/URL]             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATED USER FLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   [Login Success] ──► [Check for pending product] ──► [Checkout Page]   │
│         │                      │                            │            │
│         │                      │ (no pending)               ▼            │
│         │                      ▼                    [Complete Order]     │
│         │              [Product Dashboard]                  │            │
│         │                      │                            ▼            │
│         ▼                      ▼                    [Order Confirmation] │
│   [User Dashboard]    [Add to Cart / Buy]                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Product Image Strategy

Since there's no admin dashboard, images are matched to products via their ID on the frontend.

### Directory Structure

```bash
frontend/public/products/
├── prod_001.jpg    # Matches product with id containing "001"
├── prod_002.jpg
├── wireless-mouse.jpg
├── gaming-keyboard.jpg
└── ...
```

### Image Mapping Approach

### Option A: ID-Based Naming (Recommended)**

```typescript
// utils/getProductImage.ts
export function getProductImage(productId: string): string {
  return `/products/${productId}.jpg`;
}

// Fallback to placeholder if image doesn't exist
export function getProductImageWithFallback(productId: string): string {
  return `/products/${productId}.jpg`;
  // Use onError handler in <Image> component to show placeholder
}
```

### Option B: Slug-Based Naming

```typescript
// Product model includes a slug field
// Image file matches the slug: "wireless-mouse" → "/products/wireless-mouse.jpg"
```

### Frontend Implementation

```tsx
// components/ProductCard.tsx
import Image from 'next/image';

export function ProductCard({ product }) {
  return (
    <Image
      src={`/products/${product.id}.jpg`}
      alt={product.name}
      width={300}
      height={300}
      onError={(e) => {
        e.currentTarget.src = '/products/placeholder.jpg';
      }}
    />
  );
}
```

---

## Prisma Models (MongoDB)

### Schema Definition

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// ============================================
// USER MODEL
// ============================================
model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  email         String    @unique
  password      String    // Hashed with bcrypt
  fullName      String
  phone         String?
  address       Address?

  // Auth
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  orders        Order[]
  cart          CartItem[]
  reviews       Review[]

  @@map("users")
}

// Embedded document for address
type Address {
  street    String
  city      String
  state     String
  zipCode   String
  country   String
}

// ============================================
// PRODUCT MODEL
// ============================================
model Product {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  slug          String    @unique  // URL-friendly name, also used for image matching
  description   String
  price         Float
  comparePrice  Float?    // Original price for showing discounts

  // Categorization
  category      Category  @relation(fields: [categoryId], references: [id])
  categoryId    String    @db.ObjectId
  brand         String

  // Inventory
  stock         Int       @default(0)
  sku           String?   @unique

  // Product details
  specs         Json?     // Flexible specs: { "RAM": "16GB", "Storage": "512GB" }
  tags          String[]
  featured      Boolean   @default(false)

  // Status
  status        ProductStatus @default(ACTIVE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  orderItems    OrderItem[]
  cartItems     CartItem[]
  reviews       Review[]

  @@map("products")
}

enum ProductStatus {
  ACTIVE
  OUT_OF_STOCK
  DISCONTINUED
}

// ============================================
// CATEGORY MODEL
// ============================================
model Category {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  name        String    @unique
  slug        String    @unique
  description String?

  // Self-referencing for subcategories
  parentId    String?   @db.ObjectId
  parent      Category? @relation("SubCategories", fields: [parentId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  children    Category[] @relation("SubCategories")

  products    Product[]

  @@map("categories")
}

// ============================================
// ORDER MODEL
// ============================================
model Order {
  id              String      @id @default(auto()) @map("_id") @db.ObjectId
  orderNumber     String      @unique  // Human-readable: "ELQ-2024-001234"

  // Customer
  user            User        @relation(fields: [userId], references: [id])
  userId          String      @db.ObjectId

  // Order details
  items           OrderItem[]
  subtotal        Float
  tax             Float
  shippingCost    Float
  total           Float

  // Shipping
  shippingAddress Address

  // Status tracking
  status          OrderStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   String?
  paymentId       String?     // External payment reference (Stripe, PayPal)

  // Timestamps
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  paidAt          DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?

  @@map("orders")
}

model OrderItem {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId

  order       Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId     String    @db.ObjectId

  product     Product   @relation(fields: [productId], references: [id])
  productId   String    @db.ObjectId

  // Snapshot of product at time of order
  productName String
  price       Float
  quantity    Int

  @@map("order_items")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

// ============================================
// CART MODEL
// ============================================
model CartItem {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String    @db.ObjectId

  product     Product   @relation(fields: [productId], references: [id])
  productId   String    @db.ObjectId

  quantity    Int       @default(1)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([userId, productId])  // One cart entry per product per user
  @@map("cart_items")
}

// ============================================
// REVIEW MODEL
// ============================================
model Review {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId

  user        User      @relation(fields: [userId], references: [id])
  userId      String    @db.ObjectId

  product     Product   @relation(fields: [productId], references: [id])
  productId   String    @db.ObjectId

  rating      Int       // 1-5 stars
  title       String?
  comment     String
  verified    Boolean   @default(false)  // Verified purchase

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([userId, productId])  // One review per product per user
  @@map("reviews")
}

// ============================================
// SESSION MODEL (for auth)
// ============================================
model Session {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionToken String   @unique
  userId       String   @db.ObjectId
  expires      DateTime

  @@map("sessions")
}
```

---

## API Routes Structure

```bash
frontend/app/api/
├── auth/
│   ├── register/route.ts    POST - Create new user
│   ├── login/route.ts       POST - Authenticate user
│   ├── logout/route.ts      POST - End session
│   └── me/route.ts          GET  - Get current user
│
├── products/
│   ├── route.ts             GET  - List products (with filters)
│   └── [id]/route.ts        GET  - Single product details
│
├── cart/
│   ├── route.ts             GET/POST - Get cart / Add item
│   └── [itemId]/route.ts    PATCH/DELETE - Update/Remove item
│
├── orders/
│   ├── route.ts             GET/POST - List orders / Create order
│   └── [id]/route.ts        GET - Order details
│
└── checkout/
    └── route.ts             POST - Process checkout
```

---

## Page Structure

``` bash
frontend/app/
├── page.tsx                      # Landing page
├── layout.tsx                    # Root layout
│
├── products/
│   ├── page.tsx                  # Product dashboard (public)
│   └── [id]/page.tsx             # Product details (public)
│
├── auth/
│   ├── login/page.tsx            # Login page
│   └── signup/page.tsx           # Signup page (move existing)
│
├── checkout/
│   └── page.tsx                  # Checkout (protected)
│
├── orders/
│   ├── page.tsx                  # Order history (protected)
│   └── [id]/page.tsx             # Order details (protected)
│
└── account/
    └── page.tsx                  # User account settings (protected)
```

---

## Authentication Flow

### Login with Redirect

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/checkout', '/orders', '/account'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session-token');

  // Check if accessing protected route without auth
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
```

### Buy Now Flow

```typescript
// components/BuyNowButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function BuyNowButton({ productId }: { productId: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleBuyNow = () => {
    if (isAuthenticated) {
      // Go directly to checkout with product
      router.push(`/checkout?product=${productId}`);
    } else {
      // Redirect to login, then to checkout
      router.push(`/auth/login?redirect=/checkout?product=${productId}`);
    }
  };

  return (
    <button onClick={handleBuyNow}>
      Buy Now
    </button>
  );
}
```

---

## Implementation Phases

### Phase 1: Backend Foundation

- [ ] Set up Prisma with MongoDB
- [ ] Create `.env` with DATABASE_URL
- [ ] Run `prisma generate` and `prisma db push`
- [ ] Seed database with sample products

### Phase 2: Authentication

- [ ] Implement register API route
- [ ] Implement login API route with JWT/session
- [ ] Create auth middleware
- [ ] Build login page UI
- [ ] Move signup form to `/auth/signup`

### Phase 3: Product Dashboard

- [ ] Create products API route
- [ ] Build product listing page
- [ ] Build product detail page
- [ ] Implement image matching by product ID

### Phase 4: Cart & Checkout

- [ ] Implement cart API routes
- [ ] Build cart UI component
- [ ] Create checkout page
- [ ] Implement "Buy Now" redirect flow

### Phase 5: Orders

- [ ] Implement order creation
- [ ] Build order history page
- [ ] Build order detail page
- [ ] Add order confirmation emails (optional)

---

## Environment Variables

```env
# .env
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/eleq?retryWrites=true&w=majority"

# Auth
JWT_SECRET="your-super-secret-jwt-key"
SESSION_COOKIE_NAME="eleq-session"

# Optional: Payment
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## Quick Commands

```bash
# Install Prisma
npm install prisma @prisma/client --w frontend

# Initialize Prisma with MongoDB
npx prisma init --datasource-provider mongodb

# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```
