/**
 * Design System Metrics - Source of Truth
 *
 * Layout and spacing tokens that work across both Web (Tailwind) and Native (RN).
 * These values are imported by:
 * - tailwind.config.js (for web/NativeWind)
 * - app-metrics.ts (for React Native specific metrics)
 *
 * Note: Typography tokens are in typography.js
 */

module.exports = {
  // ============================================================================
  // SPACING SCALE
  // ============================================================================
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
  },

  // ============================================================================
  // BORDER RADIUS
  // ============================================================================
  borderRadius: {
    none: 0,
    sm: 4,
    DEFAULT: 6,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 24,
    full: 9999,
  },

  // ============================================================================
  // LAYOUT DIMENSIONS
  // ============================================================================
  layout: {
    // Tab Bar
    tabBarHeight: 65,
    tabBarIconSize: 24,
    tabBarLabelSize: 11,

    // Common heights
    buttonHeight: {
      sm: 32,
      md: 40,
      lg: 48,
    },

    // Container max widths
    container: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  // ============================================================================
  // ANIMATION DURATIONS (in milliseconds)
  // ============================================================================
  duration: {
    fast: 100,
    normal: 200,
    slow: 300,
    slower: 500,
  },
};