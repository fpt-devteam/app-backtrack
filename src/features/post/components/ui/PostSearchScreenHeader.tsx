import { PostFiltersComponent } from '@/src/features/post/components';
import { router } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
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
          <ArrowLeft size={24} color="black" />
        </Pressable>
      </View>

      <View className="flex-1">
        <PostFiltersComponent filters={filters} onFiltersChange={setFilters} />
      </View>
    </View>
  )
}

export default PostSearchScreenHeader
