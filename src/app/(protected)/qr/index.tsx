import { QRCodeList } from '@/src/features/qr/components';
import type { QrCodeData } from '@/src/features/qr/types';
import { AppHeader, MenuBottomSheet, MenuOption } from '@/src/shared/components';
import { MenuButton } from '@/src/shared/components/ui/MenuBottomSheet';
import { QR_ROUTE } from '@/src/shared/constants';
import { useUIStore } from '@/src/shared/store/ui.store';
import { RelativePathString, router } from 'expo-router';
import { BarcodeIcon, QrCodeIcon, ShoppingCartIcon } from 'phosphor-react-native';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';

const QRCodeListScreen = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const setBottomTabBarState = useUIStore((state) => state.setBottomTabBarState);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
    setBottomTabBarState('closed');
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setBottomTabBarState('open');
  };

  const handleQRCodePress = (qr: QrCodeData) => {
    router.push(QR_ROUTE.detail(qr.qrCode.id) as RelativePathString);
  };

  const handleGenerateDigitalQR = () => {
    handleMenuClose();
    router.push(QR_ROUTE.generate as RelativePathString);
  };

  const handleScanQRToLink = () => {
    handleMenuClose();
    console.log('Navigate to scan QR screen');
  };

  const handleBuyPhysicalQR = () => {
    handleMenuClose();
    console.log('Navigate to buy physical QR screen');
  };

  const menuOptions: MenuOption[] = useMemo(
    () => [
      {
        id: 'generate-digital-qr',
        icon: QrCodeIcon,
        label: 'Generate Digital QR',
        onPress: handleGenerateDigitalQR,
      },
      {
        id: 'scan-qr-to-link',
        icon: BarcodeIcon,
        label: 'Scan QR to Link',
        onPress: handleScanQRToLink,
      },
      {
        id: 'buy-physical-qr',
        icon: ShoppingCartIcon,
        label: 'Buy Physical QR',
        onPress: handleBuyPhysicalQR,
      },
    ],
    [handleGenerateDigitalQR, handleScanQRToLink, handleBuyPhysicalQR]
  );


  return (
    <View className="flex-1">
      <AppHeader title="My Protected Items" showBackButton={false} rightActionButton={<MenuButton onPress={handleMenuOpen} />} />

      <QRCodeList onItemPress={handleQRCodePress} />

      <MenuBottomSheet
        isVisible={isMenuOpen}
        options={menuOptions}
        onClose={handleMenuClose}
      />
    </View>
  );
};

export default QRCodeListScreen;
