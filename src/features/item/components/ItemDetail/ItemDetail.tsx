import { colors } from '@/src/shared/theme';
import { useRouter } from 'expo-router';
import { Clock, Pencil, Printer, QrCode, ShareNetwork } from 'phosphor-react-native';
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
            <QrCode size={60} color={colors.sky[500]} />
          </View>

          {/* QR Details */}
          <View style={styles.qrDetails}>
            <Text style={styles.qrLabel}>UNIQUE ID</Text>
            <Text style={styles.qrCode}>{item.qrCode.publicCode}</Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <ShareNetwork size={16} color={colors.sky[500]} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handlePrint}>
                <Printer size={16} color={colors.slate[500]} />
                <Text style={styles.actionButtonText}>Print</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Last Updated */}
      <View style={styles.lastUpdatedContainer}>
        <Clock size={16} color={colors.slate[500]} />
        <Text style={styles.lastUpdated}>
          Last Updated: {formatDate(item.updatedAt || item.createdAt)}
        </Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Pencil size={20} color={colors.slate[700]} />
        <Text style={styles.editButtonText}>Edit Item Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ItemDetail;