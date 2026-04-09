/**
 * ============================================================
 * METRICS TOKENS — Airbnb-inspired spatial system
 * ============================================================
 *
 * PHILOSOPHY:
 *   Airbnb's layout conveys warmth and trust through generous whitespace.
 *   Their spatial system produces airy breathing room between content —
 *   never cramped, never overwhelming.
 *
 * BASE GRID: 8px
 *   All spacing values are multiples of 8 (or 4 for micro-gaps).
 *   This creates a predictable visual rhythm across the entire app.
 *
 * KEY AIRBNB SPATIAL PATTERNS (observed from screenshots):
 *   - Screen horizontal padding:  24px (3 × 8)
 *   - Section gap (vertical):     32px (4 × 8)
 *   - Card internal padding:      16px (2 × 8)
 *   - List row gap:               12px (1.5 × 8)
 *   - Card corner radius:         14px (clean, modern — not too bubbly)
 *   - Search bar radius:          full pill (9999)
 *   - Primary CTA radius:         8px (large button — slightly rounded)
 *   - Tab bar height:             ~83px including safe area
 *
 * USAGE RULES:
 *   ✅ Use spacing.* tokens for all margin/padding/gap values.
 *   ✅ Use borderRadius.* for all corner treatments.
 *   ✅ Use layout.controlHeight.* for consistent button/input heights.
 *   ❌ Never use raw numeric literals for spacing — always a token.
 */
const metrics = {
  /**
   * ── BASE GRID UNIT ───────────────────────────────────────────────
   *
   * The foundational measurement atom.
   * All spacing values should derive from multiples of this baseline.
   * Airbnb's grid is 8px.
   */
  baseline: 8,

  /**
   * ── SPACING SCALE ────────────────────────────────────────────────
   *
   * Usage map (Airbnb-derived):
   *   xxs (2)  → icon/text optical micro-corrections only
   *   xs  (4)  → inline gaps between icon + label, badge padding
   *   sm  (8)  → compact row gaps, chip internal padding
   *   md2 (12) → list item gaps, card image-to-text spacing
   *   md  (16) → card internal padding, input horizontal inset
   *   lg  (24) → screen horizontal padding (Airbnb standard edge inset)
   *   xl  (32) → section vertical gap between content groups
   *   2xl (48) → large screen section breaks (hero → content gap)
   *   3xl (64) → maximum structural gap (rare, top-of-screen breathing)
   *
   * Source: Airbnb screenshot analysis — horizontal padding observed
   * at 24px, section gaps at 32px, card padding at 16px.
   */
  spacing: {
    /** Icon/text optical alignment micro-correction — 2px. */
    xxs: 2,
    /** Inline icon-label gap, badge/chip internal padding — 4px. */
    xs: 4,
    /** Compact list row gap, inner chip padding — 8px. */
    sm: 8,
    /** Card image-to-text gap, list item vertical gap — 12px. */
    md2: 12,
    /** Card internal padding, input field inset — 16px. */
    md: 18,
    /**
     * Screen horizontal edge padding — 24px.
     * Airbnb's standard screen-left/right inset for all main content.
     */
    lg: 24,
    /**
     * Section vertical gap — 32px.
     * The primary separator between content sections on a screen.
     */
    xl: 32,
    /** Large structural gap — 48px. Hero section bottom margin. */
    "2xl": 48,
    /** Maximum structural gap — 64px. Full-bleed section transitions. */
    "3xl": 64,
  },

  /**
   * ── BORDER RADIUS SCALE ─────────────────────────────────────────
   *
   * Airbnb uses a clean, modern rounding language — not overly bubbly,
   * not square. Each radius has a specific semantic role.
   *
   * Usage map:
   *   none (0)   → strict alignment elements, underline indicators
   *   xs   (4)   → inline badges, compact tag chips, image thumbnails
   *   sm   (8)   → primary CTA buttons (Airbnb "Reserve", "Next", "Show homes")
   *   md   (14)  → listing cards, modal panels, bottom sheets, filter cards
   *   lg   (16)  → bottom sheet top corners, overlapping panels
   *   xl   (20)  → featured/hero cards with prominent imagery
   *   2xl  (24)  → extra-featured visual cards
   *   full (9999)→ pill buttons (search bar, guest-count pills, price tags)
   *
   * Source: Airbnb screenshot analysis — listing cards ~14px, search bar
   * full pill, "Reserve" button ~8px, filter chips full pill.
   */
  borderRadius: {
    /** No rounding — for underline tab indicators and strict grid elements. */
    none: 0,
    /** Tight badge radius for compact inline labels. */
    xs: 4,
    /**
     * Button radius — Airbnb's primary CTA buttons.
     * "Reserve", "Next", "Show homes" all use ~8px.
     */
    sm: 8,
    /**
     * Card radius — Airbnb listing cards, modal bottoms, filter panels.
     * The standard container radius throughout the app.
     */
    md: 14,
    /** Alias for md — preferred name for card/panel contexts. */
    primary: 14,
    /**
     * Sheet/overlay top corners — bottom sheets, filter overlays.
     * Slightly larger than cards to emphasize the overlay hierarchy.
     */
    lg: 16,
    /** Featured/hero card radius — standout visuals. */
    xl: 20,
    /** Extra-featured card radius — rare, reserved for campaigns. */
    "2xl": 24,
    /**
     * Full pill — search bar, price tag pills, "Guest favorite" badges,
     * filter chip pills, guest count selectors.
     * Airbnb uses this extensively for all interactive chip elements.
     */
    "4xl": 40,
    full: 9999,
  },

  /**
   * ── TOUCH TARGET CONSTRAINTS ─────────────────────────────────────
   *
   * Airbnb respects Apple HIG and WCAG minimum touch targets.
   * All interactive controls must meet the `min` threshold.
   */
  touchTarget: {
    /** Minimum tap target — 44×44px per Apple HIG / WCAG 2.1. */
    min: 44,
    /**
     * Hit slop expansion for icon-only controls.
     * Add this as `hitSlop` padding around small icons (heart, share, close).
     */
    defaultHitSlop: 8,
  },

  /**
   * ── LAYOUT DIMENSIONS ───────────────────────────────────────────
   *
   * Structural sizing constants for controls and responsive containers.
   */
  layout: {
    /**
     * Control heights — consistent across all interactive surfaces.
     *
     *   xs  (28) → compact icon-only buttons, small utility controls
     *   sm  (36) → secondary compact actions, inline CTA chips
     *   md  (44) → standard touch-safe control height (Apple HIG minimum)
     *   lg  (52) → prominent secondary CTA (Airbnb pill buttons for dates)
     *   xl  (56) → primary CTA ("Reserve", "Next", full-width actions)
     *
     * Source: Airbnb booking CTA "Reserve" button ~52-56px tall.
     */
    controlHeight: {
      /** Compact icon-only or dense utility control. */
      xs: 28,
      /** Secondary compact button/chip. */
      sm: 36,
      /** Standard touch-safe baseline. */
      md: 44,
      /** Prominent secondary CTA. */
      lg: 52,
      /** Primary full-width action button. */
      xl: 56,
    },

    /**
     * Responsive container max-widths.
     * Mobile uses full width; these cap content on tablet/web.
     */
    container: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  /**
   * ── MOTION TIMING ───────────────────────────────────────────────
   *
   * Airbnb's motion is purposeful and subtle — feedback, not spectacle.
   *
   * Duration scale:
   *   fast   (100ms) → immediate tap feedback, toggle state change
   *   normal (200ms) → default UI transition (sheets, tab switches)
   *   slow   (300ms) → modal enter/exit, bottom sheet slide
   *   slower (500ms) → ambient/staged transitions (loading states)
   *
   * Per refero-design motion guide:
   *   Instant:       90–150ms  (hover, press, toggle)
   *   State change:  160–240ms (accordion, tabs)
   *   Large:         240–360ms (modal, drawer)
   *   ❌ Never exceed 500ms for product UI interactions.
   */
  motion: {
    duration: {
      /** Tap feedback, toggle, micro-state changes. */
      fast: 100,
      /** Default UI transitions — tabs, chips, toasts. */
      normal: 200,
      /** Modal/bottom sheet enter-exit. */
      slow: 300,
      /** Ambient loading states, staged animations. */
      slower: 500,
    },
  },

  /**
   * ── TAB BAR ──────────────────────────────────────────────────────
   *
   * Airbnb's bottom tab bar has 5 items with labeled icons.
   * It uses #FF385C for the active indicator, gray for inactive.
   *
   * Measurements from screenshot analysis:
   *   Total height:   ~83px (50px bar + 33px safe area bottom inset)
   *   Icon size:      24px (standard iOS tab icon)
   *   Label size:     10px (very compact, tracks slightly positive)
   *   Indicator:      dot under active icon, not full-width line
   *
   * Source: Airbnb "Explore" tab highlighted in red with label below icon.
   */
  tabBar: {
    /** Total visual height of the tab bar container. */
    height: 83,
    /** Primary icon size for tab items. */
    iconSize: 24,
    /** Label text size beneath tab icons. */
    labelSize: 10,
    /** Active dot indicator height (Airbnb uses a dot, not a bar). */
    indicatorHeight: 4,
    /** Active dot width. */
    indicatorWidth: 4,
    padding: {
      /** Top inset inside the tab bar container. */
      top: 8,
      /** Bottom inset — accommodates iPhone home indicator. */
      bottom: 16,
    },
    /**
     * Floating create-action button (Backtrack-specific).
     * Not part of Airbnb's design; preserved from original config.
     */
    createButton: {
      iconBackgroundSize: 28,
      iconBackgroundRadius: 6,
    },
  },

  /**
   * ── SHADOW PRESETS ───────────────────────────────────────────────
   *
   * Airbnb uses extremely subtle shadows — the visual elevation comes
   * primarily from the color contrast between canvas (#F7F7F7) and
   * white (#FFFFFF) surfaces, not from heavy shadows.
   *
   * Shadow philosophy:
   *   level1   → cards resting on canvas — barely perceptible (0.04 opacity)
   *   level2   → floating elements (bottom sheet, modals) — gentle lift
   *   tabBar   → tab bar top edge — subtle upward shadow
   *   popover  → search suggestions, tooltips — visible but not dramatic
   *
   * Source: Airbnb listing cards have almost no visible shadow; the
   * #FFFFFF card on #F7F7F7 canvas provides sufficient depth.
   */
  shadows: {
    /**
     * Level 1 — cards resting on canvas.
     * Airbnb cards use minimal shadow; depth from canvas/surface contrast.
     */
    level1: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    },

    /**
     * Level 2 — elevated overlays (bottom sheets, filter panels).
     * More visible upward shadow for floating surfaces.
     */
    level2: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    },

    /**
     * Tab bar — top-edge shadow for the navigation bar.
     * Airbnb's tab bar uses a very light top border/shadow.
     */
    tabBar: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 8 },
    },

    /**
     * Popover — search suggestions, tooltips, price breakdown sheets.
     * Slightly more visible shadow to signal floating above content.
     */
    popover: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 10 },
    },

    // Legacy aliases — prefer semantic names above for new work
    /** @deprecated use level1 */
    sm: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    },
    /** @deprecated use level1 or level2 */
    md: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    },
    /** @deprecated use level2 */
    lg: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    },
  },
};

module.exports = { metrics };
