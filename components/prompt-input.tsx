"use client";

import { forwardRef } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  imageDataUrl: string | null;
  onImageChange: (dataUrl: string | null) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onAbort: () => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const PromptInput = forwardRef<HTMLInputElement, PromptInputProps>(
  (
    {
      prompt,
      onPromptChange,
      imageDataUrl,
      onImageChange,
      isGenerating,
      onGenerate,
      onAbort,
      disabled = false,
      className,
      placeholder = "Describe your edit...",
    },
    ref
  ) => {
    const canGenerate = !!(
      imageDataUrl &&
      prompt.trim() &&
      !isGenerating &&
      !disabled
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && canGenerate) {
        e.preventDefault();
        onGenerate();
      }
    };

    return (
      <div
        className={cn(
          "flex flex-col items-start gap-2 rounded-full bg-background/70 backdrop-blur-xl",
          "border border-border/50 shadow-sm p-2 pl-4",
          className
        )}
        role="group"
        aria-label="Image generation prompt input"
      >
        <div className="flex gap-3 w-full items-center">
          {/* Prompt Input */}
          <Input
            ref={ref}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isGenerating}
            aria-label="Enter your image editing prompt"
            aria-describedby="prompt-help-text"
            className="flex-1 border-0 py-6 bg-transparent shadow-none focus-visible:ring-0 text-sm"
          />

          {/* Generate/Abort Button */}
          {isGenerating ? (
            <Button
              type="button"
              size="sm"
              onClick={onAbort}
              disabled={disabled}
              variant="destructive"
              aria-label="Stop image generation"
              className="h-10 w-10 rounded-full p-0 shrink-0"
            >
              <Square className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={onGenerate}
              disabled={!canGenerate}
              aria-label={canGenerate ? "Generate image" : "Upload an image and enter a prompt to generate"}
              className="h-10 w-10 rounded-full p-0 shrink-0"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
        <div id="prompt-help-text" className="sr-only">
          Describe how you want to edit your image. Press Enter to generate.
        </div>
      </div>
    );
  }
);

PromptInput.displayName = "PromptInput";
