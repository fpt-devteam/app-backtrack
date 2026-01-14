// src/shared/toast/toast.ts
import Toast from "react-native-toast-message";

export type ToastType = "success" | "error" | "info" | "warning";

type ShowToastOptions = {
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  position?: "top" | "bottom";
};

const DEFAULTS = {
  duration: 2200,
  position: "top" as const,
  topOffset: 56,
  bottomOffset: 100,
};

export const showToast = (opts: ShowToastOptions) => {
  Toast.show({
    type: opts.type,
    text1: opts.title,
    text2: opts.description,
    visibilityTime: opts.duration ?? DEFAULTS.duration,
    position: opts.position ?? DEFAULTS.position,
    topOffset: DEFAULTS.topOffset,
    bottomOffset: DEFAULTS.bottomOffset,
  });
};

export const toast = {
  success: (title: string, description?: string, duration?: number) =>
    showToast({ type: "success", title, description, duration }),
  error: (title: string, description?: string, duration?: number) =>
    showToast({ type: "error", title, description, duration }),
  info: (title: string, description?: string, duration?: number) =>
    showToast({ type: "info", title, description, duration }),
  warning: (title: string, description?: string, duration?: number) =>
    showToast({ type: "warning", title, description, duration }),
  hide: () => Toast.hide(),
};
