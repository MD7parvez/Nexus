create table if not exists public.social_publish_audit (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  actor_id text not null,
  actor_email text not null,
  platform text not null check (platform = 'facebook_page'),
  page_id text not null,
  message text not null,
  status text not null check (status in ('pending', 'published', 'failed')),
  external_post_id text,
  error_code text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists social_publish_audit_created_at_idx
  on public.social_publish_audit (created_at desc);

alter table public.social_publish_audit enable row level security;

-- Intentionally define no client-facing policies.
-- Only the server-side Supabase service-role key may read/write this audit table.
