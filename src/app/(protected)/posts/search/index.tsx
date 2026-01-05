import { PostSearchScreen, PostSearchScreenHeader } from '@/src/features/post/components'
import React from 'react'
import { View } from 'react-native'

const SearchScreen = () => {
  return (
    <View>
      <PostSearchScreenHeader />
      <PostSearchScreen />
    </View>
  )
}

export default SearchScreen
