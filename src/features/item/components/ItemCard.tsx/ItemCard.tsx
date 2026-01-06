import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export interface ItemCardComponentProps {
  item: {
    item: {
      id: string;
      name: string;
      imageUrls: string[];
      updatedAt: string | null;
      createdAt?: string;
    };
    qrCode: {
      id: string;
      createdAt: string;
      publicCode: string;
    };
  };
}

const ItemCard = ({ item: data }: ItemCardComponentProps) => {
  const router = useRouter();
  
  // Bóc tách dữ liệu từ cấu trúc lồng nhau của API
  const itemInfo = data.item;
  const qrInfo = data.qrCode;

  // Điều hướng bằng ID của qrCode để khớp với route [id].tsx
  const handlePress = () => router.push(`/(protected)/(qr)/${qrInfo.id}`);

  const imageUrl = itemInfo.imageUrls && itemInfo.imageUrls.length > 0 
    ? itemInfo.imageUrls[0] 
    : 'https://via.placeholder.com/150';

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={1}>
          {itemInfo.name || 'Unnamed Item'}
        </Text>
        <Text style={styles.itemId} numberOfLines={1}>
          Created at: {formatDate(qrInfo.createdAt)}
        </Text>
        {/* Hiển thị thêm Public Code để dễ nhận biết */}
        <Text style={{ fontSize: 10, color: '#2979ff', marginTop: 2 }}>
          ID: {qrInfo.publicCode}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCard;