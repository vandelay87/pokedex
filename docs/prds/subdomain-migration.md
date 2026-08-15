# PRD: Subdomain Migration

> Primary/detailed PRD: `subdomain-per-app-migration.md` in `akli-infrastructure`. Sibling companion PRDs: `subdomain-migration.md` in `personal-website` and `sand-box`. This PRD covers only Pokedex's own side of the migration.

## Overview

Move Pokedex from `akli.dev/apps/pokedex` to its own dedicated subdomain, `pokedex.akli.dev`, served by a new dedicated CloudFront distribution (`PokedexSiteStack` in `akli-infrastructure`) instead of a path pattern on the shared site distribution.

## Goals

- The app is built and deployed to serve correctly from a subdomain root instead of a `/apps/pokedex/` subpath
- Deploys sync to `PokedexBucket`'s root instead of the `apps/pokedex` prefix used since PRD #1
- No functional change to the app's own behavior or components — same build output, same behavior, only where it's hosted (and its `<head>` metadata) changes
- The app has a proper web app manifest and favicon, so it reads as a real, dedicated destination at `pokedex.akli.dev` rather than a subpath of the portfolio site — closing a gap that didn't matter under the old path-based setup (a subpath of `personal-website`, which already carries its own `site.webmanifest`, didn't need its own)

## Scope

**In scope:**
- `vite.config.ts`: `base` changes from `'/apps/pokedex/'` to `/` (Vite's default) — assets and routes resolve from the subdomain root
- `.github/workflows/deploy.yml`: S3 sync target changes from `s3://<PokedexBucket>/apps/pokedex` to `s3://<PokedexBucket>` (root); CloudFront invalidation path/distribution ID changes from the shared distribution's `/apps/pokedex/*` to the new dedicated distribution's `/*`
- Add a web app manifest (`public/manifest.json` or `site.webmanifest`) with `name`, `short_name`, and at least one icon, linked from `index.html` via `<link rel="manifest">`
- Replace the current placeholder `<link rel="icon" ... href="/vite.svg">` with a real Pokedex-specific favicon

**Not in scope:**
- Any change to the app's own component code or runtime behavior — the manifest/favicon work is static assets and `<head>` metadata only, not application logic
- The actual `PokedexSiteStack`/certificate/DNS creation — that's `akli-infrastructure`'s CDK work (primary PRD); this PRD only covers pointing this repo's build/deploy at what that PRD creates
- Redirecting the old `akli.dev/apps/pokedex` URL — explicitly not happening, per the primary PRD's Non-Goals

## Design

No UI — build config and CI configuration only. Visually and functionally identical app, served from a different URL.

## Technical Notes

- **Sequencing dependency**: `akli-infrastructure`'s Deploy A (new `PokedexSiteStack`, `PokedexCert`) must land first. Per the primary PRD's migration sequence, this repo's redeploy (verified against the distribution's default `*.cloudfront.net` hostname, not yet the final subdomain) is step 2 of that sequence — it happens *before* DNS-based verification and well before the old shared-distribution behavior is removed, so there's no window where the old `akli.dev/apps/pokedex` URL breaks.
- `vite.config.ts`'s `base: '/apps/pokedex/'` → `base: '/'` (or simply remove the `base` option — `/` is Vite's default). Getting this wrong in either direction breaks asset loading: too narrow (still `/apps/pokedex/`) and assets 404 under the new root-based distribution; this is the same class of bug flagged in PRD #1 about path prefixes, just the mirror image.
- `Deploy to S3` step's target changes from `s3://${{ secrets.AWS_S3_BUCKET_NAME }}/apps/pokedex` to `s3://${{ secrets.AWS_S3_BUCKET_NAME }}` — bucket root, no prefix. Unlike PRD #1 (where the prefix had to be *kept* because the old distribution forwarded the full request path), the new dedicated distribution's origin *is* the bucket root, so keeping the old prefix here would be wrong this time — the inverse of PRD #1's lesson, not a repeat of it.
- **Real gap caught in review**: the existing command uses `--delete`, and `aws s3 sync <dir> s3://bucket --delete` with no prefix scopes its delete-comparison to the *entire bucket*, not just root-level keys. Run as-is, the very first bucket-root redeploy would delete the still-live `apps/pokedex/` content the *old* shared distribution is still serving — 404ing the old URL immediately, at step 2 of the primary PRD's sequence, not at the deliberate cleanup in step 6 where that removal is supposed to happen. Add `--exclude "apps/pokedex/*"` to the sync command until the primary PRD's step 6 explicitly removes that prefix (then the exclude can be dropped) — mirrors the same technique `personal-website`'s own `deploy.yml` already uses to protect other apps' prefixes during its own sync.
- CloudFront invalidation step's `--distribution-id` changes from the shared distribution's ID to the new `PokedexSiteStack` distribution's ID, and the path changes from `/apps/pokedex/*` to `/*` (invalidating this app's own dedicated distribution, not a subpath of someone else's).
- The `AWS_S3_BUCKET_NAME`/`CLOUDFRONT_ID` secret *names* don't need to change (still referring to "this app's bucket" and "this app's distribution"), only their *values* — update the secrets to point at the new distribution ID once it exists.
- No change needed to the OIDC role/credentials setup from PRD #1 — `PokedexDeployRole`'s S3 permissions were already scoped to the whole `PokedexBucket` ARN (not the `apps/pokedex` prefix specifically), so deploying to bucket root instead of a subfolder doesn't require any IAM policy change. Worth double-checking this assumption against the actual role policy once PRD #1 is implemented, since it wasn't written with "eventually deploys to bucket root" explicitly in mind.
- **Manifest/favicon**: this repo has no `public/` directory today and no existing icon beyond Vite's default `/vite.svg`, so there's no existing asset to adapt — icons need to be created or sourced, not just relinked. Keep it minimal: a single reasonably-sized PNG icon (matching `personal-website`'s `site.webmanifest` shape — `name`, `short_name`, one `icons` entry) is enough; this isn't a PWA installability initiative, just correct browser chrome and link-preview metadata for a standalone origin.

## Acceptance Criteria

- [ ] `vite.config.ts`'s `base` is `/` (or unset)
- [ ] `Deploy to S3` step targets `PokedexBucket`'s root, not the `apps/pokedex` prefix, with `--exclude "apps/pokedex/*"` added so the redeploy's `--delete` doesn't wipe the still-live old prefix before the primary PRD's step 6 cleanup runs
- [ ] CloudFront invalidation targets the new `PokedexSiteStack` distribution's ID with path `/*`
- [ ] A real deploy run succeeds, verified first against the distribution's default `*.cloudfront.net` hostname (before DNS cutover), then against `https://pokedex.akli.dev` (after)
- [ ] `PokedexDeployRole`'s existing S3 permissions (from PRD #1) are confirmed sufficient for a bucket-root deploy with no policy change needed — or a gap is reported back to the primary PRD if not
- [ ] `index.html` links a web app manifest declaring `name`, `short_name`, and at least one icon
- [ ] The favicon is a real Pokedex-specific icon, not the default Vite icon

## Open Questions

- None.
