import { useAppUser } from '@/src/features/auth/providers/user.provider';
import PostDetails from '@/src/features/post/components/PostDetails';
import useGetPostById from '@/src/features/post/hooks/useGetPostById';
import { PostType } from '@/src/features/post/types';
import { router, useLocalSearchParams } from 'expo-router';
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Missing postId</Text>
    </View>
  );

  if (!isUserReady || isLoading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0ea5e9" />
      <Text style={{ marginTop: 10 }}>Loading...</Text>
    </View>
  );

  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ color: '#ef4444', textAlign: 'center' }}>{error.message}</Text>
    </View>
  );

  if (!data) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Item not found</Text>
    </View>
  );

  return (
    <View>
      {/* Image Carousel */}
      <View>
      </View>
      {/* Post Details */}
      <PostDetails post={data} />
      {/* Footer */}
      <View>
        <Button mode="contained" onPress={() => {
          console.log("Move to chat screen");
        }}>
          Start Chat with {data.postType === PostType.Lost ? 'Seeker' : 'Finder'}
        </Button>

        {!isOwner && <Button mode="contained" onPress={() => {
          router.push(`/posts/${postId}/matching`);
          console.log("Move to matching screen");
        }}>
          Start Matching
        </Button>}
      </View>
    </View>
  )
}

export default PostDetailScreen
