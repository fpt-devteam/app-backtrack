import { BottomSheet } from "@/src/shared/components/ui/BottomSheet";
import { colors } from "@/src/shared/theme/colors";
import { type PhosphorLogoIcon } from "phosphor-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MenuOption = {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType<React.ComponentProps<typeof PhosphorLogoIcon>>;
  onPress: () => void;
};

type MenuBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  options: MenuOption[];
};

export const MenuBottomSheet = ({
  isVisible,
  options,
  onClose,
}: MenuBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <View
        className="px-lg pb-md gap-md"
        style={{ paddingBottom: insets.bottom }}
      >
        {options.map((option) => (
          <Pressable
            key={option.id}
            onPress={option.onPress}
            className="flex-row items-center rounded-2xl gap-md2"
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <option.icon
                size={20}
                color={colors.primaryForeground}
                weight="thin"
              />
            </View>

            <View className="flex-1 gap-xs">
              <Text className="text-base font-normal text-textPrimary">
                {option.label}
              </Text>
              <Text className="text-xs font-thin text-textSecondary">
                {option.description}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
};

MenuBottomSheet.displayName = "MenuBottomSheet";
