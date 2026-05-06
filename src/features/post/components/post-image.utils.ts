import type { PostSubcategoryCode } from "@/src/features/post/types";

export type PostImageFallbackKey =
  | "BANK_CARD"
  | "COMPANY_CARD"
  | "DRIVER_LICENSE"
  | "IDENTIFICATION_CARD"
  | "PASSPORT"
  | "PERSONAL_CARD"
  | "STUDENT_CARD"
  | "CHARGER_ADAPTER"
  | "EARPHONE"
  | "HEADPHONE"
  | "KEYBOARD"
  | "LAPTOP"
  | "MOUSE"
  | "PHONE"
  | "POWER_OUTLET"
  | "POWERBANK"
  | "SMART_WATCH"
  | "BACKPACK"
  | "CLOTHINGS"
  | "JEWELRY"
  | "KEYS"
  | "SUITCASES"
  | "WALLETS"
  | "OTHERS";

const POST_IMAGE_FALLBACK_KEY_BY_SUBCATEGORY: Partial<
  Record<PostSubcategoryCode, PostImageFallbackKey>
> = {
  bank_card: "BANK_CARD",
  company_card: "COMPANY_CARD",
  driver_license: "DRIVER_LICENSE",
  identification_card: "IDENTIFICATION_CARD",
  passport: "PASSPORT",
  personal_card: "PERSONAL_CARD",
  student_card: "STUDENT_CARD",
  charger_adapter: "CHARGER_ADAPTER",
  earphone: "EARPHONE",
  headphone: "HEADPHONE",
  keyboard: "KEYBOARD",
  laptop: "LAPTOP",
  mouse: "MOUSE",
  phone: "PHONE",
  power_outlet: "POWER_OUTLET",
  powerbank: "POWERBANK",
  smartwatch: "SMART_WATCH",
  backpack: "BACKPACK",
  clothings: "CLOTHINGS",
  jewelry: "JEWELRY",
  keys: "KEYS",
  suitcases: "SUITCASES",
  wallets: "WALLETS",
  others: "OTHERS",
};

export const getPostImageFallbackKey = (
  subcategoryCode?: PostSubcategoryCode,
): PostImageFallbackKey => {
  if (!subcategoryCode) return "OTHERS";
  return POST_IMAGE_FALLBACK_KEY_BY_SUBCATEGORY[subcategoryCode] ?? "OTHERS";
};
