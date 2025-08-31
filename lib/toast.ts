import { toast } from "sonner";
import type { ToastType } from "@/types";
import { TOAST_MESSAGES } from "@/constants";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  info: (message: string) => {
    toast.info(message, {
      duration: 3000,
    });
  },

  dismiss: (id?: string | number) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

// Predefined toast messages for common scenarios
export const showGenerationToast = {
  started: () => showToast.loading(TOAST_MESSAGES.GENERATING),

  success: () => {
    showToast.dismiss();
    showToast.success(TOAST_MESSAGES.SUCCESS);
  },

  error: (error?: string) => {
    showToast.dismiss();
    showToast.error(error || TOAST_MESSAGES.ERROR);
  },

  retrying: (attempt: number, errorMessage?: string) => {
    showToast.dismiss();
    const message = errorMessage
      ? `${errorMessage}. ${TOAST_MESSAGES.RETRYING} (Attempt ${attempt})`
      : `${TOAST_MESSAGES.RETRYING} (Attempt ${attempt})`;
    showToast.loading(message);
  },

  aborted: () => {
    showToast.dismiss();
    showToast.info(TOAST_MESSAGES.ABORTED);
  },
};

export const showImageToast = {
  invalidFormat: () => showToast.error(TOAST_MESSAGES.INVALID_FORMAT),
  tooLarge: () => showToast.error(TOAST_MESSAGES.IMAGE_TOO_LARGE),
  processingError: (error: string) =>
    showToast.error(`Failed to process image: ${error}`),
};
