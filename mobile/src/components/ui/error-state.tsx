import { AlertTriangle } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Button } from "./button";
import { Text } from "./text";
import { lightColors, radius, spacing } from "@/theme/tokens";

export function ErrorState({
  title = "Something went wrong",
  description = "Check your connection and try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <AlertTriangle color={lightColors.destructive} size={24} />
      </View>
      <Text variant="heading" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" tone="muted" style={styles.description}>
        {description}
      </Text>
      {onRetry ? (
        <Button
          title="Try again"
          variant="outline"
          size="sm"
          onPress={onRetry}
          style={styles.action}
        />
      ) : null}
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
    backgroundColor: "#FEE2E2",
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
  },
  action: {
    marginTop: spacing.sm,
  },
});
