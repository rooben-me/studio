import type { DownscaleOptions } from "@/types";
import {
  MAX_UPLOAD_BYTES,
  MAX_IMAGE_DIMENSION,
  DEFAULT_IMAGE_QUALITY,
  TOAST_MESSAGES,
} from "@/constants";

export async function processImageFile(
  file: File,
  options: DownscaleOptions = {}
) {
  const maxSize = options.maxSize ?? MAX_IMAGE_DIMENSION;
  const quality = options.quality ?? DEFAULT_IMAGE_QUALITY;
  const maxBytes = options.maxBytes ?? MAX_UPLOAD_BYTES;

  if (!/image\/(png|jpeg|jpg)$/i.test(file.type)) {
    throw new Error(TOAST_MESSAGES.INVALID_FORMAT);
  }

  try {
    let dataUrl = await readAsDataURL(file);

    // First, downscale if needed
    dataUrl = await downscaleToMaxDimension(dataUrl, maxSize, quality);

    // Then, compress to fit size limit
    dataUrl = await compressToMaxBytes(dataUrl, maxBytes);

    return {
      dataUrl,
      originalSize: file.size,
      finalSize: estimateDataUrlBytes(dataUrl),
      compressionRatio: file.size / estimateDataUrlBytes(dataUrl),
    };
  } catch (error) {
    throw new Error(
      `Failed to process image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function downscaleToMaxDimension(
  dataUrl: string,
  maxDim: number,
  quality: number = DEFAULT_IMAGE_QUALITY
): Promise<string> {
  const img = await loadImage(dataUrl);
  const { width, height } = img;
  const maxSide = Math.max(width, height);

  if (maxSide <= maxDim) {
    // Re-encode to stabilize size
    return reencodeImage(img, width, height, quality);
  }

  const scale = maxDim / maxSide;
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);

  return reencodeImage(img, newWidth, newHeight, quality);
}

export async function compressToMaxBytes(
  dataUrl: string,
  maxBytes: number
): Promise<string> {
  if (estimateDataUrlBytes(dataUrl) <= maxBytes) {
    return dataUrl;
  }

  const img = await loadImage(dataUrl);
  let quality = 0.9;
  let current = dataUrl;

  while (estimateDataUrlBytes(current) > maxBytes && quality > 0.1) {
    current = reencodeImage(img, img.width, img.height, quality);
    quality -= 0.1;
  }

  if (estimateDataUrlBytes(current) > maxBytes) {
    throw new Error(TOAST_MESSAGES.IMAGE_TOO_LARGE);
  }

  return current;
}

function reencodeImage(
  img: HTMLImageElement,
  width: number,
  height: number,
  quality: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

export function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] || "";
  const padding = (base64.match(/=+$/) || [""])[0].length;
  return Math.max(0, Math.floor((base64.length * 3) / 4 - padding));
}

function fitWithin(w: number, h: number, max: number) {
  const scale = Math.min(1, max / Math.max(w, h));
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

function readAsDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
