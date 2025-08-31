"use client";

import { useEffect } from "react";
import { useStudioStore } from "@/store/studio";

export function HistoryList() {
  const { history, loadHistoryFromStorage, restoreFromHistory } =
    useStudioStore();

  useEffect(() => {
    loadHistoryFromStorage();
  }, [loadHistoryFromStorage]);

  if (!history.length) return null;

  return (
    <div className="w-full max-w-3xl">
      <h3 className="sr-only">History</h3>
      <div className="flex gap-3 overflow-x-auto py-2" role="list">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => restoreFromHistory(item)}
            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border outline-none ring-2 ring-transparent focus-visible:ring-ring"
            role="listitem"
            aria-label={`Restore ${item.task} - ${new Date(
              item.createdAt
            ).toLocaleString()}`}
            title="Restore"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-black/40 text-[10px] text-white px-1 py-0.5 opacity-0 group-hover:opacity-100">
              {item.task}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
