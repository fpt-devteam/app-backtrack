import ItemDetail from '@/src/features/item/components/ItemDetail/ItemDetail';
import useGetItemById from '@/src/features/item/hooks/useGetItemById';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const ItemDetailScreen = () => {
  const params = useLocalSearchParams<{ itemId?: string | string[] }>();
  const itemId = Array.isArray(params.itemId) ? params.itemId[0] : params.itemId;

  const { item, loading, error } = useGetItemById({ itemId: itemId || "" });

  if (!itemId) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Missing itemId</Text>
    </View>
  );

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0ea5e9" />
      <Text style={{ marginTop: 10 }}>Loading...</Text>
    </View>
  );

  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ color: '#ef4444', textAlign: 'center' }}>{error.message}</Text>
    </View>
  );

  if (!item) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Item not found</Text>
    </View>
  );

  return <ItemDetail item={item} />;
};

export default ItemDetailScreen;