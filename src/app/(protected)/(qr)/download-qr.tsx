import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';

const { width } = Dimensions.get('window');

const DownloadQRScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const viewShotRef = useRef<any>(null);

  // Lấy dữ liệu truyền từ trang Detail
  const publicCode = params.code as string;
  const itemName = params.name as string;

  const handleDownload = async () => {
    // Xin quyền truy cập thư viện ảnh
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Required", "Please allow access to your photos to download the QR code.");
      return;
    }

    try {
      // Chụp vùng ViewShot và lưu thành file
      const uri = await viewShotRef.current.capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "QR Code has been saved to your gallery!");
    } catch (error) {
      Alert.alert("Error", "Failed to save QR Code.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          QR for {itemName || "Item"}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Vùng sẽ được chụp lại để tải về */}
        <ViewShot 
          ref={viewShotRef} 
          options={{ format: "jpg", quality: 1.0 }}
          style={styles.captureContainer}
        >
          <View style={styles.qrWrapper}>
            <View style={styles.qrBackground}>
              <QRCode
                value={publicCode || "N/A"}
                size={width * 0.45}
                color="black"
                backgroundColor="white"
                quietZone={10}
              />
            </View>
          </View>
        </ViewShot>

        <Text style={styles.uniqueIdText}>Unique ID: {publicCode}</Text>
      </View>

      {/* Nút Download ở dưới cùng */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.downloadText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  captureContainer: {
    padding: 20,
    backgroundColor: '#F9FAFB', // Màu nền ảnh khi tải về
  },
  qrWrapper: {
    width: width * 0.75,
    height: width * 0.75,
    backgroundColor: '#fff',
    borderRadius: 40, // Bo góc khung QR theo thiết kế
    justifyContent: 'center',
    alignItems: 'center',
    // Đổ bóng cho khung QR
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  qrBackground: {
    padding: 15,
    backgroundColor: '#2DD4BF', // Màu xanh nền của QR theo thiết kế
    borderRadius: 20,
  },
  uniqueIdText: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#0EA5E9', // Màu nút download xanh dương
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DownloadQRScreen;