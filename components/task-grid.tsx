"use client";

import { useState } from "react";
import { Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { TaskOption } from "@/types";
import { TASK_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";

interface TaskGridProps {
  tasks?: TaskOption[];
  onTaskSelect: (task: TaskOption) => void;
  selectedTask?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
  gridClassName?: string;
  maxHeight?: string;
}

export function TaskGrid({
  tasks = TASK_OPTIONS,
  onTaskSelect,
  selectedTask,
  showSearch = true,
  searchPlaceholder = "Search tasks...",
  className,
  gridClassName,
  maxHeight = "max-h-96",
}: TaskGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter(
    (task) =>
      task.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTaskSelect = (task: TaskOption) => {
    onTaskSelect(task);
    setSearchQuery("");
  };

  return (
    <div className={cn("p-4 w-full", className)}>
      {showSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}
      <div
        className={cn(
          "p-0.5 grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto",
          maxHeight,
          gridClassName
        )}
      >
        {filteredTasks.map((task) => (
          <Button
            key={task.id}
            variant="ghost"
            onClick={() => handleTaskSelect(task)}
            className={cn(
              "h-auto p-0 flex flex-col items-start text-left rounded-lg overflow-hidden",
              selectedTask === task.id && "ring-2 ring-indigo-600 bg-accent"
            )}
          >
            <div className="relative w-full aspect-[3/4] bg-muted flex items-center justify-center">
              {task.placeholderImage ? (
                <img
                  src={task.placeholderImage}
                  alt={task.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {task.label.charAt(0)}
                  </span>
                </div>
              )}
              {selectedTask === task.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-700 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="p-3 w-full">
              <span className="font-medium text-sm block">{task.label}</span>
              {task.description && (
                <span className="text-xs text-muted-foreground mt-1 block truncate">
                  {task.description}
                </span>
              )}
            </div>
          </Button>
        ))}
      </div>
      {filteredTasks.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          No tasks found
        </div>
      )}
    </div>
  );
}
