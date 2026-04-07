/**
 * ============================================================
 * TYPOGRAPHY TOKENS — Airbnb-inspired type system
 * ============================================================
 *
 * PHILOSOPHY:
 *   Airbnb's Cereal typeface is proprietary. This file approximates
 *   its optical characteristics using system fonts:
 *   - Rounded, humanist sans-serif personality
 *   - Clean and warm — never cold or geometric
 *   - Generous x-height for legibility at small sizes
 *
 * FONT STACK STRATEGY:
 *   "system-ui" → picks the native platform sans-serif:
 *     iOS:     SF Pro (similar humanist warmth to Cereal)
 *     Android: Roboto / Noto Sans
 *   This gives native-feeling text without loading custom fonts.
 *
 * USAGE RULES:
 *   ✅ Use `presets.*` for all recurring UI text patterns.
 *   ✅ Use `fontSize.*` + `fontWeight.*` for one-off custom components.
 *   ❌ Never combine fontSize/fontWeight ad-hoc across many screens —
 *      grow the presets table instead.
 *
 * TYPE SCALE SOURCE:
 *   Analyzed from Airbnb iOS screenshots:
 *   - Screen headings: 26-28pt bold
 *   - Section titles:  17-20pt semibold
 *   - Body copy:       14-16pt regular / 24pt line height
 *   - Meta/captions:  12-13pt medium  / 16-18pt line height
 *   - Price emphasis: 16pt bold (same as body but heavier)
 */
const typography = {
  /**
   * ── FONT FAMILIES ────────────────────────────────────────────────
   *
   * All roles map to the same humanist sans-serif stack.
   * In React Native, fontFamily is platform-resolved automatically —
   * keep "sans-serif" as the Android fallback.
   *
   * If you load a custom font (e.g., Airbnb Cereal, Inter, Nunito),
   * replace "system-ui" with the registered font name here.
   */
  fontFamily: {
    /**
     * Display — hero text, splash screens, marketing moments.
     * Airbnb uses Cereal Bold/ExtraBold here.
     */
    display: [
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ],

    /**
     * Heading — screen titles, section headers, card titles.
     * Airbnb uses Cereal Bold (700) for H1-H3 level text.
     */
    heading: [
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ],

    /**
     * Body — paragraph copy, descriptions, form inputs, reviews.
     * Airbnb uses Cereal Book (400) and Medium (500).
     */
    body: [
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ],

    /**
     * Mono — IDs, codes, timestamps in debug/support views.
     * Not a primary Airbnb pattern; included for utility completeness.
     */
    mono: [
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      "monospace",
    ],
  },

  /**
   * ── FONT SIZE SCALE ──────────────────────────────────────────────
   *
   * Based on a ~1.2 modular scale anchored at 16px (base body).
   * All values in pixels (React Native uses logical pixels, 1:1 with pt on iOS).
   *
   * USAGE MAP:
   *   xs   (12) → captions, timestamps, legal copy, badge labels
   *   sm   (12) → meta rows, helper text, filter labels, list sub-items
   *   base (16) → default body, form inputs, card descriptions
   *   lg   (18) → emphasized body, section sub-headings, price lines
   *   xl   (20) → card/screen secondary titles
   *   2xl  (24) → page/section primary titles (checkout "Review and continue")
   *   3xl  (28) → large screen headings (search results, profile name)
   *   4xl  (32) → hero/display headings (onboarding slides)
   *   5xl  (40) → maximum display tier — splash screens only
   *
   * Source: Airbnb screenshots — "Review and continue" ~26pt,
   *         property title ~18pt, meta ~13pt, tab labels ~10pt
   */
  fontSize: {
    mini: 8,
    /** Tab bar labels, badge counts, compact legal text. */
    xs: 10,
    /** Dates, ratings text, helper labels, filter chips. */
    sm: 12,
    md: 14,
    /** Default body — descriptions, form fields, review text. */
    base: 16,
    /** Emphasized body, price figures, section sub-titles. */
    lg: 18,
    /** Card and screen secondary titles. */
    xl: 20,
    /** Primary page/checkout headings. */
    "2xl": 24,
    /** Large screen headings, host names, listing titles. */
    "3xl": 28,
    /** Hero feature headings, onboarding slides. */
    "4xl": 32,
    /** Maximum display — splash/campaign moments only. */
    "5xl": 40,
  },

  /**
   * ── FONT WEIGHTS ─────────────────────────────────────────────────
   *
   * Airbnb uses a narrow weight range: Book (400), Medium (500),
   * Bold (700) — rarely 800. Semibold (600) bridges section titles.
   *
   * RULES:
   *   body/meta      → normal (400)
   *   interactive    → medium (500) — tab labels, filter chips
   *   section titles → semibold (600)
   *   headings/CTAs  → bold (700)
   *   display/hero   → extrabold (800) — use sparingly
   */
  fontWeight: {
    /**  Small for input */
    thin: 300,
    /** Long-form readable body copy. */
    normal: 400,
    /** Tab labels, chip text, interactive control labels. */
    medium: 500,
    /** Section headings, form group titles. */
    semibold: 600,
    /** Page headings, listing titles, price figures, CTA labels. */
    bold: 700,
    /** Hero/splash headings only — max visual weight. */
    extrabold: 800,
  },

  /**
   * ── LINE HEIGHTS ─────────────────────────────────────────────────
   *
   * Airbnb maintains generous line heights for legibility:
   *   - Body: 24px line height (1.5 ratio at 16px base)
   *   - Small: 20px line height (1.43 ratio at 14px)
   *   - Caption: 16px line height (1.33 ratio at 12px)
   *   - Headings: tighter at ~1.2–1.25 ratio
   *
   * Use fixed pixel values to match design specs exactly in React Native.
   */
  lineHeight: {
    /** Caption and timestamp text — compact but readable. */
    xs: 16,
    /** Meta rows, filter chips, secondary info. */
    sm: 20,
    /** Standard body paragraph rhythm. */
    body: 24,
    /** Emphasized body and sub-heading flow. */
    lg: 28,
    /** Section title height. */
    xl: 28,
    /** Page heading rhythm. */
    "2xl": 32,
    /** Large heading rhythm. */
    "3xl": 36,
    /** Hero/display heading — tight for impact. */
    "4xl": 38,
    // Ratio aliases (for components that prefer ratio over fixed px)
    /** Tight — large headings where compact vertical spacing is needed. */
    tight: 1.2,
    /** Normal — default body reading rhythm. */
    normal: 1.5,
    /** Relaxed — long-form explanatory content. */
    relaxed: 1.75,
  },

  /**
   * ── LETTER SPACING ───────────────────────────────────────────────
   *
   * Airbnb's Cereal has built-in optical tracking.
   * These values simulate the same intent with system fonts.
   *
   * RULES (per refero-design typography guide):
   *   Body (14-18px):          0       — no tracking needed
   *   Small text (11-13px):    0.2px   — required for readability
   *   UI labels/buttons:       0.3px   — required, prevents cramping
   *   ALL CAPS labels:         1.0px   — always required
   *   Large headings (28px+): -0.3px   — tighten for authority
   *   Display (36px+):        -0.5px   — tighten more
   */
  letterSpacing: {
    /** Display/hero — tightened for bold authority. */
    display: -0.5,
    /** Large headings — slightly tightened. */
    heading: -0.3,
    /** Body — no tracking; natural spacing. */
    body: 0,
    /** Labels/buttons — slight positive for touchability. */
    label: 0.3,
    /** Small captions — positive for legibility. */
    caption: 0.2,
    /** ALL CAPS — wide tracking mandatory. */
    caps: 1,
  },

  /**
   * ── SEMANTIC PRESETS ─────────────────────────────────────────────
   *
   * Ready-made text style combinations for recurring UI patterns.
   * Prefer these over ad-hoc combinations to keep typography consistent.
   *
   * EXTEND THIS TABLE rather than creating one-off combos in components.
   *
   * Source: Airbnb screen analysis — all values observed from screenshots.
   */
  presets: {
    /**
     * heroTitle — splash/onboarding primary statement.
     * Airbnb onboarding: large, bold, left-aligned impact text.
     */
    heroTitle: {
      fontSize: 32,
      fontWeight: 800,
      lineHeight: 38,
      letterSpacing: -0.5,
    },

    /**
     * screenTitle — primary page heading (e.g., "Review and continue").
     * Airbnb uses ~24-26pt bold, left-aligned.
     */
    screenTitle: {
      fontSize: 24,
      fontWeight: 500,
    },

    /**
     * sectionTitle — horizontal section headings with optional chevron.
     * E.g., "Popular homes in Cleveland", "Upcoming availability".
     * Airbnb uses ~17-20pt semibold.
     */
    sectionTitle: {
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 24,
      letterSpacing: -0.1,
    },

    /**
     * cardTitle — property/listing title on cards.
     * Bold, 16pt — medium prominence.
     */
    cardTitle: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: 22,
      letterSpacing: 0,
    },

    /**
     * body — default paragraph and form text.
     * Airbnb: 16pt regular, 24px line height.
     */
    body: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 24,
      letterSpacing: 0,
    },

    /**
     * bodyMedium — emphasized body for key details.
     * Used for price lines, rating text, active filter labels.
     */
    bodyMedium: {
      fontSize: 16,
      fontWeight: 500,
      lineHeight: 24,
      letterSpacing: 0,
    },

    /**
     * meta — secondary information rows.
     * Dates, guest counts, locations. Airbnb uses ~13-14pt regular/medium.
     */
    meta: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 20,
      letterSpacing: 0,
    },

    /**
     * metaMedium — interactive meta labels (pill filters, tab labels).
     * Airbnb uses 14pt medium for filter chip text.
     */
    metaMedium: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 20,
      letterSpacing: 0.2,
    },

    /**
     * caption — timestamps, license text, badge counts.
     * Airbnb uses ~12pt, always positive letter-spacing.
     */
    caption: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 16,
      letterSpacing: 0.2,
    },

    /**
     * tabLabel — bottom navigation bar item labels.
     * Airbnb: 10pt, slightly tracked, medium weight.
     */
    tabLabel: {
      fontSize: 10,
      fontWeight: 500,
      lineHeight: 14,
      letterSpacing: 0.3,
    },

    /**
     * price — listing price figures.
     * Bold, same size as body to fit inline — stands out through weight.
     */
    price: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: 24,
      letterSpacing: 0,
    },

    /**
     * ctaLabel — primary action button text.
     * Full-width CTA: 16pt bold. Airbnb "Reserve", "Show homes", "Next".
     */
    ctaLabel: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: 24,
      letterSpacing: 0.3,
    },
  },
};

module.exports = { typography };
