"use client";

import { useState } from "react";
import { RotateCcw, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { HistoryItem } from "@/types";
import { cn } from "@/lib/utils";

interface HistorySectionProps {
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onClear?: () => void;
  className?: string;
}

export function HistorySection({
  history,
  onRestore,
  onClear,
  className,
}: HistorySectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <section className={cn("w-full", className)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">History</h2>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No generations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your generated images will appear here
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("w-full", className)}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">History</h2>
            <span className="text-sm text-muted-foreground">
              ({history.length} {history.length === 1 ? "item" : "items"})
            </span>
          </div>
          {onClear && history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              isHovered={hoveredId === item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onRestore={() => onRestore(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface HistoryCardProps {
  item: HistoryItem;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onRestore: () => void;
}

function HistoryCard({
  item,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onRestore,
}: HistoryCardProps) {
  const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      className="group relative overflow-hidden transition-all hover:shadow-md"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.imageUrl}
            alt={`Generated: ${item.prompt}`}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />

          {/* Overlay with restore button */}
          <div
            className={cn(
              "absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <Button
              onClick={onRestore}
              className="bg-background/90 text-foreground hover:bg-background"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore
            </Button>
          </div>

          {/* Style badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium">
              {item.task}
            </span>
          </div>
        </div>

        <div className="p-3">
          <p className="text-sm font-medium line-clamp-2 mb-1">{item.prompt}</p>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact horizontal version for bottom strips
export function HistoryStrip({
  history,
  onRestore,
  className,
}: Omit<HistorySectionProps, "onClear">) {
  if (history.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <ScrollArea className="w-full">
        <div className="flex gap-3 p-4">
          {history.slice(0, 10).map((item) => (
            <button
              key={item.id}
              onClick={() => onRestore(item)}
              className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden hover:scale-105 transition-transform focus-visible:outline-2 focus-visible:outline-ring"
            >
              <img
                src={item.imageUrl}
                alt={`History: ${item.prompt}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
