"use client";

import { useStudioStore } from "@/store/studio";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ApiModeToggleProps {
  className?: string;
}

export function ApiModeToggle({ className }: ApiModeToggleProps) {
  const { apiMode, setApiMode } = useStudioStore();

  const getNextMode = () => {
    switch (apiMode) {
      case "mock":
        return "gemini";
      case "gemini":
        return "mock";
      default:
        return "mock";
    }
  };

  const getModeLabel = () => {
    switch (apiMode) {
      case "mock":
        return "Mock";
      case "gemini":
        return "Gemini";
      default:
        return "Mock";
    }
  };

  const getModeColor = () => {
    switch (apiMode) {
      case "mock":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      case "gemini":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <button
      onClick={() => setApiMode(getNextMode())}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setApiMode(getNextMode());
        }
      }}
      className={cn(
        "flex items-center cursor-pointer space-x-3 bg-background/70 backdrop-blur-xl border border-border/50 rounded-2xl p-1 pl-2 hover:bg-background/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors",
        className
      )}
      aria-label={`Switch API mode from ${getModeLabel()} to next mode`}
    >
      <div className="flex items-center space-x-2">
        <Label htmlFor="api-mode" className="text-sm font-medium">
          API Mode
        </Label>
        <Badge
          variant="secondary"
          className={cn("text-xs px-2 py-1 cursor-pointer", getModeColor())}
        >
          {getModeLabel()}
        </Badge>
      </div>
    </button>
  );
}
