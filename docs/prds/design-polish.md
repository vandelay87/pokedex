# PRD: Pokedex Design & Polish

## Overview

Apply a Game Boy Color-era visual design to the Pokedex frontend. The app should look and feel like the classic Pokedex from Pokemon Red/Blue — pixel fonts, chunky UI elements, type-coloured badges, and a retro colour palette. This PRD covers all visual styling, animations, and responsive polish. It assumes the Frontend Core epic is complete (functional components, data fetching, layout structure all in place).

## Problem Statement

The Frontend Core epic delivers a functional but unstyled Pokedex. Without visual design, the app doesn't showcase frontend craft or evoke the classic Pokemon feel — both important for a portfolio piece aimed at recruiters.

## Goals

- The app immediately reads as "classic Pokedex" — retro, nostalgic, pixel-art aesthetic
- Every Pokemon type has a distinct colour that's used consistently across badges and UI accents
- Animations are subtle and purposeful — they enhance the retro feel without slowing down interactions
- The design works well on both desktop and mobile
- The app looks polished and intentional — portfolio-quality, not a throwback gimmick

## Non-Goals

- Dark mode — the Pokedex has a fixed retro aesthetic
- Original Game Boy green monochrome — using GBC-era colour palette instead
- Redesigning component structure or data fetching — that's the Frontend Core epic
- Sound effects or audio — would be fun but out of scope
- Physical Pokedex device frame/shell around the app — keep it clean, not gimmicky

## User Stories

- As a visitor, I want the Pokedex to feel like the classic Pokemon games so I immediately recognise what it is.
- As a recruiter viewing the portfolio, I want to see polished, intentional design choices that demonstrate frontend skill.
- As a mobile user, I want the design to feel just as polished and usable as on desktop.

## Design & UX

### Colour palette

#### Base colours

- **Background**: off-white/cream (`#F8F0E0`) — mimics the GBC screen warmth
- **Surface**: lighter cream (`#FFF8EC`) — cards, panels
- **Border**: dark grey-brown (`#504040`) — chunky pixel-style borders
- **Text primary**: near-black (`#383030`) — body text
- **Text secondary**: medium grey (`#787070`) — labels, IDs
- **Accent**: Pokedex red (`#E03030`) — active states, highlights

#### Type colours

Each Pokemon type gets a distinct badge colour, matching the classic game palette:

| Type | Colour | Type | Colour |
|------|--------|------|--------|
| Normal | `#A8A878` | Ice | `#98D8D8` |
| Fire | `#F08030` | Fighting | `#C03028` |
| Water | `#6890F0` | Poison | `#A040A0` |
| Grass | `#78C850` | Ground | `#E0C068` |
| Electric | `#F8D030` | Flying | `#A890F0` |
| Psychic | `#F85888` | Bug | `#A8B820` |
| Rock | `#B8A038` | Ghost | `#705898` |
| Dragon | `#7038F8` | Dark | `#705848` |
| Steel | `#B8B8D0` | Fairy | `#EE99AC` |

Type badge text colour should be white or dark depending on the background colour contrast (WCAG AA minimum).

### Typography

- **Primary font**: a pixel/retro font for headings, Pokemon names, stat labels, and UI elements. Use a web font such as "Press Start 2P" (Google Fonts) or similar GBC-era pixel font.
- **Body font**: a clean monospace or the same pixel font at a smaller size for descriptions and longer text.
- **Font sizes**: keep sizes generous for readability — pixel fonts are harder to read at small sizes. Minimum 12px for pixel fonts, 14px for body text.

### Component styling

#### Pokemon list

- Cards arranged in a vertical scrollable list
- Each card has a chunky 2px solid border in the border colour
- Subtle background colour on hover (slightly darker cream)
- Selected card has the accent red border or background highlight
- Pokemon ID displayed as `#001` format in secondary text colour
- Type badges as small coloured pills with rounded corners beside the name
- Sprite displayed at native pixel-art size with `image-rendering: pixelated` to preserve crisp pixels (no anti-aliasing blur)

#### Search input

- Styled to match the retro theme — chunky border, pixel font placeholder text
- Clear button styled as a small "×" in the accent colour

#### Detail panel

- Chunky bordered panel matching the card style
- Pokemon name as a large heading in pixel font
- Sprite displayed larger than in the list, centred, with `image-rendering: pixelated`
- Type badges displayed prominently
- Stats section with labelled bars:
  - Bar background in a muted colour
  - Bar fill colour based on stat value (low = red, medium = yellow, high = green) or a single accent colour
  - Numeric value displayed at the end of the bar
  - Labels in pixel font
- Pokemon description in body font, styled as a text box with border (like the in-game text boxes)
- Height/weight displayed with appropriate units (decimetres → m, hectograms → kg)

#### Empty/loading/error states

- Loading state: simple pixel-style loading indicator or pulsing Pokeball
- Error state: retro-styled error message with chunky retry button
- Empty search: "No Pokemon found" message in pixel font
- No selection: "Select a Pokemon" prompt in the detail panel

### Animations

Keep animations subtle and retro-appropriate:

- **List filter**: items fade out/in smoothly when search filters the list (no layout jank)
- **Detail panel open (mobile)**: slide in from the right, matching the Pokedex page-flip feel
- **Detail panel close (mobile)**: slide out to the right
- **Card hover**: slight scale up (1.02) with a quick transition
- **Card select**: brief press/bounce effect
- **Stat bars**: animate from 0 to value on panel open (staggered, quick)
- **Sprite**: subtle fade-in when the detail panel opens

All animations should respect `prefers-reduced-motion` — disable or reduce animations when the user has this preference set.

### Responsive design (mobile-first)

All styles are written mobile-first — base styles target mobile, desktop overrides are added via `min-width: 768px` media queries. This ensures the mobile experience is the foundation, not an afterthought.

- **Mobile (default, <768px)**: full-width list, generous touch targets (minimum 44×44px), full-screen overlay detail panel. Search input full width. Cards sized for comfortable thumb tapping. Spacing and font sizes optimised for small screens.
- **Desktop (≥768px)**: split view via media query override. List takes ~40% width, detail panel takes ~60%. Both scroll independently. Hover states added (not present on mobile).

## Technical Considerations

### CSS Modules (mobile-first)

All styles use CSS Modules (project convention). Each component gets a co-located `.module.css` file. Styles must be written mobile-first: base styles for mobile, then `@media (min-width: 768px)` for desktop overrides. Never use `max-width` media queries.

### Pixel font loading

- Self-host the "Press Start 2P" woff2 file in `src/assets/fonts/` — no third-party dependency, no CORS/CSP issues, faster load (~8KB)
- Define via `@font-face` in the global styles with `font-display: swap` to avoid invisible text during font load
- Fallback font stack: `'Press Start 2P', 'Courier New', monospace`

### Image rendering

- All Pokemon sprites must use `image-rendering: pixelated` to render pixel art crisply at scaled sizes. Modern Safari (16+) supports this natively — no vendor prefix needed.

### Animations implementation

- Use CSS transitions for simple hover/focus effects
- Use CSS `@keyframes` for stat bar fills and slide-in/out
- Mobile panel slide: use `transform: translateX(100%)` for the slide animation — never animate `left`/`right`/`width` (causes layout thrashing). When the panel is closed, use `visibility: hidden` (not just off-screen transform) so screen readers don't read hidden content.
- Stat bar stagger: each bar starts ~75ms after the previous one (e.g., `animation-delay: calc(var(--stat-index) * 75ms)`)
- Use `@media (prefers-reduced-motion: reduce)` to disable animations
- Use `@media (hover: hover)` to scope hover states — prevents "stuck" hover on touch devices
- Keep all animation durations short (150–300ms) to feel snappy, not sluggish
- Panel close animation timing: trigger the slide-out animation first, then clear the URL state on `transitionend` — otherwise React unmounts the component before the animation plays

### Design tokens

- All design tokens (base palette colours + type colours + z-index scale) live in a single `src/styles/tokens.css` file, imported at the app root
- Base palette: `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-secondary`, `--color-accent`
- Type colours: `--type-fire`, `--type-water`, etc.
- Z-index scale: `--z-overlay: 100` (for the mobile detail panel)
- Type badge component receives the type name as a prop and applies the colour via inline style in JSX: `style={{ backgroundColor: 'var(--type-fire)' }}`. This avoids 18 separate CSS classes.
- Type badge text colour (white or dark) is precomputed per type and defined alongside the type colour token (e.g., `--type-fire-text: #fff`)

### Testing

- **Visual regression**: not in scope for this epic — manual visual QA is sufficient
- **Component tests**: update existing tests if component markup changes (e.g., new CSS classes, aria attributes)
- **Accessibility**: verify colour contrast ratios meet WCAG AA for all type badge colours against their text
- **Animation**: verify `prefers-reduced-motion` media query is applied

## Acceptance Criteria

- [ ] Base colour palette is applied: off-white background, cream surfaces, dark borders, Pokedex red accent
- [ ] Pixel font ("Press Start 2P" or equivalent) is loaded and applied to headings, names, labels, and UI elements
- [ ] Font loading uses `font-display: swap` with a monospace fallback
- [ ] All 18 Pokemon type colours are defined as CSS custom properties
- [ ] Type badges display with correct background colour and accessible text contrast (WCAG AA)
- [ ] Pokemon sprites render with `image-rendering: pixelated` at crisp pixel-art quality
- [ ] Pokemon list cards have chunky borders, hover state, and selected state
- [ ] Pokemon ID is displayed in `#001` format
- [ ] Search input is styled with retro theme — chunky border, pixel font placeholder
- [ ] Detail panel has chunky bordered styling matching the card theme
- [ ] Stat bars animate from 0 to value on panel open, each bar staggered ~75ms after the previous
- [ ] Pokemon description is styled as a retro text box with border
- [ ] Height and weight are displayed with converted units — e.g., Bulbasaur (height: 7, weight: 69) displays as "0.7 m" and "6.9 kg"
- [ ] Loading state shows a pixel-style loading indicator
- [ ] Error state shows a retro-styled error message with retry button
- [ ] Empty search state shows "No Pokemon found" in pixel font
- [ ] No-selection state shows a prompt in the detail panel
- [ ] Mobile detail panel slides in from the right on open (`transform: translateX`), slides out on close
- [ ] Panel uses `visibility: hidden` when closed (not just off-screen) so screen readers don't read hidden content
- [ ] Panel close animation completes before URL state is cleared (no premature unmount)
- [ ] Card hover has a subtle scale-up transition
- [ ] Stat bar animation, card hover, and panel slide all respect `prefers-reduced-motion`
- [ ] The app renders correctly at 375px width without horizontal scrolling
- [ ] Mobile layout (default): full-width list, full-screen overlay detail panel, generous spacing and touch targets
- [ ] Desktop layout (≥768px): list ~40% width, detail panel ~60%, both independently scrollable
- [ ] Touch targets are minimum 44×44px on mobile
- [ ] Hover states are scoped to `@media (hover: hover)` — no stuck hover on touch devices
- [ ] All existing component and integration tests still pass after styling changes
- [ ] All tests pass (`pnpm test`)

## Open Questions

- Should the stat bars use a gradient (red → yellow → green) based on stat value, or a single accent colour?
- Should the app include a subtle background texture (e.g., scanlines or pixel grid) to enhance the retro feel, or keep the background clean?
- Should Pokemon cards in the list show the sprite, or just name/ID/types to keep it compact (with the sprite reserved for the detail panel)?
