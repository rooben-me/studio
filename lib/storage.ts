import type { HistoryItem } from "@/types";
import {
  HISTORY_STORAGE_KEY,
  MAX_HISTORY_ITEMS,
  MAX_STORAGE_IMAGE_BYTES,
  FALLBACK_IMAGE_BYTES,
} from "@/constants";
import { compressToMaxBytes, estimateDataUrlBytes } from "./downscale";
import { toast } from "sonner";

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Validate and clean the data
    const validItems = parsed
      .filter(isValidHistoryItem)
      .slice(0, MAX_HISTORY_ITEMS);

    return validItems;
  } catch (error) {
    console.warn("Failed to load history from localStorage:", error);
    return [];
  }
}

export async function saveHistoryItem(item: HistoryItem): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    if (!isValidHistoryItem(item)) {
      console.warn("Invalid history item, skipping save:", item);
      return;
    }

    // Compress images to reduce localStorage usage
    const processedItem = await processHistoryItemImages(item);

    const currentHistory = loadHistory();
    const filteredHistory = currentHistory.filter(
      (existing) => existing.id !== item.id
    );
    const newHistory = [processedItem, ...filteredHistory].slice(
      0,
      MAX_HISTORY_ITEMS
    );

    await saveHistoryWithFallback(newHistory);
  } catch (error) {
    console.error("Failed to save history item:", error);
    if (isQuotaExceededError(error)) {
      console.warn(
        "localStorage quota exceeded. Clearing old history to make space."
      );
      toast.warning("Storage full. Clearing old history to save new result.");
      await clearOldHistoryAndRetry(item);
    } else {
      toast.error("Failed to save result to history");
    }
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}

export function removeHistoryItem(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const currentHistory = loadHistory();
    const filteredHistory = currentHistory.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error("Failed to remove history item:", error);
  }
}

function isValidHistoryItem(item: any): item is HistoryItem {
  return (
    item &&
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.imageUrl === "string" &&
    typeof item.prompt === "string" &&
    typeof item.task === "string" &&
    typeof item.createdAt === "string" &&
    (item.originalImageUrl === undefined ||
      typeof item.originalImageUrl === "string") &&
    item.id.length > 0 &&
    item.imageUrl.length > 0
  );
}

export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function safeLocalStorageSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
  }
}

async function processHistoryItemImages(
  item: HistoryItem
): Promise<HistoryItem> {
  try {
    const processedItem = { ...item };

    // Compress the generated image
    if (item.imageUrl && isDataUrl(item.imageUrl)) {
      const compressedImage = await compressToMaxBytes(
        item.imageUrl,
        MAX_STORAGE_IMAGE_BYTES
      );
      processedItem.imageUrl = compressedImage;
    }

    // Compress the original image if it exists
    if (item.originalImageUrl && isDataUrl(item.originalImageUrl)) {
      const compressedOriginal = await compressToMaxBytes(
        item.originalImageUrl,
        MAX_STORAGE_IMAGE_BYTES
      );
      processedItem.originalImageUrl = compressedOriginal;
    }

    return processedItem;
  } catch (error) {
    console.warn("Failed to compress images, using originals:", error);
    return item;
  }
}

async function saveHistoryWithFallback(history: HistoryItem[]): Promise<void> {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    if (isQuotaExceededError(error)) {
      const compressedHistory = await Promise.all(
        history.map(async (item) => {
          const processedItem = { ...item };

          if (item.imageUrl && isDataUrl(item.imageUrl)) {
            try {
              processedItem.imageUrl = await compressToMaxBytes(
                item.imageUrl,
                FALLBACK_IMAGE_BYTES
              );
            } catch {
              processedItem.imageUrl = "";
            }
          }

          if (item.originalImageUrl && isDataUrl(item.originalImageUrl)) {
            try {
              processedItem.originalImageUrl = await compressToMaxBytes(
                item.originalImageUrl,
                FALLBACK_IMAGE_BYTES
              );
            } catch {
              processedItem.originalImageUrl = "";
            }
          }

          return processedItem;
        })
      );

      localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(compressedHistory)
      );
    } else {
      throw error;
    }
  }
}

async function clearOldHistoryAndRetry(newItem: HistoryItem): Promise<void> {
  try {
    clearHistory();
    const processedItem = await processHistoryItemImages(newItem);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([processedItem]));
  } catch (error) {
    console.error("Failed to save even after clearing history:", error);
  }
}

function isDataUrl(url: string): boolean {
  return url.startsWith("data:");
}

function isQuotaExceededError(error: any): boolean {
  return (
    error?.name === "QuotaExceededError" ||
    error?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error?.code === 22 ||
    error?.message?.includes("quota") ||
    error?.message?.includes("storage")
  );
}
