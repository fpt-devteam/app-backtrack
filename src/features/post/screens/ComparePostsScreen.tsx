import { AppHeader, AppInlineError, AppLoader } from '@/src/shared/components'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { PostComparisonCard } from '../components/cards'
import { MatchedAttributesSection } from '../components/ui'
import { useGetPostById } from '../hooks'

interface ComparePostsScreenProps {
  postId: string
  otherPostId: string
}

const ComparePostsScreen = ({ postId, otherPostId }: ComparePostsScreenProps) => {
  const {
    data: post1,
    isLoading: isLoadingPost1,
    error: errorPost1,
  } = useGetPostById({ postId })

  const {
    data: post2,
    isLoading: isLoadingPost2,
    error: errorPost2,
  } = useGetPostById({ postId: otherPostId })

  const isLoading = isLoadingPost1 || isLoadingPost2
  const hasError = errorPost1 || errorPost2

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-light">
        <AppHeader title="Compare Items" />
        <AppLoader />
      </View>
    )
  }

  if (hasError || !post1 || !post2) {
    return (
      <View className="flex-1 bg-background-light">
        <AppHeader title="Compare Items" />
        <AppInlineError message="Failed to load posts for comparison." />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background-light">
      <AppHeader title="Compare Items" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          {/* Comparison Cards */}
          <View className="flex-row gap-3 mb-4">
            <PostComparisonCard post={post1} />
            <PostComparisonCard post={post2} />
          </View>

          {/* Matched Attributes */}
          <MatchedAttributesSection post1={post1} post2={post2} />
        </View>
      </ScrollView>
    </View>
  )
}

export default ComparePostsScreen
