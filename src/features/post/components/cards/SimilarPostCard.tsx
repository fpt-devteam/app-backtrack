import { SimilarPost } from '@/src/features/post/types'
import { POST_ROUTE } from '@/src/shared/constants'
import { COLORS } from '@/src/shared/theme'
import { formatIsoDate } from '@/src/shared/utils'
import { ExternalPathString, RelativePathString, router } from 'expo-router'
import { Clock, MapPin } from 'phosphor-react-native'
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'

type SimilarPostCardProps = {
  postId: string
  matchPost: SimilarPost
}

const SimilarPostCardSkeleton = () => {
  return (
    <View className='flex-row bg-white rounded-lg shadow-md p-4'>
      <Text>Loading...</Text>
    </View>
  )
}

const SimilarPostCard = ({ postId, matchPost }: SimilarPostCardProps) => {
  if (!matchPost) return <SimilarPostCardSkeleton />;
  const imgUrl = matchPost.imageUrls?.[0];

  return (
    <Pressable
      onPress={() => router.push(POST_ROUTE.detailMatch(postId, matchPost.id) as ExternalPathString | RelativePathString)}
      className="flex-row gap-3 bg-white rounded-2xl border border-slate-200 p-3"
    >
      <Image source={{ uri: imgUrl }} className="w-20 h-20 rounded-xl bg-slate-100" />

      <View className="flex-1 min-w-0 gap-2">
        <View className="flex-row justify-between items-start">
          <Text className="text-lg font-semibold text-slate-900" numberOfLines={1}>
            {matchPost.itemName}
          </Text>

          <View className="flex-row items-center gap-2 rounded-full bg-sky-50 px-3 py-1">
            <Text className="text-sm font-extrabold tracking-wide text-primary">
              {(matchPost.similarityScore * 100).toFixed(0)}% Match
            </Text>
          </View>
        </View>

        <View className="flex-col justify-between gap-1">
          <View className="flex-row items-center gap-2">
            <MapPin size={16} color={COLORS.slate[500]} />
            <Text
              className="flex-1 min-w-0 text-[12px] text-slate-600"
              numberOfLines={1}
            >
              {matchPost.displayAddress}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Clock size={16} color={COLORS.slate[500]} />
            <Text
              className="flex-1 min-w-0 text-[12px] text-slate-600"
              numberOfLines={1}
            >
              {formatIsoDate(matchPost.eventTime)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default SimilarPostCard
