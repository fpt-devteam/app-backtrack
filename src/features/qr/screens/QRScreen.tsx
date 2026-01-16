import { QRCodeList } from '@/src/features/qr/components';
import type { QrCodeData } from '@/src/features/qr/types';
import { AppHeader } from '@/src/shared/components';
import { DotThreeButton } from '@/src/shared/components/ui/DotThreeButton';
import { QR_ROUTE } from '@/src/shared/constants';
import { RelativePathString, router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function QRScreen() {
  const handleMenuOpen = () => {
    router.push("/(bottom-sheet)/qr-menu" as RelativePathString);
  };

  const handleQRCodePress = (qr: QrCodeData) => {
    router.push(QR_ROUTE.detail(qr.qrCode.id) as RelativePathString);
  };

  return (
    <View className="flex-1" style={{ flex: 1 }}>
      <AppHeader title="My Protected Items" showBackButton={false} rightActionButton={<DotThreeButton onPress={handleMenuOpen} />} />

      <QRCodeList onItemPress={handleQRCodePress} />

    </View>
  );
};
