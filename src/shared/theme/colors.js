const palette = {
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  gray: {
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    800: "#1F2937",
    900: "#111827",
  },
  sky: {
    50: "#F0F9FF",
    100: "#E0F2FE",
    500: "#0EA5E9",
    600: "#0284C7",
  },
  blue: {
    500: "#3B82F6",
    600: "#2563EB",
    highlight: "#137FEC",
  },
  red: {
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626",
  },
  emerald: {
    100: "#D1FAE5",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
  },
  amber: {
    500: "#FFC107",
  },
  cyan: {
    500: "#17A2B8",
  },
};

const semantic = {
  canvas: palette.slate[100],
  surface: palette.white,

  primary: palette.emerald[600],
  primaryForeground: palette.white,

  secondary: palette.slate[200],
  secondaryForeground: palette.gray[900],

  background: palette.slate[100],
  foreground: palette.gray[900],

  text: {
    primary: palette.gray[900],
    secondary: palette.gray[500],
    main: palette.gray[900],
    sub: palette.gray[500],
    muted: palette.gray[500],
    inverse: palette.white,
    error: palette.red[500],
  },
  status: {
    success: palette.emerald[600],
    error: palette.red[600],
    warning: palette.amber[500],
    info: palette.cyan[500],
  },
  divider: palette.gray[100],
  border: {
    DEFAULT: palette.gray[100],
    focus: palette.emerald[600],
  },

  destructive: palette.red[500],
  destructiveForeground: palette.white,

  muted: palette.slate[100],
  mutedForeground: palette.gray[500],

  accent: palette.slate[100],
  accentForeground: palette.gray[900],

  popover: palette.white,
  popoverForeground: palette.gray[900],

  card: palette.white,
  cardForeground: palette.gray[900],

  input: palette.gray[100],
  ring: palette.emerald[600],
};

const colors = {
  ...palette,
  ...semantic,
};

module.exports = { colors };
