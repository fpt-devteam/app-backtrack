import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Item } from '../../types/item.type';
import { styles } from './styles';

interface ItemDetailProps {
  item: Item;
}

const ItemDetail = ({ item }: ItemDetailProps) => {
  const router = useRouter();
  const imageUrl = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : 'https://via.placeholder.com/400';

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleEdit = () => {
    router.push(`/(protected)/(qr)/edit-item/${item.id}`);
  };

  const handleShare = () => {
    console.log('Share item:', item.qrCode.publicCode);
  };

  const handlePrint = () => {
    console.log('Print QR code:', item.qrCode.publicCode);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Main Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      {/* Item Name */}
      <View style={styles.section}>
        <Text style={styles.itemName}>{item.name}</Text>
      </View>

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Linked QR Code Section */}
      <View style={styles.section}>
        <View style={styles.qrHeader}>
          <Text style={styles.sectionLabel}>Linked QR Code</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        <View style={styles.qrContainer}>
          {/* QR Code Image/Icon */}
          <View style={styles.qrCodeBox}>
            <Ionicons name="qr-code" size={60} color="#0ea5e9" />
          </View>

          {/* QR Details */}
          <View style={styles.qrDetails}>
            <Text style={styles.qrLabel}>UNIQUE ID</Text>
            <Text style={styles.qrCode}>{item.qrCode.publicCode}</Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Ionicons name="share-social" size={16} color="#0ea5e9" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handlePrint}>
                <Ionicons name="print" size={16} color="#6b7280" />
                <Text style={styles.actionButtonText}>Print</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Last Updated */}
      <View style={styles.lastUpdatedContainer}>
        <Ionicons name="time-outline" size={16} color="#6b7280" />
        <Text style={styles.lastUpdated}>
          Last Updated: {formatDate(item.updatedAt || item.createdAt)}
        </Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Ionicons name="create-outline" size={20} color="#374151" />
        <Text style={styles.editButtonText}>Edit Item Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ItemDetail;