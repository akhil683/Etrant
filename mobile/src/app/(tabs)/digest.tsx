import { router } from "expo-router";
import { CalendarDays, Newspaper, WifiOff } from "lucide-react-native";
import { RefreshControl, StyleSheet, View } from "react-native";

import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Screen,
  Skeleton,
  Text,
} from "@/components/ui";
import { useLatestDigest } from "@/hooks/use-digest";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { formatDigestDate, splitTopics } from "@/lib/dates";
import { getErrorMessage } from "@/lib/errors";
import { useSession } from "@/providers/session-provider";
import { lightColors, spacing } from "@/theme/tokens";

export default function DigestScreen() {
  const { user } = useSession();
  const devPreview = user?.id === "dev-preview";
  const { isOffline } = useNetworkStatus();
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useLatestDigest(devPreview);

  const articles = data?.articles ?? [];

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            void refetch();
          }}
          tintColor={lightColors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text variant="eyebrow" tone="primary">
          Every morning
        </Text>
        <Text variant="display" style={styles.title}>
          Daily Digest
        </Text>
        <Text variant="body" tone="muted">
          The day&apos;s current affairs, filtered for what is relevant to your
          exam.
        </Text>
        <View style={styles.dateRow}>
          <CalendarDays color={lightColors.mutedForeground} size={15} />
          <Text variant="small" tone="muted">
            {data?.date ? formatDigestDate(data.date) : "Latest digest"}
          </Text>
        </View>
      </View>

      {isOffline ? (
        <View style={styles.offline}>
          <WifiOff color={lightColors.mutedForeground} size={16} />
          <Text variant="small" tone="muted" style={styles.offlineText}>
            You are offline. Showing the last saved digest.
          </Text>
        </View>
      ) : null}

      {isLoading ? (
        <View style={styles.list}>
          {[0, 1, 2].map((index) => (
            <Card key={index} style={styles.card}>
              <Skeleton width={80} height={20} />
              <Skeleton width="90%" height={24} />
              <Skeleton width="100%" height={16} />
              <Skeleton width="70%" height={16} />
            </Card>
          ))}
        </View>
      ) : isError ? (
        <ErrorState
          description={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      ) : articles.length === 0 ? (
        <EmptyState
          icon={<Newspaper color={lightColors.primary} size={24} />}
          title="No digest yet"
          description="The next daily digest will appear here after the nightly run."
        />
      ) : (
        <View style={styles.list}>
          {articles.map((article) => (
            <Card key={article.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badges}>
                  {splitTopics(article.topic).map((topic) => (
                    <Badge key={topic} label={topic} variant="secondary" />
                  ))}
                </View>
                <Text variant="small" tone="muted">
                  {formatDigestDate(article.date)}
                </Text>
              </View>
              <Text variant="heading" style={styles.cardTitle}>
                {article.title}
              </Text>
              <Text variant="body" tone="muted" numberOfLines={4}>
                {article.summary}
              </Text>
              <Button
                title="Read the digest"
                variant="outline"
                size="sm"
                onPress={() =>
                  router.push({
                    pathname: "/digest/[id]",
                    params: { id: String(article.id) },
                  })
                }
                style={styles.cardButton}
              />
            </Card>
          ))}
        </View>
      )}
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
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  offline: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightColors.border,
    backgroundColor: lightColors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  offlineText: {
    flex: 1,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    flex: 1,
  },
  cardTitle: {
    lineHeight: 26,
  },
  cardButton: {
    alignSelf: "flex-start",
    marginTop: spacing.xs,
  },
});
