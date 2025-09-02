"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { processImageFile } from "@/lib/downscale";
import { showImageToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  imageDataUrl: string | null;
  onImageChange: (dataUrl: string | null) => void;
  disabled?: boolean;
  className?: string;
  showLoadingState?: boolean;
}

export function ImageUpload({
  imageDataUrl,
  onImageChange,
  disabled = false,
  className,
  showLoadingState = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        const result = await processImageFile(file);
        onImageChange(result.dataUrl);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        showImageToast.processingError(message);
      }
    },
    [onImageChange]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      await handleFileSelect(file);

      // Reset input value so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        await handleFileSelect(imageFile);
      }
    },
    [handleFileSelect, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone itself, not a child element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) {
      openFileDialog();
    }
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFileDialog();
      }
    },
    [disabled]
  );

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      if (disabled) return;

      // Only process paste if no input/textarea is focused
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      e.preventDefault();
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            await handleFileSelect(file);
            break;
          }
        }
      }
    },
    [disabled, handleFileSelect]
  );

  useEffect(() => {
    if (!disabled) {
      document.addEventListener("paste", handlePaste);
      return () => {
        document.removeEventListener("paste", handlePaste);
      };
    }
  }, [disabled, handlePaste]);

  const handleClearKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      clearImage();
    }
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    onImageChange(null);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Image Preview */}
      <div
        className={cn(
          "relative w-full h-[400px] rounded-2xl border-2 border-dashed transition-all duration-200",
          "flex items-center justify-center overflow-hidden cursor-pointer",
          "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
          imageDataUrl
            ? "border-border bg-background"
            : isDragOver
            ? "border-primary bg-primary/5 border-solid scale-[1.02]"
            : "border-muted-foreground/25 bg-muted/50 hover:bg-muted/70 hover:border-muted-foreground/40",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label={
          imageDataUrl
            ? "Change uploaded image (or press Ctrl+V to paste)"
            : "Upload image (or press Ctrl+V to paste)"
        }
      >
        {imageDataUrl ? (
          <>
            <img
              src={imageDataUrl}
              alt="Uploaded image"
              className="max-w-full max-h-full object-contain"
            />
            {showLoadingState && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Generating...</p>
                  </div>
                </div>
              </div>
            )}
            {!showLoadingState && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                onKeyDown={handleClearKeyDown}
                disabled={disabled}
                className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center p-6">
            <div className="rounded-full bg-muted p-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium mb-2">
                {isDragOver ? "Perfect, drop it here" : "Choose your image"}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {isDragOver
                  ? "Release to get started"
                  : "Drag & drop, click to browse, or just press Ctrl+V to paste"}
              </p>
              {!isDragOver && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full">
                  <span className="text-xs font-medium text-muted-foreground">
                    PNG or JPG
                  </span>
                  <span className="w-1 h-1 bg-muted-foreground/40 rounded-full"></span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Up to 10MB
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
