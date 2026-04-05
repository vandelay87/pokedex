# Pokedex

A searchable encyclopedia of Gen 1 Pokemon, styled after the classic Game Boy Color Pokedex. Built as a portfolio piece for [akli.dev](https://akli.dev).

Live at: [akli.dev/apps/pokedex](https://akli.dev/apps/pokedex)

## Features

- Browse all 151 Gen 1 Pokemon
- Search by name with instant filtering
- View detailed stats, types, and descriptions
- Responsive layout — split view on desktop, overlay on mobile
- Keyboard navigable and screen reader accessible

## Stack

- React 19 + TypeScript
- Vite 7
- CSS Modules
- Vitest + Testing Library

## Getting started

```bash
pnpm install
pnpm dev
```

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm lint` | Lint with ESLint |
| `pnpm format` | Format with Prettier + ESLint |

## Architecture

```
src/
  api/          API client (fetches from api.akli.dev/pokedex)
  components/   Reusable UI components (PokemonCard, PokemonList, etc.)
  hooks/        Custom hooks (data fetching, search, URL state, media query)
  pages/        Page components (Pokedex)
  types/        TypeScript interfaces
  utils/        Shared utilities
```

## Related repos

- [akli-infrastructure](https://github.com/vandelay87/akli-infrastructure) — API Gateway, Lambda, DynamoDB backend
- [personal-website](https://github.com/vandelay87/personal-website) — Portfolio site where the Pokedex is linked from
