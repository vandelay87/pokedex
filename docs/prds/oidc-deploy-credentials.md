# PRD: OIDC Deploy Credentials & Dedicated Bucket

> Primary/detailed PRD: `per-app-buckets-and-oidc-deploy.md` in `akli-infrastructure`. Sibling companion PRDs: `oidc-deploy-credentials.md` in `personal-website` and `sand-box`. This PRD covers only Pokedex's own side of the migration.

## Overview

Move Pokedex's deploy workflow off the shared static AWS key and shared S3 bucket it currently uses, onto a dedicated `PokedexBucket` and a repo-scoped IAM Role assumed via GitHub OIDC. Part of a wider effort (see the primary PRD) to give every akli.dev app its own isolated deploy credentials instead of one shared, over-privileged key.

## Goals

- Deploys authenticate via OIDC (`role-to-assume`) instead of a static access key — nothing long-lived to leak or rotate
- Deploys sync to a dedicated `PokedexBucket` instead of a prefix inside the shared site bucket
- The deployed app behaves identically — same URL (`akli.dev/apps/pokedex`), same build output, same `base: '/apps/pokedex/'` config (unchanged)

## Scope

**In scope:**
- `.github/workflows/deploy.yml`: swap the credentials step to OIDC, change the S3 sync target from `s3://<shared-bucket>/apps/pokedex` to the new dedicated bucket's root, update the CloudFront invalidation step if the distribution ID changes (it doesn't — same shared distribution, per the primary PRD)

**Not in scope:**
- Any change to the app's own code, `vite.config.ts`, or `base` path — this repo's build output doesn't change at all
- The actual bucket/Role creation — that's `akli-infrastructure`'s CDK work (primary PRD); this PRD only covers pointing this repo's workflow at what that PRD creates
- Subdomain migration (`pokedex.akli.dev`) — separate, future PRD

## Design

No UI — CI configuration only. No visible change to the deployed Pokedex app.

## Technical Notes

- **Sequencing dependency**: this only works once `akli-infrastructure`'s `PokedexDeployRole` and `PokedexBucket` actually exist — the primary PRD's CDK changes must be deployed first, and the new bucket must actually be populated with a deploy before CloudFront is repointed at it (see the primary PRD's migration/cutover section — this repo's job is step 1 of that sequence: deploy to the new bucket).
- `Configure AWS credentials` step (`aws-actions/configure-aws-credentials@v5`) changes from `aws-access-key-id`/`aws-secret-access-key` to `role-to-assume: <PokedexDeployRole ARN>`.
- **The workflow must add `permissions: id-token: write`** (at the job or workflow level) — without it, GitHub won't issue the OIDC token this step needs, and the credentials step fails. Easy to miss, the most common OIDC setup mistake. Add `permissions: contents: read` alongside it — declaring a `permissions:` block at all zeroes out every unlisted scope by default, which could otherwise starve `actions/checkout` of read access (low risk today since this repo is public, but worth setting explicitly so it doesn't bite if the repo is ever made private).
- `Deploy to S3` step's target changes from `s3://${{ secrets.AWS_S3_BUCKET_NAME }}/apps/pokedex` (shared bucket) to `s3://<PokedexBucket>/apps/pokedex` — **the `apps/pokedex` prefix must be kept**, even though the new bucket is dedicated to this app alone. CloudFront's `apps/pokedex*` cache behavior forwards the full request path as the S3 object key; it does not strip the matched prefix before hitting the origin. Deploying to the new bucket's root instead would silently 403/404 once CloudFront is repointed at it, since a request for `/apps/pokedex/index.html` would still be requested as that exact object key. Update or replace the `AWS_S3_BUCKET_NAME` secret to point at the new bucket, but keep the `/apps/pokedex` suffix in the sync command.
- `CLOUDFRONT_ID` secret and the invalidation path (`/apps/pokedex/*`) are unchanged — still the one shared distribution.
- Existing `if: github.ref == 'refs/heads/main'` guards on the deploy/invalidate steps are already correct here and don't need changing (unlike `sand-box`, which is missing this guard — see that repo's own PRD).
- `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` secrets are removed once the new workflow is verified.

## Acceptance Criteria

- [ ] `deploy.yml`'s AWS credentials step uses `role-to-assume`, no static key inputs
- [ ] The workflow declares `permissions: id-token: write`
- [ ] `Deploy to S3` step targets the new dedicated `PokedexBucket`, still under the `apps/pokedex` key prefix (not bucket root — see Technical Notes for why)
- [ ] A real deploy run (push to `main`) succeeds: build, S3 sync, and CloudFront invalidation all complete
- [ ] `https://akli.dev/apps/pokedex` serves correctly after the CloudFront behavior is repointed (per the primary PRD's cutover steps)
- [ ] `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` secrets are removed from this repo after verification
