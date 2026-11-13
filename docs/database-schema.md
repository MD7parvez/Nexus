# NEXUS Database Schema

This document describes the relational model for the first release of the NEXUS platform. The schema supports demo mode and can later be mapped to Supabase PostgreSQL tables with Row Level Security (RLS) enabled.

## Core entities

### organizations
- id: uuid primary key
- name: text not null
- created_at: timestamptz default now()
- updated_at: timestamptz default now()

### users
- id: uuid primary key
- organization_id: uuid references organizations(id)
- role: text check in ('admin', 'analyst', 'reviewer')
- email: text unique not null
- display_name: text
- created_at: timestamptz default now()
- last_login_at: timestamptz

### investigations
- id: uuid primary key
- organization_id: uuid references organizations(id)
- title: text not null
- description: text
- status: text check in ('open','monitoring','under_review','closed')
- priority: text check in ('critical','high','medium','low')
- assigned_analyst_id: uuid references users(id)
- created_at: timestamptz default now()
- updated_at: timestamptz default now()

### sources
- id: uuid primary key
- organization_id: uuid references organizations(id)
- source_name: text not null
- source_type: text
- url: text
- date_collected: date
- original_publication_date: date
- provenance_notes: text
- reliability_assessment: text
- analyst_comments: text
- created_at: timestamptz default now()

### claims
- id: uuid primary key
- investigation_id: uuid references investigations(id)
- narrative_id: uuid references narratives(id)
- text: text not null
- topic: text
- confidence: numeric(4,3)
- call_status: text check in ('verified','unverified','disputed','false','opinion')
- created_at: timestamptz default now()

### narratives
- id: uuid primary key
- title: text not null
- summary: text
- status: text
- confidence: numeric(4,3)
- organization_id: uuid references organizations(id)
- created_at: timestamptz default now()

### media_assets
- id: uuid primary key
- investigation_id: uuid references investigations(id)
- file_name: text not null
- media_type: text check in ('image','audio','video')
- file_hash: text
- metadata_json: jsonb
- provenance_notes: text
- analysis_status: text
- created_at: timestamptz default now()

### forensic_analyses
- id: uuid primary key
- media_asset_id: uuid references media_assets(id)
- provider: text
- result_label: text
- confidence: numeric(4,3)
- demo_only: boolean default true
- created_at: timestamptz default now()

### evidence_links
- id: uuid primary key
- claim_id: uuid references claims(id)
- source_id: uuid references sources(id)
- media_asset_id: uuid references media_assets(id)
- evidence_type: text
- strength: text
- created_at: timestamptz default now()

### countermeasure_drafts
- id: uuid primary key
- investigation_id: uuid references investigations(id)
- title: text not null
- body: text
- status: text check in ('draft','under_review','approved','published','monitoring','closed')
- created_at: timestamptz default now()

### countermeasure_approvals
- id: uuid primary key
- draft_id: uuid references countermeasure_drafts(id)
- approved_by: uuid references users(id)
- approval_decision: text
- approved_at: timestamptz

### response_observations
- id: uuid primary key
- draft_id: uuid references countermeasure_drafts(id)
- platform: text
- publication_url: text
- published_at: timestamptz
- engagement_observation: text
- follow_up_note: text
- created_at: timestamptz default now()

### simulation_scenarios
- id: uuid primary key
- organization_id: uuid references organizations(id)
- title: text not null
- description: text
- difficulty: text
- synthetic_only: boolean default true
- created_at: timestamptz default now()

### simulation_results
- id: uuid primary key
- scenario_id: uuid references simulation_scenarios(id)
- analyst_id: uuid references users(id)
- correct_classifications: integer
- incorrect_classifications: integer
- response_time_seconds: integer
- generated_report: text
- created_at: timestamptz default now()

### analyst_notes
- id: uuid primary key
- investigation_id: uuid references investigations(id)
- user_id: uuid references users(id)
- note: text
- created_at: timestamptz default now()

### audit_logs
- id: uuid primary key
- user_id: uuid references users(id)
- action: text not null
- entity_type: text
- entity_id: uuid
- details: jsonb
- created_at: timestamptz default now()

## Indexes
- users(email)
- investigations(organization_id, status)
- claims(investigation_id)
- narratives(organization_id)
- media_assets(investigation_id)
- evidence_links(claim_id, source_id)
- countermeasure_drafts(investigation_id, status)
- audit_logs(user_id, created_at)

## Security notes
- Enable RLS on all tables.
- Restrict organization access via organization_id.
- Use Supabase policies to prevent cross-tenant reads and writes.
- Keep service-role keys out of browser code.
