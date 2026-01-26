import type { QrCodeData, QrCodeEntity, QrItemEntity } from '@/src/features/qr/types';
import { colors } from "@/src/shared/theme/colors";
import { formatIsoDate } from '@/src/shared/utils';
import { CalendarIcon, QrCodeIcon } from 'phosphor-react-native';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
;


type QRCodeCardProps = {
  item: QrCodeData;
  onPress: () => void;
};

export const QRCodeCard = ({ item, onPress }: QRCodeCardProps) => {
  const { qrCode, item: qrItem } = item;
  const firstImage = qrItem.imageUrls?.[0];

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex-row"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <ItemImage imageUrl={firstImage} />
      <ItemInfo qrCode={qrCode} qrItem={qrItem} />
    </Pressable>
  );
};

const ItemImage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    imageUrl ? (
      <Image
        source={{ uri: imageUrl }}
        className="w-24 h-24"
        style={{ aspectRatio: 1 }}
        resizeMode="cover"
      />
    ) : (
      <View
        className="w-24 h-24 items-center justify-center"
        style={{ backgroundColor: colors.slate[100] }}
      >
        <QrCodeIcon size={32} color={colors.slate[400]} />
      </View>
    )
  )
};

const ItemInfo = ({ qrCode, qrItem }: { qrCode: QrCodeEntity, qrItem: QrItemEntity }) => {
  return (
    <View className="flex-col justify-around p-4">
      <Text className="text-base font-semibold text-gray-900 mb-1 max-w-52" numberOfLines={2}>
        {qrItem.name}
      </Text>

      <View className="flex-row items-center mr-4">
        <QrCodeIcon size={14} color={colors.slate[400]} />
        <Text className="text-xs text-gray-500 ml-1" numberOfLines={1}>
          {qrCode.publicCode}
        </Text>
      </View>

      <View className="flex-row items-center">
        <CalendarIcon size={14} color={colors.slate[400]} />
        <Text className="text-xs text-gray-500 ml-1">
          {formatIsoDate(new Date(qrCode.createdAt), "dd/MM/yyyy")}
        </Text>
      </View>
    </View>
  )
};
