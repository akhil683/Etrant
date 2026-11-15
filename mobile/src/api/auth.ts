import {
  mobileSessionSchema,
  userResponseSchema,
  type MobileSession,
  type SessionUser,
} from "./schemas";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export type { MobileSession, SessionUser };

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AuthError(
      body?.code ?? "AUTH_FAILED",
      body?.error ?? "Authentication failed.",
    );
  }

  return body as T;
}

export async function exchangeGoogleToken(input: {
  idToken: string;
  deviceId: string;
  platform: "ios" | "android";
}) {
  const data = await request<unknown>("/api/auth/mobile/google", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return mobileSessionSchema.parse(data);
}

export async function refreshMobileSession(input: {
  refreshToken: string;
  deviceId: string;
}) {
  const data = await request<unknown>("/api/auth/mobile/refresh", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return mobileSessionSchema.parse(data);
}

export function revokeMobileSession(refreshToken: string) {
  return request<{ success: boolean }>("/api/auth/mobile/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function fetchCurrentUser(
  accessToken: string,
): Promise<SessionUser | null> {
  const response = await fetch(`${API_URL}/api/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) return null;
  if (!response.ok) {
    throw new AuthError("USER_FAILED", "Could not load the user.");
  }

  const body = await response.json();
  return userResponseSchema.parse(body).user;
}
