import type { TaskOption } from "@/types";

export const TASK_OPTIONS: TaskOption[] = [
  {
    id: "change-colors",
    label: "Change Colors",
    description: "Modify specific colors or overall color palette",
    placeholderImage: "/images/tasks/change-colors.webp",
  },

  {
    id: "face-editing",
    label: "Face Editing",
    description: "Edit facial features and expressions",
    placeholderImage: "/images/tasks/face-editing.webp",
  },
  {
    id: "change-background",
    label: "Change Background",
    description: "Replace or modify the background of your image",
    placeholderImage: "/images/tasks/change-background.webp",
  },
  {
    id: "lighting-effects",
    label: "Lighting Effects",
    description: "Adjust lighting, shadows, and highlights",
    placeholderImage: "/images/tasks/lighting-effects.webp",
  },
  {
    id: "remove-object",
    label: "Remove Object",
    description: "Remove unwanted objects or people from your image",
    placeholderImage: "/images/tasks/remove-object.webp",
  },
  {
    id: "style-transfer",
    label: "Style Transfer",
    description: "Apply artistic styles to your image",
    placeholderImage: "/images/tasks/style-transfer.webp",
  },

  {
    id: "add-elements",
    label: "Add Elements",
    description: "Add new objects or elements to your image",
    placeholderImage: "/images/tasks/add-elements.webp",
  },
];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGE_DIMENSION = 1920;
export const DEFAULT_IMAGE_QUALITY = 0.92;
export const HISTORY_STORAGE_KEY = "ai-studio-history-v1";
export const STUDIO_STORAGE_KEY = "studio-prefs";
export const MAX_HISTORY_ITEMS = 5;
export const MAX_STORAGE_IMAGE_BYTES = 1024 * 1024;
export const FALLBACK_IMAGE_BYTES = 512 * 1024;

export const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelay: 300,
  maxDelay: 5000,
} as const;

export const TOAST_MESSAGES = {
  GENERATING: "Generating your image...",
  SUCCESS: "Image generated successfully!",
  ERROR: "Failed to generate image",
  RETRYING: "Retrying generation...",
  ABORTED: "Generation cancelled",
  IMAGE_TOO_LARGE: "Image is too large. Please try a smaller image.",
  INVALID_FORMAT: "Please upload a PNG or JPG image.",
} as const;
