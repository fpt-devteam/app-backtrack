import ItemDetail from '@/src/features/item/components/ItemDetail/ItemDetail';
import useGetItemById from '@/src/features/item/hooks/useGetItemById';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

const ItemDetailPage = () => {
  const { id } = useLocalSearchParams();

  const { item: fullData, loading, error } = useGetItemById({ itemId: id as string });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (error || !fullData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#ef4444' }}>{error?.message || "Item not found"}</Text>
      </View>
    );
  }

  return <ItemDetail data={fullData as any} />;
};

export default ItemDetailPage;