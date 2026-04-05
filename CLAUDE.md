# pokedex

Frontend app for the Pokedex — a searchable Pokemon encyclopedia. Deployed as a page on akli.dev, linked from the Apps page in personal-website.

## PRDs

Before implementing any new feature, check `docs/prds/` for a relevant PRD. If one exists, read it fully and follow the spec. Do not add features beyond what the PRD describes.

To write a new PRD, copy `docs/prds/template.md` and fill it in.

## Stack

- React 19 + TypeScript
- Vite 7
- CSS Modules
- Vitest + Testing Library
- Package manager: pnpm (do not use npm or yarn)

## Conventions

- Components live in `src/components/<Name>/<Name>.tsx` with a barrel `index.ts`
- Pages live in `src/pages/<Name>/<Name>.tsx` with a barrel `index.ts`
- Each component/page has a co-located test file `<Name>.test.tsx`
- Use path aliases: `@components/`, `@pages/`, `@hooks/`
- Use const arrow functions, not function declarations — enforced by ESLint (`func-style: expression`)

## Workflow

- Always run `/simplify` after completing an issue, before opening the PR.

## Related repos

- **akli-infrastructure**: API Gateway, Lambda, and DynamoDB resources for the Pokedex API
- **personal-website**: Apps page where the Pokedex card links to
