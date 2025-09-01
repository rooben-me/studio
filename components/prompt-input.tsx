"use client";

import { forwardRef } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploadCompact } from "./image-upload";
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
          "flex flex-col items-start gap-2 rounded-3xl bg-background/70 backdrop-blur-xl",
          "border border-border/50 shadow-sm p-2 pl-3",
          className
        )}
      >
        {/* Image Upload Thumbnail */}
        <ImageUploadCompact
          imageDataUrl={imageDataUrl}
          onImageChange={onImageChange}
          disabled={disabled}
        />
        <div className="flex gap-3 w-full relative right-0 -bottom-2">
          {/* Prompt Input */}
          <Input
            ref={ref}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isGenerating}
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
              className="h-10 w-10 rounded-full p-0 shrink-0"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={onGenerate}
              disabled={!canGenerate}
              className="h-10 w-10 rounded-full p-0 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

PromptInput.displayName = "PromptInput";
