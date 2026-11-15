import { Image } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Pressable, StyleSheet, View } from "react-native";

import { Button, Screen, Text } from "@/components/ui";
import { spacing } from "@/theme/tokens";

const ICON = require("@/assets/images/etrant.png");

export default function WelcomeScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.brand}>
        <Image source={ICON} style={styles.logo} contentFit="contain" />
        <Text variant="title">Etrant</Text>
      </View>

      <View style={styles.hero}>
        <Text variant="display">Read the day.</Text>
        <Text variant="display" tone="success">
          Answer the day.
        </Text>
        <Text variant="body" tone="muted" style={styles.body}>
          A short daily digest and a question reel built from it. Read the
          news, then test what stuck.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Get started"
          size="lg"
          onPress={() => router.push("/sign-in")}
        />
        <Button
          title="I already have an account"
          variant="ghost"
          onPress={() => router.push("/sign-in")}
        />
      </View>

      <View style={styles.legal}>
        <Pressable
          onPress={() =>
            WebBrowser.openBrowserAsync(
              "https://etrant.akkhil.dev/privacy-policy",
            )
          }
        >
          <Text variant="small" tone="muted">
            Privacy
          </Text>
        </Pressable>
        <Text variant="small" tone="muted">
          ·
        </Text>
        <Pressable
          onPress={() =>
            WebBrowser.openBrowserAsync(
              "https://etrant.akkhil.dev/terms-and-conditions",
            )
          }
        >
          <Text variant="small" tone="muted">
            Terms
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: spacing.xl,
    gap: spacing.xl,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  hero: {
    gap: spacing.xs,
  },
  body: {
    marginTop: spacing.md,
    maxWidth: 360,
  },
  actions: {
    gap: spacing.sm,
  },
  legal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
});
