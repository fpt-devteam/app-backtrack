import { QRActionsSheet, QRCodeList } from '@/src/features/qr/components';
import type { QrCodeData } from '@/src/features/qr/types';
import { AppHeader } from '@/src/shared/components';
import { FAB } from '@/src/shared/components/ui';
import { useUIStore } from '@/src/shared/store/ui.store';
import { router } from 'expo-router';
import { PlusIcon } from 'phosphor-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';

type QRActionSheetState = 'open' | 'closed';

const ItemScreen = () => {
  const [qrActionSheetState, setQRActionSheetState] = useState<QRActionSheetState>('closed');
  const setBottomTabBarState = useUIStore((state) => state.setBottomTabBarState);

  const handleQRActionSheetOpen = () => {
    setQRActionSheetState('open');
    setBottomTabBarState('closed');
  };

  const handleQRActionSheetClose = () => {
    setQRActionSheetState('closed');
    setBottomTabBarState('open');
  };

  const handleGenerateDigitalQR = () => {
    console.log('Navigate to generate digital QR screen');
    // TODO: router.push('/qr/generate');
  };

  const handleScanQRToLink = () => {
    console.log('Navigate to scan QR screen');
    // TODO: router.push('/qr/scan');
  };

  const handleBuyPhysicalQR = () => {
    console.log('Navigate to buy physical QR screen');
    // TODO: router.push('/qr/purchase');
  };

  const handleQRCodePress = (item: QrCodeData) => {
    console.log('QR Code pressed:', item.qrCode.publicCode);
    // TODO: router.push(`/qr/${item.qrCode.id}`);
  };

  return (
    <View className="flex-1">
      <AppHeader title="My Protected Items" showBackButton={false} />

      {/* QR Code List */}
      <QRCodeList onItemPress={handleQRCodePress} />

      {/* FAB Button */}
      <View style={{ position: 'absolute', bottom: 100, right: 24 }}>
        <FAB
          icon={PlusIcon}
          onPress={handleQRActionSheetOpen}
          tone="primary"
          size="md"
        />
      </View>

      {/* QR Actions Bottom Sheet */}
      <QRActionsSheet
        isVisible={qrActionSheetState === 'open'}
        onClose={handleQRActionSheetClose}
        onGenerateDigitalQR={handleGenerateDigitalQR}
        onScanQRToLink={handleScanQRToLink}
        onBuyPhysicalQR={handleBuyPhysicalQR}
      />
    </View>
  );
};

export default ItemScreen;
