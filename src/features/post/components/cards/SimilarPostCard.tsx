import type { SimilarPost } from '@/src/features/post/types';
import { POST_ROUTE } from '@/src/shared/constants';
import { colors } from '@/src/shared/theme';
import { formatIsoDate } from '@/src/shared/utils';
import type { ExternalPathString, RelativePathString } from 'expo-router';
import { router } from 'expo-router';
import { MapPinIcon } from 'phosphor-react-native';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

type SimilarPostCardProps = {
  postId: string;
  matchPost: SimilarPost;
};

export const SimilarPostCardSkeleton = () => {
  return (
    <View className="flex-row bg-white rounded-lg shadow-md p-4">
      <Text>Loading...</Text>
    </View>
  );
};

export const SimilarPostCard = ({ postId, matchPost }: SimilarPostCardProps) => {
  if (!matchPost) return <SimilarPostCardSkeleton />;

  const imgUrl = matchPost.imageUrls?.[0];

  return (
    <Pressable
      onPress={() =>
        router.push(
          POST_ROUTE.detailMatch(postId, matchPost.id) as ExternalPathString | RelativePathString
        )
      }
      className="flex-row gap-3 bg-white rounded-2xl border border-slate-200 p-3"
    >
      <Image source={{ uri: imgUrl }} className="w-20 h-20 rounded-xl bg-slate-100" />

      <View className="flex-1 min-w-0">
        {/* Top row: title + match */}
        <View className="flex-row justify-between items-start">
          <Text className="text-lg font-semibold text-slate-900 flex-1 min-w-0" numberOfLines={1}>
            {matchPost.itemName}
          </Text>

          <View className="ml-2 flex-row items-center rounded-full bg-sky-50 px-3 py-1">
            <Text className="text-sm font-extrabold tracking-wide text-primary">
              {(matchPost.similarityScore * 100).toFixed(0)}% Match
            </Text>
          </View>
        </View>

        {/* Middle: meta rows */}
        <View className="mt-2 gap-1">
          <View className="flex-row items-center gap-2">
            <MapPinIcon size={16} color={colors.slate[500]} />
            <Text className="flex-1 min-w-0 text-[12px] text-slate-600" numberOfLines={1}>
              {matchPost.displayAddress}
            </Text>
          </View>

          {/* Tag time at bottom (pill) */}
          <View className="mt-2 self-start rounded-md bg-orange-50 px-3 py-1">
            <Text className="text-[12px] font-semibold text-orange-600">
              {matchPost.postType.toString()} {formatIsoDate(matchPost.eventTime)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
