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

  // ============================================================================
  // TAB BAR METRICS (React Native specific)
  // ============================================================================
  tabBar: {
    height: 75,
    iconSize: 28,
    labelSize: 11,
    indicatorHeight: 3,
    indicatorWidth: 60,
    padding: {
      top: 0,
      bottom: 16,
    },
    createButton: {
      iconBackgroundSize: 28,
      iconBackgroundRadius: 6,
    },
  },

  // ============================================================================
  // MOTION TIMINGS (React Native animations)
  // ============================================================================
  motion: {
    press: {
      in: 100,
      out: 100,
    },
    bottomSheet: {
      in: 300,
      out: 250,
    },
    transition: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },

  // ============================================================================
  // SHADOWS (Platform-specific)
  // ============================================================================
  shadows: {
    sm: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    },
    md: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    },
    lg: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    },
    tabBar: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    },
  },
};