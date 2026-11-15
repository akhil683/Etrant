import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "./text";
import { lightColors, radius, spacing } from "@/theme/tokens";

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text variant="small" tone="muted">
          {label}
        </Text>
        {icon}
      </View>
      <Text variant="title" style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "47%",
    flexGrow: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: lightColors.border,
    backgroundColor: lightColors.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    fontSize: 24,
    lineHeight: 30,
  },
});
