# NEXUS — Information Integrity & Intelligence System

NEXUS is a working intelligence workstation for investigations, evidence tracking, narrative analysis, media review, defensive response workflows, and scenario research in a government-oriented workflow.

## What is active now

- Real Supabase-ready authentication and database mode
- Dashboard data read from a backend API instead of static page imports
- Structured schema for investigations, claims, sources, narratives, media, countermeasures, and audit logs
- Free-tier deployment path via Vercel + Supabase
- Demo fallback mode only when cloud credentials are not configured

## Stack

- Next.js with TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- Vercel-ready deployment config
- Recharts for charts
- Lucide icons

## Local setup

1. Install Node.js LTS.
2. In the project root, install dependencies:
   npm install
3. Copy the environment template:
   copy .env.example .env.local
4. Update the Supabase values in .env.local.
5. Start the app:
   npm run dev
6. Visit http://localhost:3000

## Real functionality

The app properly detects Supabase configuration and switches from demo mode to live backend mode automatically. The overview and case-management endpoints read from the API layer, which can query Supabase tables when cloud credentials are present.

## Supabase setup

1. Create a Supabase project.
2. Copy the project URL and anon key to .env.local.
3. Create the schema in supabase/schema.sql.
4. Enable Row Level Security and add policies for organization-scoped access.
5. Keep service-role keys server-side only.

## Free cloud deployment

Use this path for free-tier hosting:

- Frontend: Vercel (free)
- Database/auth: Supabase (free)
- Set environment variables in Vercel using the values from your Supabase project.
- Import the schema from supabase/schema.sql before first login.

## Security notes

- Never expose service-role keys in browser code.
- Keep demo data separated from production data.
- Require human approval before publishing countermeasures.
- AI and media-analysis outputs must remain clearly labeled and never treated as definitive forensic proof.
