import { useStoreActions } from "@/store/hooks";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useHandleCopy = () => {
  const showToast = useStoreActions((actions) => actions.toastModel.showToast);

  return (text: string) => {
    navigator.clipboard.writeText(text);
    showToast({ message: "Copied to clipboard", type: "success" });
  };
};