import type { ComponentType, ReactNode } from "react";

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const host =
  process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

type PostHogProviderProps = {
  apiKey: string;
  options?: {
    host?: string;
    captureAppLifecycleEvents?: boolean;
  };
  children: ReactNode;
};

// PostHog ships native code that Expo Go does not include. Load it only when a
// key is configured so the preview build keeps working inside Expo Go.
let PostHogProvider: ComponentType<PostHogProviderProps> | null = null;

if (apiKey) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    PostHogProvider = require("posthog-react-native").PostHogProvider;
  } catch {
    PostHogProvider = null;
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  if (!apiKey || !PostHogProvider) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider
      apiKey={apiKey}
      options={{
        host,
        captureAppLifecycleEvents: true,
      }}
    >
      {children}
    </PostHogProvider>
  );
}
