import { MatchedAttributesSection, PostComparisonCard } from '@/src/features/post/components'
import { useGetPostById } from '@/src/features/post/hooks'
import { AppHeader, AppInlineError, AppSplashScreen, CloseButton, HeaderTitle } from '@/src/shared/components'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ComparePostsScreenProps {
  postId: string
  otherPostId: string
}

export const ComparePostsScreen = ({ postId, otherPostId }: ComparePostsScreenProps) => {
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
    return <AppSplashScreen />
  }

  if (hasError || !post1 || !post2) {
    return (
      <View className="flex-1 bg-background-light">
        <AppHeader left={<CloseButton />} center={<HeaderTitle title="Compare Items" className="items-center" />} />
        <AppInlineError message="Failed to load posts for comparison." />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <AppHeader left={<CloseButton />} center={<HeaderTitle title="Compare Items" className="items-center" />} />
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
    </SafeAreaView>
  )
}
