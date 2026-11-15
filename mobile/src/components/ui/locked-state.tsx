import { LockKeyhole } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Button } from "./button";
import { Text } from "./text";
import { lightColors, radius, spacing } from "@/theme/tokens";

export function LockedState({
  title,
  description,
  onViewPlans,
}: {
  title: string;
  description: string;
  onViewPlans: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <LockKeyhole color={lightColors.primary} size={24} />
      </View>
      <Text variant="heading" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" tone="muted" style={styles.description}>
        {description}
      </Text>
      <Button title="View plans" onPress={onViewPlans} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: lightColors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    maxWidth: 320,
    marginBottom: spacing.sm,
  },
});
