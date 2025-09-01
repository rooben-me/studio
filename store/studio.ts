"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudioState, HistoryItem, TaskOption, ApiMode } from "@/types";
import { generateWithRetry } from "@/lib/api";
import { saveHistoryItem, loadHistory, clearHistory } from "@/lib/storage";
import { showGenerationToast } from "@/lib/toast";
import { STUDIO_STORAGE_KEY } from "@/constants";

type StudioActions = {
  // Image actions
  setImage: (dataUrl: string | null) => void;
  clearImage: () => void;

  // Prompt actions
  setPrompt: (prompt: string) => void;

  // Task actions
  setSelectedTask: (task: TaskOption | null) => void;

  // History actions
  loadHistoryFromStorage: () => void;
  restoreFromHistory: (item: HistoryItem) => void;
  clearAllHistory: () => void;

  // Generation actions
  startGeneration: () => Promise<void>;
  abortGeneration: () => void;

  // API Mode actions
  setApiMode: (mode: ApiMode) => void;

  // Error actions
  clearError: () => void;
};

const initialState: StudioState = {
  imageDataUrl: null,
  prompt: "",
  task: null,
  generationState: "idle",
  error: null,
  history: [],
  abortController: null,
  apiMode: "gemini",
};

export const useStudioStore = create<StudioState & StudioActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Image actions
      setImage: (dataUrl) => {
        set({ imageDataUrl: dataUrl, error: null });
      },

      clearImage: () => {
        set({ imageDataUrl: null, error: null });
      },

      // Prompt actions
      setPrompt: (prompt) => {
        set({ prompt, error: null });
      },

      // Task actions
      setSelectedTask: (task) => {
        set({ task: task?.id || null });
      },

      // History actions
      loadHistoryFromStorage: () => {
        try {
          const history = loadHistory();
          set({ history });
        } catch (error) {
          console.error("Failed to load history:", error);
        }
      },

      restoreFromHistory: (item) => {
        set({
          imageDataUrl: item.imageUrl,
          prompt: item.prompt,
          task: item.task,
          generationState: "idle",
          error: null,
        });
      },

      clearAllHistory: () => {
        clearHistory();
        set({ history: [] });
      },

      // Generation actions
      startGeneration: async () => {
        const state = get();

        if (
          state.generationState === "generating" ||
          !state.imageDataUrl ||
          !state.prompt.trim()
        ) {
          return;
        }

        const abortController = new AbortController();
        set({
          generationState: "generating",
          error: null,
          abortController,
        });

        // Show loading toast
        showGenerationToast.started();

        try {
          const result = await generateWithRetry(
            {
              imageDataUrl: state.imageDataUrl,
              prompt: state.prompt.trim(),
              task: state.task || "custom",
            },
            {
              signal: abortController.signal,
              maxAttempts: 3,
              apiMode: state.apiMode,
            }
          );

          // Save to history
          saveHistoryItem(result);
          const updatedHistory = loadHistory();

          // Update state with result
          set({
            imageDataUrl: result.imageUrl,
            history: updatedHistory,
            generationState: "success",
            abortController: null,
          });

          // Show success toast
          showGenerationToast.success();
        } catch (error: any) {
          if (error?.name === "AbortError" || abortController.signal.aborted) {
            set({
              generationState: "idle",
              abortController: null,
            });
            showGenerationToast.aborted();
          } else {
            const errorMessage = error?.message || "Generation failed";
            set({
              generationState: "error",
              error: errorMessage,
              abortController: null,
            });
            showGenerationToast.error(errorMessage);
          }
        }
      },

      abortGeneration: () => {
        const { abortController } = get();
        if (abortController) {
          abortController.abort();
          set({
            generationState: "idle",
            abortController: null,
          });
        }
      },

      // API Mode actions
      setApiMode: (mode) => {
        set({ apiMode: mode });
      },

      // Error actions
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: STUDIO_STORAGE_KEY,
      partialize: (state) => ({
        prompt: state.prompt,
        task: state.task,
        apiMode: state.apiMode,
      }),
    }
  )
);
