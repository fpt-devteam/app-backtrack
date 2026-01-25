const palette = {
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",

  slate: {
    50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1",
    400: "#94a3b8", 500: "#64748b", 600: "#787E87", 700: "#334155",
    800: "#1e293b", 900: "#0f172a",
  },
  gray: {
    100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af",
    500: "#6b7280", 600: "#4b5563", 800: "#1f2937", 900: "#111827",
  },
  sky: { 50: "#f0f9ff", 100: "#e0f2fe", 500: "#0ea5e9", 600: "#0284c7" },
  blue: { 500: "#3b82f6", 600: "#2563eb", highlight: "#137fec" },
  red: { 400: "#f87171", 500: "#ef4444", 600: "#dc2626" },
  emerald: { 100: "#d1fae5", 600: "#059669" },
  amber: { 500: "#ffc107" },
  cyan: { 500: "#17a2b8" },
};

const semantic = {
  primary: palette.sky[500],
  secondary: palette.slate[200],
  text: {
    main: palette.slate[900],
    sub: palette.slate[500],
    muted: palette.gray[400],
    inverse: palette.white,
    error: palette.red[500],
  },
  status: {
    success: palette.emerald[600],
    error: palette.red[600],
    warning: palette.amber[500],
    info: palette.cyan[500],
  },
  border: palette.slate[200],
};

const components = {
  "tab-bar": {
    background: palette.white,
    active: semantic.primary,
    inactive: palette.gray[400],
    indicator: semantic.primary,
    border: "rgba(0, 0, 0, 0.2)",
  }
};

module.exports = {
  ...palette,
  ...semantic,
  ...components,
};