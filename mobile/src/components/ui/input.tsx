import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { Text } from "./text";
import { fonts, lightColors, radius, spacing } from "@/theme/tokens";

export function Input({
  label,
  error,
  style,
  ...props
}: TextInputProps & {
  label?: string;
  error?: string | null;
}) {
  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="small" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        {...props}
        placeholderTextColor={lightColors.mutedForeground}
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
      />
      {error ? (
        <Text variant="small" tone="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.sansMedium,
    color: lightColors.foreground,
  },
  input: {
    minHeight: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: lightColors.input,
    backgroundColor: lightColors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: lightColors.foreground,
  },
  inputError: {
    borderColor: lightColors.destructive,
  },
});
