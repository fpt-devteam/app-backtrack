import { GooglePlacesService } from '@/src/features/location/services/googlePlaces.service'
import { useLocationSelectionStore } from '@/src/features/location/store'
import type { PlaceDetails, UserLocation } from '@/src/features/location/types'
import { usePlaceAutocomplete } from '@/src/features/map/hooks'
import type { PlaceSuggestion } from '@/src/features/map/types'
import { SuggestRow } from '@/src/shared/components'
import { MAP_ROUTE } from '@/src/shared/constants'
import { useRecentSearch } from '@/src/shared/hooks'
import { colors } from '@/src/shared/theme'
import { router } from 'expo-router'
import { ArrowLeftIcon, ClockIcon, MagnifyingGlassIcon, MapPinIcon, XCircleIcon } from 'phosphor-react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Animated, Easing, FlatList, Keyboard, Pressable, Text, TextInput, View } from 'react-native'

type DisplayMode = 'recent' | 'suggestions'

const MapSearchOptions = {
  searchBarPlaceholder: 'Search location...',

  searchRecentParams: {
    namespace: "map-search",
    maxItems: 10,
  },
}

export const MapSearchAutocompleteScreen = () => {
  const inputRef = useRef<TextInput>(null)
  const fade = useRef(new Animated.Value(1)).current
  const slide = useRef(new Animated.Value(0)).current
  const prevDisplayModeRef = useRef<DisplayMode>('recent')

  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isResolving, setIsResolving] = useState(false)

  const { items: recentItems, add, remove, clear } = useRecentSearch(MapSearchOptions.searchRecentParams)
  const { selection, onChangeSelection } = useLocationSelectionStore()

  const displayMode: DisplayMode = !isFocused || searchQuery.trim().length === 0 ? 'recent' : 'suggestions'

  const { loading, suggestions, error } = usePlaceAutocomplete({
    searchQuery,
    enabled: displayMode === 'suggestions',
  })

  const handleSelectPlace = (details: PlaceDetails, label: string) => {
    const data: UserLocation = {
      ...selection,
      location: details.location,
      displayAddress: label,
      externalPlaceId: details.placeId,
    }

    onChangeSelection(data)
    handleBack()
  }

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    }
    else {
      router.replace(MAP_ROUTE.index)
      console.log("Can not go back, replacing to map index")
    }
  }

  const runSwapAnimation = () => {
    fade.setValue(0)
    slide.setValue(8)

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start()
  }

  useEffect(() => {
    if (prevDisplayModeRef.current !== displayMode) {
      runSwapAnimation()
      prevDisplayModeRef.current = displayMode
    }
  }, [displayMode])

  const handleSelectSuggestion = async (suggestion: PlaceSuggestion) => {
    if (isResolving) return
    setIsResolving(true)

    try {
      const details = await GooglePlacesService.getPlaceDetails(suggestion.placeId)
      if (!details) return

      const label = details.formattedAddress || suggestion.description || details.name

      await add(label)

      setSearchQuery(label)

      setIsFocused(false)
      inputRef.current?.blur()
      Keyboard.dismiss()

      try {
        handleSelectPlace(details, label)
      } catch (e) {
        console.warn('[MapSearch] handleSelectPlace failed:', e)
      }
    } catch (e) {
      console.warn('[MapSearch] handleSelectSuggestion failed:', e)
    } finally {
      setIsResolving(false)
    }
  }

  const handleSelectRecent = (value: string) => {
    setSearchQuery(value)
    setIsFocused(true)
    inputRef.current?.focus()
  }

  const handleSubmit = () => {
    if (displayMode !== 'suggestions') return

    const first = suggestions[0]
    if (!first) return

    handleSelectSuggestion(first)
  }

  const renderSuggestionList = () => {
    return (
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.placeId}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          loading ? (
            <View className="flex-row items-center gap-2 p-3">
              <ActivityIndicator size="small" color={colors.blue[600]} />
              <Text className="text-sm text-gray-600">Loading...</Text>
            </View>
          ) : (
            <View className="p-3">
              <Text className="text-sm text-gray-500">
                {error ? "Failed to load suggestions." : "No suggestions."}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          loading && suggestions.length > 0 ? (
            <View className="flex-row items-center gap-2 p-3">
              <ActivityIndicator size="small" color={colors.blue[600]} />
              <Text className="text-sm text-gray-600">Loading...</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <SuggestRow
            IconComponent={MapPinIcon}
            text={item.description}
            onPress={() => void handleSelectSuggestion(item)}
          />
        )}
      />
    )
  }

  const renderRecentList = () => {
    return (
      <FlatList
        data={recentItems}
        keyExtractor={(item) => item.value}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View className="">
            <Text className="text-sm text-gray-500">No recent searches.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SuggestRow
            IconComponent={ClockIcon}
            text={item.value}
            onPress={() => handleSelectRecent(item.value)}
            onRemove={() => void remove(item.value)}
          />
        )}
      />
    )
  }

  const displayTitle = useMemo(() => displayMode === 'suggestions' ? 'Suggestions' : 'Recent', [displayMode])

  return (
    <View className="flex-1 bg-white px-4">
      <View className="flex-row items-center">
        <Pressable
          onPress={handleBack}
          hitSlop={10}
          className="mr-2 h-12 w-12 items-center justify-center rounded-2xl"
          style={{ borderColor: colors.slate[200] }}
        >
          <ArrowLeftIcon size={24} color={colors.slate[700]} />
        </Pressable>
        <View
          className="flex-1 flex-row items-center border-2 rounded-2xl px-3 h-12"
          style={{ borderColor: isFocused ? colors.primary : colors.slate[200] }}
        >
          <MagnifyingGlassIcon size={20} color={colors.slate[500]} />

          <TextInput
            ref={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={MapSearchOptions.searchBarPlaceholder}
            returnKeyType="search"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleSubmit}
            className="flex-1 ml-2 p-0 text-base"
            placeholderTextColor={colors.slate[400]}
          />

          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => {
                setSearchQuery("")
                inputRef.current?.focus()
              }}
              hitSlop={10}
            >
              <XCircleIcon size={20} color={colors.slate[400]} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View className="mt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold">{displayTitle}</Text>
          {displayMode === 'recent' && recentItems.length > 0 ? (
            <Pressable onPress={() => void clear()} hitSlop={10}>
              <Text className="text-primary font-semibold">Clear</Text>
            </Pressable>
          ) : null}
        </View>

        <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
          <View className="mt-3 max-h-[300px]">
            {displayMode === 'recent' ? renderRecentList() : renderSuggestionList()}
          </View>
        </Animated.View>
      </View>
    </View>
  )
}

