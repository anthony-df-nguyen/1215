# Shared Memories

A private web app for logging and browsing shared memories. Two-user access only, gated by Google sign-in.

Memories are shown as a vertical chronological timeline, grouped by year with a year filter. Each memory can have a title, description, a date recorded at day/month/year precision, up to 3 photos (pasted https image URLs), and up to 10 links (URL + optional label) to related content. Memories can be created, edited, and hard-deleted via server actions.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Postgres via [Neon](https://neon.tech) (Vercel Marketplace)
- Drizzle ORM
- Auth.js (NextAuth v5) with Google OAuth, restricted to an email allow-list

## Local setup

```bash
yarn install
cp .env.example .env.local
```

Fill in `.env.local`:

- `DATABASE_URL` — from the Neon integration in your Vercel project (or a local/dev Neon branch)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from a Google Cloud OAuth client (Web application type, add `http://localhost:3000/api/auth/callback/google` as a redirect URI)
- `AUTH_SECRET` — generate with `npx auth secret`
- `ALLOWED_EMAILS` — comma-separated emails allowed to sign in

Push the schema to your database:

```bash
yarn drizzle-kit push
```

Run the dev server:

```bash
yarn dev
```

## Database

Schema lives in `src/db/schema.ts`. Currently one table:

- `memories` — id, title, description, memory_date, date_precision (day/month/year), created_by, images (jsonb array of https photo URLs, up to 3 per memory), links (jsonb array of `{ url, label? }`, up to 10 per memory), created_at

Since this is a flat Postgres schema, it can be queried directly with any Python/SQL client (e.g. `psycopg2`, `pandas.read_sql`) using the same `DATABASE_URL`.

## Deploying

1. Push this repo to GitHub, import it into Vercel.
2. Add the Neon Postgres integration from the Vercel Marketplace — this sets `DATABASE_URL` automatically.
3. Add `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, `ALLOWED_EMAILS` as environment variables in the Vercel project settings.
4. Run `yarn drizzle-kit push` once (locally, pointed at the production `DATABASE_URL`) to create tables.

## Roadmap

- Native photo upload (object storage) instead of pasted image URLs
- Full-text / keyword search across title & description
- Tagging, locations
