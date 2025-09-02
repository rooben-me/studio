"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskGrid } from "@/components/task-grid";
import type { TaskOption } from "@/types";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskSelect?: (task: TaskOption) => void;
  onComplete: () => void;
}

export function OnboardingDialog({
  open,
  onOpenChange,
  onTaskSelect,
  onComplete,
}: OnboardingDialogProps) {
  const [selectedTask, setSelectedTask] = useState<string | undefined>();

  const handleTaskSelect = (task: TaskOption) => {
    setSelectedTask(task.id);
    onTaskSelect?.(task);
    // Auto-close when task is selected
    handleClose();
  };

  const handleClose = () => {
    onComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] md:max-w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden gap-0 [&>button]:hidden">
        {/* Header */}

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 pb-0">
            <TaskGrid
              onTaskSelect={handleTaskSelect}
              selectedTask={selectedTask}
              showSearch={true}
              className="w-full p-0"
              gridClassName="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              maxHeight="none"
            />
          </div>
        </div>

        <div className="bg-background/70 backdrop-blur-xl p-6 flex items-center justify-between border-t border-border/10 fixed bottom-0 left-0 right-0">
          <div className="text-left">
            <h2 className="font-medium text-gray-600">
              Select a task to get started
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Choose from the options below, or close to explore freely
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleClose}
            className="px-8 py-2 text-muted-foreground hover:text-foreground"
            size="lg"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
