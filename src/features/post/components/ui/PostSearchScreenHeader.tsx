import { PostFiltersComponent } from '@/src/features/post/components';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

const PostSearchScreenHeader = () => {
  const [filters, setFilters] = useState({});

  const handleBackPress = React.useCallback(() => {
    router.back();
  }, []);

  return (
    <View className="flex-row items-center border-2">
      {/* Back button */}
      <View>
        <Pressable onPress={handleBackPress}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </Pressable>
      </View>

      <View className="flex-1">
        <PostFiltersComponent filters={filters} onFiltersChange={setFilters} />
      </View>
    </View>
  )
}

export default PostSearchScreenHeader
