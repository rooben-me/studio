"use client";

import { useState, useEffect } from "react";
import { Search, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [searchQuery, setSearchQuery] = useState("");

  // Force close popover when needed (e.g., during generation)
  useEffect(() => {
    if (forceClose) {
      setOpen(false);
    }
  }, [forceClose]);

  const filteredTasks = TASK_OPTIONS.filter(
    (task) =>
      task.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTaskSelect = (task: TaskOption) => {
    // If clicking on already selected task, unselect it
    if (selectedTask === task.id) {
      onTaskSelect(null);
    } else {
      onTaskSelect(task);
    }
    setOpen(false);
    setSearchQuery("");
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
              "bg-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800",
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
        <div className="p-4 w-full">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="p-0.5 grid grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredTasks.map((task) => (
              <Button
                key={task.id}
                variant="ghost"
                onClick={() => handleTaskSelect(task)}
                className={cn(
                  "h-auto p-0 flex flex-col items-start text-left rounded-lg overflow-hidden",
                  selectedTask === task.id && "ring-2 ring-indigo-500 bg-accent"
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
                  <span className="font-medium text-sm block">
                    {task.label}
                  </span>
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
      </PopoverContent>
    </Popover>
  );
}

interface TaskGridProps {
  tasks?: TaskOption[];
  onTaskSelect: (task: TaskOption) => void;
  selectedTask?: string;
  columns?: number;
  className?: string;
  showImages?: boolean;
}

export function TaskGrid({
  tasks = TASK_OPTIONS,
  onTaskSelect,
  selectedTask,
  columns = 3,
  className,
  showImages = true,
}: TaskGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        {
          "grid-cols-1": columns === 1,
          "grid-cols-2": columns === 2,
          "grid-cols-3": columns === 3,
          "grid-cols-4": columns === 4,
        },
        className
      )}
    >
      {tasks.map((task) => (
        <Button
          key={task.id}
          variant="ghost"
          onClick={() => onTaskSelect(task)}
          className={cn(
            "h-auto p-0 flex flex-col items-start text-left rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-200",
            selectedTask === task.id && "ring-2 ring-primary bg-accent"
          )}
        >
          {showImages && (
            <div className="relative w-full aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden">
              {task.placeholderImage ? (
                <img
                  src={task.placeholderImage}
                  alt={task.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-primary">
                    {task.label.charAt(0)}
                  </span>
                </div>
              )}
              {selectedTask === task.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          )}
          <div className="p-4 w-full">
            <span className="font-semibold text-sm block mb-1">
              {task.label}
            </span>
            {task.description && (
              <span className="text-xs text-muted-foreground leading-relaxed">
                {task.description}
              </span>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
}
