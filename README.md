# NEXUS — Information Integrity & Intelligence System

NEXUS is a defensive information-integrity prototype for organizing investigations, recording public sources and claims, reviewing media metadata, drafting evidence-based corrections, and testing analyst workflows with fictional scenarios.

## Current deployment

- Repository: MD7parvez/Nexus
- Hosting: Render web service (free tier)
- Runtime: Next.js 16, React 19, TypeScript
- UI: Tailwind CSS and Lucide
- Prototype records: browser localStorage

## What currently works

- Overview metrics derived from the local workspace records
- Create and update investigation records and statuses
- Add public-source records
- Record claims and manually classify their review status
- Group claims by analyst-entered topic
- Select an image, audio or video file and compute its SHA-256 fingerprint locally in the browser
- Draft defensive corrections and move them through internal review and approval states
- Create clearly labelled fictional simulation scenarios
- Export a text report from the current workspace

## Important prototype limitations

This is a public demonstration build, not a production intelligence system.

- Records are stored in the current browser's localStorage. They do not sync across devices or users and can be lost if browser storage is cleared.
- Production authentication, organization isolation, server-side persistence and production access controls are not enabled.
- No social-media scraping, account creation, posting, covert influence or live platform integration is enabled.
- The media page records file metadata and a SHA-256 hash. The file itself is not uploaded and no deepfake detector runs.
- Narrative grouping is based on analyst-entered topics; it is not an automated attribution or truth assessment.
- Simulation scenarios are fictional and stay inside the workspace.
- Do not enter classified, private, personal or otherwise sensitive information.

## Local development

1. Install Node.js 20 or later.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

## Render deployment

The Render service is connected to the `main` branch. New commits trigger an automatic deployment.

Build command: `npm install && npm run build`

Start command: `npm run start -- --port $PORT`

Health endpoint: `/api/health`

The free service may sleep when idle. Browser-local records are not a backup and are not shared with the server.

## Production roadmap

Before real organizational use, replace browser-local state with a properly configured database, implement real authentication and role-based authorization, enforce organization-scoped access policies, add server-side audit logging and retention controls, complete security testing, and obtain legal/privacy review. Integrations must use approved APIs and authorized organizational accounts. Countermeasure publication must remain behind human approval.
