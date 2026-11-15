export type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  border: string;
  input: string;
  ring: string;
  overlay: string;
};

export const lightColors: ThemeColors = {
  background: "#F8FAFC",
  foreground: "#0F172A",
  card: "#FFFFFF",
  cardForeground: "#0F172A",
  popover: "#FFFFFF",
  primary: "#2563EB",
  primaryForeground: "#FFFFFF",
  secondary: "#F1F5F9",
  secondaryForeground: "#0F172A",
  muted: "#F1F5F9",
  mutedForeground: "#64748B",
  accent: "#EFF6FF",
  accentForeground: "#1D4ED8",
  destructive: "#DC2626",
  destructiveForeground: "#FFFFFF",
  success: "#047857",
  successForeground: "#FFFFFF",
  border: "#E2E8F0",
  input: "#E2E8F0",
  ring: "#2563EB",
  overlay: "rgba(15, 23, 42, 0.45)",
};

export const darkColors: ThemeColors = {
  background: "#0B1120",
  foreground: "#F8FAFC",
  card: "#111827",
  cardForeground: "#F8FAFC",
  popover: "#111827",
  primary: "#3B82F6",
  primaryForeground: "#FFFFFF",
  secondary: "#1E293B",
  secondaryForeground: "#F8FAFC",
  muted: "#1E293B",
  mutedForeground: "#94A3B8",
  accent: "#172554",
  accentForeground: "#BFDBFE",
  destructive: "#EF4444",
  destructiveForeground: "#FFFFFF",
  success: "#10B981",
  successForeground: "#052E1A",
  border: "#1E293B",
  input: "#1E293B",
  ring: "#3B82F6",
  overlay: "rgba(2, 6, 23, 0.65)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  full: 999,
};

export const fonts = {
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
  serif: "Newsreader_400Regular",
  serifMedium: "Newsreader_500Medium",
  serifSemiBold: "Newsreader_600SemiBold",
};

export const shadows = {
  soft: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  lift: {
    shadowColor: "#2563EB",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
};
