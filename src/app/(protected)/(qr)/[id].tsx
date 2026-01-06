import ItemDetail from '@/src/features/item/components/ItemDetail/ItemDetail';
import useGetItemById from '@/src/features/item/hooks/useGetItemById';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

const ItemDetailPage = () => {
  const { id } = useLocalSearchParams();

  // Gọi hook để lấy dữ liệu. 
  // Biến 'item' ở đây thực chất là object { qrCode, item } trả về từ service
  const { item: fullData, loading, error } = useGetItemById({ itemId: id as string });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  // Nếu có lỗi hoặc không có dữ liệu
  if (error || !fullData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#ef4444' }}>{error?.message || "Item not found"}</Text>
      </View>
    );
  }

  // Truyền nguyên object 'fullData' vào prop 'data' của ItemDetail
  return <ItemDetail data={fullData as any} />;
};

export default ItemDetailPage;