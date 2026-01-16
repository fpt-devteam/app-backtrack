import { AppHeader } from '@/src/shared/components';
import { DotThreeButton } from '@/src/shared/components/ui/DotThreeButton';
import MenuBottomSheet, { MenuOption } from '@/src/shared/components/ui/MenuBottomSheet';

import { QR_ROUTE } from '@/src/shared/constants';
import colors from '@/src/shared/theme/colors';
import { formatDateTime } from '@/src/shared/utils';
import { Image } from 'expo-image';
import { RelativePathString, router } from 'expo-router';
import {
  ClockIcon,
  PencilSimpleIcon,
  QrCodeIcon,
  TrashIcon
} from 'phosphor-react-native';
import React, { memo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type QRCodeDetailProps = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  publicCode: string;
  isActive: boolean;
  lastUpdated: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const QRCodeDetail = ({
  id,
  name,
  description,
  imageUrl,
  publicCode,
  isActive,
  lastUpdated,
  onEdit,
  onDelete,
}: QRCodeDetailProps) => {
  const insets = useSafeAreaInsets();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleViewQR = () => {
    router.push(QR_ROUTE.qrView(id, publicCode) as RelativePathString);
  }

  const handleEdit = () => {
    setIsMenuOpen(false);
    if (onEdit) onEdit();
    else router.push(QR_ROUTE.edit(id) as RelativePathString);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete?.();
  };

  const menuOptions: MenuOption[] = [
    {
      id: 'edit',
      label: 'Update',
      description: 'Edit item details',
      icon: PencilSimpleIcon,
      onPress: handleEdit,
    },
    {
      id: 'delete',
      label: 'Move to Trash',
      description: 'Remove this QR from your list',
      icon: TrashIcon,
      onPress: handleDelete,
    },
  ];

  return (
    <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
      <AppHeader title="QR Code Details" rightActionButton={<DotThreeButton onPress={() => setIsMenuOpen(true)} />} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ItemImage imageUrl={imageUrl} />
        <ItemTitle name={name} />

        <DetailCard
          description={description}
          publicCode={publicCode}
          isActive={isActive}
          lastUpdatedText={formatDateTime(new Date(lastUpdated))}
          onViewQR={handleViewQR}
        />
      </ScrollView>

      <MenuBottomSheet
        isVisible={isMenuOpen}
        options={menuOptions}
        onDismiss={() => setIsMenuOpen(false)}
      />
    </View>
  );
};

const ItemImage = memo(function ItemImage({ imageUrl }: { imageUrl: string }) {
  return (
    <View className="px-4 mb-6">
      <View className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100">
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      </View>
    </View>
  );
});

const ItemTitle = memo(function ItemTitle({ name }: { name: string }) {
  return (
    <View className="px-4 mb-6">
      <Text className="text-3xl font-bold text-gray-900">{name}</Text>
    </View>
  );
});

const DetailCard = memo(function DetailCard({
  description,
  publicCode,
  isActive,
  lastUpdatedText,
  onViewQR,
}: {
  description: string;
  publicCode: string;
  isActive: boolean;
  lastUpdatedText: string;
  onViewQR: () => void;
}) {
  return (
    <View
      className="px-4 mb-6 rounded-2xl p-4 mx-4"
      style={{
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.slate[200],
      }}
    >
      {/* Description */}
      <Text className="text-xl font-semibold text-gray-900 mb-2">
        Note
      </Text>
      <Text
        className="text-base text-gray-600 leading-6 max-h-[100px] mb-6"
        numberOfLines={10}
      >
        {description}
      </Text>

      {/* Divider */}
      <View className="h-px bg-gray-300 mb-4" />

      {/* Linked QR header + badge */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xl font-semibold text-gray-900">Linked QR Code</Text>

        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: isActive ? '#D1FAE5' : '#FEE2E2' }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: isActive ? '#059669' : '#DC2626' }}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      {/* Linked QR card */}
      <View
        className="rounded-2xl p-4 flex-row justify-between items-center mb-3"
        style={{
          backgroundColor: colors.slate[100],
          borderWidth: 1,
          borderColor: colors.slate[200],
        }}
      >
        <View className="flex-1 pr-3">
          <Text className="text-xs text-gray-500 mb-2">UNIQUE ID</Text>
          <Text className="text-base font-semibold text-gray-900">
            {publicCode}
          </Text>
        </View>

        <Pressable
          onPress={onViewQR}
          className="flex-row items-center justify-center py-2.5 px-4 rounded-lg active:opacity-70"
          style={{ backgroundColor: colors.primary }}
        >
          <QrCodeIcon size={18} color="white" weight="bold" />
          <Text className="text-sm font-semibold text-white ml-2">View QR</Text>
        </Pressable>
      </View>

      {/* Last Updated */}
      <View className="flex-row items-center">
        <ClockIcon size={16} color={colors.slate[500]} weight="regular" />
        <Text className="text-md text-gray-500 ml-1">
          Last Updated: {lastUpdatedText}
        </Text>
      </View>
    </View>
  );
});

export default QRCodeDetail;
