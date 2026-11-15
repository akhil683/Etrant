import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LockedState,
  Screen,
  Skeleton,
  Text,
} from "@/components/ui";
import { useDigestDetail } from "@/hooks/use-digest";
import { formatDigestDate, splitTopics } from "@/lib/dates";
import { getErrorMessage, isSubscriptionRequired } from "@/lib/errors";
import { useSession } from "@/providers/session-provider";
import { lightColors, radius, spacing } from "@/theme/tokens";

export default function DigestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();
  const devPreview = user?.id === "dev-preview";
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useDigestDetail(id ?? "", devPreview);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const backButton = (
    <Pressable onPress={() => router.back()} style={styles.back}>
      <ArrowLeft color={lightColors.foreground} size={20} />
      <Text variant="small" style={styles.backText}>
        Back
      </Text>
    </Pressable>
  );

  if (isError && isSubscriptionRequired(error)) {
    return (
      <Screen scroll contentStyle={styles.content}>
        {backButton}
        <LockedState
          title="Digest detail is part of Pro"
          description="The full article and its question set are available on a paid plan. You can still browse the daily list for free."
          onViewPlans={() => router.push("/subscription")}
        />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen scroll contentStyle={styles.content}>
        {backButton}
        <ErrorState
          description={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen scroll contentStyle={styles.content}>
        {backButton}
        <View style={styles.loading}>
          <Skeleton width={80} height={20} />
          <Skeleton width="90%" height={34} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="75%" height={20} />
        </View>
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen scroll contentStyle={styles.content}>
        {backButton}
        <EmptyState
          title="Digest not found"
          description="This digest may have been removed."
        />
      </Screen>
    );
  }

  const topics = splitTopics(data.topic);
  const paragraphs = data.summary.split(/\n{2,}/).filter(Boolean);
  const questions = data.relevantQuestions ?? [];

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
      {backButton}

      <View style={styles.header}>
        <View style={styles.badges}>
          {topics.map((topic) => (
            <Badge key={topic} label={topic} variant="secondary" />
          ))}
          <Badge label={formatDigestDate(data.date)} variant="outline" />
        </View>
        <Text variant="display" style={styles.title}>
          {data.title}
        </Text>
      </View>

      <View style={styles.body}>
        {paragraphs.map((paragraph, index) => (
          <Text key={index} variant="serif" style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>

      {questions.length > 0 ? (
        <Card style={styles.questionsCard}>
          <Text variant="heading">Relevant questions</Text>
          <View style={styles.questions}>
            {questions.map((item, index) => {
              const open = openQuestion === item.question;

              return (
                <Pressable
                  key={item.question}
                  onPress={() =>
                    setOpenQuestion(open ? null : item.question)
                  }
                  style={styles.question}
                >
                  <View style={styles.questionHeader}>
                    <View style={styles.number}>
                      <Text
                        variant="small"
                        tone="primary"
                        style={styles.numberText}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    <Text variant="body" style={styles.questionTitle}>
                      {item.question}
                    </Text>
                    {open ? (
                      <ChevronUp
                        color={lightColors.mutedForeground}
                        size={18}
                      />
                    ) : (
                      <ChevronDown
                        color={lightColors.mutedForeground}
                        size={18}
                      />
                    )}
                  </View>
                  {open ? (
                    <Text
                      variant="small"
                      tone="muted"
                      style={styles.answer}
                    >
                      {item.answer}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Card>
      ) : null}

      {data.sourceUrl ? (
        <Button
          title="Read the original"
          variant="outline"
          rightIcon={<ExternalLink color={lightColors.foreground} size={16} />}
          onPress={() => WebBrowser.openBrowserAsync(data.sourceUrl!)}
        />
      ) : null}
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
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  title: {
    lineHeight: 42,
  },
  body: {
    gap: spacing.md,
  },
  paragraph: {
    color: lightColors.foreground,
  },
  loading: {
    gap: spacing.md,
  },
  questionsCard: {
    gap: spacing.md,
  },
  questions: {
    gap: spacing.sm,
  },
  question: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: lightColors.border,
    backgroundColor: lightColors.background,
    padding: spacing.md,
    gap: spacing.sm,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  number: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: lightColors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontFamily: "Inter_700Bold",
  },
  questionTitle: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
  },
  answer: {
    paddingLeft: 38,
  },
});
