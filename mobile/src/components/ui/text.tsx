import {
  Text as RNText,
  type TextProps,
  type TextStyle,
} from "react-native";

import { fonts, lightColors } from "@/theme/tokens";

export type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "body"
  | "small"
  | "eyebrow"
  | "serif"
  | "serifLarge"
  | "button"
  | "mono";

export type TextTone =
  | "default"
  | "muted"
  | "primary"
  | "danger"
  | "success"
  | "inverted";

const variants: Record<TextVariant, TextStyle> = {
  display: {
    fontFamily: fonts.sansBold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1,
  },
  title: {
    fontFamily: fonts.sansBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.6,
  },
  heading: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23,
  },
  small: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  eyebrow: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  serif: {
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 28,
  },
  serifLarge: {
    fontFamily: fonts.serifMedium,
    fontSize: 21,
    lineHeight: 30,
  },
  button: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    lineHeight: 20,
  },
  mono: {
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 19,
  },
};

const tones: Record<TextTone, TextStyle> = {
  default: { color: lightColors.foreground },
  muted: { color: lightColors.mutedForeground },
  primary: { color: lightColors.primary },
  danger: { color: lightColors.destructive },
  success: { color: lightColors.success },
  inverted: { color: lightColors.primaryForeground },
};

export function Text({
  variant = "body",
  tone = "default",
  style,
  ...props
}: TextProps & {
  variant?: TextVariant;
  tone?: TextTone;
}) {
  return (
    <RNText {...props} style={[variants[variant], tones[tone], style]} />
  );
}
