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
├── categories/
│   └── route.ts             GET  - List all categories
│
├── cart/
│   ├── route.ts             GET/POST - Get cart / Add item
│   └── [itemId]/route.ts    PATCH/DELETE - Update/Remove item
│
├── orders/
│   ├── route.ts             GET/POST - List orders / Create order
│   └── [id]/route.ts        GET - Order details
│
├── reviews/
│   └── route.ts             GET/POST - List reviews / Create review
│
└── checkout/
    └── route.ts             POST - Process checkout
```

---

## API Endpoint Specifications

### Authentication Endpoints

---

#### `POST /api/auth/register`

Create a new user account.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe",
    "emailVerified": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
| ------ | --------- |
| 400 | `Invalid email format` |
| 400 | `Password must be at least 8 characters` |
| 409 | `Email already registered` |

---

#### `POST /api/auth/login`

Authenticate user and create session.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

**Headers Set:**

```json
Set-Cookie: eleq-session=<session-token>; HttpOnly; Secure; SameSite=Strict; Path=/
```

**Error Responses:**

| Status | Message |
| ------ | --------- |
| 400 | `Email and password are required` |
| 401 | `Invalid email or password` |

---

#### `POST /api/auth/logout`

End user session.

**Auth Required:** Yes

**Request Body:** None

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Headers Set:**

```json
Set-Cookie: eleq-session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0
```

---

#### `GET /api/auth/me`

Get current authenticated user.

**Auth Required:** Yes

**Success Response (200):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "emailVerified": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
| ------ | --------- |
| 401 | `Not authenticated` |

---

### Product Endpoints

---

#### `GET /api/products`

List all products with optional filtering.

**Auth Required:** No

**Query Parameters:**

| Parameter | Type | Description |
| --------- | ------ | ------------- |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12, max: 50) |
| `category` | string | Filter by category slug |
| `brand` | string | Filter by brand name |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `search` | string | Search in name and description |
| `sort` | string | Sort field: `price`, `-price`, `name`, `-createdAt` |
| `featured` | boolean | Filter featured products only |
| `status` | string | Filter by status: `ACTIVE`, `OUT_OF_STOCK` |

**Example Request:**

```json
GET /api/products?category=laptops&minPrice=500&maxPrice=1500&sort=-price&page=1&limit=12
```

**Success Response (200):**

```json
{
  "products": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "MacBook Pro 14\"",
      "slug": "macbook-pro-14",
      "description": "Apple M3 Pro chip, 18GB RAM, 512GB SSD",
      "price": 1999.99,
      "comparePrice": 2199.99,
      "brand": "Apple",
      "category": {
        "id": "507f1f77bcf86cd799439012",
        "name": "Laptops",
        "slug": "laptops"
      },
      "stock": 25,
      "status": "ACTIVE",
      "featured": true,
      "tags": ["apple", "laptop", "pro"],
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalItems": 45,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

#### `GET /api/products/[id]`

Get single product details.

**Auth Required:** No

**Path Parameters:**

| Parameter | Type | Description |
| --------- | ------ | ------------- |
| `id` | string | Product ID (MongoDB ObjectId) |

**Success Response (200):**

```json
{
  "product": {
    "id": "507f1f77bcf86cd799439011",
    "name": "MacBook Pro 14\"",
    "slug": "macbook-pro-14",
    "description": "Apple M3 Pro chip with 18GB unified memory...",
    "price": 1999.99,
    "comparePrice": 2199.99,
    "brand": "Apple",
    "category": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Laptops",
      "slug": "laptops"
    },
    "stock": 25,
    "sku": "MBP14-M3-512",
    "specs": {
      "Processor": "Apple M3 Pro",
      "RAM": "18GB",
      "Storage": "512GB SSD",
      "Display": "14.2\" Liquid Retina XDR"
    },
    "tags": ["apple", "laptop", "pro"],
    "status": "ACTIVE",
    "featured": true,
    "reviews": {
      "average": 4.7,
      "count": 128
    },
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-12T14:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
| ------ | --------- |
| 400 | `Invalid product ID` |
| 404 | `Product not found` |

---

### Category Endpoints

---

#### `GET /api/categories`

List all categories with optional hierarchy.

**Auth Required:** No

**Query Parameters:**

| Parameter | Type    | Description                                    |
|-----------|---------|------------------------------------------------|
| `tree`    | boolean | Return hierarchical structure (default: false) |

**Success Response (200) - Flat:**

```json
{
  "categories": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Laptops",
      "slug": "laptops",
      "description": "Portable computers",
      "productCount": 45
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "name": "Gaming Laptops",
      "slug": "gaming-laptops",
      "parentId": "507f1f77bcf86cd799439012",
      "productCount": 18
    }
  ]
}
```

**Success Response (200) - Tree:**

```json
{
  "categories": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Laptops",
      "slug": "laptops",
      "children": [
        {
          "id": "507f1f77bcf86cd799439013",
          "name": "Gaming Laptops",
          "slug": "gaming-laptops",
          "children": []
        }
      ]
    }
  ]
}
```

---

### Cart Endpoints

---

#### `GET /api/cart`

Get current user's cart.

**Auth Required:** Yes

**Success Response (200):**

```json
{
  "cart": {
    "items": [
      {
        "id": "507f1f77bcf86cd799439020",
        "product": {
          "id": "507f1f77bcf86cd799439011",
          "name": "MacBook Pro 14\"",
          "slug": "macbook-pro-14",
          "price": 1999.99,
          "stock": 25,
          "status": "ACTIVE"
        },
        "quantity": 1,
        "subtotal": 1999.99
      }
    ],
    "itemCount": 1,
    "subtotal": 1999.99
  }
}
```

---

#### `POST /api/cart`

Add item to cart.

**Auth Required:** Yes

**Request Body:**

```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 1
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Item added to cart",
  "cartItem": {
    "id": "507f1f77bcf86cd799439020",
    "productId": "507f1f77bcf86cd799439011",
    "quantity": 1
  }
}
```

**Error Responses:**

| Status | Message |

|--------|---------|
| 400 | `Product ID is required` |
| 400 | `Invalid quantity` |
| 404 | `Product not found` |
| 400 | `Product out of stock` |
| 400 | `Requested quantity exceeds available stock` |

---

#### `PATCH /api/cart/[itemId]`

Update cart item quantity.

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `itemId`  | string | Cart item ID|

**Request Body:**

```json
{
  "quantity": 2
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Cart updated",
  "cartItem": {
    "id": "507f1f77bcf86cd799439020",
    "quantity": 2
  }
}
```

**Error Responses:**

| Status | Message |
| -------- | --------- |
| 400 | `Invalid quantity` |
| 404 | `Cart item not found` |
| 400 | `Requested quantity exceeds available stock` |

---

#### `DELETE /api/cart/[itemId]`

Remove item from cart.

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `itemId`  | string | Cart item ID|

**Success Response (200):**

```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

**Error Responses:**

| Status | Message |

|--------|---------|
| 404 | `Cart item not found` |

---

### Checkout Endpoint

---

#### `POST /api/checkout`

Process checkout and create order.

**Auth Required:** Yes

**Request Body:**

```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card",
  "saveAddress": true
}
```

**Alternative - Direct Buy (single product):**

```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 1,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "id": "507f1f77bcf86cd799439030",
    "orderNumber": "ELQ-2024-001234",
    "items": [
      {
        "productName": "MacBook Pro 14\"",
        "price": 1999.99,
        "quantity": 1
      }
    ],
    "subtotal": 1999.99,
    "tax": 159.99,
    "shippingCost": 0,
    "total": 2159.98,
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "createdAt": "2024-01-15T14:30:00.000Z"
  },
  "paymentUrl": "https://checkout.stripe.com/..."
}
```

**Error Responses:**

| Status | Message |

|--------|---------|
| 400 | `Cart is empty` |
| 400 | `Shipping address is required` |
| 400 | `Product not available` |
| 400 | `Insufficient stock for [product name]` |

---

### Order Endpoints

---

#### `GET /api/orders`

List user's orders.

**Auth Required:** Yes

**Query Parameters:**

| Parameter | Type | Description |

|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | Filter by order status |

**Success Response (200):**

```json
{
  "orders": [
    {
      "id": "507f1f77bcf86cd799439030",
      "orderNumber": "ELQ-2024-001234",
      "total": 2159.98,
      "status": "DELIVERED",
      "paymentStatus": "PAID",
      "itemCount": 1,
      "createdAt": "2024-01-15T14:30:00.000Z",
      "deliveredAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 5,
    "totalPages": 1
  }
}
```

---

#### `GET /api/orders/[id]`

Get single order details.

**Auth Required:** Yes

**Path Parameters:**
| Parameter | Type | Description |

|-----------|------|-------------|
| `id` | string | Order ID |

**Success Response (200):**

```json
{
  "order": {
    "id": "507f1f77bcf86cd799439030",
    "orderNumber": "ELQ-2024-001234",
    "items": [
      {
        "id": "507f1f77bcf86cd799439031",
        "productId": "507f1f77bcf86cd799439011",
        "productName": "MacBook Pro 14\"",
        "price": 1999.99,
        "quantity": 1
      }
    ],
    "subtotal": 1999.99,
    "tax": 159.99,
    "shippingCost": 0,
    "total": 2159.98,
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "status": "DELIVERED",
    "paymentStatus": "PAID",
    "paymentMethod": "card",
    "createdAt": "2024-01-15T14:30:00.000Z",
    "paidAt": "2024-01-15T14:32:00.000Z",
    "shippedAt": "2024-01-17T09:00:00.000Z",
    "deliveredAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |

|--------|---------|
| 404 | `Order not found` |
| 403 | `Access denied` |

---

### Review Endpoints

---

#### `GET /api/reviews`

Get reviews for a product.

**Auth Required:** No

**Query Parameters:**

| Parameter | Type | Description |

|-----------|------|-------------|
| `productId` | string | Product ID (required) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `sort` | string | Sort: `-createdAt`, `rating`, `-rating` |

**Success Response (200):**

```json
{
  "reviews": [
    {
      "id": "507f1f77bcf86cd799439040",
      "user": {
        "fullName": "John D."
      },
      "rating": 5,
      "title": "Excellent laptop!",
      "comment": "Best purchase I've made. Fast, beautiful display...",
      "verified": true,
      "createdAt": "2024-01-18T16:00:00.000Z"
    }
  ],
  "summary": {
    "average": 4.7,
    "count": 128,
    "distribution": {
      "5": 89,
      "4": 25,
      "3": 10,
      "2": 3,
      "1": 1
    }
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 128,
    "totalPages": 13
  }
}
```

---

#### `POST /api/reviews`

Create a review for a product.

**Auth Required:** Yes

**Request Body:**

```json
{
  "productId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "title": "Excellent laptop!",
  "comment": "Best purchase I've made. Fast, beautiful display, great battery life."
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Review submitted",
  "review": {
    "id": "507f1f77bcf86cd799439040",
    "rating": 5,
    "title": "Excellent laptop!",
    "comment": "Best purchase I've made...",
    "verified": true,
    "createdAt": "2024-01-18T16:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |

|--------|---------|
| 400 | `Product ID is required` |
| 400 | `Rating must be between 1 and 5` |
| 400 | `Comment is required` |
| 404 | `Product not found` |
| 409 | `You have already reviewed this product` |

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
npm install prisma @prisma/client -w frontend

# Initialize Prisma with MongoDB
npx prisma init --datasource-provider mongodb

# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```
