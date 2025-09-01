export type Generation = {
  id: string;
  imageUrl: string;
  prompt: string;
  task: string;
  createdAt: string;
};

export type HistoryItem = Generation;

export type GenerationRequest = {
  imageDataUrl: string;
  prompt: string;
  task: string;
};

export type GenerationState = "idle" | "generating" | "success" | "error";

export type ToastType = "success" | "error" | "loading" | "info";

export type DownscaleOptions = {
  maxSize?: number;
  quality?: number;
  maxBytes?: number;
};

export type RetryOptions = {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  signal?: AbortSignal;
  apiMode?: ApiMode;
};

export type ApiMode = "mock" | "gemini";

export type StudioState = {
  imageDataUrl: string | null;
  prompt: string;
  task: string | null;
  generationState: GenerationState;
  error: string | null;
  history: HistoryItem[];
  abortController: AbortController | null;
  apiMode: ApiMode;
};

export type TaskOption = {
  id: string;
  label: string;
  description?: string;
  placeholderImage?: string;
};
