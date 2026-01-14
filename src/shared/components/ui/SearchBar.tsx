import React from 'react'
import { Text, View } from 'react-native'

type SearchBarProps = {
  placeholder: string
  icon: React.ReactNode

  onAutoComplete: (query: string) => void
  onCompleteSelection: (placeId: string) => void
  
  globalStoreKey: string
}

const SearchBar = () => {
  return (
    <View>
      <Text>SearchBar</Text>
    </View>
  )
}

export default SearchBar