import { type ItemCategory } from "@/src/features/post/types";
import {
  DeviceMobileIcon,
  DotsThreeCircleIcon,
  FileTextIcon,
  HandbagIcon,
  Icon,
  KeyIcon,
  SuitcaseRollingIcon,
  TShirtIcon,
  WalletIcon,
  WatchIcon,
} from "phosphor-react-native";

export type CategoryInfo = { label: string; icon: Icon };

export type CategoryRegistry = Record<ItemCategory, CategoryInfo>;

export const CATEGORY_REGISTRY: CategoryRegistry = {
  electronics: { label: "Electronics", icon: DeviceMobileIcon },
  clothing: { label: "Clothing", icon: TShirtIcon },
  accessories: { label: "Accessories", icon: WatchIcon },
  documents: { label: "Documents", icon: FileTextIcon },
  wallet: { label: "Wallet", icon: WalletIcon },
  suitcase: { label: "Suitcase", icon: SuitcaseRollingIcon },
  bags: { label: "Bags", icon: HandbagIcon },
  keys: { label: "Keys", icon: KeyIcon },
  other: { label: "Other", icon: DotsThreeCircleIcon },
};
