import { apiFetch } from "./client";
import { userResponseSchema } from "./schemas";

export async function getMe() {
  const data = await apiFetch("/api/user", undefined, {
    schema: userResponseSchema,
  });
  return data.user;
}
