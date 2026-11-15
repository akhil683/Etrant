import { Redirect, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  ChevronRight,
  FlaskConical,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  Avatar,
  Badge,
  Button,
  Card,
  Screen,
  StatCard,
  Text,
} from "@/components/ui";
import { useSession } from "@/providers/session-provider";
import { lightColors, radius, spacing } from "@/theme/tokens";

export default function ProfileScreen() {
  const { user, signOut } = useSession();

  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.header}>
        <Avatar uri={user.image} name={user.name} size={64} />
        <View style={styles.identity}>
          <Text variant="title">{user.name ?? "Etrant user"}</Text>
          <Text variant="small" tone="muted">
            {user.email ?? "No email"}
          </Text>
          <Badge label={`${user.plan ?? "Free"} plan`} variant="secondary" />
        </View>
      </View>

      <View style={styles.stats}>
        <StatCard label="Points" value={String(user.points ?? 0)} />
        <StatCard label="Streak" value={`${user.streak ?? 0} days`} />
        <StatCard
          label="Subscription"
          value={user.subscriptionActive ? "Active" : "Free"}
        />
        <StatCard label="Rank" value="#12" />
      </View>

      <Card style={styles.planCard}>
        <View style={styles.planHeader}>
          <View style={styles.planIcon}>
            <Sparkles color={lightColors.primary} size={20} />
          </View>
          <View style={styles.planText}>
            <Text variant="heading">Etrant Pro</Text>
            <Text variant="small" tone="muted">
              Unlock the full digest and every question reel.
            </Text>
          </View>
        </View>
        <Button
          title="View plans"
          size="sm"
          onPress={() => router.push("/subscription")}
        />
      </Card>

      <Card style={styles.listCard}>
        <Row
          icon={<Shield color={lightColors.mutedForeground} size={18} />}
          label="Privacy policy"
          onPress={() =>
            WebBrowser.openBrowserAsync(
              "https://etrant.akkhil.dev/privacy-policy",
            )
          }
        />
        <Row
          icon={<Shield color={lightColors.mutedForeground} size={18} />}
          label="Terms and conditions"
          onPress={() =>
            WebBrowser.openBrowserAsync(
              "https://etrant.akkhil.dev/terms-and-conditions",
            )
          }
        />
        <Row
          icon={<Sparkles color={lightColors.mutedForeground} size={18} />}
          label="Appearance"
          value="Light"
          onPress={() => undefined}
        />
        {__DEV__ ? (
          <Row
            icon={<FlaskConical color={lightColors.mutedForeground} size={18} />}
            label="Kitchen sink"
            value="Dev"
            onPress={() => router.push("/dev/kitchen-sink")}
          />
        ) : null}
      </Card>

      <Button
        title="Sign out"
        variant="outline"
        onPress={async () => {
          await signOut();
          router.replace("/(auth)/welcome");
        }}
      />

      <Pressable
        style={styles.deleteRow}
        onPress={() => undefined}
      >
        <Trash2 color={lightColors.destructive} size={16} />
        <Text variant="small" tone="danger">
          Delete account
        </Text>
      </Pressable>

      <Text variant="small" tone="muted" style={styles.footer}>
        Account deletion and live stats connect in Part 10.
      </Text>
    </Screen>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.rowLeft}>
        {icon}
        <Text variant="body">{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value ? (
          <Text variant="small" tone="muted">
            {value}
          </Text>
        ) : null}
        <ChevronRight color={lightColors.mutedForeground} size={18} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingTop: spacing.sm,
  },
  identity: {
    flex: 1,
    gap: spacing.xs,
    alignItems: "flex-start",
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  planCard: {
    gap: spacing.md,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  planIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: lightColors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  planText: {
    flex: 1,
    gap: 2,
  },
  listCard: {
    paddingVertical: spacing.xs,
    paddingHorizontal: 0,
  },
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  deleteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: 44,
  },
  footer: {
    textAlign: "center",
  },
});
