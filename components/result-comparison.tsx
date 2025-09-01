"use client";

import { Compare } from "@/components/ui/compare";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultComparisonProps {
  originalImage: string;
  generatedImage: string;
  prompt: string;
  task: string;
  onStartOver?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

export function ResultComparison({
  originalImage,
  generatedImage,
  prompt,
  task,
  onStartOver,
  onDownload,
  onShare,
  className,
}: ResultComparisonProps) {
  return (
    <div className={cn("max-w-4xl mx-auto space-y-8", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Your result is ready!
        </h2>
      </div>

      {/* Comparison Container */}
      <div className="flex justify-center">
        <div className="p-6 border rounded-3xl bg-background/50 backdrop-blur-xl border-white/20">
          <Compare
            firstImage={originalImage}
            secondImage={generatedImage}
            firstImageClassName="object-cover"
            secondImageClassname="object-cover"
            className="h-[400px] w-[400px] md:h-[500px] md:w-[500px]"
            slideMode="hover"
            autoplay={true}
            autoplayDuration={3000}
          />
        </div>
      </div>

      {/* Prompt and Task Info */}
      <div className="bg-background/70 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Task:
            </span>
            <p className="text-foreground capitalize">
              {task.replace("-", " ")}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Prompt:
            </span>
            <p className="text-foreground">{prompt}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={onDownload}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Result
        </Button>

        <Button
          variant="outline"
          onClick={onShare}
          className="border-white/20 bg-background/70 backdrop-blur-xl hover:bg-background/90"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>

        <Button
          variant="outline"
          onClick={onStartOver}
          className="border-white/20 bg-background/70 backdrop-blur-xl hover:bg-background/90"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>
    </div>
  );
}
