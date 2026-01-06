import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  contentContainer: { paddingBottom: 40 },
  imageContainer: {
    width: width,
    height: width * 0.9,
    position: 'relative',
    backgroundColor: '#fff',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    // Chỉ bo góc phía dưới để tạo hiệu ứng tràn viền bên trên
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerButtonsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30, // Điều chỉnh theo status bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Mờ nhẹ để nổi bật trên ảnh
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  contentWrapper: { paddingHorizontal: 24, marginTop: 24 },
  itemName: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 10 },
  description: { fontSize: 15, color: '#6b7280', lineHeight: 22 },
  qrHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '700', color: '#16a34a' },
  qrRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    padding: 16, 
    borderRadius: 20,
    marginBottom: 16 
  },
  qrInfo: { flex: 1 },
  qrLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', marginBottom: 4 },
  qrValue: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  viewQrButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  viewQrText: { fontSize: 13, fontWeight: '600', color: '#475569', marginLeft: 6 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#9ca3af', marginLeft: 6, fontWeight: '500' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 10,
  },
  editBtnText: { fontSize: 16, fontWeight: '700', color: '#374151', marginLeft: 10 },
});