import { PostDetails } from '@/src/features/post/components';
import { useGetPostById } from '@/src/features/post/hooks';
import { AppHeader, AppInlineError, AppSplashScreen, BackButton } from '@/src/shared/components';
import { getRandomAvatarUrl } from '@/src/shared/mocks/avatar.mock';
import { timeSincePast } from '@/src/shared/utils';
import { useLocalSearchParams } from "expo-router";
import React from 'react';
import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PostDetailHeader = ({ avatarUrl, authorName, createdAt }: { avatarUrl: string; authorName: string; createdAt: Date }) => {
  return (
    <AppHeader
      left={
        <View className="flex-row items-center gap-4">
          <BackButton />
          <View className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-base font-extrabold text-main w-40" numberOfLines={1}>
              {authorName}
            </Text>
            <Text className="text-xs text-sub" numberOfLines={1}>
              {timeSincePast(createdAt)}
            </Text>
          </View>
        </View>
      }
    />
  )
};
export const PostDetailScreen = () => {
  const params = useLocalSearchParams<{ postId: string }>();
  const postId = params.postId;
  const { top } = useSafeAreaInsets();

  const { data: post, isLoading, error } = useGetPostById({ postId });
  if (isLoading) return <AppSplashScreen />;
  if (error || !postId || !post) return <AppInlineError message="Failed to load post details." />;

  const authorName = post.author?.displayName?.trim() || "Anonymous";
  const avatarUrl = post.author?.avatarUrl || getRandomAvatarUrl();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <PostDetailHeader
        avatarUrl={avatarUrl}
        authorName={authorName}
        createdAt={post.createdAt}
      />
      < PostDetails postId={post.id} />
    </View>
  )
}