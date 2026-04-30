import {
  CARD_SUBCATEGORY,
  ELECTRONICS_SUBCATEGORY,
  OTHER_SUBCATEGORY,
  PERSONAL_BELONGING_SUBCATEGORY,
  type PostSubcategoryCode,
} from "@/src/features/post/types";
import React from "react";
import { Text, View } from "react-native";

const SUBCATEGORY_STYLE_MAP: Record<
  PostSubcategoryCode,
  { label: string; bgClass: string; textClass: string }
> = {
  [ELECTRONICS_SUBCATEGORY.PHONE]: {
    label: "Phone",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [ELECTRONICS_SUBCATEGORY.LAPTOP]: {
    label: "Laptop",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [ELECTRONICS_SUBCATEGORY.SMARTWATCH]: {
    label: "Smart Watch",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [ELECTRONICS_SUBCATEGORY.CHARGER_ADAPTER]: {
    label: "Charger Adapter",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [ELECTRONICS_SUBCATEGORY.MOUSE]: {
    label: "Mouse",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [ELECTRONICS_SUBCATEGORY.KEYBOARD]: {
    label: "Keyboard",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [ELECTRONICS_SUBCATEGORY.POWERBANK]: {
    label: "Power Bank",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [ELECTRONICS_SUBCATEGORY.POWER_OUTLET]: {
    label: "Power Outlet",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [ELECTRONICS_SUBCATEGORY.HEADPHONE]: {
    label: "Headphone",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [ELECTRONICS_SUBCATEGORY.EARPHONE]: {
    label: "Earphone",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [CARD_SUBCATEGORY.BANK_CARD]: {
    label: "Bank Card",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800",
  },
  [CARD_SUBCATEGORY.COMPANY_CARD]: {
    label: "Company Card",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800",
  },
  [CARD_SUBCATEGORY.DRIVER_LICENSE]: {
    label: "Driver License",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800",
  },
  [CARD_SUBCATEGORY.IDENTIFICATION_CARD]: {
    label: "Identification Card",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800",
  },
  [CARD_SUBCATEGORY.PASSPORT]: {
    label: "Passport",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800",
  },
  [CARD_SUBCATEGORY.PERSONAL_CARD]: {
    label: "Personal Card",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800",
  },
  [CARD_SUBCATEGORY.STUDENT_CARD]: {
    label: "Student Card",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800",
  },
  [PERSONAL_BELONGING_SUBCATEGORY.BACKPACK]: {
    label: "Backpack",
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-800",
  },
  [PERSONAL_BELONGING_SUBCATEGORY.CLOTHINGS]: {
    label: "Clothings",
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-800",
  },
  [PERSONAL_BELONGING_SUBCATEGORY.JEWELRY]: {
    label: "Jewelry",
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-800",
  },
  [PERSONAL_BELONGING_SUBCATEGORY.KEYS]: {
    label: "Keys",
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-800",
  },
  [PERSONAL_BELONGING_SUBCATEGORY.SUITCASES]: {
    label: "Suitcase",
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-800",
  },
  [PERSONAL_BELONGING_SUBCATEGORY.WALLETS]: {
    label: "Wallet",
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-800",
  },
  [OTHER_SUBCATEGORY.OTHERS]: {
    label: "Other",
    bgClass: "bg-gray-100",
    textClass: "text-gray-800",
  },
};

type PostSubcategoryBadgeProps = {
  subcategory: PostSubcategoryCode;
};

export const PostSubcategoryBadge = ({
  subcategory,
}: PostSubcategoryBadgeProps) => {
  const config =
    SUBCATEGORY_STYLE_MAP[subcategory] ||
    SUBCATEGORY_STYLE_MAP[OTHER_SUBCATEGORY.OTHERS];

  return (
    <View className={`px-2.5 py-1 rounded-md ${config.bgClass}`}>
      <Text className={`text-xs font-medium capitalize ${config.textClass}`}>
        {config.label}
      </Text>
    </View>
  );
};
