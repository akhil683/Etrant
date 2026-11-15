import { lightColors, type ThemeColors } from "./tokens";

export function useTheme(): { colors: ThemeColors; isDark: boolean } {
  // Dark mode is wired in the token file but exposed in the polish part.
  return { colors: lightColors, isDark: false };
}
