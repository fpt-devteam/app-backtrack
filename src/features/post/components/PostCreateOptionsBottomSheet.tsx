import type { RelativePathString } from "expo-router";
import { router } from "expo-router";
import { BarcodeIcon, BinocularsIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { type MenuOption } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";

import { colors } from "@/src/shared/theme";
import * as BottomSheetUtil from "@/src/shared/utils/bottom-sheet.utils";

const PostCreateOptionsScreen = () => {
  const goTo = (href: RelativePathString) => {
    setTimeout(() => {
      router.replace(href);
    }, BottomSheetUtil.CLOSE_TIME_MS);
  };

  const options: MenuOption[] = useMemo(
    () => [
      {
        id: "add-lost-post",
        icon: BinocularsIcon,
        label: "Add Lost Item",
        onPress: () =>
          goTo(`${POST_ROUTE.create}?postType=Lost` as RelativePathString),
      },
      {
        id: "add-found-post",
        icon: BarcodeIcon,
        label: "Add Found Item",
        onPress: () =>
          goTo(`${POST_ROUTE.create}?postType=Found` as RelativePathString),
      },
    ],
    [],
  );

  return (
    <View className="px-6 pb-6">
      <Text className="text-xl font-bold text-gray-900 mb-2">
        Quick Actions
      </Text>

      <View className="gap-3">
        {options.map((option) => (
          <Pressable
            key={option.id}
            onPress={option.onPress}
            className="flex-row items-center bg-gray-50 rounded-2xl p-4"
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: colors.primary }}
            >
              <option.icon size={24} color="white" weight="regular" />
            </View>

            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 mb-1">
                {option.label}
              </Text>
              {option.description && (
                <Text className="text-sm text-gray-500">
                  {option.description}
                </Text>
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default PostCreateOptionsScreen;
