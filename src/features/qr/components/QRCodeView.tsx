import { getQrCodeImage } from '@/src/features/qr/api';
import { AppHeader, AppInlineError, AppLoader } from '@/src/shared/components';
import colors from '@/src/shared/theme/colors';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { CopyIcon, DownloadSimpleIcon } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type QRCodeViewProps = {
  publicCode: string;
  itemName?: string;
  onBack?: () => void;
};

const QRCodeView = ({ publicCode, itemName, onBack }: QRCodeViewProps) => {
  const insets = useSafeAreaInsets();
  const [qrImageUri, setQrImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQRCodeImage();
  }, [publicCode]);

  const loadQRCodeImage = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const imageBuffer = await getQrCodeImage(publicCode);

      // Convert ArrayBuffer to base64
      const base64 = arrayBufferToBase64(imageBuffer);
      const dataUri = `data:image/png;base64,${base64}`;

      setQrImageUri(dataUri);
    } catch (err) {
      console.error('Failed to load QR code:', err);
      setError('Failed to load QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCodePoint(bytes[i]);
    }
    return btoa(binary);
  };

  const handleCopyCode = async () => {
    try {
      await Clipboard.setStringAsync(publicCode);
      Alert.alert('Copied!', 'QR code copied to clipboard.');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to copy code.');
    }
  };

  const handleDownload = () => {
    Alert.alert('Coming Soon', 'QR code download feature is under development.');
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
      <AppHeader title="QR Code" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* Item Name */}
        {itemName && (
          <View className="w-full mb-6">
            <Text className="text-xl font-bold text-gray-900 text-center">{itemName}</Text>
          </View>
        )}

        {/* QR Code Container */}
        <View
          className="w-full max-w-sm aspect-square rounded-3xl mb-6 items-center justify-center"
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: colors.slate[200],
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {isLoading && <AppLoader size={40} />}

          {error && <AppInlineError message={error} />}

          {!isLoading && !error && qrImageUri && (
            <View className="w-[85%] h-[85%] items-center justify-center">
              <Image
                source={{ uri: qrImageUri }}
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
              />
            </View>
          )}
        </View>

        {/* QR Code ID */}
        <View className="w-full mb-6">
          <Text className="text-xs text-gray-500 text-center mb-1">QR CODE ID</Text>
          <Pressable
            onPress={handleCopyCode}
            className="flex-row items-center justify-center py-2 px-4 rounded-lg active:bg-gray-100"
          >
            <Text className="text-lg font-mono font-semibold text-gray-900">{publicCode}</Text>
            <CopyIcon size={18} color={colors.slate[600]} weight="regular" />
          </Pressable>
        </View>

        {/* Action Buttons */}
        <View className="w-full max-w-sm space-y-3">
          {/* Download Button */}
          <Pressable
            onPress={handleDownload}
            className="flex-row items-center justify-center py-3.5 rounded-xl active:opacity-70"
            style={{
              backgroundColor: colors.primary,
              borderWidth: 1,
              borderColor: colors.slate[200],
            }}
          >
            <DownloadSimpleIcon size={20} color="white" weight="bold" />
            <Text className="text-base font-semibold text-white ml-2">Download QR Code</Text>
          </Pressable>
        </View>

        {/* Instructions */}
        <View className="w-full max-w-sm mt-8 p-4 rounded-2xl" style={{ backgroundColor: colors.slate[50] }}>
          <Text className="text-sm font-semibold text-gray-900 mb-2">How to use this QR Code</Text>
          <Text className="text-sm text-gray-600 leading-5">
            Anyone who scans this QR code will be able to view the item details and contact you if
            they find your lost item or want to return your found item.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default QRCodeView;
