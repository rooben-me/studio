"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TaskGrid } from "@/components/task-grid";
import type { TaskOption } from "@/types";
import { TASK_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";

interface TaskSelectorProps {
  selectedTask?: string;
  onTaskSelect: (task: TaskOption | null) => void;
  className?: string;
  forceClose?: boolean;
}

export function TaskSelector({
  selectedTask,
  onTaskSelect,
  className,
  forceClose = false,
}: TaskSelectorProps) {
  const [open, setOpen] = useState(false);

  // Force close popover when needed (e.g., during generation)
  useEffect(() => {
    if (forceClose) {
      setOpen(false);
    }
  }, [forceClose]);

  const handleTaskSelect = (task: TaskOption) => {
    // If clicking on already selected task, unselect it
    if (selectedTask === task.id) {
      onTaskSelect(null);
    } else {
      onTaskSelect(task);
    }
    setOpen(false);
  };

  const selectedTaskLabel = selectedTask
    ? TASK_OPTIONS.find((t) => t.id === selectedTask)?.label || "Select Task"
    : "Select Task";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between bg-background/70 backdrop-blur-xl border border-border/50 rounded-t-none text-muted-foreground",
            selectedTask &&
              "bg-indigo-100 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800",
            className
          )}
        >
          <span className="text-sm">{selectedTaskLabel}</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 ml-2" aria-hidden="true">
            <path fill="currentColor" d="M7 10l5 5 5-5z" />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[95vw] max-w-4xl p-0" align="center">
        <TaskGrid onTaskSelect={handleTaskSelect} selectedTask={selectedTask} />
      </PopoverContent>
    </Popover>
  );
}
