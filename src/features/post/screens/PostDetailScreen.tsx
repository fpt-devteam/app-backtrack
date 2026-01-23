import { PostDetails } from '@/src/features/post/components';
import { useGetPostById } from '@/src/features/post/hooks';
import { AppInlineError, AppSplashScreen } from '@/src/shared/components';
import { getRandomAvatarUrl } from '@/src/shared/mocks/avatar.mock';
import { timeSincePast } from '@/src/shared/utils/datetime.utils';
import { useLocalSearchParams } from "expo-router";
import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const PostDetailScreen = () => {
  const params = useLocalSearchParams<{ postId: string }>();
  const postId = params.postId;

  const { data: post, isLoading, error } = useGetPostById({ postId });
  if (isLoading) return <AppSplashScreen />;
  if (error || !postId || !post) return <AppInlineError message="Failed to load post details." />;

  const authorName = post.author?.displayName?.trim() || "Anonymous";
  const avatarUrl = post.author?.avatarUrl || getRandomAvatarUrl();


  return (
    <SafeAreaView>
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        {/* Avatar */}
        <View className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>

        <View className="flex-1 min-w-0 ml-3">
          <Text className="text-base font-extrabold text-slate-900" numberOfLines={1}>
            {authorName}
          </Text>
          <Text className="text-xs text-slate-500" numberOfLines={1}>
            {timeSincePast(post.createdAt)}
          </Text>
        </View>
      </View>
      < PostDetails postId={post.id} />
    </SafeAreaView>
  )
}