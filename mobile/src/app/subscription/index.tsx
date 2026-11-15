import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ArrowLeft, Check } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Badge, Button, Card, Screen, Sheet, Text } from "@/components/ui";
import { useSession } from "@/providers/session-provider";
import { lightColors, radius, spacing } from "@/theme/tokens";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    description: "The latest digest and a sample of the question reel.",
    features: ["Latest digest", "Limited question reel", "Leaderboard"],
  },
  {
    name: "Pro",
    price: "₹99",
    description: "The full archive and every daily question set.",
    features: [
      "Full digest archive",
      "Every question reel",
      "Date range filter",
      "Leaderboard",
    ],
    popular: true,
  },
  {
    name: "Max",
    price: "₹149",
    description: "Everything in Pro, with early access and priority support.",
    features: ["Everything in Pro", "Early access", "Priority support"],
  },
];

export default function SubscriptionScreen() {
  const { user } = useSession();
  const [sheetOpen, setSheetOpen] = useState(false);

  const openWebsite = () => {
    setSheetOpen(false);
    WebBrowser.openBrowserAsync(
      "https://etrant.akkhil.dev/subscription?from=app",
    );
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft color={lightColors.foreground} size={20} />
        <Text variant="small" style={styles.backText}>
          Back
        </Text>
      </Pressable>

      <View style={styles.header}>
        <Text variant="eyebrow" tone="primary">
          Plans
        </Text>
        <Text variant="display" style={styles.title}>
          Simple pricing
        </Text>
        <Text variant="body" tone="muted">
          Start free. Upgrade when you want the full archive and every daily
          question set.
        </Text>
      </View>

      <View style={styles.plans}>
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            style={plan.popular ? styles.popularCard : styles.planCard}
          >
            <View style={styles.planHeader}>
              <Text variant="heading">{plan.name}</Text>
              {plan.popular ? (
                <Badge label="Most popular" variant="secondary" />
              ) : null}
            </View>
            <View style={styles.priceRow}>
              <Text variant="display" style={styles.price}>
                {plan.price}
              </Text>
              <Text variant="small" tone="muted">
                /month
              </Text>
            </View>
            <Text variant="small" tone="muted">
              {plan.description}
            </Text>
            <View style={styles.features}>
              {plan.features.map((feature) => (
                <View key={feature} style={styles.feature}>
                  <Check color={lightColors.primary} size={16} />
                  <Text variant="small">{feature}</Text>
                </View>
              ))}
            </View>
            <Button
              title={plan.name === "Free" ? "Current plan" : `Choose ${plan.name}`}
              variant={plan.name === "Free" ? "outline" : "primary"}
              size="sm"
              disabled={plan.name === "Free"}
              onPress={() => setSheetOpen(true)}
            />
          </Card>
        ))}
      </View>

      <Text variant="small" tone="muted" style={styles.footer}>
        Payments are handled by Dodo Payments on the Etrant website.
      </Text>

      <Sheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Subscribe on our website"
      >
        <Text variant="body" tone="muted">
          Plans and payments are handled on etrant.akkhil.dev. Sign in there
          with the same Google account you use in this app. After payment, come
          back and your plan will appear automatically.
        </Text>
        {user?.email ? (
          <Text variant="small" style={styles.email}>
            Signed in as {user.email}
          </Text>
        ) : null}
        <Button title="Open etrant.akkhil.dev" onPress={openWebsite} />
        <Button
          title="Not now"
          variant="ghost"
          onPress={() => setSheetOpen(false)}
        />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 44,
  },
  backText: {
    fontFamily: "Inter_600SemiBold",
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    marginTop: -2,
  },
  plans: {
    gap: spacing.md,
  },
  planCard: {
    gap: spacing.md,
  },
  popularCard: {
    gap: spacing.md,
    borderColor: lightColors.primary,
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  price: {
    fontSize: 32,
    lineHeight: 38,
  },
  features: {
    gap: spacing.sm,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  email: {
    fontFamily: "Inter_600SemiBold",
  },
  footer: {
    textAlign: "center",
  },
});
