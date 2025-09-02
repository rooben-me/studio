"use client";

import { useCallback, useRef, useState } from "react";
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
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={imageDataUrl ? "Change uploaded image" : "Upload an image"}
        aria-describedby="upload-description"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {imageDataUrl ? (
          <>
            <img
              src={imageDataUrl}
              alt="Uploaded image preview"
              className="max-w-full max-h-full object-contain"
            />
            {showLoadingState && (
              <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-2xl"
                role="status"
                aria-live="polite"
                aria-label="Generating image"
              >
                <div className="text-center space-y-3">
                  <div 
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"
                    aria-hidden="true"
                  />
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
                disabled={disabled}
                aria-label="Remove uploaded image"
                className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center p-6">
            <div className="rounded-full bg-muted p-4" aria-hidden="true">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium mb-2">
                {isDragOver ? "Perfect, drop it here" : "Choose your image"}
              </p>
              <p className="text-sm text-muted-foreground mb-3" id="upload-description">
                {isDragOver
                  ? "Release to get started"
                  : "Drag & drop or click to browse"}
              </p>
              {!isDragOver && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full">
                  <span className="text-xs font-medium text-muted-foreground">
                    PNG or JPG
                  </span>
                  <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" aria-hidden="true"></span>
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
        aria-label="Select image file"
      />
    </div>
  );
}

// Compact version for use in other components
export function ImageUploadCompact({
  imageDataUrl,
  onImageChange,
  disabled = false,
  className,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const result = await processImageFile(file);
        onImageChange(result.dataUrl);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        showImageToast.processingError(message);
      }

      // Reset input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onImageChange]
  );

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
  };

  return (
    <div className={className}>
      <div
        className={cn(
          "relative group w-12 h-12 top-2 left-2",
          disabled && "opacity-50"
        )}
      >
        <button
          type="button"
          onClick={openFileDialog}
          disabled={disabled}
          className={cn(
            "w-full h-full rounded-2xl border border-border",
            "bg-muted flex items-center justify-center transition-colors",
            "hover:bg-muted/80 focus-visible:outline-2 focus-visible:outline-ring",
            disabled && "cursor-not-allowed"
          )}
        >
          {imageDataUrl ? (
            <img
              src={imageDataUrl}
              alt="Uploaded thumbnail"
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {imageDataUrl && (
          <button
            type="button"
            onClick={clearImage}
            disabled={disabled}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            aria-label="Remove image"
          >
            <X className="h-3 w-3 text-white" />
          </button>
        )}
      </div>

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
