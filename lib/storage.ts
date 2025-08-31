import type { HistoryItem } from "@/types";
import { HISTORY_STORAGE_KEY, MAX_HISTORY_ITEMS } from "@/constants";

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

export function saveHistoryItem(item: HistoryItem): void {
  if (typeof window === "undefined") return;

  try {
    if (!isValidHistoryItem(item)) {
      console.warn("Invalid history item, skipping save:", item);
      return;
    }

    const currentHistory = loadHistory();
    const filteredHistory = currentHistory.filter(
      (existing) => existing.id !== item.id
    );
    const newHistory = [item, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to save history item:", error);
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
    item.id.length > 0 &&
    item.imageUrl.length > 0
  );
}

// Generic storage utilities
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
