import { PostStatusBadge } from '@/src/features/post/components/badges';
import type { Post } from '@/src/features/post/types';
import { POST_ROUTE } from '@/src/shared/constants';
import { formatIsoDate } from '@/src/shared/utils';
import type { ExternalPathString, RelativePathString } from 'expo-router';
import { router } from 'expo-router';
import { ClockIcon, MapPinIcon } from 'phosphor-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type MinimalPostCardProps = {
  post: Post
}

const MinimalPostCard = ({ post }: MinimalPostCardProps) => {
  const imgUrl = post.imageUrls?.[0];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(POST_ROUTE.details(post.id) as ExternalPathString | RelativePathString)}
      className="flex-row gap-3 bg-white rounded-2xl border border-slate-200 p-3"
    >
      <Image source={{ uri: imgUrl }} className="w-20 h-20 rounded-xl bg-slate-100" />

      <View className="flex-1 min-w-0 gap-2">
        <View className="flex-row justify-between items-start">
          <Text className="w-[70%] text-lg font-semibold text-slate-900" numberOfLines={1}>
            {post.itemName}
          </Text>

          <PostStatusBadge status={post.postType} />
        </View>

        <View className="flex-col justify-between gap-1">
          <View className="flex-row items-center gap-2">
            <MapPinIcon size={16} color="#64748B" />
            <Text
              className="flex-1 min-w-0 text-[12px] text-slate-600"
              numberOfLines={1}
            >
              {post.displayAddress}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <ClockIcon size={16} color="#64748B" />
            <Text
              className="flex-1 min-w-0 text-[12px] text-slate-600"
              numberOfLines={1}
            >
              {formatIsoDate(post.eventTime)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default MinimalPostCard
