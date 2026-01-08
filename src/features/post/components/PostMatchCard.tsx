import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useMemo } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Post, SimilarPost } from '../types'

type PostMatchCardProps = {
  yourItem: Post
  matchedItem: SimilarPost
  matchPercent?: number
  matchedAgoLabel?: string
}

const PostMatchCard = ({
  yourItem,
  matchedItem,
  matchPercent = 95,
  matchedAgoLabel = '2 hrs ago',
}: PostMatchCardProps) => {
  const yourImage = yourItem?.imageUrls?.[0]
  const matchedImage = matchedItem?.imageUrls?.[0]

  const title = useMemo(() => {


    return matchedItem?.itemName || matchedItem?.description || 'Matched item'
  }, [matchedItem])

  const subtitle = useMemo(() => {


    const addr = matchedItem?.displayAddress || ''
    const shortDesc = (matchedItem?.description ?? '').trim()
    if (addr) return `Found at ${addr}.`
    if (shortDesc) return shortDesc.length > 70 ? shortDesc.slice(0, 70) + '…' : shortDesc
    return 'Found item'
  }, [matchedItem])

  return (
    <View
      className="w-full rounded-3xl bg-white p-4"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
      }}
    >
      {/* Top row */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 rounded-full bg-sky-50 px-3 py-1">
          <View className="h-5 w-5 items-center justify-center rounded-full bg-sky-100">
            <Ionicons name="sparkles" size={12} color="#0284C7" />
          </View>
          <Text className="text-xs font-extrabold tracking-wide text-sky-700">
            {(matchedItem.similarityScore * 100).toFixed(2)}% MATCH
          </Text>
        </View>

        <Text className="text-xs text-slate-400">{matchedAgoLabel}</Text>
      </View>

      {/* Images row */}
      <View className="relative mb-4 flex-row items-center justify-between">
        {/* Right image */}
        <View className="h-28 w-[48%] overflow-hidden rounded-2xl bg-slate-100">
          {!!matchedImage && (
            <Image source={{ uri: matchedImage }} className="h-full w-full" resizeMode="cover" />
          )}
          <View className="absolute bottom-2 left-2 rounded-full bg-black/35 px-2 py-1">
            <Text className="text-[10px] font-bold text-white">FOUND ITEM</Text>
          </View>

          <View className="absolute bottom-0 left-0 right-0 h-8 bg-sky-400/20" />
        </View>
      </View>

      {/* Title + subtitle */}
      <Text className="text-base font-extrabold text-slate-900" numberOfLines={1}>
        {title}
      </Text>

      <Text className="mt-1 text-sm text-slate-500" numberOfLines={2}>
        {subtitle}
      </Text>

      {/* CTA */}
      <TouchableOpacity
        onPress={() => router.push(`/posts/${yourItem.id}/matching/${matchedItem.id}`)}
        className="mt-4 flex-row items-center justify-center rounded-full border border-slate-200 bg-white py-3"
        activeOpacity={0.85}
      >
        <Text className="mr-2 text-sm font-semibold text-slate-700">View Comparison</Text>
        <Ionicons name="arrow-forward" size={16} color="#334155" />
      </TouchableOpacity>
    </View>
  )
}

export default PostMatchCard
