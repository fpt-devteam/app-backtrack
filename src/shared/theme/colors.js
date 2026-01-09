
module.exports = {
  // Brand Colors
  primary: "#137fec",
  secondary: "#6c757d",
  success: "#28a745",
  error: "#dc2626",
  warning: "#ffc107",
  info: "#17a2b8",

  // UI Colors
  background: {
    light: "#f6f7f8",
    dark: "#101922",
  },
  "background-light": "#f6f7f8",
  "background-dark": "#101922",

  placeholder: "#a0a9b8",
  input: "#0f172a", // Also slate-900
  label: "#0f172a", // slate-900
  normal: "#334155", // slate-700

  // Standard Palette (Hex values for Native compatibility)
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",

  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },

  gray: {
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    800: "#1f2937",
    900: "#111827",
  },

  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    500: "#0ea5e9",
    600: "#0284c7",
  },

  blue: {
    500: "#3b82f6",
    600: "#2563eb",
  },

  red: {
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
  },

  emerald: {
    100: "#d1fae5",
    600: "#059669",
  },

  // Tab Bar
  "tab-bar": {
    background: "#FFFFFF",
    active: "#137fec",
    inactive: "#65676B",
    indicator: "#137fec",
    border: "rgba(0, 0, 0, 0.1)",
  },

  // Semantic mappings (formerly CSS vars)
  // Using slate palette approximations for consistency
  card: {
    DEFAULT: "#ffffff",
    foreground: "#0f172a", // slate-900
  },
  popover: {
    DEFAULT: "#ffffff",
    foreground: "#0f172a",
  },
  muted: {
    DEFAULT: "#f1f5f9", // slate-100
    foreground: "#64748b", // slate-500
  },
  accent: {
    DEFAULT: "#f1f5f9", // slate-100
    foreground: "#137fec", // primary
  },
  destructive: {
    DEFAULT: "#ef4444", // red-500
    foreground: "#ffffff",
  },
  border: "#e2e8f0", // slate-200
  ring: "#137fec", // primary
};
