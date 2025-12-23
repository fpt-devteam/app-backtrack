import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ItemCardProps } from '../../types/item.type';
import { styles } from './styles';

interface ItemCardComponentProps {
  item: ItemCardProps;
}

const ItemCard = ({ item }: ItemCardComponentProps) => {
  const router = useRouter();
  const handlePress = () => router.push(`/(protected)/(qr)/${item.id}`);

  const imageUrl = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : 'https://via.placeholder.com/150';

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      {/* Image Carousel Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemId} numberOfLines={1}>
          Create at: {item.createdAt}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCard;