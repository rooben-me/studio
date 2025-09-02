"use client";

import { Compare } from "@/components/ui/compare";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultComparisonProps {
  originalImage: string;
  generatedImage: string;
  prompt?: string;
  task?: string;
  onStartOver?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

export function ResultComparison({
  originalImage,
  generatedImage,
  onStartOver,
  onDownload,
  onShare,
  className,
}: ResultComparisonProps) {
  return (
    <div className={cn("max-w-5xl mx-auto", className)}>
      {/* Header */}
      <div className="text-center flex items-center justify-center gap-4">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p className="text-muted-foreground text-lg">Your Results are ready</p>
      </div>

      {/* Comparison Container */}
      <div className="flex justify-center px-4">
        <div className="p-6 border rounded-3xl bg-background/50 backdrop-blur-xl border-white/20 max-w-4xl w-full">
          <Compare
            firstImage={originalImage}
            secondImage={generatedImage}
            firstImageClassName="object-contain"
            secondImageClassname="object-contain"
            className="aspect-square max-h-[70vh] h-auto bg-gray-50 rounded-2xl border border-gray-100 mx-auto w-full md:min-w-[500px]"
            slideMode="hover"
            autoplay={true}
            autoplayDuration={3000}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-8 justify-between items-center max-w-[500px] mx-auto">
        <Button
          variant="ghost"
          size="lg"
          onClick={onStartOver}
          className="text-muted-foreground hover:text-foreground px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Create Another
        </Button>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onShare}
            className="border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
          <Button
            onClick={onDownload}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105"
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
