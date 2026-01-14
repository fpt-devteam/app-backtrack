import { ComparePostsScreen } from '@/src/features/post/components'
import { AppInlineError } from '@/src/shared/components'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

const DetailCompareRoute = () => {
  const { postId, otherPostId } = useLocalSearchParams<{ postId: string; otherPostId: string }>()

  if (!postId || !otherPostId) {
    return <AppInlineError message="Invalid comparison parameters" />
  }

  return <ComparePostsScreen postId={postId} otherPostId={otherPostId} />
}

export default DetailCompareRoute
