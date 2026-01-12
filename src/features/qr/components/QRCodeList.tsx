import { useQRCodes } from '@/src/features/qr/hooks';
import type { QrCodeData } from '@/src/features/qr/types';
import { AppEndOfFeed, AppInlineError, AppLoader } from '@/src/shared/components';
import colors from '@/src/shared/theme/colors';
import { CalendarIcon, QrCodeIcon } from 'phosphor-react-native';
import React, { useCallback } from 'react';
import { FlatList, Image, Pressable, RefreshControl, Text, View } from 'react-native';

type QRCodeListProps = {
  onItemPress?: (item: QrCodeData) => void;
  pageSize?: number;
};

const QRCodeList = ({ onItemPress, pageSize = 20 }: QRCodeListProps) => {
  const { items, isLoading, error, hasMore, loadMore, isLoadingNextPage, refresh, isRefetching } = useQRCodes({
    pageSize,
  });

  const handleEndReached = useCallback(() => {
    if (!hasMore || isLoadingNextPage) return;
    loadMore();
  }, [hasMore, isLoadingNextPage, loadMore]);

  const renderItem = useCallback(
    ({ item }: { item: QrCodeData }) => (
      <QRCodeCard item={item} onPress={() => onItemPress?.(item)} />
    ),
    [onItemPress]
  );

  const renderFooter = useCallback(() => {
    if (!isRefetching && (isLoading || isLoadingNextPage)) {
      return (
        <View className="py-4">
          <AppLoader />
        </View>
      );
    }

    if (!hasMore && items.length > 0) {
      return (
        <View className="py-4">
          <AppEndOfFeed />
        </View>
      );
    }

    return null;
  }, [isLoading, isLoadingNextPage, hasMore, items.length]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;

    return (
      <View className="flex-1 items-center justify-center py-12 px-6">
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: colors.slate[100] }}
        >
          <QrCodeIcon size={40} color={colors.slate[400]} />
        </View>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          No QR Codes Yet
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          Create your first QR code to protect your items
        </Text>
      </View>
    );
  }, [isLoading]);

  if (error) {
    console.error('Error loading QR codes:', error);
    return (
      <AppInlineError
        message="Failed to load QR codes"
      />
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.qrCode.id}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={{
        padding: 16,
        flexGrow: 1,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={refresh}
          tintColor={colors.primary}
        />
      }
    />
  );
};

// ============================================================================
// QR Code Card Component
// ============================================================================

type QRCodeCardProps = {
  item: QrCodeData;
  onPress: () => void;
};

const QRCodeCard = ({ item, onPress }: QRCodeCardProps) => {
  const { qrCode, item: qrItem } = item;
  const firstImage = qrItem.imageUrls?.[0];
  const formattedDate = new Date(qrCode.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {firstImage ? (
        <Image
          source={{ uri: firstImage }}
          className="w-full"
          style={{ aspectRatio: 16 / 9 }}
          resizeMode="cover"
        />
      ) : (
        <View
          className="w-full h-48 items-center justify-center"
          style={{ backgroundColor: colors.slate[100] }}
        >
          <QrCodeIcon size={32} color={colors.slate[400]} />
        </View>
      )}

      <View className="flex-row">
        <View className="flex-1 p-4">
          <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={2}>
            {qrItem.name || 'Untitled Item'}
          </Text>

          {!!qrItem.description && (
            <Text className="text-sm text-gray-500 mb-2" numberOfLines={1}>
              {qrItem.description}
            </Text>
          )}

          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <QrCodeIcon size={14} color={colors.slate[400]} />
              <Text className="text-xs text-gray-500 ml-1" numberOfLines={1}>
                {qrCode.publicCode}
              </Text>
            </View>

            <View className="flex-row items-center">
              <CalendarIcon size={14} color={colors.slate[400]} />
              <Text className="text-xs text-gray-500 ml-1">
                {formattedDate}
              </Text>
            </View>
          </View>
        </View>
        {!!qrCode.linkedAt && (
          <View className='p-2'>
            <View
              className="px-2 py-1 rounded-md self-start mt-2"
              style={{ backgroundColor: colors.emerald[100] }}
            >
              <Text className="text-xs font-medium" style={{ color: colors.emerald[600] }}>
                Linked
              </Text>
            </View>
          </View>
        )}
      </View>


    </Pressable>
  );
};

export default QRCodeList;
