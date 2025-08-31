import type { RetryOptions } from "@/types";
import { RETRY_CONFIG } from "@/constants";
import { showGenerationToast } from "./toast";

export async function exponentialBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = RETRY_CONFIG.maxAttempts,
    baseDelay = RETRY_CONFIG.baseDelay,
    maxDelay = RETRY_CONFIG.maxDelay,
    signal,
  } = options;

  let attempt = 0;
  let lastError: Error;

  while (attempt < maxAttempts) {
    if (signal?.aborted) {
      throw new Error("Operation aborted");
    }

    attempt++;

    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on abort errors
      if (lastError.name === "AbortError" || signal?.aborted) {
        throw lastError;
      }

      // Don't delay on the last attempt
      if (attempt >= maxAttempts) {
        break;
      }

      // Show retry toast notification with error reason
      const errorMessage = lastError.message || "Unknown error";
      showGenerationToast.retrying(attempt, errorMessage);

      // Calculate exponential backoff with jitter
      const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
      const delay = Math.min(exponentialDelay + jitter, maxDelay);

      await sleep(delay);
    }
  }

  throw lastError!;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createAbortableOperation<T>(
  operation: (signal: AbortSignal) => Promise<T>
): {
  execute: () => Promise<T>;
  abort: () => void;
  signal: AbortSignal;
} {
  const controller = new AbortController();

  return {
    execute: () => operation(controller.signal),
    abort: () => controller.abort(),
    signal: controller.signal,
  };
}
