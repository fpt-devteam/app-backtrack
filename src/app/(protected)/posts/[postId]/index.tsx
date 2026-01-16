import { PostDetails } from '@/src/features/post/components/ui';
import { useGetPostById } from '@/src/features/post/hooks';
import { AppHeader } from '@/src/shared/components';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

const PostDetailScreen = () => {
  const params = useLocalSearchParams<{ postId?: string | string[] }>();
  const postId = Array.isArray(params.postId) ? params.postId[0] : params.postId;

  const { data, isLoading, error } = useGetPostById({ postId: postId! });

  if (!postId) return (
    <View className="flex-1 justify-center items-center">
      <Text>Missing postId</Text>
    </View>
  );

  if (isLoading) return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#0ea5e9" />
      <Text className="mt-2.5">Loading...</Text>
    </View>
  );

  if (error) return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className="text-red-500 text-center">{error.message}</Text>
    </View>
  );

  if (!data) return (
    <View className="flex-1 justify-center items-center">
      <Text>Item not found</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 mb-20">
      {/* Header  */}
      <View>
        <AppHeader title="Post Details" showBackButton />
      </View>

      {/* Post Details */}
      <View>
        <PostDetails postId={data.id} />
      </View>
    </ScrollView>
  )
}

export default PostDetailScreen
