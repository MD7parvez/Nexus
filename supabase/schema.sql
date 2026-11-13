create extension if not exists pgcrypto;

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  role text not null default 'analyst' check (role in ('admin', 'analyst', 'reviewer')),
  email text not null unique,
  display_name text,
  created_at timestamptz default now(),
  last_login_at timestamptz
);

create table if not exists investigations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open', 'monitoring', 'under_review', 'closed')),
  priority text not null default 'medium' check (priority in ('critical','high','medium','low')),
  assigned_analyst_id uuid references users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  source_name text not null,
  source_type text,
  url text,
  date_collected date,
  original_publication_date date,
  provenance_notes text,
  reliability_assessment text,
  analyst_comments text,
  created_at timestamptz default now()
);

create table if not exists narratives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  title text not null,
  summary text,
  status text,
  confidence numeric(4,3),
  created_at timestamptz default now()
);

create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  investigation_id uuid references investigations(id),
  narrative_id uuid references narratives(id),
  text text not null,
  topic text,
  confidence numeric(4,3),
  call_status text check (call_status in ('verified','unverified','disputed','false','opinion')),
  created_at timestamptz default now()
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  investigation_id uuid references investigations(id),
  file_name text not null,
  media_type text check (media_type in ('image','audio','video')),
  file_hash text,
  metadata_json jsonb,
  provenance_notes text,
  analysis_status text,
  created_at timestamptz default now()
);

create table if not exists countermeasure_drafts (
  id uuid primary key default gen_random_uuid(),
  investigation_id uuid references investigations(id),
  title text not null,
  body text,
  status text check (status in ('draft','under_review','approved','published','monitoring','closed')),
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_investigations_status on investigations(status);
create index if not exists idx_claims_investigation on claims(investigation_id);
create index if not exists idx_countermeasure_drafts_status on countermeasure_drafts(status);
create index if not exists idx_audit_logs_user on audit_logs(user_id);
