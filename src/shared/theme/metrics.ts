/**
 * Design System - Native Metrics
 *
 * Contains numeric constants and platform-specific values that cannot be
 * expressed reliably with CSS tokens:
 * - Layout metrics (heights, sizes, spacing)
 * - Animation durations
 * - Shadow/elevation presets
 *
 * DO NOT store colors here - colors must come from global.css via NativeWind.
 */

import { Platform, StyleSheet } from "react-native";

// ============================================================================
// TAB BAR METRICS
// ============================================================================

export const TAB_BAR = {
  /** Total tab bar height (excluding safe area insets) */
  height: 65,

  /** Icon size (width and height) */
  iconSize: 24,

  /** Label font size */
  labelSize: 11,

  /** Active indicator line height */
  indicatorHeight: 3,

  /** Active indicator line width */
  indicatorWidth: 60,

  /** Padding adjustments */
  padding: {
    top: 6,
    bottom: 2,
  },

  /** Create button specific sizes */
  createButton: {
    iconBackgroundSize: 28,
    iconBackgroundRadius: 6,
  },
} as const;

// ============================================================================
// MOTION & ANIMATION
// ============================================================================

export const MOTION = {
  /** Quick press feedback duration */
  press: {
    in: 100,
    out: 100,
  },

  /** Bottom sheet animations */
  bottomSheet: {
    in: 300,
    out: 250,
  },

  /** Page transitions */
  transition: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
} as const;

// ============================================================================
// SHADOWS & ELEVATION
// ============================================================================

/**
 * Platform-specific shadow/elevation presets
 * Use these in StyleSheet.create() for consistent depth
 */
export const SHADOWS = {
  /** Subtle shadow for cards, tabs */
  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),

  /** Medium shadow for floating elements */
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),

  /** Strong shadow for modals, overlays */
  lg: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),

  /** Tab bar specific shadow (from original design) */
  tabBar: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
} as const;

// ============================================================================
// LAYOUT UTILITIES
// ============================================================================

export const LAYOUT = {
  /** StyleSheet.hairlineWidth for minimal borders */
  hairlineWidth: StyleSheet.hairlineWidth,

  /** Common border radius values (if not using Tailwind) */
  radius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    full: 9999,
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ShadowPreset = keyof typeof SHADOWS;
export type MotionDuration = keyof typeof MOTION;
