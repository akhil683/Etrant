import { ApiError } from "@/api/client";
import { AuthError } from "@/api/auth";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "UNAUTHORIZED":
        return "Your session expired. Please sign in again.";
      case "SUBSCRIPTION_REQUIRED":
        return "This feature is part of a paid plan.";
      case "NOT_FOUND":
        return "We could not find that item.";
      case "HTTP_ERROR":
        return "Something went wrong. Please try again.";
      default:
        return error.message;
    }
  }

  if (error instanceof AuthError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function isSubscriptionRequired(error: unknown) {
  return error instanceof ApiError && error.code === "SUBSCRIPTION_REQUIRED";
}

export function isUnauthorized(error: unknown) {
  return error instanceof ApiError && error.code === "UNAUTHORIZED";
}
