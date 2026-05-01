/**
 * ============================================================
 * COLOR TOKENS — Airbnb-inspired design language
 * ============================================================
 *
 * ARCHITECTURE:
 *   palette  →  raw named hex values (source of truth)
 *   semantic →  intent-based tokens that reference palette
 *   colors   →  merged export (palette + semantic, flat)
 *
 * USAGE RULES:
 *   ✅ Use semantic tokens in all feature screens and components.
 *   ✅ Use palette values ONLY when defining new semantic tokens.
 *   ❌ Never use raw palette shades directly in UI (e.g., rose[500]).
 *
 * AIRBNB DESIGN LANGUAGE:
 *   - One bold primary accent ("Rausch" #FF385C) — used sparingly.
 *   - Warm near-black text (#222222), never pure #000000.
 *   - Airy neutral canvas (#F7F7F7) creates warmth and breathing room.
 *   - Ghost borders (#EBEBEB) separate without visual noise.
 */
const palette = {
  // ── Absolute utilities ──────────────────────────────────────────
  /** Pure white — card/surface fill, foreground text on dark. */
  white: "#FFFFFF",
  /** Pure black — reserved for overlays only; prefer nearBlack for text. */
  black: "#000000",
  /** Transparent — overlays, gradients, ghost borders. */
  transparent: "transparent",
  /** Google brand blue — used for Google sign-in icon prop color. */
  google: "#4285F4",

  // ── Rausch (Airbnb primary brand red-pink) ──────────────────────
  /**
   * Airbnb's signature "Rausch" brand color scale.
   * Use DEFAULT for CTAs, active states, hearts, and tab indicators.
   * Use lighter shades for tinted backgrounds; darker for pressed states.
   *
   * Source: Airbnb DLS — Rausch palette
   *   100: tinted chip background
   *   500: DEFAULT — primary actions, active tab, favorite hearts
   *   600: pressed/hover state on primary buttons
   *   700: destructive emphasis or dark-mode primary
   */
  rausch: {
    50: "#FFF0F3",
    100: "#FFEEF1",
    500: "#FF385C",
    600: "#E31C5F",
    700: "#C13584",
  },

  // ── Warm neutrals ───────────────────────────────────────────────
  /**
   * Hof (Airbnb warm gray scale) — the backbone of all surfaces and text.
   *
   *   50:  App canvas — warmly off-white, not stark (#F7F7F7)
   *   100: Section divider fills, chip backgrounds
   *   200: Subtle borders and hairline separators (#EBEBEB)
   *   300: Disabled control fills, ghost inputs
   *   400: Placeholder text, deselected icons
   *   500: Secondary/muted readable text (#717171)
   *   600: Supporting body text (less muted)
   *   800: Primary readable body text (#484848)
   *   900: Near-black headings and emphasis (#222222)
   *
   * Source: Airbnb DLS — Hof neutral scale
   */
  hof: {
    50: "#F7F7F7",
    100: "#F0F0F0",
    200: "#EBEBEB",
    300: "#DDDDDD",
    400: "#B0B0B0",
    500: "#717171",
    600: "#636363",
    800: "#484848",
    900: "#222222",
  },

  // ── Semantic feedback scales ────────────────────────────────────
  /**
   * Babu (success green) — confirmations, verified badges, success toasts.
   * Source: Airbnb DLS — Babu scale
   */
  babu: {
    100: "#E6F4EA",
    200: "#A8D5A3",
    300: "#66BB6A",
    400: "#2E8B57",
    500: "#008A05",
    600: "#006E02",
  },

  /**
   * Kazan (warning amber) — caution states, expiration warnings.
   * Source: Airbnb DLS — Kazan scale
   */
  kazan: {
    100: "#FFF3E0",
    500: "#FF8C00",
    600: "#E07800",
  },

  /**
   * Error red — destructive actions, validation errors, critical alerts.
   * Distinct from Rausch (brand); use only for functional error states.
   */
  error: {
    100: "#FDECEA",
    500: "#C62828",
    600: "#B71C1C",
  },

  /**
   * Info blue — neutral informational badges, "NEW" labels.
   */
  info: {
    50: "#F0F9FF",
    100: "#E3F2FD",
    300: "#90CAF9",
    500: "#1565C0",
    600: "#0D47A1",
  },

  /**
   * Arches (rating gold) — star ratings, premium/Luxe badges.
   * Source: Airbnb DLS — Arches scale
   */
  arches: {
    50: "#FFF8E1",
    300: "#FFD54F",
    500: "#FFB400",
    600: "#F59F00",
  },
};

/**
 * ============================================================
 * SEMANTIC TOKENS
 * ============================================================
 *
 * Maps design intent → concrete palette value.
 * These are the only tokens you should use in components.
 *
 * CATEGORIES:
 *   Surface   — canvas, surface, card, popover, muted, input
 *   Brand     — primary, primaryForeground, accent
 *   Content   — foreground, text.*
 *   Borders   — divider, border.*
 *   Feedback  — status.*, destructive.*
 *   Interactive — ring
 */
const semantic = {
  // ── Surface tokens ──────────────────────────────────────────────

  /**
   * App root canvas — the warm neutral fill behind all screens.
   * Airbnb uses #F7F7F7, slightly warmer than pure white, creating depth
   * between canvas and surface without heavy shadows.
   */
  canvas: palette.hof[50],

  /**
   * Primary elevated surface for cards, modals, bottom sheets.
   * Pure white creates clear contrast against the canvas.
   */
  surface: palette.white,

  /**
   * Card container fill — same as surface.
   * Explicit token keeps card styling decoupled from generic surface.
   */
  card: palette.white,

  /** Default text/icon color on card surfaces. */
  cardForeground: palette.hof[900],

  /**
   * Floating popover/menu surface (search suggestions, tooltips).
   * Pure white with shadow creates elevation impression.
   */
  popover: palette.white,

  /** Text/icon color inside popovers. */
  popoverForeground: palette.hof[900],

  /**
   * Muted chip/badge/tag background.
   * Airbnb uses very light fills (#F0F0F0) for pill filters and unselected chips.
   */
  muted: palette.hof[100],

  /** Text/icon color on muted surfaces. */
  mutedForeground: palette.hof[500],

  /**
   * Input field background.
   * Slightly tinted (#F0F0F0) so fields are distinguishable from surface.
   */
  input: palette.hof[100],

  /**
   * App-level background alias — identical to canvas.
   * Kept for compatibility with NativeWind "bg-background" utility.
   */
  background: palette.hof[50],

  // ── Brand tokens ────────────────────────────────────────────────

  /**
   * PRIMARY — Rausch #FF385C.
   * Airbnb's iconic pink-red used for:
   *   - Reserve/CTA buttons
   *   - Active tab indicator dot
   *   - Heart/favorite icon (filled state)
   *   - Highlighted text links
   * Use sparingly — one dominant action per screen.
   */
  primary: palette.rausch[500],

  /** Foreground (text/icon) color on primary brand surfaces. */
  primaryForeground: palette.white,

  /**
   * Secondary action surface — dark/near-black (#222222).
   * Airbnb uses black buttons for non-primary high-emphasis actions
   * (e.g., "Next", "Show homes", full-width CTA in booking flow).
   */
  secondary: palette.hof[900],

  /** Foreground color on secondary surfaces. */
  secondaryForeground: palette.white,

  /**
   * Accent background for subtle tinted highlights.
   * Rausch 100 (#FFEEF1) — used for inline tinted chips, selected state hints.
   */
  accent: palette.rausch[100],

  /** Text/icon on accent surfaces. */
  accentForeground: palette.rausch[600],

  // ── Content/text tokens ─────────────────────────────────────────

  /**
   * Default screen foreground — near-black #222222.
   * Airbnb avoids pure black for body content; #222222 feels warmer.
   */
  foreground: palette.hof[900],

  /**
   * Structured text hierarchy.
   *
   *   primary  — headings, property titles, key numbers (#222222)
   *   secondary — supporting copy, dates, reviews (#484848)
   *   muted    — placeholder, helper, disabled (#717171)
   *   inverse  — text on dark/brand backgrounds
   *   error    — inline validation copy
   *
   * Source: Airbnb DLS — Typography/Color usage
   */
  text: {
    /** Main headings and high-emphasis content. */
    primary: palette.hof[900],
    /** Supporting and descriptive content. */
    secondary: palette.hof[600],
    /** Placeholder, helper, disabled text. */
    muted: palette.hof[500],
    /** Text on dark/brand-colored surfaces. */
    inverse: palette.white,
    /** Inline error message copy. */
    error: palette.error[500],
    // Legacy aliases — prefer primary/secondary/muted above
    /** — use text.primary */
    main: palette.hof[900],
    /** — use text.muted */
    sub: palette.hof[500],
  },

  // ── Border tokens ───────────────────────────────────────────────

  /**
   * Hairline dividers between sections and list rows.
   * Airbnb uses #EBEBEB — barely visible, non-intrusive.
   */
  divider: palette.hof[200],

  /**
   * Control and card border tokens.
   *   DEFAULT — resting border for inputs, cards, chips (#DDDDDD)
   *   focus   — active/focused input border (Rausch primary)
   *   strong  — selected chip/filter state (near-black)
   *
   * Source: Airbnb filter pills use black border when selected.
   */
  border: {
    /** Default resting border. */
    DEFAULT: palette.hof[300],
    /**
     * Input field resting border — lighter than DEFAULT.
     * Airbnb uses ultra-light separators for passive fields/chips (~#EBEBEB).
     * Kept separate from DEFAULT so cards/chips can use a different weight.
     */
    input: palette.hof[200],
    /** Focus-visible border for active inputs. */
    focus: palette.rausch[500],
    /** Selected state border for chips/filters. */
    strong: palette.hof[800],
    muted: palette.hof[200],
  },

  // ── Feedback/status tokens ──────────────────────────────────────

  /**
   * Feedback status scale.
   * Use these for toast banners, validation states, status badges.
   *
   *   success — verified, confirmed, completed (#008A05)
   *   error   — failed, blocked, invalid (#C62828)
   *   warning — expiring, cautionary (#FF8C00)
   *   info    — neutral informational (#1565C0)
   */
  status: {
    success: palette.babu[500],
    error: palette.error[500],
    warning: palette.kazan[500],
    info: palette.info[500],
  },

  /**
   * Destructive action surface — delete, remove, cancel irreversible.
   * Uses error red, distinct from Rausch brand.
   */
  destructive: palette.error[500],

  /** Foreground on destructive surfaces. */
  destructiveForeground: palette.white,

  /**
   * Focus ring — keyboard accessibility ring color.
   * Uses primary Rausch so focus is visually tied to brand action.
   */
  ring: palette.rausch[500],

  // ── Special tokens ──────────────────────────────────────────────

  /**
   * Star rating fill — Arches gold #FFB400.
   * Applied to star icons in reviews, listings, host profiles.
   */
  rating: palette.arches[500],
};

/**
 * ============================================================
 * BACKWARD-COMPATIBILITY ALIASES
 * ============================================================
 *
 * These map old palette names (slate, emerald, amber, red, sky, blue)
 * to semantically equivalent values in the new Airbnb-inspired palette.
 *
 * PURPOSE: Prevents TypeScript and runtime errors in existing components
 * that still reference old palette keys. Migrate components to use
 * semantic tokens (e.g., `colors.muted`, `colors.status.warning`) and
 * then remove this block.
 *
 * — use semantic tokens or new palette names instead.
 *   slate.*   → colors.hof.*
 *   gray.*    → colors.hof.* (slightly different scale)
 *   emerald.* → colors.babu.* or colors.primary
 *   amber.*   → colors.kazan.* or colors.status.warning
 *   red.*     → colors.error.*
 *   sky.*     → colors.info.*
 *   blue.*    → colors.info.*
 *   cyan.*    → colors.info.*
 */
const compat = {
  /** Use hof scale or semantic surface/muted tokens. */
  slate: {
    50: palette.hof[50],
    100: palette.hof[100],
    200: palette.hof[200],
    300: palette.hof[300],
    400: palette.hof[400],
    500: palette.hof[500],
    600: palette.hof[600],
    700: palette.hof[600],
    800: palette.hof[800],
    900: palette.hof[900],
  },
  /** Use hof scale or text.* semantic tokens. */
  gray: {
    100: palette.hof[100],
    200: palette.hof[200],
    300: palette.hof[300],
    400: palette.hof[400],
    500: palette.hof[500],
    600: palette.hof[600],
    800: palette.hof[800],
    900: palette.hof[900],
  },
  /** Use babu scale or status.success / primary. */
  emerald: {
    100: palette.babu[100],
    500: palette.babu[500],
    600: palette.babu[500],
    700: palette.babu[600],
  },
  /** Use kazan scale or status.warning. */
  amber: {
    500: palette.kazan[500],
  },
  /** Use error scale or status.error / destructive. */
  red: {
    400: palette.error[500],
    500: palette.error[500],
    600: palette.error[600],
  },
  /** Use info scale or status.info. */
  sky: {
    50: palette.info[100],
    100: palette.info[100],
    500: palette.info[500],
    600: palette.info[600],
  },
  /** Use info scale. */
  blue: {
    500: palette.info[500],
    600: palette.info[600],
    highlight: palette.info[500],
  },
  /** Use info scale or status.info. */
  cyan: {
    500: palette.info[500],
  },
};

/**
 * ============================================================
 * EXPORT
 * ============================================================
 *
 * `colors` merges palette (raw) + semantic (intent-based) + compat aliases.
 *
 *   Preferred usage:  colors.primary, colors.text.primary
 *   New palette use:  colors.rausch[500], colors.hof[200]
 *   Legacy compat:    colors.slate[100] (maps to hof equivalent — migrate away)
 */
const colors = {
  ...palette,
  ...compat,
  ...semantic,
};

module.exports = { colors };
