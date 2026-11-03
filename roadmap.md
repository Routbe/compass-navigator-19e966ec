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
- [ ] Durable event worker: Inngest connection was declined; request-lifetime tasks are not a durable queue.
- [ ] Sovereign object storage and WebP/WebM conversion: storage credentials and a Worker-compatible conversion service are missing; current media remains in existing Neon gallery storage.
- [ ] WebSocket job synchronization: Neon has no configured realtime service; current Studio inbox uses bounded polling while jobs are pending.
- [ ] Authenticated end-to-end ingestion and published media verification: blocked by missing ingestion schema and account setup.
