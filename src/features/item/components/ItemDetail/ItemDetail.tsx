import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

interface ItemDetailProps {
  data: {
    item: {
      id: string;
      name: string;
      description: string;
      imageUrls: string[];
      createdAt: string;
      updatedAt: string | null;
    };
    qrCode: {
      id: string;
      publicCode: string;
      linkedAt: string;
      createdAt: string; //
    };
  };
}

const ItemDetail = ({ data }: ItemDetailProps) => {
  const router = useRouter();
  const { item, qrCode } = data;

  const imageUrl = item?.imageUrls && item.imageUrls.length > 0 
    ? item.imageUrls[0] 
    : 'https://via.placeholder.com/400';

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + `, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
     
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
       
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.mainImage} resizeMode="cover" />
          
         
          <View style={styles.headerButtonsContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          <Text style={styles.itemName}>{item?.name}</Text>

      
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>{item?.description}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.qrHeader}>
              <Text style={styles.sectionLabel}>Linked QR Code</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>

            <View style={styles.qrRow}>
              <View style={styles.qrInfo}>
                <Text style={styles.qrLabel}>UNIQUE ID</Text>
                <Text style={styles.qrValue}>{qrCode?.publicCode}</Text>
              </View>
              
            
              <TouchableOpacity 
  style={styles.viewQrButton}
  onPress={() => {
    
    if (qrCode?.publicCode && item?.name) {
      router.push({
        pathname: "/(protected)/(qr)/download-qr",
        params: { 
          code: qrCode.publicCode, 
          name: item.name 
        }
      });
    }
  }}
>
  <Ionicons name="qr-code-outline" size={18} color="#4b5563" />
  <Text style={styles.viewQrText}>View QR</Text>
</TouchableOpacity>
            </View>

            
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={16} color="#9ca3af" />
              <Text style={styles.timeText}>
                Last Updated: {formatDate(item?.updatedAt || qrCode?.linkedAt || qrCode?.createdAt)}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => router.push(`/(protected)/(qr)/edit-item/${item?.id}`)}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#374151" />
            <Text style={styles.editBtnText}>Edit Item Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ItemDetail;