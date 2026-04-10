This is a [Next.js](https://nextjs.org) project for Sibshred Kitchen.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Sanity CMS Setup (Private Admin)

This project includes Sanity CMS with a private admin flow:

- Private admin login page: `/admin`
- Sanity Studio route: `/studio`

### 1. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `ADMIN_PASSCODE` (used by the private `/admin` login)

### 2. Start the app and login

1. Run `npm run dev`
2. Open `/admin`
3. Enter `ADMIN_PASSCODE`
4. You will be redirected to `/studio`

### 3. CMS schema included

- `post` document type for homepage journal/blog content.
- Homepage reads Sanity featured posts with fallback to local static data.

### 4. Useful Sanity commands

```bash
npm run sanity:dev
npm run sanity:deploy
```

If Sanity environment values are missing, the site still runs with fallback content and Studio shows a configuration message.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
