import { router } from "expo-router";
import { ArrowLeft, Inbox, Sparkles } from "lucide-react-native";
import { useState } from "react";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  Screen,
  Sheet,
  Skeleton,
  StatCard,
  Text,
} from "@/components/ui";
import { lightColors, spacing } from "@/theme/tokens";

export default function KitchenSinkScreen() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft color={lightColors.foreground} size={20} />
        <Text variant="small" style={styles.backText}>
          Back
        </Text>
      </Pressable>

      <Text variant="eyebrow" tone="primary">
        Dev only
      </Text>
      <Text variant="display">Kitchen sink</Text>
      <Text variant="body" tone="muted">
        Every primitive in the Etrant design system.
      </Text>

      <Section title="Typography">
        <Text variant="display">Display</Text>
        <Text variant="title">Title</Text>
        <Text variant="heading">Heading</Text>
        <Text variant="body">Body text for the daily digest.</Text>
        <Text variant="small" tone="muted">
          Small muted text
        </Text>
        <Text variant="eyebrow" tone="primary">
          Eyebrow
        </Text>
        <Text variant="serif">
          Newsreader is used for long form digest copy. It keeps the reading
          column calm.
        </Text>
      </Section>

      <Section title="Buttons">
        <Button title="Primary" onPress={() => undefined} />
        <Button title="Secondary" variant="secondary" onPress={() => undefined} />
        <Button title="Outline" variant="outline" onPress={() => undefined} />
        <Button title="Ghost" variant="ghost" onPress={() => undefined} />
        <Button title="Danger" variant="danger" onPress={() => undefined} />
        <Button title="Loading" loading onPress={() => undefined} />
        <Button title="Small" size="sm" onPress={() => undefined} />
      </Section>

      <Section title="Badges">
        <View style={styles.row}>
          <Badge label="Default" />
          <Badge label="Secondary" variant="secondary" />
          <Badge label="Outline" variant="outline" />
          <Badge label="Success" variant="success" />
          <Badge label="Danger" variant="danger" />
        </View>
      </Section>

      <Section title="Input">
        <Input
          label="Email address"
          placeholder="trekker@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input label="With error" value="" error="Enter a valid email." />
      </Section>

      <Section title="Avatars">
        <View style={styles.row}>
          <Avatar name="Aarav" size={32} />
          <Avatar name="Meera" size={40} />
          <Avatar name="Kabir" size={48} />
        </View>
      </Section>

      <Section title="Cards and stats">
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text variant="heading">Card title</Text>
            <Badge label="New" variant="success" />
          </View>
          <Text variant="body" tone="muted">
            A card groups related content. It is not the page layout.
          </Text>
        </Card>
        <View style={styles.stats}>
          <StatCard
            label="Points"
            value="120"
            icon={<Sparkles color={lightColors.primary} size={18} />}
          />
          <StatCard label="Streak" value="4 days" />
        </View>
      </Section>

      <Section title="Loading">
        <Skeleton height={20} />
        <Skeleton height={20} width="80%" />
        <Skeleton height={80} borderRadius={12} />
      </Section>

      <Section title="Empty state">
        <Card>
          <EmptyState
            icon={<Inbox color={lightColors.primary} size={24} />}
            title="No questions yet"
            description="Pick a wider date range to see more questions."
            action={
              <Button
                title="Change range"
                variant="outline"
                size="sm"
                onPress={() => undefined}
              />
            }
          />
        </Card>
      </Section>

      <Section title="Error state">
        <Card>
          <ErrorState onRetry={() => undefined} />
        </Card>
      </Section>

      <Section title="Sheet">
        <Button
          title="Open sheet"
          variant="outline"
          onPress={() => setSheetOpen(true)}
        />
      </Section>

      <Sheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Sheet title"
      >
        <Text variant="body" tone="muted">
          Sheets are for short tasks and confirmations. Use a full screen for
          anything that needs protected focus.
        </Text>
        <Button title="Primary action" onPress={() => setSheetOpen(false)} />
        <Button
          title="Cancel"
          variant="ghost"
          onPress={() => setSheetOpen(false)}
        />
      </Sheet>
    </Screen>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text variant="heading">{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
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
  section: {
    gap: spacing.md,
  },
  sectionBody: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.sm,
  },
  card: {
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stats: {
    flexDirection: "row",
    gap: spacing.md,
  },
});
