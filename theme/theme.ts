export const appTheme = {
  colors: {
    background: "#f8fafc",
    surface: "#ffffff",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    accent: "#2563eb",
  },
  spacing: {
    xSmall: 8,
    small: 12,
    medium: 16,
    large: 24,
    xLarge: 32,
  },
  radius: {
    medium: 16,
  },
} as const;

export type AppTheme = typeof appTheme;
