import React from 'react'
import { Image, Text, View } from 'react-native'
import { Post, PostType } from '@/src/features/post/types'

interface PostComparisonCardProps {
  post: Post
}

export const PostComparisonCard = ({ post }: PostComparisonCardProps) => {
  const isLost = post.postType === PostType.Lost
  const badgeColor = isLost ? 'bg-orange-100' : 'bg-green-100'
  const badgeTextColor = isLost ? 'text-orange-600' : 'text-green-600'
  const badgeText = isLost ? 'LOST' : 'FOUND'

  return (
    <View className="bg-white rounded-2xl p-4 flex-1">
      <View className={`${badgeColor} self-start px-3 py-1 rounded-full`}>
        <Text className={`${badgeTextColor} text-xs font-semibold`}>{badgeText}</Text>
      </View>

      {post.imageUrls.length > 0 && (
        <View className="mt-3 rounded-xl overflow-hidden bg-slate-100 aspect-square">
          <Image
            source={{ uri: post.imageUrls[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}

      <Text className="text-slate-900 font-semibold text-base mt-3" numberOfLines={2}>
        {post.itemName}
      </Text>

      <Text className="text-slate-500 text-sm mt-1" numberOfLines={2}>
        {post.description || 'No description'}
      </Text>
    </View>
  )
}
