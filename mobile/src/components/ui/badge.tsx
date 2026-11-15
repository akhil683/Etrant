import { StyleSheet, View } from "react-native";

import { Text } from "./text";
import { lightColors, radius } from "@/theme/tokens";

type Variant = "default" | "secondary" | "outline" | "success" | "danger";

export function Badge({
  label,
  variant = "secondary",
}: {
  label: string;
  variant?: Variant;
}) {
  return (
    <View style={[styles.base, variantStyles[variant]]}>
      <Text variant="small" style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Inter_600SemiBold",
  },
});

const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: lightColors.primary,
  },
  secondary: {
    backgroundColor: lightColors.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  success: {
    backgroundColor: "#DCFCE7",
  },
  danger: {
    backgroundColor: "#FEE2E2",
  },
});
