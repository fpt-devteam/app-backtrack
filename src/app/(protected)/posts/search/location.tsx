import { LocationMarker, LocationRadiusBottomSheet } from '@/src/features/location/components'
import { useUserLocation } from '@/src/features/location/hooks'
import { useLocationSelectionStore } from '@/src/features/location/store'
import { AppHeader } from '@/src/shared/components'
import { ANIMATE_TO_DURATION, DEFAULT_LOCATION, POST_ROUTE } from '@/src/shared/constants'
import { colors } from '@/src/shared/theme'
import { ensureLocationPermission } from '@/src/shared/utils'
import { router } from 'expo-router'
import { CrosshairIcon, MagnifyingGlassIcon, TargetIcon } from 'phosphor-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native'
import type { LatLng, Region } from 'react-native-maps'
import MapView, { Circle } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TARGET_RADIUS_DEFAULT_KM = 5
const RADIUS_ANIMATION_MS = 300
const RADIUS_SCREEN_PADDING = 1.3
const METERS_PER_LATITUDE_DEGREE = 111_320
const DEFAULT_DELTA = 0.01

type MapLayout = { width: number; height: number }

const getRegionForRadius = (
  latitude: number,
  longitude: number,
  radiusKm: number,
  mapLayout?: MapLayout
): Region => {
  const radiusMeters = radiusKm * 1000
  const latitudeRadians = (latitude * Math.PI) / 180
  const safeCos = Math.max(Math.cos(latitudeRadians), 0.01)
  const latitudeDeltaBase =
    (radiusMeters * 2 * RADIUS_SCREEN_PADDING) / METERS_PER_LATITUDE_DEGREE
  const longitudeDeltaBase =
    (radiusMeters * 2 * RADIUS_SCREEN_PADDING) / (METERS_PER_LATITUDE_DEGREE * safeCos)
  let latitudeDelta = latitudeDeltaBase
  let longitudeDelta = longitudeDeltaBase
  if (mapLayout && mapLayout.width > 0 && mapLayout.height > 0) {
    const aspectRatio = mapLayout.width / mapLayout.height
    latitudeDelta = Math.max(latitudeDeltaBase, longitudeDeltaBase / aspectRatio)
    longitudeDelta = latitudeDelta * aspectRatio
  }
  return {
    latitude,
    longitude,
    latitudeDelta: Number.isFinite(latitudeDelta) ? latitudeDelta : DEFAULT_DELTA,
    longitudeDelta: Number.isFinite(longitudeDelta) ? longitudeDelta : DEFAULT_DELTA,
  }
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const LocationSearchScreen = () => {
  const insets = useSafeAreaInsets()
  const mapRef = useRef<MapView>(null)

  const { getUserLocation, loadingUserLocation, error } = useUserLocation();
  const { takeSelection, selection, setSelection } = useLocationSelectionStore();

  const [mapLayout, setMapLayout] = useState<MapLayout>({ width: 0, height: 0 })

  const initialRadius = TARGET_RADIUS_DEFAULT_KM

  const [openRadiusSheet, setOpenRadiusSheet] = useState(false)
  const [localRadiusKm, setLocalRadiusKm] = useState(initialRadius)

  const initialLocation: LatLng = DEFAULT_LOCATION
  const [localLocation, setLocalLocation] = useState<LatLng>(initialLocation)

  const animatedRadius = useRef(new Animated.Value(initialRadius * 1000)).current
  const prevRadiusRef = useRef(localRadiusKm)

  useEffect(() => {
    console.log("Selection changed:", selection);
    if (selection) {
      setLocalLocation(selection.location);
      if (selection.radiusKm) {
        setLocalRadiusKm(selection.radiusKm);
      }
    }
  }, [selection])

  const handleSelectLocation = () => {
    console.log("takeSelection", takeSelection());
    router.back();
  }

  useEffect(() => {
    const radiusChanged = prevRadiusRef.current !== localRadiusKm
    prevRadiusRef.current = localRadiusKm

    const duration = radiusChanged ? RADIUS_ANIMATION_MS : ANIMATE_TO_DURATION
    const delay = radiusChanged ? 0 : 200

    const t = setTimeout(() => {
      const region = getRegionForRadius(
        localLocation.latitude,
        localLocation.longitude,
        localRadiusKm,
        mapLayout
      )
      mapRef.current?.animateToRegion(region, duration)
    }, delay)

    return () => clearTimeout(t)
  }, [localLocation, localRadiusKm, mapLayout])

  useEffect(() => {
    Animated.timing(animatedRadius, {
      toValue: localRadiusKm * 1000,
      duration: RADIUS_ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()
  }, [animatedRadius, localRadiusKm])

  const onGetCurrentPosition = async () => {
    const hasPermission = await ensureLocationPermission();
    if (!hasPermission) return;

    const userLocation = await getUserLocation();
    if (!userLocation) return;

    setSelection({ location: userLocation });
  }

  const openSheet = () => setOpenRadiusSheet(true)

  const closeSheet = () => setOpenRadiusSheet(false)

  const onRadiusChange = (newRadius: number) => {
    const next = {
      location: selection?.location || localLocation,
      radiusKm: newRadius
    }

    setSelection(next)

    setLocalRadiusKm(newRadius);
    closeSheet();

    console.log('Radius change:', newRadius);
  }

  const onLocationChange = (coord: LatLng) => {
    const next = { ...selection, location: coord }
    setSelection(next)

    setLocalLocation(coord)
    console.log('Location change: ', coord)
  }

  const handleOpenSearch = () => router.push(POST_ROUTE.searchLocationInput)

  const isMapUtilDisable = loadingUserLocation || openRadiusSheet

  return (
    <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
      {/* Header */}
      <AppHeader
        title="Search Location"
        rightActionButton={(
          <TouchableOpacity
            onPress={handleOpenSearch}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white"
          >
            <MagnifyingGlassIcon size={20} color={colors.slate[700]} />
          </TouchableOpacity>
        )}
      />

      {/* Map View */}
      <View className="flex-1">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          onLayout={(event) => setMapLayout(event.nativeEvent.layout)}
          provider='google'
        >
          {localLocation && (
            <LocationMarker
              mapRef={mapRef}
              location={localLocation}
              onLocationChange={onLocationChange}
            />
          )}
        </MapView>
      </View>

      {/* Map Util */}
      <View className="absolute inset-0 z-10" pointerEvents="box-none">
        {/* Util buttons */}
        <View className="absolute right-4 flex-col items-center gap-4 bottom-28" pointerEvents="box-none">
          {/* Change radius */}
          <View className="h-12 w-12 bg-white rounded-lg">
            <TouchableOpacity
              onPress={openSheet}
              className="h-full w-full items-center justify-center"
              disabled={isMapUtilDisable}
            >
              <TargetIcon size={24} color={colors.black} />
            </TouchableOpacity>
          </View>

          {/* Get current position */}
          <View className="h-12 w-12 bg-white rounded-lg">
            <TouchableOpacity
              onPress={onGetCurrentPosition}
              disabled={isMapUtilDisable}
              className="h-full w-full items-center justify-center"
            >
              <CrosshairIcon size={24} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Radius Slider Bottom sheet */}
        <LocationRadiusBottomSheet
          isVisible={openRadiusSheet}
          onClose={closeSheet}
          radius={localRadiusKm}
          onRadiusChange={onRadiusChange}
        />
      </View>

      {/* Footer */}
      <View className="p-4 pb-0">
        <TouchableOpacity
          className="h-11 items-center justify-center rounded-sm bg-primary"
          onPress={handleSelectLocation}
        >
          <Text className="text-base font-semibold text-white">Select location</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LocationSearchScreen
