import { DefaultTheme, ThemeProvider } from "expo-router";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { ErrorBoundary } from "@/components/error-boundary";
import { initSentry } from "@/lib/sentry";
import { AppProviders } from "@/providers/app-providers";
import { useAppFonts } from "@/theme/fonts";

SplashScreen.preventAutoHideAsync();
initSentry();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppProviders>
      <ThemeProvider value={DefaultTheme}>
        <ErrorBoundary>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="digest/[id]" />
            <Stack.Screen name="subscription/index" />
            <Stack.Screen name="dev/kitchen-sink" />
          </Stack>
        </ErrorBoundary>
      </ThemeProvider>
    </AppProviders>
  );
}
