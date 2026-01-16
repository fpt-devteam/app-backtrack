import { BottomSheet } from '@/src/shared/components/ui';
import { DotsThreeIcon, type PhosphorLogoIcon } from 'phosphor-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import colors from '../../theme/colors';

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

const MenuBottomSheet = ({ isVisible, options, onClose }: MenuBottomSheetProps) => {
  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={onClose}
    >
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
    </BottomSheet>
  );
};

MenuBottomSheet.displayName = 'MenuBottomSheet';

export default MenuBottomSheet;


export const MenuButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      hitSlop={10}
    >
      <DotsThreeIcon size={22} color={colors.slate[900]} weight="bold" />
    </Pressable>
  );
};