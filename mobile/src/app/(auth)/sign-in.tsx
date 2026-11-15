import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Button, Screen, Text } from "@/components/ui";
import { useSession } from "@/providers/session-provider";
import { spacing } from "@/theme/tokens";

export default function SignInScreen() {
  const { login, devSignIn } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showDevPreview =
    __DEV__ || process.env.EXPO_PUBLIC_DEV_PREVIEW === "1";

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      await login();
      router.replace("/(tabs)/digest");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    devSignIn();
    router.replace("/(tabs)/digest");
  };

  return (
    <Screen contentStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text variant="small" style={styles.backText}>
          Back
        </Text>
      </Pressable>

      <View style={styles.header}>
        <Text variant="display">Sign in to Etrant</Text>
        <Text variant="body" tone="muted">
          Use the same Google account you use on the web. Your digest,
          questions, points, and plan stay in sync.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Continue with Google"
          size="lg"
          loading={loading}
          onPress={handleGoogle}
        />

        {error ? (
          <Text variant="small" tone="danger">
            {error}
          </Text>
        ) : null}

        {showDevPreview ? (
          <Button
            title="Preview signed-in screen"
            variant="outline"
            onPress={handlePreview}
          />
        ) : null}
      </View>

      {showDevPreview ? (
        <Text variant="small" tone="muted" style={styles.footnote}>
          The preview button is for development only. Real sign-in needs the
          Google client IDs in mobile/.env.local.
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    gap: spacing.xl,
  },
  back: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
  },
  backText: {
    fontFamily: "Inter_600SemiBold",
  },
  header: {
    gap: spacing.md,
  },
  actions: {
    gap: spacing.md,
  },
  footnote: {
    textAlign: "center",
  },
});
