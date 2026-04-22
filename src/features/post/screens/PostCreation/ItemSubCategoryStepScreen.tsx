import { usePostCreationStore } from "@/src/features/post/hooks";
import {
  CARD_SUBCATEGORY,
  ELECTRONICS_SUBCATEGORY,
  OTHER_SUBCATEGORY,
  PERSONAL_BELONGING_SUBCATEGORY,
  POST_CATEGORIES,
  PostCategory,
  PostSubcategoryCode,
} from "@/src/features/post/types";
import { AppLoader } from "@/src/shared/components";
import {
  CARD_SUB_CATEGORY_ICONS,
  ELECTRONICS_SUB_CATEGORY_ICONS,
  OTHERS_ICON,
  PERSONAL_BELONGING_SUB_CATEGORY_ICONS,
} from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { Asset } from "expo-asset";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type SubCategoryItem = {
  id: string;
  title: string;
  description: string;
  icon: ImageSourcePropType;
  value: PostSubcategoryCode;
};

const SUBCATEGORIES: Record<PostCategory, SubCategoryItem[]> = {
  [POST_CATEGORIES.ELECTRONICS]: [
    {
      id: "phone",
      title: "Phone",
      description: "iPhones, Androids, or any handheld mobile devices.",
      icon: ELECTRONICS_SUB_CATEGORY_ICONS.PHONE,
      value: ELECTRONICS_SUBCATEGORY.PHONE,
    },
    {
      id: "laptop",
      title: "Laptop",
      description: "MacBooks, gaming laptops, or office notebooks.",
      icon: ELECTRONICS_SUB_CATEGORY_ICONS.LAPTOP,
      value: ELECTRONICS_SUBCATEGORY.LAPTOP,
    },
    {
      id: "smart_watch",
      title: "Smart Watch",
      description: "Apple Watch, Galaxy Watch, or fitness trackers.",
      icon: ELECTRONICS_SUB_CATEGORY_ICONS.SMART_WATCH,
      value: ELECTRONICS_SUBCATEGORY.SMARTWATCH,
    },
    {
      id: "charger_adapter",
      title: "Charger / Adapter",
      description: "Power bricks, USB-C cables, or laptop chargers.",
      icon: ELECTRONICS_SUB_CATEGORY_ICONS.CHARGER_ADAPTER,
      value: ELECTRONICS_SUBCATEGORY.CHARGER_ADAPTER,
    },
    {
      id: "mouse",
      title: "Mouse",
      description: "Wireless, Bluetooth, or gaming computer mice.",
      icon: ELECTRONICS_SUB_CATEGORY_ICONS.MOUSE,
      value: ELECTRONICS_SUBCATEGORY.MOUSE,
    },
    {
      id: "keyboard",
      title: "Keyboard",
      description: "Mechanical, magic keyboards, or input pads.",
      icon: ELECTRONICS_SUB_CATEGORY_ICONS.KEYBOARD,
      value: ELECTRONICS_SUBCATEGORY.KEYBOARD,
    },
    {
      id: "powerbank",
      title: "Power Bank",
      description: "Portable battery packs and external chargers.",
      icon: ELECTRONICS_SUB_CATEGORY_ICONS.POWERBANK,
      value: ELECTRONICS_SUBCATEGORY.POWERBANK,
    },
    {
      id: "power_outlet",
      title: "Power Outlet",
      description: "Power strips, extension cords, or travel adapters.",
      icon: ELECTRONICS_SUB_CATEGORY_ICONS.POWER_OUTLET,
      value: ELECTRONICS_SUBCATEGORY.POWER_OUTLET,
    },
    {
      id: "headphone",
      title: "Headphone",
      description: "Over-ear, noise-canceling, or studio headphones.",
      icon: ELECTRONICS_SUB_CATEGORY_ICONS.HEADPHONE,
      value: ELECTRONICS_SUBCATEGORY.HEADPHONE,
    },
    {
      id: "earphone",
      title: "Earphone",
      description: "AirPods, earbuds, or wired in-ear monitors.",
      icon: ELECTRONICS_SUB_CATEGORY_ICONS.EARPHONE,
      value: ELECTRONICS_SUBCATEGORY.EARPHONE,
    },
  ],
  [POST_CATEGORIES.CARD]: [
    {
      id: "bank_card",
      title: "Bank Card",
      description: "Credit, Debit, ATM, or Napas finance cards.",
      icon: CARD_SUB_CATEGORY_ICONS.BANK_CARD,
      value: CARD_SUBCATEGORY.BANK_CARD,
    },
    {
      id: "company_card",
      title: "Company Card",
      description: "Employee badges, corporate IDs, or access cards.",
      icon: CARD_SUB_CATEGORY_ICONS.COMPANY_CARD,
      value: CARD_SUBCATEGORY.COMPANY_CARD,
    },
    {
      id: "driver_license",
      title: "Driver's License",
      description: "Driving permits for motorbikes or automobiles.",
      icon: CARD_SUB_CATEGORY_ICONS.DRIVER_LICENSE,
      value: CARD_SUBCATEGORY.DRIVER_LICENSE,
    },
    {
      id: "identification_card",
      title: "Identification Card",
      description: "National ID (CCCD), citizen cards, or birth certificates.",
      icon: CARD_SUB_CATEGORY_ICONS.IDENTIFICATION_CARD,
      value: CARD_SUBCATEGORY.IDENTIFICATION_CARD,
    },
    {
      id: "passport",
      title: "Passport",
      description: "International travel booklets or visa documents.",
      icon: CARD_SUB_CATEGORY_ICONS.PASSPORT,
      value: CARD_SUBCATEGORY.PASSPORT,
    },
    {
      id: "personal_card",
      title: "Personal Card",
      description: "Membership, loyalty, or health insurance cards.",
      icon: CARD_SUB_CATEGORY_ICONS.PERSONAL_CARD,
      value: CARD_SUBCATEGORY.PERSONAL_CARD,
    },
    {
      id: "student_card",
      title: "Student Card",
      description: "University, high school, or student ID cards.",
      icon: CARD_SUB_CATEGORY_ICONS.STUDENT_CARD,
      value: CARD_SUBCATEGORY.STUDENT_CARD,
    },
  ],
  [POST_CATEGORIES.PERSONAL_BELONGINGS]: [
    {
      id: "backpack",
      title: "Backpack / Bag",
      description: "Rucksacks, handbags, tote bags, or school bags.",
      icon: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.BACKPACK,
      value: PERSONAL_BELONGING_SUBCATEGORY.BACKPACK,
    },
    {
      id: "clothings",
      title: "Clothing",
      description: "Jackets, hoodies, hats, or other apparel items.",
      icon: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.CLOTHINGS,
      value: PERSONAL_BELONGING_SUBCATEGORY.CLOTHINGS,
    },
    {
      id: "jewelry",
      title: "Jewelry",
      description: "Rings, necklaces, earrings, or luxury watches.",
      icon: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.JEWELRY,
      value: PERSONAL_BELONGING_SUBCATEGORY.JEWELRY,
    },
    {
      id: "keys",
      title: "Keys",
      description: "House, car, motorcycle, or locker keychains.",
      icon: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.KEYS,
      value: PERSONAL_BELONGING_SUBCATEGORY.KEYS,
    },
    {
      id: "suitcases",
      title: "Suitcase",
      description: "Luggage, travel trolleys, or large duffel bags.",
      icon: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.SUITCASES,
      value: PERSONAL_BELONGING_SUBCATEGORY.SUITCASES,
    },
    {
      id: "wallets",
      title: "Wallet",
      description: "Leather wallets, purses, or small card holders.",
      icon: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.WALLETS,
      value: PERSONAL_BELONGING_SUBCATEGORY.WALLETS,
    },
  ],
  [POST_CATEGORIES.OTHERS]: [
    {
      id: "other",
      title: "Something Else",
      description: "Unique items, pets, or things not listed above.",
      icon: OTHERS_ICON,
      value: OTHER_SUBCATEGORY.OTHER,
    },
  ],
};

const ALL_SUBCATEGORY_ICONS = [
  ...Object.values(ELECTRONICS_SUB_CATEGORY_ICONS),
  ...Object.values(CARD_SUB_CATEGORY_ICONS),
  ...Object.values(PERSONAL_BELONGING_SUB_CATEGORY_ICONS),
  OTHERS_ICON,
];

const ItemSubCategoryStepScreen = () => {
  const [isReady, setIsReady] = useState(false);

  const category = usePostCreationStore((state) => state.category);
  const subCategory = usePostCreationStore((state) => state.subCategoryCode);
  const selectSubCategory = usePostCreationStore(
    (state) => state.selectSubCategory,
  );

  useEffect(() => {
    async function preloadImages() {
      try {
        const cacheImages = ALL_SUBCATEGORY_ICONS.map((image) =>
          Asset.fromModule(image).downloadAsync(),
        );
        await Promise.all(cacheImages);
      } catch (e) {
        console.warn("Preload failed", e);
      } finally {
        setIsReady(true);
      }
    }
    preloadImages();
  }, []);

  const subcategories = SUBCATEGORIES[category];

  const renderContent = () => {
    if (!isReady) return <AppLoader />;

    return (
      <ScrollView className="flex-1 bg-surface px-lg pt-lg">
        <View className="mb-lg">
          <Text className="text-textPrimary font-normal text-2xl pr-lg tracking-tight">
            Which subcategory fits best?
          </Text>
        </View>

        <View className="gap-y-md pb-20">
          {subcategories.map((item) => {
            const isSelected = subCategory === item.value;

            return (
              <Pressable
                key={item.id}
                onPress={() => selectSubCategory(item.value)}
              >
                {({ pressed }) => (
                  <MotiView
                    animate={{
                      scale: pressed ? 0.97 : 1,
                      borderColor: isSelected ? colors.secondary : colors.muted,
                    }}
                    transition={{ type: "timing", duration: 150 }}
                    className="flex-row items-center p-md rounded-3xl border bg-surface"
                    style={{
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                    }}
                  >
                    {/* Icon */}
                    <View className="w-20 h-20 items-center justify-center bg-surface/50 rounded-2xl mr-4">
                      <Image
                        source={item.icon}
                        style={{ width: 90, height: 90 }}
                        resizeMode="contain"
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <Text className="text-textPrimary font-normal text-lg">
                        {item.title}
                      </Text>
                      <Text className="text-textSecondary font-thin text-sm leading-5">
                        {item.description}
                      </Text>
                    </View>

                    {/* Radio Button */}
                    <View
                      className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                        isSelected ? "border-secondary" : "border-divider"
                      }`}
                    >
                      {isSelected && (
                        <View className="w-3 h-3 rounded-full bg-secondary" />
                      )}
                    </View>
                  </MotiView>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return <View className="flex-1 bg-surface">{renderContent()}</View>;
};

export default ItemSubCategoryStepScreen;
