import {
  ItemPlaceMarker,
  UserPlaceButton,
  UserPlaceMarker,
} from "@/src/features/map/components";
import { DEFAULT_RADIUS_KM } from "@/src/features/map/constants";
import { useReverseGeocoding, useUserLocation } from "@/src/features/map/hooks";
import { useLocationSelectionStore } from "@/src/features/map/store";
import { PostDetails, PostList } from "@/src/features/post/components";
import { usePosts } from "@/src/features/post/hooks";
import type { PostsFiltersOptions } from "@/src/features/post/hooks/usePosts";
import type { PostFilters } from "@/src/features/post/types";
import { BottomSheet } from "@/src/shared/components";
import { MAP_ROUTE } from "@/src/shared/constants";
import { useUIStore } from "@/src/shared/store/ui.store";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import type { ReactNode } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { LatLng, Region } from "react-native-maps";
import MapView from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const placeholder = "Search for a location";

export const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const setBottomTabBarState = useUIStore(
    (state) => state.setBottomTabBarState,
  );
  const [sheetVisible, setSheetVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { getUserLocation } = useUserLocation();

  const bottomSheetElement = useRef<ReactNode>(null);
  const { selection, onChangeSelection } = useLocationSelectionStore();
  const { reverseGeocode } = useReverseGeocoding();

  const searchDisplayText = useMemo(() => {
    if (!selection) return placeholder;

    const displayText = selection ? selection.displayAddress : placeholder;
    return displayText;
  }, [selection]);

  useEffect(() => {
    (async () => {
      const data = await getUserLocation();
      if (!data?.location) return;

      const initSelection = {
        ...data,
        radiusKm: DEFAULT_RADIUS_KM,
      };

      onChangeSelection(initSelection);
    })();
  }, [getUserLocation, onChangeSelection]);

  const postParams = useMemo(() => {
    if (!selection?.location || !selection?.radiusKm)
      return { enabled: false } as PostsFiltersOptions;

    const nextFilter: PostFilters = {
      location: selection?.location,
      radiusInKm: selection?.radiusKm,
    };
    return {
      filters: nextFilter,
      enabled: true,
    } as PostsFiltersOptions;
  }, [selection]);

  const { items } = usePosts(postParams);

  const handleOpenSheet = () => {
    setSheetVisible(false);
    setSheetVisible(true);
  };

  useEffect(() => {
    if (sheetVisible) {
      setBottomTabBarState("closed");
    } else {
      setBottomTabBarState("open");
    }

    return () => {
      setBottomTabBarState("open");
    };
  }, [sheetVisible, setBottomTabBarState]);

  useEffect(() => {
    const coords = selection?.location;
    if (!coords) return;
    handleMoveMarker(coords);
  }, [selection]);

  const onCoordinateChange = async (coord: LatLng) => {
    const geocodeResult = await reverseGeocode({ location: coord });

    const nextSelection = {
      ...selection,
      location: geocodeResult.location,
      displayAddress: geocodeResult?.formattedAddress ?? placeholder,
      externalPlaceId: geocodeResult?.placeId ?? selection?.externalPlaceId,
    };

    onChangeSelection(nextSelection);
  };

  const handleMoveMarker = (coord: LatLng, duration: number = 2000) => {
    if (!mapRef.current) return;

    const newRegion: Region = {
      latitude: coord.latitude,
      longitude: coord.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    mapRef.current.animateToRegion(newRegion, duration);
  };

  return (
    <View className="flex-1">
      {/* Map (base) */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        showsCompass={true}
        compassOffset={{ x: -16, y: 60 }}
      >
        {selection?.location && (
          <>
            <UserPlaceMarker
              coordinate={selection.location}
              disabled={false}
              radiusKm={selection.radiusKm}
              onPress={() => {
                handleOpenSheet();
                bottomSheetElement.current = (
                  <View
                    className="px-4"
                    style={{ paddingBottom: insets.bottom }}
                  >
                    <Text className="text-lg font-bold mb-4">Posts</Text>
                    <PostList
                      direction="horizontal"
                      filters={postParams.filters}
                    />
                  </View>
                );
              }}
            />

            {items.map((item) => (
              <ItemPlaceMarker
                key={item.id}
                item={item}
                coordinate={item.location}
                disabled={false}
                onPress={() => {
                  handleOpenSheet();
                  bottomSheetElement.current = <PostDetails postId={item.id} />;
                }}
              />
            ))}
          </>
        )}
      </MapView>

      {/* SearchBar overlay */}
      <View
        style={{
          position: "absolute",
          top: insets.top,
          left: 16,
          right: 16,
          zIndex: 10,
        }}
        pointerEvents="box-none"
      >
        <View className="rounded-full bg-white shadow-sm shadow-black/10 overflow-hidden">
          <View className="flex-row items-center">
            {/* Back icon inside the pill */}
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              style={{ paddingLeft: 16, paddingRight: 10, paddingVertical: 14 }}
            >
              <CaretLeftIcon
                size={20}
                color={colors.slate[700]}
                weight="bold"
              />
            </Pressable>

            {/* Tap area for search */}
            <Pressable
              onPress={() => router.push(MAP_ROUTE.search)}
              hitSlop={10}
              className="flex-1"
              style={{ paddingRight: 16, paddingVertical: 14 }}
            >
              <Text className="text-sm text-slate-600" numberOfLines={1}>
                {searchDisplayText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* FAB overlay */}
      <View
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          zIndex: 20,
        }}
        pointerEvents="box-none"
      >
        <UserPlaceButton disabled={false} onPress={onCoordinateChange} />
      </View>

      {/* BottomSheet overlay (topmost) */}
      <View
        style={{
          position: "absolute",
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
  );
};
