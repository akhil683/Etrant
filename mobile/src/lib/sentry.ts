const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

export async function initSentry() {
  if (!dsn) return;

  const Sentry = await import("@sentry/react-native");

  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    enableAutoSessionTracking: true,
  });
}
