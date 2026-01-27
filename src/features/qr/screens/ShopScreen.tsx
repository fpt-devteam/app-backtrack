import { AppHeader, BackButton, HeaderTitle } from '@/src/shared/components';
import { colors } from '@/src/shared/theme/colors';
import { ShoppingBagIcon } from 'phosphor-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ShopScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader
        left={<BackButton />}
        center={<HeaderTitle title="Shop" className="min-w-0" />}
      />
      <View className="flex-1 items-center justify-center px-6">
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: colors.slate[100] }}
        >
          <ShoppingBagIcon size={40} color={colors.slate[400]} />
        </View>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Shop
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          Browse and purchase QR code products
        </Text>
      </View>
    </SafeAreaView>
  );
};
