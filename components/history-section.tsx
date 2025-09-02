"use client";

import { useState } from "react";
import { RotateCcw, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { HistoryItem } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

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
      <section className={cn("w-full", className)} aria-label="Generation History">
        <div className="max-w-7xl mx-auto p-6 border bg-gray-50 border-gray-100 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-lg font-semibold">History</h2>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4" aria-hidden="true">
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
    <section className={cn("w-full", className)} aria-label="Generation History">
      <div className="max-w-7xl mx-auto p-6 border bg-gray-50 border-gray-100 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
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
              aria-label={`Clear all ${history.length} history items`}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Clear All
            </Button>
          )}
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          role="grid"
          aria-label="History items"
        >
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
      className="group relative overflow-hidden transition-all hover:shadow-md p-0"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="gridcell"
      aria-label={`Generated image: ${item.prompt}, created ${formattedDate}`}
    >
      <CardContent className="p-0">
        {/* Image Comparison */}
        <div className="relative aspect-square overflow-hidden">
          {item.originalImageUrl ? (
            <div className="flex h-full">
              {/* Original Image */}
              <div className="w-1/2 relative overflow-hidden">
                <img
                  src={item.originalImageUrl}
                  alt={`Original image for: ${item.prompt}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 ease-in-out duration-300"
                />
                <div className="absolute bottom-1 left-1">
                  <span 
                    className="px-1.5 py-0.5 bg-background/90 backdrop-blur-sm rounded text-xs font-medium"
                    aria-label="Before generation"
                  >
                    Before
                  </span>
                </div>
              </div>

              {/* Generated Image */}
              <div className="w-1/2 relative overflow-hidden border-l border-border/20">
                <img
                  src={item.imageUrl}
                  alt={`Generated result for: ${item.prompt}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 ease-in-out duration-300"
                />
                <div className="absolute bottom-1 right-1">
                  <span 
                    className="px-1.5 py-0.5 bg-primary/90 backdrop-blur-sm rounded text-xs font-medium text-primary-foreground"
                    aria-label="After generation"
                  >
                    After
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={item.imageUrl}
              alt={`Generated image for: ${item.prompt}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 ease-in-out duration-300"
            />
          )}
        </div>

        <div className="flex items-center justify-between p-3">
          <div className="flex flex-col">
            <p className="text-sm font-medium line-clamp-2 mb-1">
              {item.prompt}
            </p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>

          <Badge variant={"secondary"} className="uppercase text-gray-600">
            {item.task.replace("-", " ")}
          </Badge>
        </div>
        <div className="p-3 pt-1">
          <Button
            onClick={onRestore}
            size="sm"
            variant="outline"
            aria-label={`Restore this generation: ${item.prompt}`}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Restore This Result
          </Button>
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
