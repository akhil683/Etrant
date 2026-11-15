import { StyleSheet, View } from "react-native";

import { Avatar, Badge, Card, Screen, Text } from "@/components/ui";
import { lightColors, radius, spacing } from "@/theme/tokens";

const ROWS = [
  { rank: 1, name: "Aarav", points: 1240, streak: 18 },
  { rank: 2, name: "Meera", points: 1180, streak: 15 },
  { rank: 3, name: "Kabir", points: 1060, streak: 12 },
  { rank: 4, name: "Ishita", points: 940, streak: 9 },
  { rank: 5, name: "Rohan", points: 880, streak: 7 },
];

export default function LeaderboardScreen() {
  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="eyebrow" tone="primary">
          This week
        </Text>
        <Text variant="display" style={styles.title}>
          Leaderboard
        </Text>
        <Text variant="body" tone="muted">
          Points come from answered questions. Streaks reward showing up.
        </Text>
        <Badge label="Preview" variant="outline" />
      </View>

      <Card style={styles.meCard}>
        <View style={styles.meLeft}>
          <Text variant="small" tone="muted">
            Your rank
          </Text>
          <Text variant="title">#12</Text>
        </View>
        <View style={styles.meRight}>
          <Text variant="small" tone="muted">
            Points
          </Text>
          <Text variant="title" tone="primary">
            120
          </Text>
        </View>
        <View style={styles.meRight}>
          <Text variant="small" tone="muted">
            Streak
          </Text>
          <Text variant="title">4 days</Text>
        </View>
      </Card>

      <Card style={styles.listCard}>
        <Text variant="heading">Top learners</Text>
        <View style={styles.rows}>
          {ROWS.map((row) => (
            <View key={row.rank} style={styles.row}>
              <Text variant="small" style={styles.rank}>
                #{row.rank}
              </Text>
              <Avatar name={row.name} size={38} />
              <View style={styles.rowText}>
                <Text variant="body" style={styles.name}>
                  {row.name}
                </Text>
                <Text variant="small" tone="muted">
                  {row.streak} day streak
                </Text>
              </View>
              <Text variant="body" style={styles.points}>
                {row.points}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Text variant="small" tone="muted" style={styles.footer}>
        Live leaderboard data connects in Part 8.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  title: {
    marginTop: -2,
  },
  meCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  meLeft: {
    gap: spacing.xs,
  },
  meRight: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  listCard: {
    gap: spacing.md,
  },
  rows: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: lightColors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rank: {
    width: 28,
    fontFamily: "Inter_600SemiBold",
    color: lightColors.mutedForeground,
  },
  rowText: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontFamily: "Inter_600SemiBold",
  },
  points: {
    fontFamily: "Inter_700Bold",
    color: lightColors.primary,
  },
  footer: {
    textAlign: "center",
  },
});
