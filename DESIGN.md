# Design System Inspiration of Airbnb

## 0. 2026-04 Research-First iOS Update

### Design Brief

I am designing an Airbnb-inspired iOS-first design system for Backtrack mobile users (travelers + hosts style audience) that helps them quickly scan listings, compare options, and complete booking-like actions with confidence. It should feel warm, calm, and premium-simple. The user job is "help me decide fast without feeling overwhelmed." Main objection to overcome: "Can I trust what I am seeing and act quickly?" They should remember: photography-first browsing with one confident brand accent. Constraints: React Native + NativeWind token architecture, existing token key compatibility, and strict semantic token usage.

### Research Summary

```text
📊 RESEARCH SUMMARY
────────────────────────────────────────
Queries: 7 | Screens analyzed: 8

WHAT I FOUND:
	Airbnb iOS is photography-first with typographic clarity, very light separators,
	and one dominant accent (#FF385C). Interaction density is low, with generous
	vertical rhythm and clear primary actions.

	Key findings (facts with sources):
	• App Store (Airbnb iOS): "8+ million vacation rentals in 240+ countries and regions" and "Use over 80 filtering options" — supports dense filter architecture with simple UI chrome.
	• App Store (Airbnb iOS): "day-by-day view" in Trips tab and "all in one app" messaging — reinforces timeline cards + modular task surfaces.
	• Google Design (Airbnb: Communicating Clarity and Charm): bottom navigation unified across iOS/Android with frequent destinations always available.
	• Google Design: Airbnb emphasized typography over icon-only communication; hierarchy is driven by text size/weight variation, not decorative chrome.
	• Google Design: shared-element transitions enlarge listing imagery during navigation, keeping photos as the continuity anchor.
	• Karri Saarinen (Airbnb DLS): system is mostly platform-agnostic, but navigation/system iconography/contextual actions follow platform conventions.
	• Karri Saarinen (Airbnb DLS): components are defined by required + optional elements, not only atomic fragments.
	• Visual audit (official App Store screenshots + iOS clone screenshots): recurring geometry is pill search bars, ~14px card radius, 8px CTA corners, soft near-invisible dividers, and compact tab labels near 10pt.

	Notable differences:
	• Marketing screenshots are cleaner/brighter than in-app exploration flows, but both preserve the same hierarchy and accent discipline.
	• Content-heavy trip/detail views increase density while preserving neutral surfaces and soft separators.

GAPS:
	• Airbnb does not publicly publish complete iOS token primitives (full spacing/type scales), so exact internal values are inferred from first-party screenshots and public case studies.
────────────────────────────────────────
```

### Pattern Table (Top References)

| Aspect         | Airbnb App Store Screens   | Google Design Case Study         | Karri Saarinen DLS Notes                  | Pattern                                  |
| -------------- | -------------------------- | -------------------------------- | ----------------------------------------- | ---------------------------------------- |
| Primary accent | Rausch pink CTA accents    | Brand-forward action emphasis    | Unified visual language                   | One strong accent, used sparingly        |
| Layout density | Airy cards, strong imagery | Clarity + focus                  | Reusable cross-platform components        | Space first, then information            |
| Navigation     | Bottom tabs persistent     | Bottom nav called out explicitly | Platform-aware nav conventions            | Always-available primary destinations    |
| Typography     | Large confident headings   | "Very typographic" interface     | Component semantics over decorative atoms | Text carries meaning and trust           |
| Motion         | Implied continuity         | Shared-element transitions       | Interaction consistency across platforms  | Motion communicates hierarchy, not flair |

### Steal List (Applied)

| Source                       | What                                                         | Why It Works                                         | How We Use It                                                |
| ---------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------ |
| Airbnb App Store             | "Start your search" in a pill-shaped global search entry     | One clear top-of-screen action reduces decision cost | Keep pill search as high-priority entry pattern              |
| Airbnb App Store             | "Use over 80 filtering options" with still-minimal UI chrome | High capability without visual clutter               | Keep advanced filtering but maintain low-chrome containers   |
| Google Design                | Frequent destinations always in bottom nav                   | Reduces orientation cost across deep journeys        | Keep stable tab destinations and compact labels              |
| Google Design                | Shared-element transitions for photo continuity              | Preserves context between list and detail            | Use image-continuity motion patterns in listing flows        |
| Karri DLS                    | Required + optional component anatomy                        | Scales complexity without losing consistency         | Define each component by required semantics + optional slots |
| App Store + screenshot audit | Soft separators and low-contrast borders                     | Keeps interface calm and premium                     | Use hof[200]/hof[300] border system, avoid heavy outlines    |

### Built Token Decisions (Implemented)

- Color system
  - Divider is now mapped to `hof[200]` (`#EBEBEB`) for true hairline behavior.
  - Default borders use `hof[300]` with lighter input borders at `hof[200]`.
  - Supporting text now uses `hof[600]` to reduce contrast harshness in dense views.
  - Success status uses `babu[500]` for clear semantic contrast.
- Metrics system
  - `spacing.md2` corrected to 12 (was 14) to restore 8pt rhythm integrity.
  - Card radius baseline updated to 14 (`borderRadius.md` and `borderRadius.primary`).
- Typography system
  - Font stacks now prefer `Airbnb Cereal`/`Circular` before system fallbacks.
  - `presets.screenTitle` upgraded to 26/700 with tighter heading tracking for Airbnb-like hierarchy.

### Quality Gate Snapshot

- Functional: semantic tokens preserved; no key removals.
- Visual: closer to Airbnb iOS evidence (lighter separators, stronger headline hierarchy, warmer support text).
- Persuasion: photography-first and single-accent strategy maintained.
- Polish: spacing rhythm and border semantics corrected at token level.

## 1. Visual Theme & Atmosphere

Airbnb's website is a warm, photography-forward marketplace that feels like flipping through a travel magazine where every page invites you to book. The design operates on a foundation of pure white (`#ffffff`) with the iconic Rausch Red (`#ff385c`) — named after Airbnb's first street address — serving as the singular brand accent. The result is a clean, airy canvas where listing photography, category icons, and the red CTA button are the only sources of color.

The typography uses Airbnb Cereal VF — a custom variable font that's warm and approachable, with rounded terminals that echo the brand's "belong anywhere" philosophy. The font operates in a tight weight range: 500 (medium) for most UI, 600 (semibold) for emphasis, and 700 (bold) for primary headings. Slight negative letter-spacing (-0.18px to -0.44px) on headings creates a cozy, intimate reading experience rather than the compressed efficiency of tech companies.

What distinguishes Airbnb is its palette-based token system (`--palette-*`) and multi-layered shadow approach. The primary card shadow uses a three-layer stack (`rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px`) that creates a subtle, warm lift. Combined with generous border-radius (8px–32px), circular navigation controls (50%), and a category pill bar with horizontal scrolling, the interface feels tactile and inviting — designed for browsing, not commanding.

**Key Characteristics:**

- Pure white canvas with Rausch Red (`#ff385c`) as singular brand accent
- Airbnb Cereal VF — custom variable font with warm, rounded terminals
- Palette-based token system (`--palette-*`) for systematic color management
- Three-layer card shadows: border ring + soft blur + stronger blur
- Generous border-radius: 8px buttons, 14px badges, 20px cards, 32px large elements
- Circular navigation controls (50% radius)
- Photography-first listing cards — images are the hero content
- Near-black text (`#222222`) — warm, not cold
- Luxe Purple (`#460479`) and Plus Magenta (`#92174d`) for premium tiers

## 2. Color Palette & Roles

### Primary Brand

- **Rausch Red** (`#ff385c`): `--palette-bg-primary-core`, primary CTA, brand accent, active states
- **Deep Rausch** (`#e00b41`): `--palette-bg-tertiary-core`, pressed/dark variant of brand red
- **Error Red** (`#c13515`): `--palette-text-primary-error`, error text on light
- **Error Dark** (`#b32505`): `--palette-text-secondary-error-hover`, error hover

### Premium Tiers

- **Luxe Purple** (`#460479`): `--palette-bg-primary-luxe`, Airbnb Luxe tier branding
- **Plus Magenta** (`#92174d`): `--palette-bg-primary-plus`, Airbnb Plus tier branding

### Text Scale

- **Near Black** (`#222222`): `--palette-text-primary`, primary text — warm, not cold
- **Focused Gray** (`#3f3f3f`): `--palette-text-focused`, focused state text
- **Secondary Gray** (`#6a6a6a`): Secondary text, descriptions
- **Disabled** (`rgba(0,0,0,0.24)`): `--palette-text-material-disabled`, disabled state
- **Link Disabled** (`#929292`): `--palette-text-link-disabled`, disabled links

### Interactive

- **Legal Blue** (`#428bff`): `--palette-text-legal`, legal links, informational
- **Border Gray** (`#c1c1c1`): Border color for cards and dividers
- **Light Surface** (`#f2f2f2`): Circular navigation buttons, secondary surfaces

### Surface & Shadows

- **Pure White** (`#ffffff`): Page background, card surfaces
- **Card Shadow** (`rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px`): Three-layer warm lift
- **Hover Shadow** (`rgba(0,0,0,0.08) 0px 4px 12px`): Button hover elevation

## 3. Typography Rules

### Font Family

- **Primary**: `Airbnb Cereal VF`, fallbacks: `Circular, -apple-system, system-ui, Roboto, Helvetica Neue`
- **OpenType Features**: `"salt"` (stylistic alternates) on specific caption elements

### Hierarchy

| Role                | Font             | Size           | Weight  | Line Height  | Letter Spacing | Notes                       |
| ------------------- | ---------------- | -------------- | ------- | ------------ | -------------- | --------------------------- |
| Section Heading     | Airbnb Cereal VF | 28px (1.75rem) | 700     | 1.43         | normal         | Primary headings            |
| Card Heading        | Airbnb Cereal VF | 22px (1.38rem) | 600     | 1.18 (tight) | -0.44px        | Category/card titles        |
| Card Heading Medium | Airbnb Cereal VF | 22px (1.38rem) | 500     | 1.18 (tight) | -0.44px        | Lighter variant             |
| Sub-heading         | Airbnb Cereal VF | 21px (1.31rem) | 700     | 1.43         | normal         | Bold sub-headings           |
| Feature Title       | Airbnb Cereal VF | 20px (1.25rem) | 600     | 1.20 (tight) | -0.18px        | Feature headings            |
| UI Medium           | Airbnb Cereal VF | 16px (1.00rem) | 500     | 1.25 (tight) | normal         | Nav, emphasized text        |
| UI Semibold         | Airbnb Cereal VF | 16px (1.00rem) | 600     | 1.25 (tight) | normal         | Strong emphasis             |
| Button              | Airbnb Cereal VF | 16px (1.00rem) | 500     | 1.25 (tight) | normal         | Button labels               |
| Body / Link         | Airbnb Cereal VF | 14px (0.88rem) | 400     | 1.43         | normal         | Standard body               |
| Body Medium         | Airbnb Cereal VF | 14px (0.88rem) | 500     | 1.29 (tight) | normal         | Medium body                 |
| Caption Salt        | Airbnb Cereal VF | 14px (0.88rem) | 600     | 1.43         | normal         | `"salt"` feature            |
| Small               | Airbnb Cereal VF | 13px (0.81rem) | 400     | 1.23 (tight) | normal         | Descriptions                |
| Tag                 | Airbnb Cereal VF | 12px (0.75rem) | 400–700 | 1.33         | normal         | Tags, prices                |
| Badge               | Airbnb Cereal VF | 11px (0.69rem) | 600     | 1.18 (tight) | normal         | `"salt"` feature            |
| Micro Uppercase     | Airbnb Cereal VF | 8px (0.50rem)  | 700     | 1.25 (tight) | 0.32px         | `text-transform: uppercase` |

### Principles

- **Warm weight range**: 500–700 dominate. No weight 300 or 400 for headings — Airbnb's type is always at least medium weight, creating a warm, confident voice.
- **Negative tracking on headings**: -0.18px to -0.44px letter-spacing on display creates intimate, cozy headings rather than cold, compressed ones.
- **"salt" OpenType feature**: Stylistic alternates on specific UI elements (badges, captions) create subtle glyph variations that add visual interest.
- **Variable font precision**: Cereal VF enables continuous weight interpolation, though the design system uses discrete stops at 500, 600, and 700.

## 4. Component Stylings

### Buttons

**Primary Dark**

- Background: `#222222` (near-black, not pure black)
- Text: `#ffffff`
- Padding: 0px 24px
- Radius: 8px
- Hover: transitions to error/brand accent via `var(--accent-bg-error)`
- Focus: `0 0 0 2px var(--palette-grey1000)` ring + scale(0.92)

**Circular Nav**

- Background: `#f2f2f2`
- Text: `#222222`
- Radius: 50% (circle)
- Hover: shadow `rgba(0,0,0,0.08) 0px 4px 12px` + translateX(50%)
- Active: 4px white border ring + focus shadow
- Focus: scale(0.92) shrink animation

### Cards & Containers

- Background: `#ffffff`
- Radius: 14px (badges), 20px (cards/buttons), 32px (large)
- Shadow: `rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px` (three-layer)
- Listing cards: full-width photography on top, details below
- Carousel controls: circular 50% buttons

### Inputs

- Search: `#222222` text
- Focus: `var(--palette-bg-primary-error)` background tint + `0 0 0 2px` ring
- Radius: depends on context (search bar uses pill-like rounding)

### Navigation

- White sticky header with search bar centered
- Airbnb logo (Rausch Red) left-aligned
- Category filter pills: horizontal scroll below search
- Circular nav controls for carousel navigation
- "Become a Host" text link, avatar/menu right-aligned

### Image Treatment

- Listing photography fills card top with generous height
- Image carousel with dot indicators
- Heart/wishlist icon overlay on images
- 8px–14px radius on contained images

## 5. Layout Principles

### Spacing System

- Base unit: 8px
- Scale: 2px, 3px, 4px, 6px, 8px, 10px, 11px, 12px, 15px, 16px, 22px, 24px, 32px

### Grid & Container

- Full-width header with centered search
- Category pill bar: horizontal scrollable row
- Listing grid: responsive multi-column (3–5 columns on desktop)
- Full-width footer with link columns

### Whitespace Philosophy

- **Travel-magazine spacing**: Generous vertical padding between sections creates a leisurely browsing pace — you're meant to scroll slowly, like browsing a magazine.
- **Photography density**: Listing cards are packed relatively tightly, but each image is large enough to feel immersive.
- **Search bar prominence**: The search bar gets maximum vertical space in the header — finding your destination is the primary action.

### Border Radius Scale

- Subtle (4px): Small links
- Standard (8px): Buttons, tabs, search elements
- Badge (14px): Status badges, labels
- Card (20px): Feature cards, large buttons
- Large (32px): Large containers, hero elements
- Circle (50%): Nav controls, avatars, icons

## 6. Depth & Elevation

| Level                  | Treatment                                                                                     | Use                            |
| ---------------------- | --------------------------------------------------------------------------------------------- | ------------------------------ |
| Flat (Level 0)         | No shadow                                                                                     | Page background, text blocks   |
| Card (Level 1)         | `rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px` | Listing cards, search bar      |
| Hover (Level 2)        | `rgba(0,0,0,0.08) 0px 4px 12px`                                                               | Button hover, interactive lift |
| Active Focus (Level 3) | `rgb(255,255,255) 0px 0px 0px 4px` + focus ring                                               | Active/focused elements        |

**Shadow Philosophy**: Airbnb's three-layer shadow system creates a warm, natural lift. Layer 1 (`0px 0px 0px 1px` at 0.02 opacity) is an ultra-subtle border. Layer 2 (`0px 2px 6px` at 0.04) provides soft ambient shadow. Layer 3 (`0px 4px 8px` at 0.1) adds the primary lift. This graduated approach creates shadows that feel like natural light rather than CSS effects.

## 7. Do's and Don'ts

### Do

- Use `#222222` (warm near-black) for text — never pure `#000000`
- Apply Rausch Red (`#ff385c`) only for primary CTAs and brand moments — it's the singular accent
- Use Airbnb Cereal VF at weight 500–700 — the warm weight range is intentional
- Apply the three-layer card shadow for all elevated surfaces
- Use generous border-radius: 8px for buttons, 20px for cards, 50% for controls
- Use photography as the primary visual content — listings are image-first
- Apply negative letter-spacing (-0.18px to -0.44px) on headings for intimacy
- Use circular (50%) buttons for carousel/navigation controls

### Don't

- Don't use pure black (`#000000`) for text — always `#222222` (warm)
- Don't apply Rausch Red to backgrounds or large surfaces — it's an accent only
- Don't use thin font weights (300, 400) for headings — 500 minimum
- Don't use heavy shadows (>0.1 opacity as primary layer) — keep them warm and graduated
- Don't use sharp corners (0–4px) on cards — the generous rounding (20px+) is core
- Don't introduce additional brand colors beyond the Rausch/Luxe/Plus system
- Don't override the palette token system — use `--palette-*` variables consistently

## 8. Responsive Behavior

### Breakpoints

| Name          | Width       | Key Changes                   |
| ------------- | ----------- | ----------------------------- |
| Mobile Small  | <375px      | Single column, compact search |
| Mobile        | 375–550px   | Standard mobile listing grid  |
| Tablet Small  | 550–744px   | 2-column listings             |
| Tablet        | 744–950px   | Search bar expansion          |
| Desktop Small | 950–1128px  | 3-column listings             |
| Desktop       | 1128–1440px | 4-column grid, full header    |
| Large Desktop | 1440–1920px | 5-column grid                 |
| Ultra-wide    | >1920px     | Maximum grid width            |

_Note: Airbnb has 61 detected breakpoints — one of the most granular responsive systems observed, reflecting their obsession with layout at every possible screen size._

### Touch Targets

- Circular nav buttons: adequate 50% radius sizing
- Listing cards: full-card tap target on mobile
- Search bar: prominently sized for thumb interaction
- Category pills: horizontally scrollable with generous padding

### Collapsing Strategy

- Listing grid: 5 → 4 → 3 → 2 → 1 columns
- Search: expanded bar → compact bar → overlay
- Category pills: horizontal scroll at all sizes
- Navigation: full header → mobile simplified
- Map: side panel → overlay/toggle

### Image Behavior

- Listing photos: carousel with swipe on mobile
- Responsive image sizing with aspect ratio maintained
- Heart overlay positioned consistently across sizes
- Photo quality adjusts based on viewport

## 9. Agent Prompt Guide

### Quick Color Reference

- Background: Pure White (`#ffffff`)
- Text: Near Black (`#222222`)
- Brand accent: Rausch Red (`#ff385c`)
- Secondary text: `#6a6a6a`
- Disabled: `rgba(0,0,0,0.24)`
- Card border: `rgba(0,0,0,0.02) 0px 0px 0px 1px`
- Card shadow: full three-layer stack
- Button surface: `#f2f2f2`

### Example Component Prompts

- "Create a listing card: white background, 20px radius. Three-layer shadow: rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px. Photo area on top (16:10 ratio), details below: 16px Airbnb Cereal VF weight 600 title, 14px weight 400 description in #6a6a6a."
- "Design search bar: white background, full card shadow, 32px radius on container. Search text at 14px Cereal VF weight 400. Red search button (#ff385c, 50% radius, white icon)."
- "Build category pill bar: horizontal scrollable row. Each pill: 14px Cereal VF weight 600, #222222 text, bottom border on active. Circular prev/next arrows (#f2f2f2 bg, 50% radius)."
- "Create a CTA button: #222222 background, white text, 8px radius, 16px Cereal VF weight 500, 0px 24px padding. Hover: brand red accent."
- "Design a heart/wishlist button: transparent background, 50% radius, white heart icon with dark shadow outline."

### Iteration Guide

1. Start with white — the photography provides all the color
2. Rausch Red (#ff385c) is the singular accent — use sparingly for CTAs only
3. Near-black (#222222) for text — the warmth matters
4. Three-layer shadows create natural, warm lift — always use all three layers
5. Generous radius: 8px buttons, 20px cards, 50% controls
6. Cereal VF at 500–700 weight — no thin weights for any heading
7. Photography is hero — every listing card is image-first
