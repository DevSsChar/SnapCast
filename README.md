# Loom Clone

A full-stack video sharing platform built with Next.js 16, featuring authentication, database integration, and a modern UI.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth
- **Fonts:** Karla & Satoshi (Custom)

## Features

- 🔐 Google OAuth authentication
- 📹 Video library with public/private visibility
- 👤 User profiles and sessions
- 🎨 Modern UI with custom design system
- 🔒 Protected routes with middleware
- 📱 Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Google Cloud Console project for OAuth

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd loom
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- `next`, `react`, `react-dom` - Core framework
- `drizzle-orm` - TypeScript ORM for database operations
- `drizzle-kit` - CLI tool for database migrations
- `better-auth` - Authentication library
- `@neondatabase/serverless` - Neon database driver
- `pg` - PostgreSQL client
- `tailwindcss` - Utility-first CSS framework

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Connection
DATABASE_URL=your_postgresql_connection_string

# Better Auth Configuration
BETTER_AUTH_SECRET=your_random_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Line-by-line explanation:**

- `DATABASE_URL`: Your PostgreSQL connection string from Neon or any PostgreSQL provider
  - Format: `postgresql://user:password@host:5432/database?sslmode=require`
  - Get this from your Neon dashboard or PostgreSQL service
  
- `BETTER_AUTH_SECRET`: A random secret key for session encryption
  - Generate with: `openssl rand -base64 32`
  - Keep this secure and never commit to Git
  
- `NEXT_PUBLIC_BASE_URL`: Your application's base URL
  - Use `http://localhost:3000` for development
  - Change to your production URL when deploying
  
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials from Google Cloud Console
  - Go to [Google Cloud Console](https://console.cloud.google.com/)
  - Create a new project or select existing one
  - Enable Google+ API
  - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
  - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
  - Copy the Client ID and Client Secret

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

### 10. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

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

## Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After approval, Google redirects to `/api/auth/callback/google`
4. Better Auth creates user account and session in database
5. Session cookie is set
6. User is redirected to dashboard
7. Middleware checks session on protected routes

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

## Deploy on Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update `NEXT_PUBLIC_BASE_URL` to your production URL
5. Add production redirect URI to Google Cloud Console
6. Deploy!

## License

MIT
