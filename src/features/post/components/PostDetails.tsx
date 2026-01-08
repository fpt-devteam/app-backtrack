import { ImageCarousel } from '@/src/shared/components'
import { CHAT_ROUTE, POST_ROUTE } from '@/src/shared/constants'
import { formatIsoDate } from '@/src/shared/utils'
import { ExternalPathString, RelativePathString, router } from 'expo-router'
import React, { useEffect, useMemo, useRef } from 'react'
import { Animated, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { Icon } from 'react-native-paper'
import { useAppUser } from '../../auth/providers'
import { useCreateConversation } from '../../chat/hooks'
import { ConversationCreateRequest } from '../../chat/types'
import useGetPostById from '../hooks/useGetPostById'
import useMatchingPost from '../hooks/useMatchingPost'
import { PostType } from '../types'
import PostStatusBadge from './PostStatusBadge'
import SimilarPostCard from './SimilarPostCard'

type PostDetailsProps = {
  postId: string
}

const PostDetailsSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.45)).current

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ])
    )
    anim.start()
    return () => anim.stop()
  }, [opacity])

  const Skel = ({ className }: { className: string }) => (
    <Animated.View style={{ opacity }} className={`bg-slate-200 ${className}`} />
  )

  return (
    <View>
      <View className="m-4 bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
        {/* Header */}
        <View className="px-5 pt-5 pb-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-2">
              <Skel className="h-6 rounded-xl w-[85%]" />
              <Skel className="h-6 rounded-xl w-[55%]" />
            </View>
            <Skel className="h-7 w-20 rounded-full" />
          </View>

          <View className="mt-3 gap-2">
            <Skel className="h-3 rounded-lg w-[95%]" />
            <Skel className="h-3 rounded-lg w-[88%]" />
            <Skel className="h-3 rounded-lg w-[70%]" />
          </View>
        </View>

        <View className="h-[1px] bg-slate-900/5 mx-4" />

        {/* Info Section */}
        <View className="p-4 gap-4">
          {[0, 1, 2].map((i) => (
            <View key={i} className="flex-row gap-3 items-center">
              <Skel className="h-10 w-10 rounded-2xl" />
              <View className="flex-1 gap-2">
                <Skel className="h-3 w-32 rounded-lg" />
                <Skel className="h-4 w-[80%] rounded-lg" />
              </View>
            </View>
          ))}
        </View>

        {/* Map Section */}
        <View className="px-5 pb-5">
          <View className="rounded-2xl overflow-hidden border border-slate-200">
            <Skel className="h-40 w-full rounded-none" />
            <View className="absolute right-3 bottom-3">
              <Skel className="h-11 w-11 rounded-2xl" />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const PostDetails = ({ postId }: PostDetailsProps) => {
  const { isLoading, data: post } = useGetPostById({ postId })
  const { isMatching, similarPosts } = useMatchingPost(postId)

  const { createConversation, isCreatingConversation, error } = useCreateConversation();
  const { user, isUserReady } = useAppUser();

  const isOwner = useMemo(() => post?.authorId === user?.id, [post, user]);

  const handleCreateConversation = async () => {
    if (!post) return;

    const req = {
      partnerId: post.authorId,
      creatorKeyName: post.postType,
      partnerKeyName: post.postType === PostType.Lost ? PostType.Lost : PostType.Found,
    } as ConversationCreateRequest;

    try {
      const response = await createConversation(req);
      if (!response?.data) throw new Error("No conversation data returned");
      console.log("Create conversation response:", response);
      router.push(CHAT_ROUTE.message(response.data.conversationId) as ExternalPathString | RelativePathString);
    } catch (e) {
      console.log("Create conversation error:", e);
    }
  };

  const mapRef = useRef<MapView>(null)

  const region: Region | undefined = useMemo(() => {
    if (!post?.location) return undefined
    return {
      latitude: post.location.latitude,
      longitude: post.location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
  }, [post?.location])

  useEffect(() => {
    if (!region) return
    mapRef.current?.animateToRegion(region, 650)
  }, [region])

  if (isLoading || isMatching || !post) return <PostDetailsSkeleton />

  const eventTimeText = formatIsoDate(post.eventTime)

  const openInMaps = async () => {
    if (!post.location) return
    const { latitude, longitude } = post.location
    const label = encodeURIComponent(post.itemName || 'Location')
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${post.externalPlaceId ?? ''}&q=${label}`
    try {
      await Linking.openURL(url)
    } catch {
      // ignore
    }
  }

  return (
    <View>
      {/* Image Carousel */}
      <View className="bg-white">
        <ImageCarousel data={post.imageUrls} showLoadingIndicator={true} autoScrollInterval={4000} />
      </View>

      {/* Post Details */}
      <View className="m-4 bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
        {/* Header */}
        <View className="px-5 pt-5 pb-4">
          <View className="flex-row items-start justify-between gap-3">
            <Text className="flex-1 text-[22px] font-extrabold text-slate-900 leading-7" numberOfLines={2}>
              {post.itemName}
            </Text>
            <PostStatusBadge status={post.postType} />
          </View>

          {/* Description */}
          <Text className="mt-3 text-[13px] leading-[19px] text-slate-600" numberOfLines={3}>
            {post.description}
          </Text>
        </View>

        <View className="h-[1px] bg-slate-900/5 mx-4" />

        {/* Info Section */}
        <View className="p-4 gap-4">
          {/* Last seen location */}
          <View className="flex-row gap-3 items-start">
            <Icon source="map-marker-outline" size={32} color="#2563EB" />
            <View className="flex-1 justify-center">
              <Text className="text-sm text-slate-500 font-display">Last seen location</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text className="text-base mt-0.5">{post.displayAddress || 'N/A'}</Text>
              </ScrollView>
            </View>
          </View>

          {/* Distinctive marks */}
          <View className="flex-row gap-3 items-start">
            <Icon source="shape-outline" size={32} color="#2563EB" />
            <View className="flex-1 justify-center">
              <Text className="text-sm text-slate-500 font-display">Distinctive marks</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text className="text-base mt-0.5">{post.distinctiveMarks || 'N/A'}</Text>
              </ScrollView>
            </View>
          </View>

          {/* Event time */}
          <View className="flex-row gap-3 items-start">
            <Icon source="clock-outline" size={32} color="#2563EB" />
            <View className="flex-1 justify-center">
              <Text className="text-sm text-slate-500 font-display">Event time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text className="text-base mt-0.5">{eventTimeText}</Text>
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View className="px-5 pb-5">
          <View className="rounded-2xl overflow-hidden border border-blue-600/15 bg-blue-50">
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={{ height: 160 }}
              initialRegion={region}
              showsUserLocation
              showsMyLocationButton={false}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              {post.location && <Marker coordinate={post.location} />}
            </MapView>

            <TouchableOpacity
              onPress={openInMaps}
              className="absolute right-3 bottom-3 bg-white/95 rounded-2xl p-3 border border-slate-900/10"
            >
              <Icon source="map-outline" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="m-6 mt-0">
        <TouchableOpacity
          className="w-full bg-primary rounded-lg py-3 items-center justify-center"
          disabled={isCreatingConversation}
          onPress={handleCreateConversation}
        >
          <Text className="text-white"> Start Chat with {post.postType === PostType.Lost ? 'Seeker' : 'Finder'}</Text>
        </TouchableOpacity>

        {!isOwner &&
          <TouchableOpacity onPress={() => {
            router.push(POST_ROUTE.matching(postId) as ExternalPathString | RelativePathString);
          }}>
            Start Matching
          </TouchableOpacity>
        }
      </View>

      {/* Similar Posts */}
      {similarPosts && similarPosts.length > 0 && (
        <View className="mx-4 mb-6">
          <Text className="text-lg font-bold text-slate-900 mb-3">Similar Posts</Text>
          <ScrollView contentContainerStyle={{ gap: 12 }}>
            {similarPosts.map((item) => (<SimilarPostCard key={item.id} postId={post.id} matchPost={item} />))}
          </ScrollView>
        </View>
      )}
    </View>
  )
};

export default PostDetails;
