import { useEffect } from "react";
import {
  StyleSheet,
  type DimensionValue,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { lightColors, radius } from "@/theme/tokens";

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = radius.sm,
}: {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
}) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: lightColors.secondary,
  },
});
