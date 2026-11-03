# App source import
- [x] Import full source and assets, excluding secrets and repository metadata.
- [x] Install dependencies, confirm the build, and verify the public home page and account entry page.
- [x] Link Neon and verify database reachability and the existing restricted app role.
- [ ] Complete account, email, payment, and other external-service setup (requires provider settings; authenticated flows remain unverified).

## Omni-Matrix
- [x] Audit existing ingestion, Studio controls, profile grid, storage and queue.
- [x] Add Studio URL imports, job inbox, webhook-token controls, content-type/meta editing and Hero switch.
- [x] Add bounded webhook bodies, guarded oEmbed discovery, local-media mapping and reduced-motion kinetic controls.
- [x] Run 25 targeted tests and bunx tsgo --noEmit (exit 0); preview build succeeds.
- [ ] Activate ingestion schema in Neon: existing migration 0188 is not applied; requires reviewed database migration execution.
- [x] Replace request-lifetime processing with enqueue-only web handlers and public.omni_jobs.
- [x] Add standalone PostgreSQL LISTEN/NOTIFY daemon with SKIP LOCKED claims, leases, retries and five-minute zombie recovery.
- [x] Move extraction and Sharp/FFmpeg conversion into the daemon; use private Scaleway S3 and metadata-only job paths.
- [x] Replace Studio polling with authenticated SSE from the persistent daemon.
- [x] Test queue, recovery, ticket authorization and separation of web/worker concerns; native disposable PostgreSQL confirms commit-only notifications and SKIP LOCKED concurrency.
- [ ] Deploy daemon and activate migration: requires persistent PostgreSQL access (the Neon HTTP connector cannot LISTEN), worker hosting, storage credentials and shared realtime secret.
- [ ] Authenticated end-to-end ingestion and published media verification: blocked by missing ingestion schema and account setup.
