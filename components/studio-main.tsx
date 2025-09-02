"use client";

import { useEffect, useRef } from "react";
import { useStudioStore } from "@/store/studio";
import { ImageUpload } from "./image-upload";
import { PromptInput } from "./prompt-input";
import { TaskSelector } from "./task-selector";
import { ResultComparison } from "./result-comparison";
import { HistorySection } from "./history-section";
import { ApiModeToggle } from "./api-mode-toggle";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";
import type { TaskOption } from "@/types";
import { cn } from "@/lib/utils";

interface StudioMainProps {
  className?: string;
}

export function StudioMain({ className }: StudioMainProps) {
  const {
    imageDataUrl,
    originalImageUrl,
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
    clearImage,
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
  };

  const handleStartOver = () => {
    clearImage();
    setPrompt("");
    setSelectedTask(null);
    clearError();
  };

  const handleDownload = () => {
    if (imageDataUrl) {
      const link = document.createElement("a");
      link.href = imageDataUrl;
      link.download = `ai-studio-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (navigator.share && imageDataUrl) {
      try {
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const file = new File([blob], "ai-studio-result.png", {
          type: "image/png",
        });

        await navigator.share({
          title: "AI Studio Result",
          text: `Check out this image I created with AI Studio: ${prompt}`,
          files: [file],
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
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

  if (generationState === "success" && imageDataUrl && originalImageUrl) {
    return (
      <div
        className={cn(
          "min-h-screen bg-gradient-to-br from-background to-muted/20",
          className
        )}
      >
        {/* Header */}
        <header className="border-b border-border/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  Studio
                </h1>
              </div>
              <ApiModeToggle />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <ResultComparison
            originalImage={originalImageUrl}
            generatedImage={imageDataUrl}
            onStartOver={handleStartOver}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        </div>

        {/* History Section */}
        <div className="mt-16">
          <HistorySection
            history={history}
            onRestore={handleRestore}
            onClear={clearAllHistory}
          />
        </div>

        <Toaster />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background to-muted/20",
        className
      )}
    >
      {/* Header */}
      <header className="border-b border-border/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Studio</h1>
            </div>
            <ApiModeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Main Studio Interface */}
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Image Upload */}
          <ImageUpload
            imageDataUrl={imageDataUrl}
            onImageChange={setImage}
            disabled={isGenerating}
            showLoadingState={generationState === "generating"}
          />

          {generationState !== "generating" && (
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
          )}

          {generationState !== "generating" && (
            <div className="flex justify-center -mt-8">
              <TaskSelector
                selectedTask={task || undefined}
                onTaskSelect={handleTaskSelect}
                className="min-w-[200px]"
                forceClose={isGenerating}
              />
            </div>
          )}

          {/* Generation Status */}
          {generationState === "generating" && (
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  This may take a few moments
                </p>
              </div>
              <Button
                variant="outline"
                onClick={abortGeneration}
                className="text-destructive hover:text-destructive/80"
              >
                Cancel Generation
              </Button>
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
