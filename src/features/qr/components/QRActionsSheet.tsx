import { BottomSheet } from '@/src/shared/components/ui';
import colors from '@/src/shared/theme/colors';
import type { PhosphorLogoIcon } from 'phosphor-react-native';
import { BarcodeIcon, QrCodeIcon, ShoppingCartIcon } from 'phosphor-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type QRAction = {
  id: string;
  icon: React.ElementType<React.ComponentProps<typeof PhosphorLogoIcon>>;
  label: string;
  description?: string;
  onPress: () => void;
};

type QRActionsSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  onGenerateDigitalQR?: () => void;
  onScanQRToLink?: () => void;
  onBuyPhysicalQR?: () => void;
};

const QRActionsSheet = ({
  isVisible,
  onClose,
  onGenerateDigitalQR,
  onScanQRToLink,
  onBuyPhysicalQR,
}: QRActionsSheetProps) => {
  const handleActionPress = (action: () => void) => {
    action();
    onClose();
  };

  const actions: QRAction[] = [
    {
      id: 'generate-digital-qr',
      icon: QrCodeIcon,
      label: 'Generate Digital QR',
      onPress: () => {
        if (onGenerateDigitalQR) {
          handleActionPress(onGenerateDigitalQR);
        }
      },
    },
    {
      id: 'scan-qr-to-link',
      icon: BarcodeIcon,
      label: 'Scan QR to Link',
      onPress: () => {
        console.log('Scan QR to Link');
        if (onScanQRToLink) {
          handleActionPress(onScanQRToLink);
        }
      },
    },
    {
      id: 'buy-physical-qr',
      icon: ShoppingCartIcon,
      label: 'Buy Physical QR',
      onPress: () => {
        console.log('Buy Physical QR');
        if (onBuyPhysicalQR) {
          handleActionPress(onBuyPhysicalQR);
        }
      },
    },
  ];

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
          {actions.map((action) => (
            <Pressable
              key={action.id}
              onPress={action.onPress}
              className="flex-row items-center bg-gray-50 rounded-2xl p-4"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: colors.primary }}
              >
                <action.icon size={24} color="white" weight="regular" />
              </View>

              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  {action.label}
                </Text>
                {action.description && (
                  <Text className="text-sm text-gray-500">
                    {action.description}
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

export default QRActionsSheet;