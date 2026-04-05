# pokedex

Frontend app for the Pokedex — a searchable Pokemon encyclopedia. Deployed as a page on akli.dev, linked from the Apps page in personal-website.

## PRDs

Before implementing any new feature, check `docs/prds/` for a relevant PRD. If one exists, read it fully and follow the spec. Do not add features beyond what the PRD describes.

To write a new PRD, copy `docs/prds/template.md` and fill it in.

## Stack

- TypeScript
- Vitest for testing
- Package manager: pnpm (do not use npm or yarn)

## Conventions

- Each module has a co-located test file `<name>.test.ts`

## Workflow

- Always run `/simplify` after completing an issue, before opening the PR.

## Related repos

- **akli-infrastructure**: API Gateway, Lambda, and DynamoDB resources for the Pokedex API
- **personal-website**: Apps page where the Pokedex card links to
