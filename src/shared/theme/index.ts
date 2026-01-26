import { colors as colorsJS } from "@/src/shared/theme/colors";
import { metrics as metricsJS } from "@/src/shared/theme/metrics";
import { typography as typographyJS } from "@/src/shared/theme/typography";

export const colors = colorsJS;
export const metrics = metricsJS;
export const typography = typographyJS;

export type AppTheme = {
  colors: typeof colors;
  metrics: typeof metrics;
  typography: typeof typography;
};

export type ColorKeys = keyof typeof colors;