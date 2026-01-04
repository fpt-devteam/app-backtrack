import { useAppUser } from '@/src/features/auth/providers/user.provider';
import PostDetails from '@/src/features/post/components/PostDetails';
import useGetPostById from '@/src/features/post/hooks/useGetPostById';
import { PostType } from '@/src/features/post/types';
import ImageCarousel from '@/src/shared/components/ui/ImageCarousel';
import { POST_ROUTE } from '@/src/shared/constants';
import { ExternalPathString, RelativePathString, router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

const PostDetailScreen = () => {
  const params = useLocalSearchParams<{ postId?: string | string[] }>();
  const postId = Array.isArray(params.postId) ? params.postId[0] : params.postId;

  const { data, isLoading, error } = useGetPostById({ postId: postId || "" });
  const { user, isUserReady } = useAppUser();

  console.log('data:', data);
  console.log('user:', user);

  const isOwner = useMemo(() => data?.authorId === user?.id, [data, user]);
  if (!postId) return (
    <View className="flex-1 justify-center items-center">
      <Text>Missing postId</Text>
    </View>
  );

  if (!isUserReady || isLoading) return (
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
    <View className="flex-1 bg-gray-50">
      {/* Image Carousel */}
      <View className="bg-white">
        <ImageCarousel
          data={data.imageUrls}
          showLoadingIndicator={true}
          autoScrollInterval={4000}
        />
      </View>

      {/* Post Details */}
      <PostDetails post={data} />

      {/* Footer */}
      <View className="p-4 bg-white border-t border-gray-200 gap-3">
        <Button mode="contained" onPress={() => {
          console.log("Move to chat screen");
        }}>
          Start Chat with {data.postType === PostType.Lost ? 'Seeker' : 'Finder'}
        </Button>

        {!isOwner && <Button mode="contained" onPress={() => {
          router.push(POST_ROUTE.matching(postId) as ExternalPathString | RelativePathString);
        }}>
          Start Matching
        </Button>}
      </View>
    </View>
  )
}

export default PostDetailScreen
