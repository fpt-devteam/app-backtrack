import ItemInfinityScrollView from '@/src/features/item/components/ItemInfinityScrollView/ItemInfinityScrollView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ItemScreen = () => {
  const insets = useSafeAreaInsets();

  const BOTTOM_BAR_HEIGHT = 64;

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
      {/* The FlatList renders its own header (ListHeaderComponent) to avoid nesting a ScrollView */}
      <ItemInfinityScrollView />

      {/* Bottom Buttons */}
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + 12,
          left: 16,
          right: 16,
          height: BOTTOM_BAR_HEIGHT,
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push('/(qr)/item-create')}
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 32,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            borderWidth: 1,
            borderColor: '#ddd',
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={20} color="#2979ff" />
          <Text style={{ fontWeight: '600' }}>Digital QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(qr)/item-link')}
          style={{
            flex: 1,
            backgroundColor: '#2979ff',
            borderRadius: 32,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="qr-code-outline" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '600' }}>Scan to Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemScreen;
