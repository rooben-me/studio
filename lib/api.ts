import type { HistoryItem, GenerationRequest, RetryOptions } from "@/types";
import { exponentialBackoff } from "./retry";

export async function generateWithRetry(
  request: GenerationRequest,
  options: RetryOptions = {}
): Promise<HistoryItem> {
  if (options.apiMode === "gemini") {
    const endpoint = "/api/generate-gemini";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: options.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData?.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    if (!isValidHistoryItem(data)) {
      throw new Error("Invalid response format from server");
    }

    return data as HistoryItem;
  }

  return exponentialBackoff(async () => {
    const endpoint = "/api/generate";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: options.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData?.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    if (!isValidHistoryItem(data)) {
      throw new Error("Invalid response format from server");
    }

    return data as HistoryItem;
  }, options);
}

function isValidHistoryItem(data: any): data is HistoryItem {
  return (
    data &&
    typeof data === "object" &&
    typeof data.id === "string" &&
    typeof data.imageUrl === "string" &&
    typeof data.prompt === "string" &&
    typeof data.task === "string" &&
    typeof data.createdAt === "string"
  );
}
