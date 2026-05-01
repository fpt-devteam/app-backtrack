import { usePostCreationStore } from "@/src/features/post/hooks";
import { POST_CATEGORIES } from "@/src/features/post/types";
import { AppLoader } from "@/src/shared/components";
import {
  CARD_ICON,
  ELECTRONICS_ICON,
  OTHERS_ICON,
  PERSONAL_BELONGING_ICON,
} from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { Asset } from "expo-asset";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

const CATEGORIES = [
  {
    id: "electronics",
    title: "Electronics",
    description: "Phones, laptops, cameras, and gadgets",
    icon: ELECTRONICS_ICON,
    value: POST_CATEGORIES.ELECTRONICS,
  },
  {
    id: "cards",
    title: "Cards",
    description: "Credit cards, IDs, or personal wallets",
    icon: CARD_ICON,
    value: POST_CATEGORIES.CARD,
  },
  {
    id: "personal",
    title: "Personal Belongings",
    description: "Bags, backpacks, keys, clothing, or jewelry",
    icon: PERSONAL_BELONGING_ICON,
    value: POST_CATEGORIES.PERSONAL_BELONGINGS,
  },
  {
    id: "other",
    title: "Others",
    description: "Items that don't fit into the above categories",
    icon: OTHERS_ICON,
    value: POST_CATEGORIES.OTHERS,
  },
];

const ItemCategoryStepScreen = () => {
  const [isReady, setIsReady] = useState(false);

  const category = usePostCreationStore((state) => state.category);
  const selectCategory = usePostCreationStore((state) => state.selectCategory);

  useEffect(() => {
    async function preloadImages() {
      try {
        const cacheImages = [
          ELECTRONICS_ICON,
          CARD_ICON,
          PERSONAL_BELONGING_ICON,
          OTHERS_ICON,
        ].map((image) => Asset.fromModule(image).downloadAsync());
        await Promise.all(cacheImages);
      } catch (e) {
        console.warn("Preload failed", e);
      } finally {
        setIsReady(true);
      }
    }
    preloadImages();
  }, []);

  const renderContent = () => {
    if (!isReady) return <AppLoader />;

    return (
      <View className="flex-1 bg-surface px-lg pt-lg">
        <View className="mb-lg">
          <Text className="text-textPrimary font-normal text-2xl pr-lg tracking-tight">
            Which of these best describes your item?
          </Text>
        </View>

        <View className="gap-y-md pb-20">
          {CATEGORIES.map((item) => {
            const isSelected = category === item.value;

            return (
              <Pressable
                key={item.id}
                onPress={() => selectCategory(item.value)}
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

                    {/* Content*/}
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
      </View>
    );
  };

  return <View className="flex-1 bg-surface">{renderContent()}</View>;
};

export default ItemCategoryStepScreen;
