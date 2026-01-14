import { useLocationSelectionStore } from '@/src/features/location/store'
import ItemPlaceMarker from '@/src/features/map/components/ItemPlaceMarker'
import UserPlaceButton from '@/src/features/map/components/UserPlaceButton'
import UserPlaceMarker from '@/src/features/map/components/UserPlaceMarker'
import { PostDetails, PostHomeScreen } from '@/src/features/post/components'
import { usePosts } from '@/src/features/post/hooks'
import type { PostFilters } from '@/src/features/post/types'
import { BottomSheet } from '@/src/shared/components'
import { MAP_ROUTE } from '@/src/shared/constants'
import { useUIStore } from '@/src/shared/store/ui.store'
import colors from '@/src/shared/theme/colors'
import { router } from 'expo-router'
import { MagnifyingGlassIcon } from 'phosphor-react-native'
import type { ReactNode } from 'react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import type { LatLng, Region } from 'react-native-maps'
import MapView from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/**
 * minimalist: only show map and search bar + user location button
 * full: show map + search bar + user location button + bottom sheet with posts + post's markers 
 */
type MapMode = 'minimalist' | 'full'

type MapOptions = {
  mode?: MapMode
  searchBarPlaceholder?: string
}

const MapScreen = ({
  mode = 'full',
  searchBarPlaceholder = "Search location...",
}: MapOptions) => {
  const mapRef = useRef<MapView>(null)
  const bottomSheetElement = useRef<ReactNode>(null)

  const insets = useSafeAreaInsets()
  const { selection, onChangeSelection } = useLocationSelectionStore()
  const setBottomTabBarState = useUIStore((state) => state.setBottomTabBarState)
  const [sheetVisible, setSheetVisible] = useState(false)

  const searchDisplayText = useMemo(() => {
    if (!selection) return searchBarPlaceholder
    const displayText = selection ? selection.displayAddress : searchBarPlaceholder
    return displayText
  }, [selection, searchBarPlaceholder])

  const postParams = useMemo(() => {
    const nextFilter: PostFilters = {
      ...selection,
      location: selection?.location,
      radiusInKm: selection?.radiusKm,
    }
    return { filters: nextFilter }
  }, [selection])

  const handleOpenSheet = () => {
    setSheetVisible(false)
    setSheetVisible(true)
  }

  useEffect(() => {
    if (sheetVisible) {
      setBottomTabBarState('closed')
    }
    else {
      setBottomTabBarState('open')
    }

    return () => {
      setBottomTabBarState('open')
    }
  }, [sheetVisible])

  const { items } = usePosts(postParams)

  useEffect(() => {
    const coords = selection?.location
    if (!coords) return
    handleMoveMarker(coords)
  }, [selection])

  const onCoordinateChange = (coord: LatLng) => {
    const nextSelection = {
      ...selection,
      location: coord,
    }
    onChangeSelection(nextSelection)
  }

  const handleMoveMarker = (coord: LatLng, duration: number = 2000) => {
    if (!mapRef.current) return

    const newRegion: Region = {
      latitude: coord.latitude,
      longitude: coord.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }

    console.log("")
    mapRef.current.animateToRegion(newRegion, duration)
  }

  return (
    <View
      className="flex-1"
      style={{ paddingBottom: insets.bottom }}
    >
      {/* Map (base) */}
      <View style={{
        flex: 1,
        zIndex: 0
      }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
        >
          {selection && (
            <>
              <UserPlaceMarker
                coordinate={selection.location}
                disabled={false}
                radiusKm={selection.radiusKm}
                showRadius={mode === 'full'}
                onPress={() => {
                  handleOpenSheet()
                  bottomSheetElement.current = (
                    <View className="px-4" style={{ paddingBottom: insets.bottom }}>
                      <Text className="text-lg font-bold mb-4">Posts</Text>
                      <PostHomeScreen direction="horizontal" filters={postParams.filters} />
                    </View>
                  )
                }}
              />

              {items.map((item) => (
                <ItemPlaceMarker
                  key={item.id}
                  item={item}
                  coordinate={item.location}
                  disabled={false}
                  onPress={() => {
                    handleOpenSheet()
                    bottomSheetElement.current = <PostDetails postId={item.id} />
                  }}
                />
              ))}
            </>
          )}
        </MapView>
      </View>

      {/* SearchBar overlay */}
      <View
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          right: 16,
          zIndex: 10,
        }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => router.push(MAP_ROUTE.search)}
          activeOpacity={0.9}
          className="rounded-full p-4 flex-row items-center bg-white shadow-sm shadow-black/10"
        >
          <MagnifyingGlassIcon size={18} color={colors.slate[600]} />
          <Text className="flex-1 ml-4 text-sm text-slate-600" numberOfLines={1}>{searchDisplayText}</Text>
        </TouchableOpacity>
      </View>

      {/* FAB overlay */}
      <View
        style={{
          position: 'absolute',
          right: 16,
          bottom: 128,
          zIndex: 20,
        }}
        pointerEvents="box-none"
      >
        <UserPlaceButton disabled={false} onPress={onCoordinateChange} />
      </View>

      {/* BottomSheet overlay (topmost) */}
      <View
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 30,
        }}
        pointerEvents="box-none"
      >
        <BottomSheet
          isVisible={sheetVisible}
          onClose={() => setSheetVisible(false)}
        >
          {bottomSheetElement.current}
        </BottomSheet>
      </View>
    </View>
  )
}

export default MapScreen