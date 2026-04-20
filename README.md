# Sib Method Website

This is the main website for Sib Method, built with Next.js.

It includes:

- The public marketing and menu pages
- Checkout and order receipt pages
- A Prisma-backed data layer
- A private Sanity Studio setup for content editing

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open http://localhost:3000

## Environment Variables

At minimum, make sure these are set in `.env.local`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

Optional for server-side private/draft reads:

- `SANITY_API_TOKEN` (server-only; never prefixed with NEXT_PUBLIC)
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `ADMIN_OWNER_EMAILS` (comma-separated owner emails)

If you are using database-backed menu/catalog features, also configure:

- `DATABASE_URL` (runtime, recommended Supabase pooler URL)
- `DIRECT_URL` (migrations, direct Supabase URL)

For Supabase + Prisma, the usual pattern is:

- `DATABASE_URL`: pooler host (port `6543`) with `pgbouncer=true`, `connection_limit=1`, and `sslmode=require`
- `DIRECT_URL`: direct host (port `5432`) with `sslmode=require`

See [.env.example](.env.example) for the exact template format.

## Private Admin + Sanity Studio

This project has a private admin gate before Studio:

- Admin login: `/admin`
- Studio: `/studio`

Flow:

1. Run the app with `npm run dev`
2. Visit `/admin`
3. Sign in with your Auth.js provider account
4. You will be redirected to `/studio`

If Sanity env values are missing, the public site still works with fallback content and Studio will show a configuration message instead of crashing.

### Admin + Studio Setup Checklist

Use this checklist to get the integrated dashboard working on `/admin` and `/studio`.

1. Add these values to `.env.local`:

```bash
AUTH_SECRET="replace-with-a-long-random-string"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"
ADMIN_OWNER_EMAILS="you@example.com"

NEXT_PUBLIC_SANITY_PROJECT_ID="your-sanity-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2026-04-10"
```

2. In Google Cloud Console, add these redirect URIs to your OAuth client:

```text
http://localhost:3000/api/auth/callback/google
https://your-production-domain/api/auth/callback/google
```

3. Run database migration and seed owner role (once per environment):

```bash
npm run prisma:migrate
npm run prisma:seed
```

4. Start the app:

```bash
npm run dev
```

5. Open `/admin`:
- Confirm Auth status = configured
- Confirm Sanity status = configured
- Sign in with a Google account listed in `ADMIN_OWNER_EMAILS`

6. Open `/studio`:
- If signed in with OWNER role, Studio should load inside the Next.js site.
- If access is denied, assign your account an OWNER or STAFF role from `/admin` role management.

## Content Model Notes

Sanity currently includes a `post` document type for journal content.

- Journal list route: `/journal`
- Journal detail route: `/journal/[slug]`

If no Sanity posts exist yet, the site falls back to local content so these pages still render.

## Useful Commands

```bash
# App
npm run dev
npm run build
npm run start
npm run lint

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:studio
npm run prisma:seed

# Sanity (root project)
npm run sanity:dev
npm run sanity:deploy

# Standalone studio workspace
npm run studio:dev
npm run studio:build
npm run studio:start
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma + Postgres
- Sanity CMS

## Deploying

Deploy it like a standard Next.js app (Vercel works great, but anything that supports Next.js is fine).

Before deploying, double-check:

- Production environment variables are set
- Prisma migrations are applied
- Sanity project and dataset values point to the correct environment
