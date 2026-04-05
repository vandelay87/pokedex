# PRD: Pokedex Frontend Core

## Overview

Build the core frontend for the Pokedex app — a searchable, browsable encyclopedia of Gen 1 Pokemon. Deployed as a standalone app at `akli.dev/apps/pokedex` (like sand-box), consuming the Pokedex API at `api.akli.dev/pokedex`. This PRD covers functional structure, components, routing, and API integration. Visual design and Gameboy aesthetic are handled in a separate Design & Polish PRD.

## Problem Statement

The Pokedex API (separate epic) serves Pokemon data but has no user-facing interface. This epic builds the frontend that lets visitors browse and search Pokemon, view detailed information, and interact with the data in a way that feels like the classic Pokedex from the games.

## Goals

- Visitors can browse all 151 Gen 1 Pokemon in a scrollable list
- Visitors can search by name with instant filtering as they type
- Visitors can select a Pokemon to view full details (stats, type, description) in an overlay panel
- Selected Pokemon state is reflected in the URL (`?id=1`) so entries are shareable/bookmarkable
- The app is performant — data is fetched once and cached, interactions feel instant
- The app is accessible — keyboard navigable, screen reader friendly

## Non-Goals

- Visual design, Gameboy aesthetic, animations — separate Design & Polish PRD
- Filtering by type, generation, or other attributes — future iteration
- Offline support / service worker — future iteration
- SSR — standalone static app like sand-box
- Backend/API changes — separate epic in akli-infrastructure

## User Stories

- As a visitor, I want to see a list of all Gen 1 Pokemon so I can browse through them.
- As a visitor, I want to type a name and see the list filter instantly so I can find a specific Pokemon.
- As a visitor, I want to click a Pokemon and see its details (stats, type, description) without losing my place in the list.
- As a visitor, I want to share a link to a specific Pokemon and have the detail panel open when someone visits that link.
- As a visitor, I want the app to load quickly and feel responsive.
- As a visitor using a screen reader, I want to navigate the list and detail panel with keyboard and have content announced properly.

## Design & UX

Minimal/unstyled for this epic — just the functional structure. The Design & Polish PRD will handle the Gameboy aesthetic.

### Layout

- **Desktop**: split view — Pokemon list on the left, detail panel on the right. Detail panel shows a placeholder/empty state when no Pokemon is selected.
- **Mobile**: list view fills the screen. Selecting a Pokemon opens the detail panel as a full-screen overlay with a back button.

### States

- **Loading**: shown while the Pokemon list is being fetched on first load
- **Error**: shown if the API call fails, with a retry option
- **Empty search**: shown when the search filter matches no Pokemon
- **No selection**: detail panel shows a prompt to select a Pokemon
- **Selected**: detail panel shows full Pokemon details

### Search behaviour

- Text input at the top of the list
- Filters the list as the user types — no debounce needed for 151 items (filtering is instant, client-side)
- Case-insensitive match on Pokemon name
- Clear button appears when input has text
- Pressing Escape clears the search

### Detail panel

- Shows: name, ID, sprite, types, height, weight, category, description, gender rate, base stats
- Stats displayed as labelled bars (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) with numeric values
- Closing the panel (back button on mobile, or clicking away on desktop) clears the URL state

### URL state

- No Pokemon selected: `akli.dev/apps/pokedex`
- Pokemon selected: `akli.dev/apps/pokedex?id=25` (Pikachu)
- On initial load, if `?id=` is present, fetch the Pokemon detail and open the panel automatically

## Technical Considerations

### Data fetching

- Fetch the full Pokemon list (`GET https://api.akli.dev/pokedex/pokemon`) once on app mount
- Cache the list in React state — no refetching on subsequent renders
- Fetch individual Pokemon detail (`GET https://api.akli.dev/pokedex/pokemon/{id}`) when a Pokemon is selected
- Cache fetched details in a `useRef<Record<number, PokemonDetail>>` — the cache doesn't need to trigger re-renders (the selected Pokemon state change handles that)
- Use `useEffect` + `useState` for data fetching — simpler and well-understood for two fetch calls. Show loading/error states via component state, not Suspense.
- Wrap the detail panel in an error boundary to catch and display fetch failures without crashing the list

### Component structure

```
src/
  components/
    PokemonList/        — scrollable list of Pokemon cards
    PokemonCard/        — single card in the list (id, name, sprite, types)
    PokemonDetail/      — full detail panel (stats, description, etc.)
    SearchInput/        — search text input with clear button
    StatBar/            — single stat bar (label, value, bar fill)
    ErrorBoundary/      — catches fetch errors, shows retry UI
  hooks/
    usePokemonList.ts   — fetches and caches the full Pokemon list
    usePokemonDetail.ts — fetches and caches individual Pokemon details
    useSearchFilter.ts  — manages search input state and filtered list
    useSelectedPokemon.ts — manages selected Pokemon state synced with URL params
  pages/
    Pokedex/            — main page composing all components
  types/
    pokemon.ts          — TypeScript interfaces for API response shapes
```

### Type definitions

```typescript
interface PokemonSummary {
  id: number
  name: string
  types: string[]
  sprite: string
}

interface PokemonDetail extends PokemonSummary {
  height: number
  weight: number
  category: string
  description: string
  genderRate: number
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
}

interface PokemonListResponse {
  pokemon: PokemonSummary[]
  count: number
  nextToken: string | null  // included by the API for future pagination — frontend ignores this field
}
```

### Routing and URL state

- Use `react-router-dom`'s `useSearchParams` hook to manage the `?id=` parameter — it's already installed and handles serialisation cleanly.
- `useSelectedPokemon` hook wraps `useSearchParams`, exposing a `selectedId` and `setSelectedId` interface.

### Performance

- The full list (151 items, ~30KB JSON) loads in a single request — no pagination needed
- Search filtering is a simple `Array.filter` on the cached list — no debounce needed for 151 items
- Detail fetches are cached in memory — each Pokemon is fetched at most once per session
- Images (sprites) use lazy loading (`loading="lazy"`) for list items below the fold

### Accessibility

- Search input has a visible label or `aria-label`
- Pokemon list is a semantic list (`<ul>`) with items as `<li>`
- Each Pokemon card is a `<button>` (interactive) with descriptive `aria-label` (e.g., "Bulbasaur, Grass and Poison type")
- Detail panel has `role="region"` with `aria-label="Pokemon details"`
- On mobile, the overlay panel traps focus and returns focus to the triggering card on close
- Stat bars use `aria-label` with the numeric value (e.g., "HP: 45 out of 255")
- Escape key closes the detail panel (mobile overlay)

### API contract

The API response shapes match the TypeScript interfaces exactly — both the API and frontend are designed together. The API uses camelCase field names (`genderRate`, `specialAttack`), not snake_case.

### Prerequisites

- The Pokedex API must be deployed and accessible at `api.akli.dev/pokedex` with CORS configured to allow `https://akli.dev` (handled in the API & Data epic in akli-infrastructure).

### Deployment

- Built as a static SPA with Vite (`vite build`)
- Vite config must set `base: '/apps/pokedex/'` so asset URLs resolve correctly when served from a subpath
- Output deployed to S3 at `apps/pokedex/` path (same pattern as sand-box)
- CloudFront serves it from the existing distribution with an `apps/pokedex*` cache behaviour

### Responsive breakpoint

- Desktop/mobile breakpoint: 768px. Below 768px, the detail panel renders as a full-screen overlay instead of a side panel.

### Testing

TDD is the preferred approach. Tests should be written before implementation.

- **Component tests**: each component tested with Testing Library — rendering, user interactions, state changes
- **Hook tests**: `usePokemonList`, `usePokemonDetail`, `useSearchFilter`, `useSelectedPokemon` tested in isolation
- **Integration test**: full Pokedex page — search filters the list, selecting a Pokemon opens the detail panel, URL updates
- **Error states**: API failure shows error UI with retry, invalid `?id=` param handled gracefully
- **Accessibility**: test keyboard navigation, focus management, aria attributes

## Acceptance Criteria

- [ ] Pokemon list displays all 151 Gen 1 Pokemon fetched from `api.akli.dev/pokedex/pokemon`
- [ ] Each list item shows the Pokemon's name, ID, sprite, and types
- [ ] Search input filters the list by name as the user types (case-insensitive)
- [ ] Clear button appears when search input has text and clears the input when clicked
- [ ] Pressing Escape clears the search input
- [ ] Empty search state is shown when no Pokemon match the filter
- [ ] Clicking a Pokemon opens the detail panel with full information
- [ ] Detail panel shows: name, ID, sprite, types, height, weight, category, description, gender rate, base stats
- [ ] Base stats are displayed as labelled bars with numeric values
- [ ] Selecting a Pokemon updates the URL to `?id={id}` without a full page navigation
- [ ] Loading the app with `?id={id}` in the URL opens the detail panel for that Pokemon
- [ ] Invalid `?id=` values (non-numeric, out of range, empty) are ignored — panel stays closed and the parameter is removed from the URL
- [ ] Loading state is shown while the Pokemon list is being fetched
- [ ] Error state with retry button is shown if the API call fails
- [ ] Detail fetch errors are caught by an error boundary and displayed without crashing the list
- [ ] Fetched Pokemon details are cached — selecting the same Pokemon twice does not re-fetch
- [ ] On desktop, list and detail panel are shown side by side (split view)
- [ ] On mobile, detail panel opens as a full-screen overlay with a back button
- [ ] Mobile overlay traps focus and returns focus to the triggering card on close
- [ ] Search input, list items, and detail panel are keyboard navigable
- [ ] Screen reader accessible: semantic HTML, aria labels, announced content
- [ ] Pressing Escape closes the detail panel (mobile overlay) and returns focus to the triggering card
- [ ] Sprite images use lazy loading for list items below the fold
- [ ] Component tests cover rendering, interactions, and state changes for each component
- [ ] Hook tests cover data fetching, caching, filtering, and URL sync
- [ ] Integration test covers the full search → select → detail flow
- [ ] All tests pass (`pnpm test`)

## Open Questions

- Should the detail panel support navigating between Pokemon (next/previous arrows), or is selecting from the list the only way?
- Should there be a loading skeleton for the detail panel while fetching, or is a simple spinner sufficient?
- What should the max stat value be for the stat bars — 255 (absolute max in Pokemon) or the highest stat among Gen 1 (180, Mewtwo's Sp. Atk)?
