# SnapCast 🎥

A production-ready, full-stack video sharing platform built with Next.js 16, featuring secure authentication, real-time video uploads to BunnyCDN, database integration, and advanced security with rate limiting. This platform enables users to upload, share, and manage video content with granular privacy controls.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Features

### Core Functionality
- 📹 **Video Upload & Streaming**: Upload videos directly to BunnyCDN with real-time progress tracking
- 🖼️ **Thumbnail Management**: Automatic thumbnail upload and CDN delivery
- 👁️ **View Tracking**: Intelligent view counting system with 3-second delay to prevent false counts
- 🔒 **Privacy Controls**: Toggle videos between public and private visibility
- 🗑️ **Video Management**: Delete videos with ownership verification
- 🔗 **Link Sharing**: Copy video links to clipboard with visual feedback
- 🔍 **Search & Filter**: Search videos by title with multiple sorting options (Most Viewed, Most Recent, Oldest First, Least Viewed)
- 📄 **Pagination**: Efficient video browsing with server-side pagination

### Authentication & Security
- 🔐 **Google OAuth Integration**: Secure sign-in with Better Auth
- 🛡️ **Rate Limiting**: Arcjet-powered rate limiting to prevent abuse (2 uploads per minute)
- 🚪 **Protected Routes**: Middleware-based authentication for all protected pages
- 👤 **Session Management**: Secure cookie-based sessions with automatic expiration
- 🔑 **Ownership Verification**: Server-side checks for video deletion and visibility updates

### User Experience
- 👥 **User Profiles**: View user-specific video collections
- 🎨 **Modern UI**: Custom design system with Tailwind CSS v4
- 📱 **Responsive Design**: Mobile-first approach with adaptive layouts
- ⚡ **Fast Navigation**: Optimized routing with Next.js App Router
- 🎭 **Empty States**: Helpful UI when no content is available
- 📊 **Video Cards**: Rich video previews with thumbnails, metadata, and duration

### Technical Features
- 🗄️ **Database ORM**: Type-safe queries with Drizzle ORM
- 🌐 **CDN Integration**: BunnyCDN for video streaming and thumbnail delivery
- 🔄 **Real-time Updates**: Automatic page revalidation after data mutations
- 🎯 **TypeScript**: End-to-end type safety
- 🧩 **Modular Architecture**: Clean separation of concerns with server actions
- 🔧 **Error Handling**: Comprehensive error handling with user-friendly messages

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Video Upload Flow](#-video-upload-flow)
- [Security Implementation](#-security-implementation)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Custom React components with client/server separation
- **Fonts**: Karla & Satoshi (Custom Google Fonts)

### Backend
- **Runtime**: Node.js (forced in middleware for Better Auth compatibility)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM**: [Drizzle ORM 0.45](https://orm.drizzle.team/)
- **Authentication**: [Better Auth 1.4](https://better-auth.com/)
- **CDN**: [BunnyCDN](https://bunnycdn.com/) (Video Stream & Storage)
- **Security**: [Arcjet](https://arcjet.com/) (Rate limiting & fingerprinting)

### Development Tools
- **Package Manager**: npm
- **Database Migrations**: Drizzle Kit
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode

## 🏗️ Architecture Overview

SnapCast follows a modern, scalable architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                        │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │   Pages    │  │ Components │  │  Client Actions     │  │
│  │  (TSX/JSX) │  │   (React)  │  │  (State Management) │  │
│  └────────────┘  └────────────┘  └─────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│                    Next.js Server (Edge + Node)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Middleware (Node.js Runtime)             │  │
│  │  • Authentication Check  • Session Validation         │  │
│  │  • Route Protection      • Request Logging            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   App Router (RSC)                    │  │
│  │  • Server Components  • Streaming                     │  │
│  │  • Data Fetching      • Metadata Generation           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Server Actions (lib/actions)             │  │
│  │  • Video Operations   • User Management               │  │
│  │  • Database Queries   • CDN Interactions              │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────┬─────────────────────────┬────────────────────────┘
            │                         │
┌───────────▼──────────┐  ┌──────────▼──────────┐
│  PostgreSQL (Neon)   │  │  BunnyCDN Services  │
│  ┌────────────────┐  │  │  ┌──────────────┐  │
│  │ Drizzle ORM    │  │  │  │ Video Stream │  │
│  │ Schema & Rels  │  │  │  │ Storage API  │  │
│  └────────────────┘  │  │  └──────────────┘  │
│  • Users             │  │  • Video Files      │
│  • Videos            │  │  • Thumbnails       │
│  • Sessions          │  │  • CDN Delivery     │
│  • Accounts          │  │                     │
└──────────────────────┘  └─────────────────────┘
            │
┌───────────▼──────────┐
│  External Services   │
│  • Google OAuth      │
│  • Arcjet Security   │
│  • Better Auth       │
└──────────────────────┘
```

### Key Architectural Decisions

1. **Server-First Approach**: All data mutations happen via Server Actions for enhanced security
2. **CDN-First Media**: All video and thumbnail assets served via BunnyCDN for global performance
3. **Type-Safe Database**: Drizzle ORM provides full TypeScript support with zero runtime overhead
4. **Middleware Protection**: Authentication checks at the edge before reaching application code
5. **Rate Limiting**: Arcjet fingerprinting prevents abuse at the infrastructure level

## 📁 Project Structure

```
loom/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (unprotected)
│   │   └── sign-in/
│   │       └── page.tsx          # Google OAuth sign-in page
│   ├── (root)/                   # Main application (protected)
│   │   ├── layout.tsx            # Protected layout with navbar
│   │   ├── page.tsx              # Home page with public video grid
│   │   ├── upload/
│   │   │   └── page.tsx          # Video upload interface
│   │   ├── videos/
│   │   │   └── [videoId]/
│   │   │       └── page.tsx      # Video player & details page
│   │   └── profile/
│   │       └── [id]/
│   │           └── page.tsx      # User profile with video collection
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts      # Better Auth catch-all endpoint
│   ├── layout.tsx                # Root layout with fonts & metadata
│   └── globals.css               # Tailwind config & custom styles
│
├── components/                   # Reusable React components
│   ├── DropdownList.tsx          # Filter dropdown (Most Viewed, etc.)
│   ├── EmptyState.tsx            # Empty state UI
│   ├── FileInput.tsx             # File upload input with drag & drop
│   ├── FormField.tsx             # Form input wrapper
│   ├── header.tsx                # Page header with title/subtitle
│   ├── navbar.tsx                # Navigation bar with user menu
│   ├── RecordString.tsx          # Video recording component
│   ├── VideoCard.tsx             # Video thumbnail card with metadata
│   ├── VideoDetailHeader.tsx     # Video page header with actions
│   ├── VideoPlayer.tsx           # BunnyCDN iframe player
│   └── VideoViewTracker.tsx      # Client-side view tracking
│
├── constants/
│   └── index.ts                  # App-wide constants & dummy data
│
├── drizzle/                      # Database layer
│   ├── db.ts                     # Database client instance
│   ├── schema.ts                 # Table schemas & relations
│   └── migrations/               # SQL migration files (auto-generated)
│
├── fonts/
│   └── font.ts                   # Custom font configuration
│
├── lib/                          # Core business logic
│   ├── actions/
│   │   └── video.ts              # Server actions for video operations
│   ├── hooks/
│   │   ├── useFileInput.ts       # File input state management
│   │   └── useScreenRecording.ts # Screen recording logic
│   ├── arcjet.ts                 # Arcjet security client
│   ├── auth.ts                   # Better Auth server config
│   ├── auth-client.ts            # Better Auth client config
│   └── utils.ts                  # Helper functions & utilities
│
├── public/
│   └── assets/
│       ├── icons/                # SVG icons
│       ├── images/               # User images & static assets
│       └── samples/              # Sample thumbnails
│
├── drizzle.config.ts             # Drizzle Kit configuration
├── middleware.ts                 # Route protection middleware
├── next.config.ts                # Next.js configuration
├── index.d.ts                    # Global TypeScript declarations
├── package.json                  # Dependencies & scripts
└── tsconfig.json                 # TypeScript compiler options
```

### Component Architecture

#### Server Components (Default)
- `app/(root)/page.tsx` - Fetches videos server-side
- `app/(root)/videos/[videoId]/page.tsx` - Server-side video data fetching
- `app/(root)/profile/[id]/page.tsx` - User profile data fetching

#### Client Components ('use client')
- `VideoViewTracker` - Tracks video views after 3 seconds
- `VideoDetailHeader` - Handles delete/visibility toggle
- `VideoCard` - Interactive video cards with hover states
- `navbar` - User menu dropdown
- All form components for interactivity

## 📋 Prerequisites

Before you begin, ensure you have:

### Required
- **Node.js 18+** and **npm** installed
- **PostgreSQL database** (we recommend [Neon](https://neon.tech/) for serverless PostgreSQL)
- **Google Cloud Console** project for OAuth credentials
- **BunnyCDN account** with:
  - Video Stream library created
  - Storage zone for thumbnails
  - API keys for both services
- **Arcjet account** for rate limiting (optional but recommended)

### Development Tools
- Git for version control
- Code editor (VS Code recommended)
- Terminal/Command line access

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/DevSsChar/SnapCast.git
cd loom
```

### Step 2: Install Dependencies

```bash
npm install
```

**What gets installed:**

**Core Dependencies:**
- `next@16.0.8` - React framework with App Router
- `react@19.2.1` & `react-dom@19.2.1` - React library
- `typescript@5.9.3` - TypeScript compiler

**Database & ORM:**
- `drizzle-orm@0.45.0` - TypeScript-first ORM
- `drizzle-kit@0.31.8` - Database migration tool
- `@neondatabase/serverless@1.0.2` - Neon PostgreSQL driver
- `pg@8.16.3` - PostgreSQL client

**Authentication & Security:**
- `better-auth@1.4.6` - Modern authentication library
- `@arcjet/next@1.0.0-beta.15` - Rate limiting & security

**Styling:**
- `tailwindcss@4.1.17` - Utility-first CSS framework
- `@tailwindcss/postcss@4` - PostCSS plugin
- `clsx@2.1.1` & `tailwind-merge@3.4.0` - Class name utilities

**Utilities:**
- `dotenv@17.2.3` - Environment variable loading

### Step 3: Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# ========================================
# Database Configuration
# ========================================
DATABASE_URL=postgresql://username:password@hostname:5432/database?sslmode=require

# ========================================
# Authentication (Better Auth)
# ========================================
BETTER_AUTH_SECRET=your_32_character_random_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ========================================
# OAuth Providers
# ========================================
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ========================================
# BunnyCDN Configuration
# ========================================
BUNNY_LIBRARY_ID=your_bunny_library_id
BUNNY_STREAM_ACCESS_KEY=your_stream_api_key
BUNNY_STORAGE_ACCESS_KEY=your_storage_api_key

# ========================================
# Security (Optional but Recommended)
# ========================================
ARCJET_KEY=ajkey_your_arcjet_key
```

## 🔐 Environment Variables Explained

### Database Configuration

#### `DATABASE_URL`
Your PostgreSQL connection string. 

**Format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require`

**How to get it:**
1. Sign up at [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string from dashboard
4. Ensure it includes `?sslmode=require` for secure connections

**Example:**
```
postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
```

### Authentication Configuration

#### `BETTER_AUTH_SECRET`
A random secret key used to encrypt session cookies and tokens.

**How to generate:**
```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Security Notes:**
- Must be at least 32 characters
- Keep this secret and never commit to Git
- Different secret for production vs development
- Changing this invalidates all active sessions

#### `NEXT_PUBLIC_BASE_URL`
The base URL of your application (with protocol, no trailing slash).

- **Development:** `http://localhost:3000`
- **Production:** `https://your-domain.com`

**Important:** This is used for OAuth callbacks and must match exactly.

### Google OAuth Configuration

#### `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`

**How to obtain:**

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add **Authorized JavaScript origins:**
     - `http://localhost:3000` (development)
     - `https://your-domain.com` (production)
   - Add **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)

4. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your `.env` file

### BunnyCDN Configuration

#### `BUNNY_LIBRARY_ID`
Your BunnyCDN Video Stream library ID.

**How to get:**
1. Login to [BunnyCDN Dashboard](https://panel.bunnycdn.com/)
2. Go to "Stream" → "Libraries"
3. Create a new library or select existing
4. Copy the Library ID (numeric value)

#### `BUNNY_STREAM_ACCESS_KEY`
API key for BunnyCDN Video Stream operations.

**How to get:**
1. In your Stream library
2. Go to "API" tab
3. Copy the API Key
4. This key allows video upload, management, and deletion

#### `BUNNY_STORAGE_ACCESS_KEY`
API key for BunnyCDN Storage (for thumbnails).

**How to get:**
1. Go to "Storage" in BunnyCDN dashboard
2. Create a storage zone or select existing
3. Go to "FTP & API Access"
4. Copy the Storage API Password
5. This key allows thumbnail uploads to storage

**Storage Setup:**
- Create a folder named `thumbnails` in your storage zone
- This is where all video thumbnails will be uploaded
- Configure CDN hostname for thumbnail delivery

### Arcjet Security (Optional)

#### `ARCJET_KEY`
API key for Arcjet rate limiting and security features.

**How to get:**
1. Sign up at [Arcjet](https://arcjet.com/)
2. Create a new project
3. Copy the API key
4. This enables rate limiting (2 uploads per minute per user)

**If not using Arcjet:**
- Comment out rate limiting code in `lib/actions/video.ts`
- Remove `validateWithArcjet()` calls from server actions

### 4. Configure Drizzle ORM

The `drizzle.config.ts` file is already configured:

```typescript
import 'dotenv/config';
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({path: './.env'}); // Load environment variables from .env file

export default defineConfig({
  out: './drizzle/migrations',      // Where migration files will be stored
  schema: './drizzle/schema.ts',    // Your database schema definition
  dialect: 'postgresql',             // Database type
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // Connection string from .env
  },
});
```

**What this does:**
- Tells Drizzle Kit where your schema is located
- Configures the output directory for migration files
- Sets up the database connection using your environment variable

### 5. Set Up Database Schema

The schema is defined in `drizzle/schema.ts` with the following tables:

**User Table** - Stores user information
```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),           // Unique user ID
  name: text("name").notNull(),          // User's display name
  email: text("email").notNull().unique(), // Email (must be unique)
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),                  // Profile picture URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

**Session Table** - Manages user sessions
```typescript
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(), // When session expires
  token: text("token").notNull().unique(),      // Session token
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  // ... other fields
});
```

**Account Table** - Stores OAuth provider information
```typescript
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),    // Provider's user ID
  providerId: text("provider_id").notNull(),  // e.g., "google"
  userId: text("user_id").references(() => user.id),
  accessToken: text("access_token"),          // OAuth access token
  refreshToken: text("refresh_token"),        // OAuth refresh token
  // ... other fields
});
```

**Verification Table** - Email verification codes
```typescript
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),  // Email address
  value: text("value").notNull(),           // Verification code
  expiresAt: timestamp("expires_at").notNull(),
});
```

### 6. Push Database Schema

Run the following command to create tables in your database:

```bash
npx drizzle-kit push
```

**What this does:**
- Reads your `drizzle/schema.ts` file
- Connects to your database using `DATABASE_URL`
- Creates all tables (user, session, account, verification)
- Sets up indexes, foreign keys, and constraints
- No migration files needed for initial setup

**Alternative: Generate and Run Migrations**

For production or team environments, use migrations:

```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate
```

### 7. Configure Authentication

The `lib/auth.ts` file sets up Better Auth:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { schema } from "@/drizzle/schema";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  // Connect Better Auth to your database using Drizzle
  database: drizzleAdapter(db, {
    provider: 'pg',  // PostgreSQL provider
    schema           // Your database schema
  }),
  
  // Configure OAuth providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  },
  
  // Enable Next.js cookie handling
  plugins: [nextCookies()],
  
  // Base URL for callbacks
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
});
```

**Line-by-line explanation:**

- `betterAuth()`: Initializes the authentication system
- `drizzleAdapter()`: Connects Better Auth to your Drizzle database
- `socialProviders`: Configures Google OAuth with your credentials
- `nextCookies()`: Enables secure cookie-based sessions in Next.js
- `baseUrl`: Required for OAuth callback URLs

### 8. Set Up Database Connection

The `drizzle/db.ts` file creates your database client:

```typescript
import { drizzle } from 'drizzle-orm/neon-http';

// Create database instance using Neon's HTTP driver
const db = drizzle(process.env.DATABASE_URL!);

export { db };
```

**What this does:**
- Uses Neon's serverless HTTP driver (no connection pooling needed)
- Connects to your PostgreSQL database
- Exports `db` for use throughout your application

### 9. Configure Middleware for Route Protection

The `middleware.ts` file protects routes:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

// Force Node.js runtime (Better Auth requires it)
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  // Get current session from Better Auth
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Redirect to sign-in if no session exists
  if (!session) {
    return NextResponse.redirect(
      new URL('/sign-in', request.url)
    );
  }
  
  // Allow request to continue if authenticated
  return NextResponse.next();
}

// Apply middleware to all routes except these
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)"
  ]
};
```

**Line-by-line explanation:**

- `runtime = 'nodejs'`: Required because Better Auth uses Node.js APIs
- `auth.api.getSession()`: Checks if user has valid session
- `NextResponse.redirect()`: Sends user to sign-in page if not authenticated
- `matcher`: Array of routes to protect (excludes API routes, static files, sign-in page, and assets)

### Step 4: Run Database Migrations

```bash
npx drizzle-kit push
```

This command:
- Reads your schema from `drizzle/schema.ts`
- Connects to your database using `DATABASE_URL`
- Creates all required tables and relations
- Sets up indexes and constraints

**Expected output:**
```
✔ Pulling schema from database...
✔ Changes detected
✔ Applying changes...
✓ Tables created successfully
```

### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**Development server features:**
- Hot module replacement (HMR)
- Fast refresh for React components
- Automatic TypeScript compilation
- Error overlay in browser

## 🗄️ Database Schema

SnapCast uses Drizzle ORM with PostgreSQL for type-safe database operations. The schema includes four main tables with proper relations and constraints.

### Entity Relationship Diagram

```
┌─────────────────┐
│      user       │
│─────────────────│
│ id (PK)        │
│ name           │◄────────┐
│ email (unique) │         │
│ emailVerified  │         │
│ image          │         │
│ createdAt      │         │
│ updatedAt      │         │
└────────┬────────┘         │
         │                  │
         │ 1:N              │ N:1
         │                  │
┌────────▼────────┐    ┌───┴──────────┐
│    session      │    │    videos    │
│─────────────────│    │──────────────│
│ id (PK)        │    │ id (PK)     │
│ expiresAt      │    │ title       │
│ token (unique) │    │ description │
│ userId (FK)    │    │ videoUrl    │
│ ipAddress      │    │ videoId     │
│ userAgent      │    │ thumbnailUrl│
│ createdAt      │    │ visibility  │
│ updatedAt      │    │ userId (FK) │
└─────────────────┘    │ views       │
                       │ duration    │
┌─────────────────┐    │ createdAt   │
│    account      │    │ updatedAt   │
│─────────────────│    └──────────────┘
│ id (PK)        │
│ accountId      │
│ providerId     │         ┌──────────────────┐
│ userId (FK)    │◄────┐   │  verification    │
│ accessToken    │     │   │──────────────────│
│ refreshToken   │     │   │ id (PK)         │
│ idToken        │     │   │ identifier      │
│ scope          │     │   │ value           │
│ expiresAt      │     │   │ expiresAt       │
│ createdAt      │     │   │ createdAt       │
│ updatedAt      │     └───│ userId (FK)     │
└─────────────────┘         └──────────────────┘
```

### Table Definitions

#### `user` Table
Stores user account information.

```typescript
{
  id: text("id").primaryKey(),                    // Unique user identifier
  name: text("name").notNull(),                   // Display name
  email: text("email").notNull().unique(),        // Email (unique constraint)
  emailVerified: boolean("email_verified")        // Email verification status
    .default(false).notNull(),
  image: text("image"),                           // Profile picture URL
  createdAt: timestamp("created_at")              // Account creation time
    .defaultNow().notNull(),
  updatedAt: timestamp("updated_at")              // Last update time
    .defaultNow().notNull()
}
```

**Indexes:**
- Primary key on `id`
- Unique index on `email`

#### `session` Table
Manages user authentication sessions.

```typescript
{
  id: text("id").primaryKey(),                    // Session identifier
  expiresAt: timestamp("expires_at").notNull(),   // Expiration timestamp
  token: text("token").notNull().unique(),        // Session token (unique)
  userId: text("user_id").notNull()               // Foreign key to user
    .references(() => user.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),                  // Client IP address
  userAgent: text("user_agent"),                  // Browser user agent
  createdAt: timestamp("created_at")              // Session creation
    .defaultNow().notNull(),
  updatedAt: timestamp("updated_at")              // Last activity
    .defaultNow().notNull()
}
```

**Indexes:**
- Primary key on `id`
- Unique index on `token`
- Index on `userId` for fast lookups

**Relations:**
- Cascading delete: Deleting a user removes all their sessions

#### `account` Table
Stores OAuth provider information.

```typescript
{
  id: text("id").primaryKey(),                    // Account record ID
  accountId: text("account_id").notNull(),        // Provider's user ID
  providerId: text("provider_id").notNull(),      // Provider name (google)
  userId: text("user_id").notNull()               // Foreign key to user
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),              // OAuth access token
  refreshToken: text("refresh_token"),            // OAuth refresh token
  idToken: text("id_token"),                      // OAuth ID token
  accessTokenExpiresAt: timestamp("..."),         // Access token expiry
  refreshTokenExpiresAt: timestamp("..."),        // Refresh token expiry
  scope: text("scope"),                           // OAuth scopes granted
  createdAt: timestamp("created_at")              // Link creation
    .defaultNow().notNull(),
  updatedAt: timestamp("updated_at")              // Last token refresh
    .defaultNow().notNull()
}
```

**Indexes:**
- Primary key on `id`
- Index on `userId` for user lookup

**Relations:**
- Cascading delete: Removing user removes OAuth accounts

#### `videos` Table
Stores video metadata and settings.

```typescript
{
  id: text("id").primaryKey(),                    // Database video ID
  title: text("title").notNull(),                 // Video title
  description: text("description").notNull(),     // Video description
  videoUrl: text("video_url").notNull(),          // BunnyCDN embed URL
  videoId: text("video_id").notNull(),            // BunnyCDN video GUID
  thumbnailUrl: text("thumbnail_url").notNull(),  // Thumbnail CDN URL
  visibility: text("visibility")                  // public | private
    .$type<"public" | "private">().notNull(),
  userId: text("user_id").notNull()               // Video owner
    .references(() => user.id, { onDelete: "cascade" }),
  views: integer("views").notNull().default(0),   // View count
  duration: integer("duration"),                  // Duration in seconds
  createdAt: timestamp("created_at")              // Upload time
    .notNull().defaultNow(),
  updatedAt: timestamp("updated_at")              // Last modification
    .notNull().defaultNow()
}
```

**Indexes:**
- Primary key on `id`
- Index on `userId` for user videos lookup
- Index on `visibility` for filtering public videos
- Index on `createdAt` for sorting

**Relations:**
- Cascading delete: Deleting user removes all their videos

#### `verification` Table
Email verification codes.

```typescript
{
  id: text("id").primaryKey(),                    // Verification record ID
  identifier: text("identifier").notNull(),       // Email being verified
  value: text("value").notNull(),                 // Verification code
  expiresAt: timestamp("expires_at").notNull(),   // Code expiration
  createdAt: timestamp("created_at")              // Code creation
    .defaultNow().notNull()
}
```

### Database Operations

#### Common Queries

**Get all public videos with user info:**
```typescript
const videos = await db
  .select({
    video: videos,
    user: { id: user.id, name: user.name, image: user.image }
  })
  .from(videos)
  .leftJoin(user, eq(videos.userId, user.id))
  .where(eq(videos.visibility, 'public'))
  .orderBy(desc(videos.createdAt))
  .limit(8);
```

**Increment video views:**
```typescript
await db
  .update(videos)
  .set({ views: sql`${videos.views} + 1` })
  .where(eq(videos.id, videoId));
```

**Get user's videos (including private if owner):**
```typescript
const isOwner = userId === currentUserId;
const conditions = [
  eq(videos.userId, userId),
  !isOwner && eq(videos.visibility, 'public')
].filter(Boolean);

const userVideos = await db
  .select()
  .from(videos)
  .where(and(...conditions));
```

## 🔒 Authentication Flow

SnapCast uses **Better Auth** with Google OAuth for secure authentication.

### Architecture

```
┌──────────────┐
│   Browser    │
│ ┌──────────┐ │     1. Click "Sign in with Google"
│ │ Sign-in  │ ├────────────────────────────────────────┐
│ │  Button  │ │                                         │
│ └──────────┘ │                                         ▼
└──────────────┘              ┌──────────────────────────────────┐
                              │  Next.js Middleware              │
                              │  /api/auth/[...all]/route.ts     │
       ▲                      └──────────┬───────────────────────┘
       │                                 │ 2. Redirect to Google
       │                                 ▼
       │                      ┌──────────────────────────────────┐
       │                      │  Google OAuth Consent Screen     │
       │                      │  - Request email & profile       │
       │                      │  - User approves                 │
       │                      └──────────┬───────────────────────┘
       │                                 │ 3. Callback with code
       │                                 ▼
       │                      ┌──────────────────────────────────┐
       │                      │  Better Auth Processing          │
       │                      │  - Exchange code for tokens      │
       │                      │  - Fetch user profile            │
       │                      └──────────┬───────────────────────┘
       │                                 │
       │                                 ▼
       │                      ┌──────────────────────────────────┐
       │                      │  Database Operations (Drizzle)   │
       │                      │  1. Upsert user record           │
       │                      │  2. Create/update account        │
       │                      │  3. Create session               │
       │                      └──────────┬───────────────────────┘
       │                                 │
       │                                 ▼
       │                      ┌──────────────────────────────────┐
       │                      │  Set Session Cookie              │
       │  4. Redirect home    │  - httpOnly: true                │
       │     with session     │  - secure: true (prod)           │
       │                      │  - sameSite: lax                 │
       └──────────────────────┤  - expires: 30 days              │
                              └──────────────────────────────────┘
```

### Authentication Implementation

#### 1. Better Auth Configuration (`lib/auth.ts`)

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { schema } from "@/drizzle/schema";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  // Database adapter connects Better Auth to Drizzle
  database: drizzleAdapter(db, {
    provider: 'pg',      // PostgreSQL
    schema               // Our database schema
  }),
  
  // OAuth providers configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  },
  
  // Enable Next.js cookie integration
  plugins: [nextCookies()],
  
  // Base URL for OAuth callbacks
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
});
```

**What this does:**
- Integrates with Drizzle ORM for database operations
- Configures Google as OAuth provider
- Enables secure cookie-based sessions
- Sets up OAuth callback URLs automatically

#### 2. Client-Side Auth (`lib/auth-client.ts`)

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
});
```

**Usage in components:**
```typescript
const { data: session } = authClient.useSession();
const { signOut } = authClient;

// Sign out
await signOut();
```

#### 3. Middleware Protection (`middleware.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

// Force Node.js runtime (Better Auth requires Node.js APIs)
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  // Check for valid session
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Redirect unauthenticated users to sign-in
  if (!session) {
    return NextResponse.redirect(
      new URL('/sign-in', request.url)
    );
  }
  
  // Allow authenticated requests
  return NextResponse.next();
}

// Protect all routes except:
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)"
  ]
};
```

**What this protects:**
- ✅ `/` - Home page
- ✅ `/upload` - Upload page
- ✅ `/videos/:id` - Video pages
- ✅ `/profile/:id` - Profile pages
- ❌ `/sign-in` - Public (excluded)
- ❌ `/api/*` - API routes (handled separately)
- ❌ `/assets/*` - Static assets (excluded)

#### 4. Sign-In Page (`app/(auth)/sign-in/page.tsx`)

```typescript
import { authClient } from '@/lib/auth-client';

const SignInPage = () => {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',  // Redirect after sign-in
    });
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
};
```

### Session Management

**Session Lifecycle:**

1. **Creation:** When user signs in via Google OAuth
2. **Storage:** Stored in `session` table with expiration
3. **Cookie:** Session token stored in httpOnly cookie
4. **Validation:** Checked on every protected route request
5. **Renewal:** Automatically renewed on activity
6. **Expiration:** 30 days of inactivity (configurable)

**Getting Session in Server Components:**

```typescript
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const session = await auth.api.getSession({
  headers: await headers()
});

const userId = session?.user?.id;
```

**Getting Session in Client Components:**

```typescript
'use client'
import { authClient } from '@/lib/auth-client';

const { data: session } = authClient.useSession();
const userId = session?.user?.id;
```

### Security Features

1. **Session Tokens:** Cryptographically secure random tokens
2. **HttpOnly Cookies:** Prevents XSS attacks
3. **Secure Flag:** HTTPS-only in production
4. **SameSite:** CSRF protection
5. **IP Tracking:** Session bound to IP address
6. **User Agent:** Detects session hijacking
7. **Automatic Expiry:** Stale sessions cleaned up

## Project Structure

```
loom/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages (sign-in)
│   ├── (root)/            # Protected pages (videos, profile)
│   ├── api/               # API routes
│   ├── globals.css        # Global styles & Tailwind config
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── constants/             # App constants & dummy data
├── drizzle/              # Database layer
│   ├── db.ts             # Database client
│   ├── schema.ts         # Table definitions
│   └── migrations/       # SQL migration files (generated)
├── fonts/                # Custom font configurations
├── lib/                  # Utility libraries
│   ├── auth.ts           # Better Auth server config
│   └── auth-client.ts    # Better Auth client config
├── public/               # Static assets
│   └── assets/           # Icons, images, samples
├── drizzle.config.ts     # Drizzle Kit configuration
├── middleware.ts         # Route protection
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Key Files Explained

### Database Layer

- **`drizzle/schema.ts`**: Defines your database tables using Drizzle ORM
- **`drizzle/db.ts`**: Creates database connection instance
- **`drizzle.config.ts`**: Configures Drizzle Kit CLI tool

### Authentication

- **`lib/auth.ts`**: Server-side Better Auth configuration
- **`lib/auth-client.ts`**: Client-side authentication methods
- **`middleware.ts`**: Route protection logic
- **`app/api/auth/[...all]/route.ts`**: Catch-all API route for auth endpoints

### UI Components

- **`components/navbar.tsx`**: Navigation bar with user menu
- **`components/header.tsx`**: Page headers with titles
- **`components/VideoCard.tsx`**: Video thumbnail cards
- **`app/globals.css`**: Custom Tailwind utilities and design system

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint

# Drizzle commands
npx drizzle-kit push      # Push schema to database (no migrations)
npx drizzle-kit generate  # Generate migration files
npx drizzle-kit migrate   # Run pending migrations
npx drizzle-kit studio    # Open Drizzle Studio (database GUI)
```

## Database Management

### View Database with Drizzle Studio

```bash
npx drizzle-kit studio
```

Opens a browser-based GUI at `https://local.drizzle.studio` to:
- View and edit table data
- Run SQL queries
- Inspect table schemas
- Test database operations

### Making Schema Changes

1. Edit `drizzle/schema.ts` to add/modify tables
2. Generate migration: `npx drizzle-kit generate`
3. Review migration files in `drizzle/migrations/`
4. Apply migration: `npx drizzle-kit migrate`

## 📹 Video Upload Flow

SnapCast implements a multi-step video upload process with BunnyCDN integration.

### Upload Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Client (Browser)                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. User Selects Video File                         │    │
│  │     - File validation (size, type)                  │    │
│  │     - Thumbnail selection/upload                    │    │
│  │     - Form fields (title, description, visibility)  │    │
│  └────────────────┬────────────────────────────────────┘    │
│                   │                                           │
│                   ▼                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  2. Request Upload URLs (Server Action)             │    │
│  │     getVideoUploadUrl() → video URL + videoId       │    │
│  │     getThumbnailUploadUrl() → thumbnail URL + CDN   │    │
│  └────────────────┬────────────────────────────────────┘    │
└───────────────────┼───────────────────────────────────────────┘
                    │
┌───────────────────▼───────────────────────────────────────────┐
│              Next.js Server (Server Actions)                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  3. Create Video Resource on BunnyCDN               │    │
│  │     POST /library/{libraryId}/videos                │    │
│  │     Response: { guid, uploadUrl }                   │    │
│  └────────────────┬────────────────────────────────────┘    │
│                   │                                           │
│                   ▼                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  4. Return Upload Endpoints to Client               │    │
│  │     - Video upload URL                              │    │
│  │     - Thumbnail upload URL                          │    │
│  │     - BunnyCDN access keys                          │    │
│  └────────────────┬────────────────────────────────────┘    │
└───────────────────┼───────────────────────────────────────────┘
                    │
┌───────────────────▼───────────────────────────────────────────┐
│                    Client (Browser)                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  5. Direct Upload to BunnyCDN                       │    │
│  │     PUT video to upload URL with progress tracking  │    │
│  │     PUT thumbnail to storage URL                    │    │
│  └────────────────┬────────────────────────────────────┘    │
│                   │                                           │
│                   ▼                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  6. Save Metadata (Server Action)                   │    │
│  │     saveVideoDetails() with all metadata            │    │
│  └────────────────┬────────────────────────────────────┘    │
└───────────────────┼───────────────────────────────────────────┘
                    │
┌───────────────────▼───────────────────────────────────────────┐
│              Next.js Server (Server Actions)                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  7. Update BunnyCDN Video Metadata                  │    │
│  │     POST /library/{libraryId}/videos/{videoId}      │    │
│  │     - Set title & description                       │    │
│  └────────────────┬────────────────────────────────────┘    │
│                   │                                           │
│                   ▼                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  8. Rate Limiting Check (Arcjet)                    │    │
│  │     - Fingerprint user                              │    │
│  │     - Check: Max 2 uploads per minute               │    │
│  └────────────────┬────────────────────────────────────┘    │
│                   │                                           │
│                   ▼                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  9. Save to Database (Drizzle ORM)                  │    │
│  │     INSERT INTO videos VALUES (...)                 │    │
│  │     - videoId, title, thumbnailUrl, visibility      │    │
│  │     - userId, videoUrl, createdAt                   │    │
│  └────────────────┬────────────────────────────────────┘    │
│                   │                                           │
│                   ▼                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  10. Revalidate Paths                               │    │
│  │      - Invalidate / (home page cache)               │    │
│  │      - Trigger re-fetch on next visit               │    │
│  └────────────────┬────────────────────────────────────┘    │
└───────────────────┼───────────────────────────────────────────┘
                    │
┌───────────────────▼───────────────────────────────────────────┐
│                    Client (Browser)                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  11. Success! Redirect to Home                      │    │
│  │      - Video appears in public library              │    │
│  │      - BunnyCDN processes video for streaming       │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

### Implementation Details

#### Step 1: Get Upload URLs (`lib/actions/video.ts`)

```typescript
export const getVideoUploadUrl = withErrorHandling(async () => {
  await getSessionUserId();  // Verify authentication

  // Create video resource on BunnyCDN
  const videoResponse = await apiFetch<BunnyVideoResponse>(
    `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos`,
    {
      method: "POST",
      bunnyType: "stream",
      body: { title: 'Temporary Title', collectionId: '' }
    }
  );

  const uploadUrl = `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoResponse.guid}`;

  return {
    videoId: videoResponse.guid,  // BunnyCDN video ID
    uploadUrl,                     // Direct upload endpoint
    accessKey: ACCESS_KEYS.streamAccessKey,
  };
});

export const getThumbnailUploadUrl = withErrorHandling(async (videoId: string) => {
  await getSessionUserId();
  
  const filename = `${Date.now()}-${videoId}-thumbnail`;
  const uploadUrl = `${THUMBNAIL_STORAGE_BASE_URL}/thumbnails/${filename}`;
  const cdnUrl = `${THUMBNAIL_CDN_URL}/thumbnails/${filename}`;
  
  return {
    uploadUrl,   // Where to PUT the thumbnail
    cdnUrl,      // Public URL for serving
    accessKey: ACCESS_KEYS.storageAccessKey,
  };
});
```

#### Step 2: Client-Side Upload (Simplified)

```typescript
// Get upload URLs
const { videoId, uploadUrl, accessKey } = await getVideoUploadUrl();
const thumbnailData = await getThumbnailUploadUrl(videoId);

// Upload video directly to BunnyCDN
const videoUpload = await fetch(uploadUrl, {
  method: 'PUT',
  body: videoFile,
  headers: {
    'AccessKey': accessKey,
    'Content-Type': 'application/octet-stream'
  }
});

// Upload thumbnail
const thumbnailUpload = await fetch(thumbnailData.uploadUrl, {
  method: 'PUT',
  body: thumbnailFile,
  headers: {
    'AccessKey': thumbnailData.accessKey,
    'Content-Type': 'image/jpeg'
  }
});

// Save metadata
await saveVideoDetails({
  videoId,
  title,
  description,
  thumbnailUrl: thumbnailData.cdnUrl,
  visibility,
  // ... other fields
});
```

#### Step 3: Save Video Metadata

```typescript
export const saveVideoDetails = withErrorHandling(async (
  videoDetails: VideoDetails
) => {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("User ID not found");

  // Rate limiting (2 uploads per minute)
  await validateWithArcjet(userId);

  // Update BunnyCDN video metadata
  await apiFetch(
    `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoDetails.videoId}`,
    {
      method: "POST",
      bunnyType: "stream",
      body: {
        title: videoDetails.title,
        description: videoDetails.description,
      }
    }
  );

  // Save to database
  await db.insert(videos).values({
    ...videoDetails,
    visibility: videoDetails.visibility as "public" | "private",
    videoUrl: `${BUNNY.EMBED_URL}/${BUNNY_LIBRARY_ID}/${videoDetails.videoId}`,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Revalidate home page to show new video
  revalidatePaths([`/`]);

  return { videoId: videoDetails.videoId }; 
});
```

### File Validation

```typescript
// Maximum file sizes
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;     // 500 MB
const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;  // 10 MB

// Allowed video formats
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',  // .mov
];

// Allowed thumbnail formats
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
```

## 🛡️ Security Implementation

SnapCast implements multiple security layers to protect against abuse and unauthorized access.

### 1. Rate Limiting with Arcjet

```typescript
import arcjet from '@arcjet/next';
import { fixedWindow } from '@arcjet/next';

const aj = arcjet({
    key: getEnv('ARCJET_KEY'),
    rules: [],
});

const validateWithArcjet = async (fingerprint: string) => {
    // Configure rate limiting
    const ratelimit = aj.withRule(
        fixedWindow({
            mode: 'LIVE',
            window: '1m',           // 1 minute window
            max: 2,                 // Maximum 2 requests
            characteristics: ['fingerprint'],
        })
    );

    const req = await request();
    const decision = await ratelimit.protect(req, { fingerprint });

    if (decision.isDenied()) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }
};
```

**Applied to:**
- Video uploads (2 per minute per user)
- Prevents spam and abuse
- User fingerprinting for accurate tracking

### 2. Ownership Verification

All delete and update operations verify ownership:

```typescript
export const deleteVideo = withErrorHandling(async (videoId: string, bunnyVideoId: string) => {
    const userId = await getSessionUserId();
    if (!userId) throw new Error("Unauthenticated");

    // Verify ownership
    const [video] = await db.select().from(videos).where(eq(videos.id, videoId));
    if (!video) throw new Error("Video not found");
    if (video.userId !== userId) throw new Error("Unauthorized");

    // Delete from BunnyCDN
    await apiFetch(
        `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${bunnyVideoId}`,
        { method: "DELETE", bunnyType: "stream" }
    );

    // Delete from database
    await db.delete(videos).where(eq(videos.id, videoId));

    revalidatePaths([`/`, `/profile/${userId}`]);
    
    return { success: true };
});
```

### 3. Middleware Protection

```typescript
// Runtime enforcement
export const runtime = 'nodejs';  // Force Node.js for Better Auth

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  return NextResponse.next();
}
```

**Protects:**
- All application routes by default
- Executes before page rendering
- Immediate redirect if unauthenticated

### 4. Server Actions Security

```typescript
// Authentication check wrapper
const getSessionUserId = async (): Promise<string | null> => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) throw new Error("Unauthenticated");
    return session?.user.id || null;
};

// Error handling wrapper
export const withErrorHandling = <T extends (...args: any[]) => any>(
  fn: T
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Server action error:', error);
      throw error;
    }
  }) as T;
};
```

**Every server action:**
1. Wrapped in `withErrorHandling`
2. Checks authentication with `getSessionUserId`
3. Validates input data
4. Verifies permissions
5. Logs errors for debugging

### 5. Database Security

```typescript
// Cascading deletes
userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })

// Unique constraints
email: text("email").notNull().unique()
token: text("token").notNull().unique()

// Type-safe queries (prevents SQL injection)
await db.select().from(videos)
  .where(eq(videos.id, videoId));  // Parameterized
```

### 6. CDN Access Control

```typescript
// API keys stored in environment variables (never exposed)
const ACCESS_KEYS = {
    streamAccessKey: getEnv("BUNNY_STREAM_ACCESS_KEY"),
    storageAccessKey: getEnv("BUNNY_STORAGE_ACCESS_KEY"),
};

// Keys sent via secure server actions only
const { accessKey } = await getVideoUploadUrl();
```

### 7. Visibility Controls

```typescript
// Public videos: Visible to everyone
// Private videos: Visible only to owner

const canSeeTheVideos = currentUserId
    ? or(
        eq(videos.visibility, 'public'),
        eq(videos.userId, currentUserId)  // Owner can see private
      )
    : eq(videos.visibility, 'public');    // Non-authenticated: public only
```

## 📡 API Documentation

### Server Actions (`lib/actions/video.ts`)

All server actions are called from client components using Next.js Server Actions.

#### Video Upload

**`getVideoUploadUrl()`**
```typescript
// Returns upload URL for video
const result = await getVideoUploadUrl();
// Returns: { videoId, uploadUrl, accessKey }
```

**`getThumbnailUploadUrl(videoId: string)`**
```typescript
// Returns upload URL for thumbnail
const result = await getThumbnailUploadUrl(videoId);
// Returns: { uploadUrl, cdnUrl, accessKey }
```

**`saveVideoDetails(videoDetails: VideoDetails)`**
```typescript
// Saves video metadata to database
const result = await saveVideoDetails({
  videoId: 'bunny-video-guid',
  title: 'My Video',
  description: 'Video description',
  thumbnailUrl: 'https://cdn.url/thumb.jpg',
  visibility: 'public',
  duration: 120,
  tags: 'tag1,tag2'
});
// Returns: { videoId }
```

#### Video Management

**`deleteVideo(videoId: string, bunnyVideoId: string)`**
```typescript
// Deletes video from BunnyCDN and database
await deleteVideo(dbVideoId, bunnyGuid);
// Returns: { success: true }
// Throws: "Unauthorized" if not owner
```

**`updateVideoVisibility(videoId: string, visibility: 'public' | 'private')`**
```typescript
// Updates video visibility
await updateVideoVisibility(videoId, 'private');
// Returns: { success: true, visibility: 'private' }
// Throws: "Unauthorized" if not owner
```

**`incrementVideoViews(videoId: string)`**
```typescript
// Increments view count
await incrementVideoViews(videoId);
// Returns: { success: true, views: number }
```

#### Video Retrieval

**`getAllVideos(searchQuery?, sortFilter?, pageNumber?, pageSize?)`**
```typescript
// Get paginated public videos
const result = await getAllVideos('search', 'Most Viewed', 1, 8);
// Returns: {
//   videos: VideoWithUser[],
//   pagination: {
//     currentPage: number,
//     totalPages: number,
//     totalVideos: number,
//     pageSize: number
//   }
// }
```

**`getVideoById(videoId: string)`**
```typescript
// Get single video with user info
const result = await getVideoById(videoId);
// Returns: { video: Video, user: User }
```

**`getAllVideosByUser(userId: string, searchQuery?, sortFilter?)`**
```typescript
// Get user's videos (public + private if owner)
const result = await getAllVideosByUser(userId, '', 'Most Recent');
// Returns: {
//   user: User,
//   videos: VideoWithUser[],
//   count: number
// }
```

### Sort Filter Options

- `"Most Viewed"` - ORDER BY views DESC
- `"Most Recent"` - ORDER BY createdAt DESC
- `"Oldest First"` - ORDER BY createdAt ASC
- `"Least Viewed"` - ORDER BY views ASC

## Troubleshooting

### "Failed to load external module node:module"
- Ensure `export const runtime = 'nodejs';` is in `middleware.ts`
- Better Auth requires Node.js runtime, not Edge runtime

### Database connection errors
- Verify `DATABASE_URL` in `.env` is correct
- Check if database is accessible
- Ensure SSL mode is set if required by your provider

### Google OAuth not working
- Verify redirect URI in Google Console matches your app
- Check `NEXT_PUBLIC_BASE_URL` is correct
- Ensure Google+ API is enabled in Google Cloud Console

### Tailwind styles not applying
- Check class names exist in `app/globals.css`
- Restart dev server after changing Tailwind config
- Verify `@tailwindcss/postcss` is installed

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Better Auth Documentation](https://better-auth.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Neon Documentation](https://neon.tech/docs)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

#### Step 1: Prepare for Deployment

```bash
# Test production build locally
npm run build
npm run start

# Verify everything works
# Check http://localhost:3000
```

#### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 3: Deploy to Vercel

1. **Sign up/Login to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

4. **Add Environment Variables**
   
   In Vercel dashboard, add all environment variables:

   ```env
   DATABASE_URL=postgresql://...
   BETTER_AUTH_SECRET=your_production_secret
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   BUNNY_LIBRARY_ID=your_bunny_library_id
   BUNNY_STREAM_ACCESS_KEY=your_stream_key
   BUNNY_STORAGE_ACCESS_KEY=your_storage_key
   ARCJET_KEY=your_arcjet_key
   ```

   **Important:**
   - Generate a NEW `BETTER_AUTH_SECRET` for production
   - Update `NEXT_PUBLIC_BASE_URL` to your Vercel domain
   - Ensure all keys are from production services

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Vercel will provide a production URL

#### Step 4: Update OAuth Redirects

1. **Google Cloud Console**
   - Go to your OAuth 2.0 Client
   - Add to **Authorized redirect URIs:**
     ```
     https://your-domain.vercel.app/api/auth/callback/google
     ```
   - Save changes

2. **Test Authentication**
   - Visit your production URL
   - Try signing in with Google
   - Verify it redirects back correctly

#### Step 5: Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_BASE_URL` to custom domain
5. Update Google OAuth redirect URI

### Database Migrations

**For production deployment:**

```bash
# Generate migration files
npx drizzle-kit generate

# Review migrations in drizzle/migrations/

# Apply to production database
DATABASE_URL=your_production_url npx drizzle-kit migrate
```

### Environment-Specific Configuration

#### Production Checklist

- ✅ Use production database (not development)
- ✅ New `BETTER_AUTH_SECRET` (different from dev)
- ✅ HTTPS-only cookies enabled
- ✅ Rate limiting configured
- ✅ Error logging set up
- ✅ CDN properly configured
- ✅ OAuth redirects updated
- ✅ Database backups enabled

#### Vercel Configuration

Create `vercel.json` (optional):

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_BASE_URL": "https://your-domain.vercel.app"
  }
}
```

### Monitoring & Analytics

**Recommended Services:**
- **Vercel Analytics** - Built-in performance monitoring
- **Sentry** - Error tracking
- **PostHog** - Product analytics
- **BunnyCDN Analytics** - Video streaming metrics

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database (Drizzle Kit)
npx drizzle-kit push     # Push schema to database (no migrations)
npx drizzle-kit generate # Generate migration files
npx drizzle-kit migrate  # Apply migrations
npx drizzle-kit studio   # Open Drizzle Studio GUI

# Utilities
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
```

### Drizzle Studio

Drizzle Studio provides a GUI for database management:

```bash
npx drizzle-kit studio
```

**Features:**
- Browse tables and data
- Run SQL queries
- Edit records
- View relationships
- Test queries

**Access:** Opens at `https://local.drizzle.studio`

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. "Failed to load external module node:module"

**Cause:** Better Auth requires Node.js runtime, but middleware defaults to Edge.

**Solution:**
```typescript
// middleware.ts
export const runtime = 'nodejs';  // Add this line
```

#### 2. Database Connection Errors

**Symptoms:**
- `ECONNREFUSED`
- `Connection timeout`
- `SSL required`

**Solutions:**
```bash
# Check DATABASE_URL format
postgresql://user:password@host:5432/dbname?sslmode=require

# Test connection
psql $DATABASE_URL

# Verify Neon project is active
# Check if database exists
```

#### 3. Google OAuth Not Working

**Symptoms:**
- `redirect_uri_mismatch`
- `invalid_client`

**Solutions:**
1. Verify redirect URI in Google Console:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
2. Check `NEXT_PUBLIC_BASE_URL` matches
3. Ensure Google+ API is enabled
4. Clear browser cookies and try again

#### 4. BunnyCDN Upload Fails

**Symptoms:**
- 401 Unauthorized
- 403 Forbidden
- Upload timeout

**Solutions:**
```typescript
// Verify API keys
console.log('Stream Key:', process.env.BUNNY_STREAM_ACCESS_KEY);
console.log('Storage Key:', process.env.BUNNY_STORAGE_ACCESS_KEY);

// Check library ID
console.log('Library ID:', process.env.BUNNY_LIBRARY_ID);

// Test API key manually
curl -X GET "https://video.bunnycdn.com/library/{libraryId}/videos" \
  -H "AccessKey: your_key"
```

#### 5. Tailwind Styles Not Applying

**Cause:** Tailwind CSS v4 configuration issues

**Solutions:**
```bash
# Restart dev server
npm run dev

# Clear Next.js cache
rm -rf .next

# Verify globals.css import
# Check app/layout.tsx has: import './globals.css'

# Check tailwind.config.ts exists
```

#### 6. Rate Limiting Errors

**Symptoms:**
- "Rate limit exceeded"
- Can't upload videos

**Solutions:**
```typescript
// Temporarily disable for testing
// Comment out in lib/actions/video.ts
// await validateWithArcjet(userId);

// Or adjust limits
fixedWindow({
    window: '5m',  // Increase window
    max: 10,       // Increase limit
})
```

#### 7. Middleware Infinite Redirects

**Symptoms:**
- Browser shows "too many redirects"
- Can't access any page

**Solutions:**
```typescript
// Check matcher doesn't block sign-in
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)"
  ]
};

// Verify sign-in route exists
// Check /app/(auth)/sign-in/page.tsx
```

#### 8. Video Not Playing

**Symptoms:**
- Black screen
- Loading forever
- 404 error

**Solutions:**
```typescript
// Verify video URL format
const videoUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;

// Check BunnyCDN video processing
// Videos may take 1-2 minutes to process

// Verify video exists in BunnyCDN dashboard
```

#### 9. TypeScript Errors

**Common errors:**
```typescript
// Property does not exist
// Solution: Update index.d.ts with proper types

// Module not found
// Solution: npm install <package>

// Type mismatch
// Solution: Check interface definitions
```

#### 10. Build Errors

**Symptoms:**
- `npm run build` fails
- Type errors in production

**Solutions:**
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install

# Check TypeScript config
npx tsc --noEmit

# Review error messages
npm run build 2>&1 | tee build.log
```

### Debug Mode

Enable detailed logging:

```typescript
// lib/utils.ts
export const DEBUG = process.env.NODE_ENV === 'development';

// Use in code
if (DEBUG) {
  console.log('Video details:', videoDetails);
}
```

### Getting Help

1. **Check Logs:**
   - Browser console (F12)
   - Terminal output
   - Vercel deployment logs

2. **Review Documentation:**
   - [Next.js Docs](https://nextjs.org/docs)
   - [Drizzle ORM Docs](https://orm.drizzle.team/)
   - [Better Auth Docs](https://better-auth.com/)
   - [BunnyCDN Docs](https://docs.bunny.net/)

3. **Common Resources:**
   - Stack Overflow
   - GitHub Issues
   - Discord communities

## 📚 Learn More

### Documentation

- **Next.js 16:** [nextjs.org/docs](https://nextjs.org/docs)
- **Drizzle ORM:** [orm.drizzle.team](https://orm.drizzle.team/)
- **Better Auth:** [better-auth.com](https://better-auth.com/)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com/)
- **BunnyCDN:** [docs.bunny.net](https://docs.bunny.net/)
- **Arcjet:** [arcjet.com/docs](https://arcjet.com/docs)

### Tutorials & Guides

- Next.js App Router Guide
- Drizzle ORM Quick Start
- BunnyCDN Stream API Guide
- Better Auth React Integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add comments for complex logic
- Test before submitting PR
- Update documentation if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **DevSsChar** - Initial work - [GitHub](https://github.com/DevSsChar)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- BunnyCDN for video streaming infrastructure
- Better Auth for authentication solution
- Drizzle team for the excellent ORM

---

**Built with ❤️ using Next.js 16, TypeScript, and modern web technologies.**

For questions or support, please open an issue on GitHub.
