import ItemInfinityScrollView from '@/src/features/item/components/ItemInfinityScrollView/ItemInfinityScrollView';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ItemScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ItemInfinityScrollView />
      </View>

      <View style={{ padding: 16, gap: 16, borderTopWidth: 1, borderTopColor: '#e0e0e0', backgroundColor: '#fff' }}>
        <TouchableOpacity onPress={() => router.push('/(qr)/item-link')} >
          <Text>Generate QR Code</Text>
        </TouchableOpacity >

        <TouchableOpacity onPress={() => router.push('/(qr)/item-link')} >
          <Text>Link Item to QR Code</Text>
        </TouchableOpacity >
      </View>
    </View >
  )
}

export default ItemScreen
