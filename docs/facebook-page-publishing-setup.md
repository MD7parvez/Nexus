# Facebook Page publishing setup (NEXUS)

This integration is intentionally disabled by default. It supports one manually confirmed text post at a time to one Facebook Page. It does not support personal-profile publishing, automated posting, bulk posting, or engagement automation.

## Required organization-admin setup

An adult Page administrator or the responsible organization administrator must perform the following steps and verify that the Page is authorized for this app. Do not share access tokens in chat, source control, browser storage, or client-side code.

1. Create/authorize the Meta app under the organization's legitimate developer account and complete any applicable review.
2. Grant the app the Page permissions required by Meta for Page publishing: `pages_manage_posts`, `pages_read_engagement`, and `pages_show_list`. The authorizing person must have the Page's `CREATE_CONTENT` task.
3. Apply `supabase/migrations/20261113000100_social_publish_audit.sql` to the project's Supabase database.
4. Configure these Render environment variables using the Render dashboard's secret-value controls:
   - `META_PAGE_ID`: the authorized Page ID
   - `META_PAGE_ACCESS_TOKEN`: the Page access token (secret)
   - `META_RESEARCH_PROFILE_URL`: the canonical HTTPS URL of that Page
   - `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
   - `SUPABASE_SERVICE_ROLE_KEY`: server-only secret; never expose it to the browser
   - `NEXUS_PUBLISHING_ADULT_ADMIN_EMAILS`: comma-separated email allowlist for adult organization administrators who have authorized the Page
   - `NEXUS_PUBLISHING_ENABLED`: keep `false` until all previous steps are complete and verified; only then may the responsible adult administrator enable it
5. Keep `NEXUS_SESSION_SECRET` configured. Use a named adult administrator account in `NEXUS_ADMIN_EMAILS`; do not use the prototype-owner login for live publishing.

## Runtime safeguards

- Every request requires a valid signed administrator session and an email on the adult publishing allowlist.
- The server appends a fixed research disclosure; the browser cannot remove it.
- The request requires an explicit confirmation flag and a unique request ID.
- A persistent audit row must be written before contacting Meta. If the audit database is unavailable, the request is rejected without sending a post.
- Only the single configured Page is targeted. The client must select the matching Page URL.
- The app never stores Page tokens in localStorage or returns them to the browser.
- A network timeout can leave the final result uncertain. Check the audit record and the Page before attempting another post.

## Meta API reference

The implementation uses the official Page Feed endpoint documented by Meta:
https://developers.facebook.com/docs/graph-api/reference/page/feed/

Meta currently documents Page publishing through `POST /{page-id}/feed`, with a Page access token, the `pages_manage_posts`, `pages_read_engagement`, and `pages_show_list` permissions, and the Page's `CREATE_CONTENT` task.
