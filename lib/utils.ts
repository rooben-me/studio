import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cnFallback(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
