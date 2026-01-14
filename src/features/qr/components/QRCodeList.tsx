import { useQRCodes } from '@/src/features/qr/hooks';
import type { QrCodeData } from '@/src/features/qr/types';
import { AppEndOfFeed, AppInlineError, AppLoader } from '@/src/shared/components';
import colors from '@/src/shared/theme/colors';
import { QrCodeIcon } from 'phosphor-react-native';
import React, { useCallback } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { QRCodeCard } from './QRCodeCard';

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
      renderItem={({ item }) => (
        <View className='mb-4'>
          <QRCodeCard item={item} onPress={() => onItemPress?.(item)} />
        </View>
      )}
      numColumns={1}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={refresh}
          tintColor={colors.primary}
        />
      }
      className='mb-20 p-4'
    />
  );
};

export default QRCodeList;
