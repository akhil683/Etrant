import type { ZodType } from "zod";

import { getAccessToken, refreshSession } from "@/auth/session";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

type ApiFetchOptions<T> = {
  retry?: boolean;
  schema?: ZodType<T>;
};

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  options: ApiFetchOptions<T> = {},
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

  if (response.status === 401 && options.retry !== false) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiFetch<T>(path, init, { ...options, retry: false });
    }
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      body?.code ?? "HTTP_ERROR",
      response.status,
      body?.error ?? response.statusText,
    );
  }

  if (options.schema) {
    const parsed = options.schema.safeParse(body);
    if (!parsed.success) {
      if (__DEV__) {
        console.warn("API schema mismatch", path, parsed.error.flatten());
      }
      return body as T;
    }
    return parsed.data;
  }

  return body as T;
}
