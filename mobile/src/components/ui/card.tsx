import {
  StyleSheet,
  View,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { lightColors, radius, shadows, spacing } from "@/theme/tokens";

export function Card({
  style,
  ...props
}: ViewProps & { style?: StyleProp<ViewStyle> }) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: lightColors.border,
    backgroundColor: lightColors.card,
    padding: spacing.lg,
    ...shadows.soft,
  },
});
