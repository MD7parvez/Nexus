# NEXUS Supabase setup

NEXUS uses Supabase Free for authentication and account-scoped database storage.

## 1. Create a Supabase project
Create a project in the Supabase dashboard. Keep database credentials private. The project owner should be an adult or responsible organization administrator.

## 2. Apply the migration
In Supabase SQL Editor, run the complete file:
supabase/migrations/20261114000100_nexus_accounts_and_workspace.sql

This creates:
- profiles: account display name, age and organization metadata
- workspace_records: one JSONB workspace per authenticated user
- Row Level Security policies restricting profile/workspace access to the owner
- A trigger that creates/updates a profile when Supabase Auth creates/updates a user

Supabase Auth stores password hashes. NEXUS does not store plaintext passwords.

## 3. Configure Render environment variables
In Render → NEXUS → Environment, set:
- SUPABASE_URL: Project URL from Supabase → Project Settings → API
- NEXT_PUBLIC_SUPABASE_ANON_KEY: publishable/anon key from Supabase → Project Settings → API
- SUPABASE_SERVICE_ROLE_KEY: service-role key from Supabase → Project Settings → API

The service-role key is server-only. Never put it in a NEXT_PUBLIC variable, GitHub, client code, or chat. Do not share it with collaborators who do not administer the project.

Keep NEXUS_SESSION_SECRET set to a random secret of at least 32 characters. Keep NEXUS_ADMIN_EMAILS restricted to authorized administrator accounts.

## 4. Authentication settings
Configure the Supabase Auth email provider and site URL/redirect URLs for the deployed NEXUS domain. If email confirmation is enabled, users must verify their email before signing in.

## 5. Verify
After Render redeploys:
1. Register a test account.
2. Verify the email if required.
3. Sign in.
4. Create a test investigation.
5. Refresh and confirm it remains.
6. Create a second account and confirm it cannot see the first account's workspace.

## Notes
- Free-tier limits and availability are controlled by Supabase and may change.
- Old browser-local records are not automatically imported. The old local workspace mixed example data with user-entered data, so it must be reviewed before any migration.
- The application stores profile metadata and workspace records. It does not store the user's password itself.