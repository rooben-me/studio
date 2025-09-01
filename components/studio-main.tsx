"use client";

import { useEffect, useRef } from "react";
import { useStudioStore } from "@/store/studio";
import { ImageUpload } from "./image-upload";
import { PromptInput } from "./prompt-input";
import { TaskSelector } from "./task-selector";
import { HistorySection } from "./history-section";
import { ApiModeToggle } from "./api-mode-toggle";
import { Toaster } from "./ui/sonner";
import type { TaskOption } from "@/types";
import { cn } from "@/lib/utils";

interface StudioMainProps {
  className?: string;
}

export function StudioMain({ className }: StudioMainProps) {
  const {
    imageDataUrl,
    prompt,
    task,
    generationState,
    error,
    history,
    setImage,
    setPrompt,
    setSelectedTask,
    loadHistoryFromStorage,
    restoreFromHistory,
    clearAllHistory,
    startGeneration,
    abortGeneration,
    clearError,
  } = useStudioStore();

  const promptInputRef = useRef<HTMLInputElement>(null);
  const isGenerating = generationState === "generating";

  // Load history on mount
  useEffect(() => {
    loadHistoryFromStorage();
  }, [loadHistoryFromStorage]);

  // Focus prompt input when image is uploaded
  useEffect(() => {
    if (imageDataUrl && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [imageDataUrl]);

  const handleTaskSelect = (task: TaskOption | null) => {
    setSelectedTask(task);
    // Future: Could set prompt suggestions based on task
  };

  const handleGenerate = () => {
    if (error) clearError();
    startGeneration();
  };

  const handleRestore = (item: any) => {
    restoreFromHistory(item);
    // Focus prompt input after restore
    setTimeout(() => {
      promptInputRef.current?.focus();
    }, 0);
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background to-muted/20",
        className
      )}
    >
      {/* API Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ApiModeToggle />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Studio Interface */}
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Image Upload Section */}
          <ImageUpload
            imageDataUrl={imageDataUrl}
            onImageChange={setImage}
            disabled={isGenerating}
          />

          {/* Prompt Input */}
          <PromptInput
            ref={promptInputRef}
            prompt={prompt}
            onPromptChange={setPrompt}
            imageDataUrl={imageDataUrl}
            onImageChange={setImage}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onAbort={abortGeneration}
          />

          {/* Task Selector */}
          <div className="flex justify-center">
            <TaskSelector
              selectedTask={task || undefined}
              onTaskSelect={handleTaskSelect}
              className="min-w-[200px]"
            />
          </div>

          {/* Generation Status */}
          {generationState === "generating" && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Generating...</span>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="mt-16">
          <HistorySection
            history={history}
            onRestore={handleRestore}
            onClear={clearAllHistory}
          />
        </div>
      </div>

      {/* Toast Container */}
      <Toaster />
    </div>
  );
}
