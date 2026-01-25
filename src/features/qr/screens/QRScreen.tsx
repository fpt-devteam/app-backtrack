import { QRCodeList } from '@/src/features/qr/components';
import type { QrCodeData } from '@/src/features/qr/types';
import { AppHeader, DotsThreeButton, HeaderTitle } from '@/src/shared/components';
import { QR_ROUTE } from '@/src/shared/constants';
import { RelativePathString, router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const QRScreen = () => {
  const handleMenuOpen = () => {
    router.push("/(bottom-sheet)/qr-menu" as RelativePathString);
  };

  const handleQRCodePress = (qr: QrCodeData) => {
    router.push(QR_ROUTE.detail(qr.qrCode.id) as RelativePathString);
  };

  return (
    <SafeAreaView className="flex-1">
      <AppHeader left={<HeaderTitle title="My Protected Items" />} right={<DotsThreeButton onPress={handleMenuOpen} />} />
      <QRCodeList onItemPress={handleQRCodePress} />
    </SafeAreaView>
  );
};
