import { Platform } from "react-native";

import {
  exchangeGoogleToken,
  fetchCurrentUser,
  refreshMobileSession,
  revokeMobileSession,
  type MobileSession,
  type SessionUser,
} from "@/api/auth";
import { signInWithGoogle } from "@/auth/google";
import {
  clearStoredSession,
  getOrCreateDeviceId,
  getStoredSession,
  storeSession,
} from "@/auth/secure-store";

export type { SessionUser };

const EXPIRY_BUFFER_MS = 30_000;

export async function loginWithGoogle(): Promise<MobileSession> {
  const idToken = await signInWithGoogle();
  const deviceId = await getOrCreateDeviceId();
  const platform: "ios" | "android" =
    Platform.OS === "ios" ? "ios" : "android";

  const session = await exchangeGoogleToken({
    idToken,
    deviceId,
    platform,
  });

  await storeSession({ ...session, deviceId });
  return session;
}

export async function refreshSession(): Promise<boolean> {
  const stored = await getStoredSession();
  if (!stored) return false;

  try {
    const session = await refreshMobileSession({
      refreshToken: stored.refreshToken,
      deviceId: stored.deviceId,
    });

    await storeSession({ ...session, deviceId: stored.deviceId });
    return true;
  } catch {
    await clearStoredSession();
    return false;
  }
}

export async function restoreSession(): Promise<SessionUser | null> {
  const stored = await getStoredSession();
  if (!stored) return null;

  if (stored.expiresAt > Date.now() + EXPIRY_BUFFER_MS) {
    const user = await fetchCurrentUser(stored.accessToken).catch(() => null);
    if (user) return user;
  }

  const refreshed = await refreshSession();
  if (!refreshed) return null;

  const next = await getStoredSession();
  return next?.user ?? null;
}

export async function getAccessToken(): Promise<string | null> {
  const stored = await getStoredSession();
  if (!stored) return null;

  if (stored.expiresAt > Date.now() + EXPIRY_BUFFER_MS) {
    return stored.accessToken;
  }

  const refreshed = await refreshSession();
  if (!refreshed) return null;

  const next = await getStoredSession();
  return next?.accessToken ?? null;
}

export async function signOutSession() {
  const stored = await getStoredSession();

  if (stored?.refreshToken) {
    await revokeMobileSession(stored.refreshToken).catch(() => undefined);
  }

  await clearStoredSession();
}
