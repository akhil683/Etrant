import { CheckCircle2, XCircle } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Badge, Button, Card, Screen, Text } from "@/components/ui";
import { lightColors, radius, spacing } from "@/theme/tokens";

const RANGES = [
  { id: "7", label: "7 days" },
  { id: "30", label: "30 days" },
  { id: "90", label: "90 days" },
  { id: "custom", label: "Custom" },
];

const OPTIONS = [
  { letter: "A", text: "The regulator must publish its findings within 30 days.", state: "correct" },
  { letter: "B", text: "The regulator can act without a written complaint.", state: "wrong" },
  { letter: "C", text: "Consent can be recorded after the data is processed.", state: "idle" },
  { letter: "D", text: "The rules apply only to companies outside India.", state: "idle" },
] as const;

export default function QuestionsScreen() {
  const [range, setRange] = useState("30");

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="eyebrow" tone="primary">
          Practice
        </Text>
        <Text variant="display" style={styles.title}>
          Question Reels
        </Text>
        <Text variant="body" tone="muted">
          Ten questions from each day&apos;s digest. Pick a window and work
          through them.
        </Text>
        <Badge label="Preview" variant="outline" />
      </View>

      <View style={styles.rangeRow}>
        {RANGES.map((item) => {
          const active = range === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setRange(item.id)}
              style={[styles.chip, active ? styles.chipActive : null]}
            >
              <Text
                variant="small"
                tone={active ? "inverted" : "muted"}
                style={styles.chipText}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Card style={styles.questionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.badges}>
            <Badge label="Hard" variant="danger" />
            <Badge label="Polity" variant="secondary" />
          </View>
          <Text variant="small" tone="muted">
            13 Nov 2026
          </Text>
        </View>

        <Text variant="heading" style={styles.question}>
          Under the amended data protection rules, which statement is correct?
        </Text>

        <View style={styles.options}>
          {OPTIONS.map((option) => {
            const correct = option.state === "correct";
            const wrong = option.state === "wrong";

            return (
              <View
                key={option.letter}
                style={[
                  styles.option,
                  correct ? styles.optionCorrect : null,
                  wrong ? styles.optionWrong : null,
                ]}
              >
                <View
                  style={[
                    styles.letter,
                    correct ? styles.letterCorrect : null,
                    wrong ? styles.letterWrong : null,
                  ]}
                >
                  <Text
                    variant="small"
                    tone={correct || wrong ? "inverted" : "muted"}
                    style={styles.letterText}
                  >
                    {option.letter}
                  </Text>
                </View>
                <Text variant="body" style={styles.optionText}>
                  {option.text}
                </Text>
                {correct ? (
                  <CheckCircle2 color={lightColors.success} size={20} />
                ) : null}
                {wrong ? (
                  <XCircle color={lightColors.destructive} size={20} />
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.explanation}>
          <Text variant="small" style={styles.explanationTitle}>
            Why A is correct
          </Text>
          <Text variant="small" tone="muted">
            The amendment sets a 30 day window for the regulator to publish
            findings after a complaint is closed. The other options describe
            powers the regulator does not have.
          </Text>
        </View>

        <Button title="Next question" size="sm" style={styles.nextButton} />
      </Card>

      <Text variant="small" tone="muted" style={styles.footer}>
        Live questions and date filtering connect in Part 7.
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
  rangeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    minHeight: 36,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: lightColors.border,
    backgroundColor: lightColors.card,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    borderColor: lightColors.primary,
    backgroundColor: lightColors.primary,
  },
  chipText: {
    fontFamily: "Inter_600SemiBold",
  },
  questionCard: {
    gap: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  question: {
    lineHeight: 26,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: lightColors.border,
    backgroundColor: lightColors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  optionCorrect: {
    borderColor: "#A7F3D0",
    backgroundColor: "#ECFDF5",
  },
  optionWrong: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  letter: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: lightColors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  letterCorrect: {
    backgroundColor: lightColors.success,
  },
  letterWrong: {
    backgroundColor: lightColors.destructive,
  },
  letterText: {
    fontFamily: "Inter_700Bold",
  },
  optionText: {
    flex: 1,
  },
  explanation: {
    borderRadius: radius.lg,
    backgroundColor: lightColors.accent,
    padding: spacing.md,
    gap: spacing.xs,
  },
  explanationTitle: {
    fontFamily: "Inter_600SemiBold",
    color: lightColors.accentForeground,
  },
  nextButton: {
    alignSelf: "flex-start",
  },
  footer: {
    textAlign: "center",
  },
});
