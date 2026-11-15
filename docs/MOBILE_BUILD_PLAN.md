# Etrant mobile build plan

Status: proposed
Last updated: 2026-11-13
Scope: build the digest, nightly question reels, auth, subscription, and leaderboard.

Related documents:

- `docs/MOBILE_ARCHITECTURE.md` explains the system, data model, API, screens, and decisions.
- `docs/MOBILE_SKILLS.md` lists the installed skills.

## 1. How to use this plan

Build one part at a time. Do not start the next part until the current part passes its exit check.

The app has five features: Google sign in, daily digest, nightly question reels, leaderboard, and subscription. It does not include groups, chat, file analysis, on-demand AI questions, or Wikipedia reels.

Load `expo-overview` before any Expo task.

## 2. Build order at a glance

| Part | Name | Depends on | Output | Estimate |
| --- | --- | --- | --- | --- |
| 0 | Backend foundation | none | Tables, auth, scoring, leaderboard, subscription, account deletion | 3 to 4 days |
| 1 | Expo project setup | Part 0 | App runs on iOS and Android | 1 day |
| 2 | Dependencies and base wiring | Part 1 | Libraries installed, providers mounted, smoke screen passes | 1 day |
| 3 | Authentication | Part 2 | Google sign in, refresh, sign out, auth gate | 2 to 3 days |
| 4 | Design system and app shell | Part 3 | Tokens, primitives, four tabs, kitchen sink | 3 to 4 days |
| 5 | API client and contracts | Part 3 | Typed client, bearer auth, refresh, query keys | 1 to 2 days |
| 6 | Daily digest | Part 5 | Digest list and paid detail | 2 days |
| 7 | Question reels and date range | Part 6 | Question pager, 7/30/90/custom filter | 3 to 4 days |
| 8 | Scoring and leaderboard | Part 7 | Server scoring, points, streak, leaderboard | 2 to 3 days |
| 9 | Subscription handoff | Part 8 | Plans screen, external purchase sheet, entitlement refresh | 2 days |
| 10 | Profile and settings | Part 9 | Profile, plan, theme, legal, sign out, delete account | 2 days |
| 11 | Offline, performance, polish | Part 10 | Cache, image cache, budgets, design gate | 3 days |
| 12 | Testing and QA | Part 11 | Unit, component, contract, Maestro | 2 to 3 days |
| 13 | Build and store release | Part 12 | TestFlight and Play internal builds | 2 to 3 days |
| 14 | Launch and monitoring | Part 13 | Staged rollout, Sentry, PostHog, rollback plan | 1 to 2 days |

Total estimate: 5 to 6 weeks for one developer with an agent. The backend can run in parallel with Parts 1 and 2.

## 3. Part 0: Backend foundation

Status: implemented and verified on 2026-11-13.

Verified with `scripts/verify-mobile-part0.mjs`:

- Test user creation and a signed access token.
- `GET /api/user`
- `GET /api/digest`
- `GET /api/digest/[id]`
- `GET /api/questions`
- `POST /api/questions/attempt` with 10 points and duplicate protection
- `GET /api/leaderboard` with rank
- `GET /api/subscription/verify`
- 401 without a token

Still needed for production:

- `GOOGLE_MOBILE_CLIENT_IDS` to verify real Google ID tokens.
- `GEMINI_API_KEY` to generate the nightly questions.
- `AUTH_SECRET` for access tokens.
- `CRON_SECRET` for the nightly cron.

### Goal

Make the existing Next.js backend ready for the app.

### Steps

1. Add the tables from `docs/MOBILE_ARCHITECTURE.md`, section 7:
   - `questions`
   - `mobile_refresh_tokens`
   - `quiz_attempts`
2. Add the nightly question pipeline:
   - `lib/prompts/digest-to-questions.ts`
   - `lib/repositories/daily-question-repository.ts`
   - Extend `app/api/daily-digest/route.ts` to generate 10 questions after the digest insert.
3. Add mobile auth:
   - `lib/auth/mobile.ts`
   - `lib/auth/request-user.ts`
   - `POST /api/auth/mobile/google`
   - `POST /api/auth/mobile/refresh`
   - `POST /api/auth/mobile/logout`
4. Add scoring:
   - `POST /api/questions/attempt`
   - 10 points for correct, 2 for wrong
   - streak update on the first attempt of the day
5. Add the leaderboard:
   - `GET /api/leaderboard` returns the top 50 and `me` with rank.
6. Add subscription:
   - `GET /api/subscription/verify` accepts bearer auth.
   - `GET /api/user` accepts bearer auth.
   - The web checkout and webhook stay as they are.
7. Add account deletion:
   - `DELETE /api/account`
8. Gate the paid routes:
   - `GET /api/digest/[id]`
   - `GET /api/questions`
   - `GET /api/questions/dates`
   - `POST /api/questions/attempt`
9. Keep the existing `POST /api/questions` for the web's on-demand AI questions.
10. Apply the schema:

```bash
pnpm db:push
```

If Drizzle asks about the existing `daily_points.pois` column, choose the option that keeps your data.

11. Trigger the cron once:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://etrant.akkhil.dev/api/daily-digest
```

### Verification

- The cron response includes `digestDate` and `questions.inserted: 10`.
- `POST /api/auth/mobile/google` returns an access token, a refresh token, and the user.
- `GET /api/user` works with the bearer token.
- `GET /api/digest` works for a signed-in user.
- `GET /api/digest/[id]` returns 403 for a free user and 200 for a paid user.
- `POST /api/questions/attempt` awards points once per idempotency key.
- `GET /api/leaderboard` returns the top 50 and `me`.
- `GET /api/subscription/verify` returns the plan with the bearer token.
- `DELETE /api/account` removes the user.

### Exit check

A test user can sign in, read the digest, answer a question, earn points, see the leaderboard, and read the subscription status.

## 4. Part 1: Expo project setup

Status: implemented on 2026-11-14.

The app is scaffolded at `mobile/` with Expo SDK 58, React Native 0.88, React 19.3, Expo Router, and TypeScript. The bundle identifiers are `dev.akkhil.etrant`, the scheme is `etrant`, and the splash uses the Etrant blue.

### Goal

Create the app, give it an identity, and run it on both platforms.

### Steps

```bash
cd /path/to/Etrant
npx create-expo-app@latest mobile --template default
cd mobile
```

Set the identity in `mobile/app.json`:

```json
{
  "expo": {
    "name": "Etrant",
    "slug": "etrant",
    "scheme": "etrant",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "bundleIdentifier": "dev.akkhil.etrant",
      "supportsTablet": true,
      "associatedDomains": ["applinks:etrant.akkhil.dev"]
    },
    "android": {
      "package": "dev.akkhil.etrant"
    },
    "plugins": ["expo-router"]
  }
}
```

Start the app:

```bash
npx expo start --clear
```

Press `i` for iOS and `a` for Android. Then run it on one physical device with Expo Go.

### Verification

- The default app opens on iOS.
- The default app opens on Android.
- The app opens on a physical device.
- The bundle identifier and package name are the ones you will use in the stores.

### Exit check

The app runs on all three targets without a red screen.

## 5. Part 2: Dependencies and base wiring

Status: implemented and verified on 2026-11-14.

Installed with `npx expo install`:

- Auth: `expo-secure-store`, `expo-crypto`, `@react-native-google-signin/google-signin`
- Data: TanStack Query, the async storage persister, AsyncStorage, Zustand, Zod, date-fns
- UI: Google Fonts, `expo-haptics`, FlashList, `react-native-confetti-cannon`
- Analytics and errors: PostHog React Native, Sentry React Native, `expo-application`
- Updates: `expo-updates`, `expo-dev-client`
- Testing: `jest-expo`, Jest, types, React Native Testing Library

The provider tree is in `src/providers/app-providers.tsx`:

- `GestureHandlerRootView`
- `SafeAreaProvider`
- `QueryProvider` with AsyncStorage persistence
- `SessionProvider` placeholder
- `AnalyticsProvider`, which is a no-op when `EXPO_PUBLIC_POSTHOG_KEY` is missing

Sentry initializes only when `EXPO_PUBLIC_SENTRY_DSN` is set.

Verified:

- `npx expo-doctor`: 20/20 checks passed.
- `npx tsc --noEmit`: passes.
- `npx expo export --platform android`: bundles successfully.
- `npx expo export --platform web`: bundles successfully.

The temporary smoke screen is at `src/app/index.tsx`. It exercises Zustand, React Query, SecureStore, WebBrowser, Reanimated, FlashList, expo-image, PostHog, and Sentry.

### Goal

Install the libraries and prove they work together.

Use `npx expo install` for native code and `npm install` for pure JavaScript.

### Install groups

Run from `mobile/`.

Navigation and core:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar expo-splash-screen
```

UI and motion:

```bash
npx expo install expo-font @expo-google-fonts/inter @expo-google-fonts/newsreader expo-image expo-haptics
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install @shopify/flash-list
npm install react-native-confetti-cannon
```

Styling uses `StyleSheet` and the shared tokens in `src/theme/tokens.ts`. Do not add NativeWind or Tailwind in v1. Expo SDK 58 works without the extra styling build step.

Data and state:

```bash
npm install @tanstack/react-query @tanstack/query-async-storage-persister @react-native-async-storage/async-storage zustand zod date-fns
```

Auth:

```bash
npx expo install expo-secure-store expo-crypto
npx expo install @react-native-google-signin/google-signin
```

Browser:

```bash
npx expo install expo-web-browser
```

Analytics and errors:

```bash
npm install posthog-react-native @sentry/react-native
npx expo install expo-application expo-device
```

Updates and development builds:

```bash
npx expo install expo-updates expo-dev-client
```

Testing:

```bash
npx expo install jest-expo jest @types/jest --dev
npm install -D @testing-library/react-native
```

Do not install Pusher, document picker, file system, or notifications. They are not part of this app.

### Provider tree

Create `mobile/src/app/_layout.tsx`:

```tsx
<GestureHandlerRootView style={{ flex: 1 }}>
  <SafeAreaProvider>
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider>
          <PostHogProvider>
            <Sentry.ErrorBoundary fallback={<ErrorScreen />}>
              <Slot />
            </Sentry.ErrorBoundary>
          </PostHogProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  </SafeAreaProvider>
</GestureHandlerRootView>
```

### Smoke screen

Create a temporary `mobile/src/app/smoke.tsx` that proves:

- The theme tokens and StyleSheet styles render.
- Zustand increments.
- React Query calls `GET /api/digest`.
- FlashList renders 20 rows.
- expo-image loads a remote image.
- Reanimated animates a box.
- SecureStore writes and reads.
- WebBrowser opens a page.
- PostHog captures an event.
- Sentry captures a dev-only test error.

Delete the screen after Part 2.

### Verification

```bash
npx expo-doctor
npx tsc --noEmit
npx expo start --clear
```

- Every smoke item works on iOS.
- Every smoke item works on Android.
- `expo-doctor` reports no issues.
- `tsc` passes.

### Exit check

The smoke screen works on both platforms and the providers mount without warnings.

## 6. Part 3: Authentication

Status: implemented on 2026-11-14.

The app now has:

- `src/api/auth.ts`: Google token exchange, refresh, logout, current user.
- `src/auth/google.ts`: native Google Sign-In with a web guard.
- `src/auth/secure-store.ts`: SecureStore on native, localStorage on web.
- `src/auth/session.ts`: login, restore, refresh, access token, sign out.
- `src/api/client.ts`: bearer client with one retry after refresh.
- `src/providers/session-provider.tsx`: real session state and splash handling.
- `src/app/(auth)/welcome.tsx`
- `src/app/(auth)/sign-in.tsx`
- `src/app/(app)/home.tsx`
- Auth gate at `src/app/index.tsx`

The app was checked in the web preview. The welcome and sign-in screens render. The sign-in screen has a dev-only "Preview signed-in screen" button so the signed-in state can be viewed without Google credentials.

Still needed for real Google sign-in:

- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` in `mobile/.env.local`
- `GOOGLE_MOBILE_CLIENT_IDS` on the API server
- `AUTH_SECRET` on the API server
- The API server running at `EXPO_PUBLIC_API_URL`

### Goal

Sign in with Google, keep the session across restarts, refresh it, and sign out.

### Google Cloud setup

1. Create an OAuth client for iOS with the bundle identifier.
2. Create an OAuth client for Android with the package name and SHA-1 fingerprint.
3. Create an OAuth client for Web.
4. Put the client IDs in `mobile/.env`:

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
```

5. Add the mobile client IDs to the backend as `GOOGLE_MOBILE_CLIENT_IDS`.
6. Add the Google Sign-In plugin to `app.json` with the reversed iOS client ID as the URL scheme.

```json
{
  "plugins": [
    "expo-router",
    [
      "@react-native-google-signin/google-signin",
      {
        "iosUrlScheme": "com.googleusercontent.apps.your-ios-client-id"
      }
    ]
  ]
}
```

7. Rebuild the development client after changing the plugin.

### Backend contract

```http
POST /api/auth/mobile/google
{
  "idToken": "google-id-token",
  "nonce": "random-nonce",
  "deviceId": "stable-device-id",
  "platform": "ios"
}
```

Response:

```json
{
  "accessToken": "jwt",
  "refreshToken": "opaque-token",
  "expiresAt": 1760000000000,
  "user": {
    "id": "user-id",
    "name": "Name",
    "email": "name@example.com",
    "image": "https://...",
    "plan": "Free",
    "subscriptionActive": false,
    "points": 0,
    "streak": 0
  }
}
```

Refresh:

```http
POST /api/auth/mobile/refresh
{ "refreshToken": "opaque-token", "deviceId": "stable-device-id" }
```

Logout:

```http
POST /api/auth/mobile/logout
{ "refreshToken": "opaque-token" }
```

### Mobile flow

1. Create `src/auth/google.ts` with `GoogleSignin.configure`.
2. Create a nonce with `expo-crypto`.
3. Call `GoogleSignin.signIn({ nonce })`.
4. Post the ID token to `/api/auth/mobile/google`.
5. Store the refresh token and device id in SecureStore.
6. Keep the access token in memory and in SecureStore.
7. Add `getAccessToken`, `refreshSession`, `signOut`, and `clearSession` in `src/auth/session.ts`.
8. Add the auth gate in `src/app/index.tsx`.
9. Add the welcome and sign-in screens with plain components. The design comes in Part 4.
10. Add a temporary sign-out button.

### Verification

- Sign in with a Google test account.
- The app shows the user id and email.
- Kill the app and reopen it. The session is still active.
- Wait for the access token to expire, then make a request. The client refreshes once.
- Sign out. SecureStore is empty and the app returns to welcome.
- Revoke the refresh token on the server. The app signs out instead of looping.

### Exit check

A user can sign in, stay signed in across restarts, refresh an expired access token, and sign out.

## 7. Part 4: Design system and app shell

Status: implemented on 2026-11-14.

Built:

- `src/theme/tokens.ts`: light and dark palettes, spacing, radius, fonts, shadows.
- `src/theme/fonts.ts`: Inter and Newsreader loaded with `expo-font`.
- `src/theme/use-theme.ts`: light theme active, dark tokens ready for the polish part.
- `src/components/ui/`: `Text`, `Button`, `Card`, `Badge`, `Input`, `Avatar`, `Screen`, `Sheet`, `EmptyState`, `ErrorState`, `Skeleton`, `StatCard`.
- Four tabs: Digest, Questions, Leaderboard, Profile.
- `src/app/digest/[id].tsx`: digest detail with the Newsreader reading column.
- `src/app/subscription/index.tsx`: plans and the website handoff sheet.
- `src/app/dev/kitchen-sink.tsx`: every primitive in one screen.
- Restyled welcome and sign-in screens.

Verified:

- `npx tsc --noEmit`: passes.
- `npx expo-doctor`: 20/20 checks passed.
- `npx expo export --platform android`: bundles successfully.
- Web preview renders the welcome screen with Inter and the Etrant logo.

Dark mode is wired in the token file but not exposed yet. It returns in the polish part so the web preview stays deterministic.

### Goal

Build the visual language and the four-tab shell.

Load `impeccable`, `emil-design-eng`, `expo-native-ui`, `expo-design-system`, `better-typography`, `better-colors`, and `better-layout`.

### Steps

1. Create `src/theme/tokens.ts` from `docs/MOBILE_ARCHITECTURE.md`, section 14.
2. Load Inter and Newsreader.
3. Create `src/theme/tokens.ts` and style the primitives with `StyleSheet`.
4. Build the primitives:
   - `Screen`
   - `Button`
   - `Card`
   - `Badge`
   - `Input`
   - `Avatar`
   - `Sheet`
   - `EmptyState`
   - `ErrorState`
   - `Skeleton`
   - `StatCard`
5. Build the theme store. Support system, light, and dark.
6. Build four tabs: Digest, Questions, Leaderboard, Profile.
7. Build the stack header for the digest detail and the plans screen.
8. Build a kitchen sink screen at `src/app/dev/kitchen-sink.tsx`.
9. Restyle the welcome and sign-in screens.
10. Apply the design direction and quality gate.

### Verification

- The kitchen sink renders in light and dark.
- Every button has a 44 by 44 point touch target.
- Text scales to 200 percent without clipping.
- The tab bar respects the safe area on a notched iPhone and on Android gesture navigation.
- No card inside a card.
- No gradient text, decorative glass, or emoji icons.
- The auth screens look like the web app.

### Exit check

The four tabs and the primitives look finished in both themes.

## 8. Part 5: API client and contracts

Status: implemented on 2026-11-14.

Built:

- `src/api/schemas.ts`: Zod schemas for auth, user, digest, questions, attempts, leaderboard, and subscription.
- `src/api/client.ts`: `apiFetch` with bearer auth, one refresh retry, typed `ApiError`, and optional schema parsing.
- `src/api/auth.ts`: token exchange, refresh, logout, current user.
- `src/api/user.ts`
- `src/api/digest.ts`
- `src/api/questions.ts`
- `src/api/leaderboard.ts`
- `src/api/subscription.ts`
- `src/lib/query-keys.ts`
- `src/lib/errors.ts`
- `src/components/error-boundary.tsx`, wrapped around the root stack.

Verified:

- `npx tsc --noEmit`: passes.
- `npx expo-doctor`: 20/20 checks passed.
- `npx expo export --platform android`: bundles successfully.
- Production static web export renders the welcome screen.

The screens still use preview content. Parts 6 to 8 replace it with the typed API calls.

### Goal

Add one typed client that attaches the access token and refreshes on 401.

### Steps

1. Create `src/api/client.ts`:

```ts
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  retry = true,
): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 401 && retry) {
    const refreshed = await refreshSession();
    if (refreshed) return apiFetch<T>(path, init, false);
    await clearSession();
    throw new ApiError("UNAUTHORIZED", 401, "Session expired");
  }

  if (response.status === 403) {
    const body = await response.json().catch(() => null);
    if (body?.code === "SUBSCRIPTION_REQUIRED") {
      throw new ApiError("SUBSCRIPTION_REQUIRED", 403, body.error);
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      body?.code ?? "HTTP_ERROR",
      response.status,
      body?.message ?? response.statusText,
    );
  }

  return response.json() as Promise<T>;
}
```

2. Add `src/api/auth.ts`, `digest.ts`, `questions.ts`, `leaderboard.ts`, `subscription.ts`, and `user.ts`.
3. Add `src/lib/query-keys.ts` from the architecture doc, section 15.
4. Add `src/lib/errors.ts` with a message map.
5. Add Zod schemas in `src/types` or `packages/contracts`.
6. Add a global error boundary.

### Verification

- `GET /api/user` returns the signed-in user.
- A 401 triggers one refresh and then succeeds.
- A 403 with `SUBSCRIPTION_REQUIRED` routes to the plans screen.
- A network error shows the offline state.
- Responses are parsed with their schemas in development.

### Exit check

No screen calls `fetch` directly.

## 9. Part 6: Daily digest

Status: implemented on 2026-11-14.

Built:

- `src/hooks/use-digest.ts`: `useLatestDigest` and `useDigestDetail` with TanStack Query.
- `src/hooks/use-network-status.ts`: offline detection with NetInfo.
- `src/lib/dates.ts`: digest date formatting and topic splitting.
- `src/components/ui/locked-state.tsx`: the paid gate.
- `src/app/(tabs)/digest.tsx`: live list, skeleton loading, empty state, error state, offline banner, pull to refresh.
- `src/app/digest/[id].tsx`: live detail, serif reading column, Q&A accordion, source link, paid gate, pull to refresh.
- `src/api/mock.ts`: dev-preview digest data so the UI can be seen without Google credentials.

Verified:

- `npx tsc --noEmit`: passes.
- `npx expo-doctor`: 20/20 checks passed.
- `npx expo export --platform android`: bundles successfully.
- Static web preview renders the welcome screen and the digest flow.

The digest list is free. The detail is paid and shows the locked state when the API returns `SUBSCRIPTION_REQUIRED`.

### Goal

Show the latest digest and open one article for paid users.

### Steps

1. Build the digest tab with a header, date, and cards.
2. Each card shows topic chips, title, a summary excerpt, and "Read the digest".
3. Build the detail screen with the Newsreader font, a 68 character measure, the source link, and the Q&A accordion.
4. Add the paid gate on the detail. A free user sees the locked screen with "View plans".
5. Add pull to refresh.
6. Add loading, empty, error, and offline states.
7. Cache the last digest.

### Verification

- The digest tab shows the latest day.
- The detail shows the full summary and every question and answer for a paid user.
- A free user sees the locked screen on the detail, not the list.
- The source link opens in the in-app browser.
- A day with no digest shows a clear empty state.
- The last digest is readable offline.

### Exit check

A paid user can read the latest digest and its detail without a network after the first load.

## 10. Part 7: Question reels and date range

### Goal

Show the day's questions in a full screen reel and filter them by date range.

### Steps

1. Build the questions tab with a date range control: 7 days, 30 days, 90 days, Custom.
2. Custom opens a date range picker. Use `GET /api/questions/dates` to disable days without questions.
3. Build the question pager with FlashList or FlatList paging.
4. Build the question card with difficulty, tags, date, four answer rows, and letter badges.
5. Add correct and wrong states. Correct turns green, selected wrong turns red, others fade.
6. Add the explanation sheet after an answer.
7. Add confetti on a correct answer and haptics on selection.
8. Prefetch the next page when the user reaches the second to last question.
9. Add empty and error states for ranges with no questions.
10. Cache the last 100 questions.
11. Add the paid gate. A free user sees the locked screen.

### Verification

- The default 30 day range loads the day's questions.
- Switching to 7 or 90 days reloads the list.
- A custom range with no questions shows the empty state.
- Swiping is 60 fps on a mid-tier Android device.
- No blank frame between questions.
- The explanation opens after an answer.
- The last batch is readable offline.
- A free user sees the locked screen.

### Exit check

A paid user can answer questions from the last 7, 30, or 90 days, or a custom range, without a blank screen or a crash.

## 11. Part 8: Scoring and leaderboard

### Goal

Score answers on the server, update points and streak, and show the leaderboard.

### Steps

1. Wire the answer selection to `POST /api/questions/attempt`.
2. Send `questionId`, `selectedIndex`, and an idempotency key.
3. Show the server response: correct index, explanation, points, total points.
4. Update the points chip from the server response, not from a local guess.
5. Build the leaderboard tab with the top 50.
6. Show rank, avatar, name, points, and streak.
7. Highlight the current user and show their rank even outside the top 50.
8. Add pull to refresh and an empty state.

### Verification

- A correct answer awards 10 points and a wrong answer awards 2.
- The same idempotency key does not award points twice.
- The streak increments once per day.
- The leaderboard matches `users.points`.
- The current user rank is correct.
- A free user cannot score because the attempt route returns 403.

### Exit check

The server is the only source of points, and the leaderboard matches the database.

## 12. Part 9: Subscription handoff

### Goal

Let the user buy on the website, then unlock paid features in the app with the same account.

### Steps

1. Build the plans screen with Free, Pro, and Max cards.
2. Add the handoff sheet with this copy:
   - Title: "Subscribe on our website"
   - Body: "Plans and payments are handled on etrant.akkhil.dev. Sign in there with the same Google account you use in this app. After payment, come back and your plan will appear automatically."
   - Primary button: "Open etrant.akkhil.dev"
   - Secondary button: "Not now"
3. Show the signed-in email in the sheet.
4. Open `https://etrant.akkhil.dev/subscription?from=app` with `WebBrowser.openBrowserAsync`.
5. On return, on foreground, and on pull to refresh, call `GET /api/subscription/verify`.
6. If active, update the session store and unlock paid features.
7. If still pending after 30 seconds, show "Payment is still processing. Pull to refresh in a minute."
8. If the account is different, show "Sign in with the same Google account you used on the website."
9. Make every paid gate route to the plans screen.
10. Confirm the web app has the `?from=app` notice and the login callback.

### Verification

- A free user taps a paid feature and sees the plans screen.
- The sheet shows the signed-in email.
- The website shows the same-account notice.
- A test purchase writes `users.subscriptionActive` and `users.plan`.
- Returning to the app refreshes the entitlement and unlocks paid features.
- A purchase on a different account does not unlock the app.
- No StoreKit, Google Play Billing, or RevenueCat code exists in the app.

### Exit check

A website purchase unlocks the app on return with the same account.

### Store decision gate

Before the first App Store submission, decide how to handle Apple Guideline 3.1.1. The options are in `docs/MOBILE_ARCHITECTURE.md`, section 9.4. Do not submit without a decision.

## 13. Part 10: Profile and settings

### Goal

Give the user their account, plan, preferences, and the account deletion path.

### Steps

1. Build the profile with avatar, name, email, plan badge, points, and streak.
2. Add "Manage subscription" that opens the plans screen.
3. Add appearance: system, light, dark.
4. Add privacy policy and terms, opened in the browser.
5. Add the app version and build number.
6. Add sign out. It calls `POST /api/auth/mobile/logout`, clears SecureStore, and clears the query cache.
7. Add delete account with a confirmation screen. It calls `DELETE /api/account` and returns to welcome.

### Verification

- The profile matches the signed-in user.
- Theme changes persist across restarts.
- Sign out clears the session.
- Delete account removes the user and cascades.
- Privacy and terms open correctly.

### Exit check

The user can manage the account from the app, including deletion.

## 14. Part 11: Offline, performance, and polish

### Goal

Make the app fast and reliable, then run the design gate again.

### Steps

1. Persist the query cache with AsyncStorage and a whitelist of keys.
2. Cache images with `expo-image`.
3. Use FlashList for the digest list, question pager, and leaderboard.
4. Memoize question cards and leaderboard rows.
5. Prefetch the next question page.
6. Add the offline banner and retry actions.
7. Profile startup, question swipe, and memory.
8. Run `break-ui` on long titles, emoji, empty ranges, and 200 percent text.
9. Run `interface-review` on the diff.
10. Run `better-accessibility` and fix the findings.

### Performance budgets

| Metric | Target |
| --- | --- |
| Cold start to interactive | under 2.5 s on a mid-tier Android device |
| Question swipe | 60 fps, no blank frame |
| Digest list scroll | 60 fps with 100 cards |
| Leaderboard scroll | 60 fps with 50 rows |
| Image memory | under 120 MB during a 50 question session |
| Initial JS bundle | under 3 MB compressed |
| API p95 | under 400 ms for reads |

### Exit check

The app meets the budgets, the design gate passes, and no screen clips at 200 percent text.

## 15. Part 12: Testing and QA

### Goal

Prove the app works across the important paths and devices.

| Layer | Tool | What it covers |
| --- | --- | --- |
| Unit | Jest | Token math, date ranges, formatting, answer selection |
| Component | React Native Testing Library | Digest card, question card, leaderboard row, locked screen |
| Contract | Vitest and Zod | API response shapes |
| API | Vitest and a test database | Auth, scoring, date range, subscription gate |
| E2E | Maestro | Sign in, digest, questions, date filter, leaderboard, subscription sheet, profile |
| Manual | Device matrix | iOS 17 and 18, Android 13 to 16, small and large screens |

Maestro flows:

```text
flows/
  auth.yaml
  digest.yaml
  digest-detail.yaml
  questions.yaml
  date-range.yaml
  leaderboard.yaml
  subscription.yaml
  profile.yaml
```

### Verification

```bash
npx jest
maestro test flows/
```

- All flows pass on iOS.
- All flows pass on Android.
- The device matrix passes.
- No crash appears in Sentry during the test run.

### Exit check

CI is green and the release candidate passes the device matrix.

## 16. Part 13: Build and store release

### Goal

Ship a signed build to TestFlight and Play internal testing.

### Steps

1. Create `eas.json` with `development`, `preview`, and `production` profiles.
2. Configure the Apple Developer account, App Store Connect, and Google Play.
3. Add signing credentials to EAS.
4. Build:

```bash
eas build --profile preview --platform all
```

5. Submit:

```bash
eas submit --platform ios
eas submit --platform android
```

6. Prepare the listing with `app-store-optimization`:
   - App name and subtitle.
   - Keywords.
   - Screenshots with captions.
   - Privacy labels: identifiers, purchases, diagnostics, analytics.
   - Age rating.
   - Support URL and privacy policy URL.
7. Add review notes for account deletion and the external purchase handoff.
8. Add a note that the app has no user-generated content.

### Verification

- The preview build installs on a clean device.
- TestFlight shows the build.
- Play internal testing shows the build.
- The listing preview looks correct.
- The privacy labels match the data the app collects.

### Exit check

A release candidate is available in both stores for internal testing.

## 17. Part 14: Launch and monitoring

### Goal

Release to production with a rollback path.

### Steps

1. Roll out to 10 percent of users.
2. Watch crash-free sessions, API errors, subscription activation, and empty question ranges.
3. Increase to 50 percent after 24 hours.
4. Increase to 100 percent after another 24 hours.
5. Keep the previous build available for rollback.
6. Add a Sentry release and source maps.
7. Add PostHog events for sign in, digest open, question answer, date range change, subscription handoff, and leaderboard view.
8. Add a weekly review of the top crashes and the slowest screens.

### Verification

- Crash-free sessions are above 99.5 percent.
- Subscription activation matches the web payments.
- The digest and question APIs have no elevated error rate.
- The date range filter has no empty days that should have questions.
- The rollback build is ready.

### Exit check

The app is at 100 percent rollout, the crash-free rate is above 99.5 percent, and the team knows how to roll back.

## 18. Dependency order rules

These parts can run in parallel:

- Part 0 backend and Part 1 Expo setup.
- Part 4 primitives and Part 5 API client.
- Part 6 digest and Part 7 question pager, once Part 5 is done.
- Part 8 scoring and Part 9 subscription, once Part 7 is done.
- Part 10 profile and Part 11 polish, once Part 9 is done.

These parts must stay sequential:

- Part 1 before Part 2.
- Part 2 before Part 3.
- Part 3 before Part 4.
- Part 5 before Part 6.
- Part 6 before Part 7.
- Part 7 before Part 8.
- Part 8 before Part 9.
- Part 9 before Part 10.
- Part 10 before Part 11.
- Part 11 before Part 12.
- Part 12 before Part 13.
- Part 13 before Part 14.

## 19. Definition of done for the app

- A user can sign in with Google and stay signed in across restarts.
- The digest list and detail work, with the detail gated for paid users.
- The question reels work for 7, 30, 90 day and custom ranges.
- Answers are scored on the server, points and streak update, and the leaderboard matches.
- A website purchase unlocks paid features in the app with the same account.
- The nightly cron inserts 10 questions for the day without duplicates.
- The app works offline with the last cached digest and question batch.
- Account deletion works from the profile.
- The design gate and accessibility checks pass.
- Maestro flows pass on iOS and Android.
- The app is in TestFlight and Play internal testing.
- Crash-free sessions are above 99.5 percent after launch.

## Appendix A. Command cheat sheet

```bash
# Create the app
npx create-expo-app@latest mobile --template default

# Start the dev server
npx expo start --clear

# Run a development build
npx expo run:ios
npx expo run:android

# Install a native dependency with the right version
npx expo install <package>

# Check the project
npx expo-doctor
npx tsc --noEmit

# Tests
npx jest
maestro test flows/

# Build and submit
eas build --profile preview --platform all
eas build --profile production --platform all
eas submit --platform ios
eas submit --platform android

# Update the JavaScript bundle without a store release
eas update --channel production --message "fix: copy"
```

## Appendix B. Environment variables

Mobile, public only:

```env
EXPO_PUBLIC_API_URL=https://etrant.akkhil.dev
EXPO_PUBLIC_POSTHOG_KEY=
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_SUBSCRIPTION_URL=https://etrant.akkhil.dev/subscription?from=app
EXPO_PUBLIC_SENTRY_DSN=
```

Backend additions:

```env
GOOGLE_MOBILE_CLIENT_IDS=
```

`AUTH_SECRET` must be set for access tokens.

## Appendix C. Per-part skill map

| Part | Load first | Load next |
| --- | --- | --- |
| 0. Backend foundation | `architect` | `postgres-drizzle`, `typescript-best-practices`, `tdd`, `how`, `why` |
| 1. Expo setup | `expo-overview` | `expo-project-structure`, `expo-router` |
| 2. Dependencies | `expo-overview` | `expo-data-fetching`, `expo-design-system`, `expo-animation` |
| 3. Authentication | `expo-data-fetching` | `react-native-best-practices`, `tdd`, `typescript-best-practices` |
| 4. Design system | `impeccable` | `expo-native-ui`, `expo-design-system`, `frontend-design`, `better-typography`, `better-colors`, `better-layout`, `react-native-design` |
| 5. API client | `expo-data-fetching` | `typescript-best-practices`, `codebase-design` |
| 6. Digest | `expo-router` | `better-typography`, `expo-data-fetching`, `react-native-testing` |
| 7. Questions and date range | `expo-animation` | `animate-expo`, `gestures`, `vercel-react-native-skills`, `react-native-best-practices`, `break-ui` |
| 8. Scoring and leaderboard | `expo-data-fetching` | `tdd`, `react-native-testing`, `typescript-best-practices` |
| 9. Subscription handoff | `dodo-payments` | `expo-data-fetching`, `impeccable` |
| 10. Profile and settings | `expo-router` | `react-native-testing`, `better-accessibility` |
| 11. Offline and performance | `react-native-best-practices` | `expo-data-fetching`, `interface-review`, `review-animations`, `better-accessibility` |
| 12. Testing | `maestro-mobile-testing` | `react-native-testing`, `tdd`, `principle-prove-it-works` |
| 13. Release | `eas-app-stores` | `app-store-optimization`, `technical-writing` |
| 14. Launch | `principle-prove-it-works` | `technical-writing`, `unslop` |

## Appendix D. Build checklist

- [x] Part 0: Backend foundation
- [x] Part 1: Expo project setup
- [x] Part 2: Dependencies and base wiring
- [x] Part 3: Authentication
- [x] Part 4: Design system and app shell
- [x] Part 5: API client and contracts
- [x] Part 6: Daily digest
- [ ] Part 7: Question reels and date range
- [ ] Part 8: Scoring and leaderboard
- [ ] Part 9: Subscription handoff
- [ ] Part 10: Profile and settings
- [ ] Part 11: Offline, performance, polish
- [ ] Part 12: Testing and QA
- [ ] Part 13: Build and store release
- [ ] Part 14: Launch and monitoring

Do not tick a box until that part's exit check passes.
