/**
 * Theme Exports - Design System Entry Point
 *
 * Re-exports design tokens from JS source files for TypeScript consumption.
 * The JS files are the source of truth used by:
 * - Tailwind CSS configuration
 * - React Native components
 * - Type definitions
 */

// Import JS source files
const colorsJS = require('./colors');
const metricsJS = require('./metrics');
const typographyJS = require('./typography');

// Export with proper types for TypeScript
export const colors = colorsJS;
export const metrics = metricsJS;
export const typography = typographyJS;

// Export native-specific metrics that cannot be expressed in Tailwind
export * from './app-metrics';

export type AppTheme = {
  colors: typeof colors;
  metrics: typeof metrics;
  typography: typeof typography;
};