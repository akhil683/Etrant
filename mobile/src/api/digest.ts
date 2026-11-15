import { apiFetch } from "./client";
import { digestDetailSchema, digestResponseSchema } from "./schemas";

export function getLatestDigest() {
  return apiFetch("/api/digest", undefined, {
    schema: digestResponseSchema,
  });
}

export function getDigestDetail(id: number | string) {
  return apiFetch(`/api/digest/${id}`, undefined, {
    schema: digestDetailSchema,
  });
}
