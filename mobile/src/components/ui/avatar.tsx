import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { Text } from "./text";
import { lightColors, radius } from "@/theme/tokens";

export function Avatar({
  uri,
  name,
  size = 40,
}: {
  uri?: string | null;
  name?: string | null;
  size?: number;
}) {
  const initial = (name ?? "E").trim().charAt(0).toUpperCase();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: radius.full }}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: radius.full },
      ]}
    >
      <Text variant="button" tone="primary" style={{ fontSize: size * 0.4 }}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: lightColors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
