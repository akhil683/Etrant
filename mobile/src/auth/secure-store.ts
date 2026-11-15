import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import * as Crypto from "expo-crypto";

import type { MobileSession, SessionUser } from "@/api/auth";

const SESSION_KEY = "etrant.session";
const DEVICE_KEY = "etrant.deviceId";

export type StoredSession = MobileSession & {
  deviceId: string;
};

type WebStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function webStorage(): WebStorage | null {
  return (globalThis as { localStorage?: WebStorage }).localStorage ?? null;
}

async function readValue(key: string) {
  if (Platform.OS === "web") {
    return webStorage()?.getItem(key) ?? null;
  }
  return SecureStore.getItemAsync(key);
}

async function writeValue(key: string, value: string) {
  if (Platform.OS === "web") {
    webStorage()?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function deleteValue(key: string) {
  if (Platform.OS === "web") {
    webStorage()?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function getOrCreateDeviceId() {
  const existing = await readValue(DEVICE_KEY);
  if (existing) return existing;

  const deviceId = Crypto.randomUUID();
  await writeValue(DEVICE_KEY, deviceId);
  return deviceId;
}

export async function storeSession(session: StoredSession) {
  await writeValue(SESSION_KEY, JSON.stringify(session));
}

export async function getStoredSession(): Promise<StoredSession | null> {
  const raw = await readValue(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.deviceId !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function clearStoredSession() {
  await deleteValue(SESSION_KEY);
}
