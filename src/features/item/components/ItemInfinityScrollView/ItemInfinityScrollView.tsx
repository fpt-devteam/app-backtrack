import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Image, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useItems from '../../hooks/useItems';
import ItemCard, { ItemCardComponentProps } from '../ItemCard.tsx/ItemCard';

const BOTTOM_BAR_HEIGHT = 64;

const ItemInfinityScrollView = () => {
  const insets = useSafeAreaInsets();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading
  } = useItems({
    pageSize: 10
  });

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return <ActivityIndicator style={{ padding: 20 }} color="#2979ff" />;
    }
    
    // FIX LỖI: Kiểm tra undefined an toàn cho data?.pages
    const hasItems = data?.pages?.[0]?.items && data.pages[0].items.length > 0;
    if (!hasNextPage && hasItems) {
      return (
        <Text style={{ textAlign: 'center', padding: 20, color: '#999' }}>
          No more to load!
        </Text>
      );
    }
    return <View style={{ height: 20 }} />;
  }, [isFetchingNextPage, hasNextPage, data]);

  const headerComponent = useMemo(() => (
    <View style={{ backgroundColor: '#f5f6fa' }}>
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>BackTrack</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>My Protected Items</Text>
          <Text style={{ color: '#2979ff', fontWeight: '600' }}>Manage</Text>
        </View>

        <View
          style={{
            marginTop: 16,
            backgroundColor: '#eef3ff',
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#2979ff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="lock-closed" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>Get Physical Stickers</Text>
            <Text style={{ color: '#555', fontSize: 12 }}>
              Order high-quality, durable QR codes for your gear.
            </Text>
          </View>
        </View>
      </View>
      <View style={{ height: 16 }} />
    </View>
  ), [insets.top]);

  // FIX LỖI: Sử dụng 'unknown' để ép kiểu an toàn khi hai kiểu dữ liệu không chồng lấp
  const allItems = useMemo(() => {
    const flattened = data?.pages.flatMap(page => page.items) || [];
    // Ép kiểu qua unknown để tránh lỗi "neither type sufficiently overlaps"
    return (flattened as unknown) as ItemCardComponentProps['item'][];
  }, [data]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2979ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={allItems}
      // Sử dụng ID từ qrCode theo đúng dữ liệu Postman
      keyExtractor={(item) => item.qrCode.id} 
      renderItem={({ item }) => <ItemCard item={item} />} 
      onEndReachedThreshold={0.3}
      onEndReached={handleEndReached}
      ListFooterComponent={handleFooter}
      ListHeaderComponent={headerComponent}
      contentContainerStyle={{ 
        paddingBottom: BOTTOM_BAR_HEIGHT + insets.bottom + 24,
        backgroundColor: '#f5f6fa'
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default ItemInfinityScrollView;